import { User } from "@sap/cds";
import Decimal from "decimal.js";

import {
    Either,
    left,
    right
} from "@sweet-monads/either";

import {
    BaseServiceImplementation
} from "../base/implementation";

import {
    LiabilityTransactionService
} from "./protocols";

import {
    LiabilityTransaction,
    LiabilityTransactions
} from "@models/apps/dflc/expensemanager/entities";

import {
    AbstractError
} from "@/errors";

import {
    PermissionDenied
} from "@/errors/permission-denied";

import {
    LiabilityTransactionRepository
} from "@/repositories/liability-transaction";

import {
    LiabilityRepository
} from "@/repositories/liability";

import {
    PersonRepository
} from "@/repositories/person";

import {
    ShareRepository
} from "@/repositories/share";

import {
    EntityRepository
} from "@/repositories/entity";

import {
    EntitiesCodes
} from "@/constants/entities-codes";

import {
    ServiceLocator
} from "@/infrastructure/ServiceLocator";

import {
    normalizeDate,
    outstandingBalance,
    paymentPercentage,
    statusFromBalance,
    summarizeTransactions
} from "@/domain/liability-rules";

export class LiabilityTransactionServiceImplementation
    extends BaseServiceImplementation<LiabilityTransaction>
    implements LiabilityTransactionService {

    public Repository:
        LiabilityTransactionRepository;

    constructor(
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,

        Repository:
            LiabilityTransactionRepository,

        private readonly LiabilityRepository:
            LiabilityRepository

    ) {

        super(
            PersonRepository,
            ShareRepository,
            EntityRepository
        );

        this.Repository = Repository;

    }


    public entityCode(): number {

        return EntitiesCodes.LiabilityTransactions;

    }


    protected personPath(): string[] {

        return ["Liability", "Person"];

    }


    protected parentField():
        string | null {

        return "Liability.ID";

    }


    protected async checkPermission(
        Transaction: LiabilityTransaction,
        User: User,
        Permission: number
    ) {

        const cache =
            ServiceLocator.getPermissionCache();

        const userId =
            User?.id;

        let personId =
            cache.personMap.get(
                Transaction.ID
            );

        if (!personId) {

            if (
                !Transaction?.Liability_ID &&
                !Transaction?.Liability?.ID
            ) {

                personId =
                    await this.Repository
                        .findPersonIdById(
                            Transaction?.ID as string
                        );

            } else {

                const liabilityId =
                    Transaction?.Liability_ID ||
                    Transaction?.Liability?.ID;

                personId =
                    cache.personMap.get(
                        liabilityId as string
                    ) ||
                    await this.LiabilityRepository
                        .findPersonIdById(
                            liabilityId as string
                        );

            }

            if (personId) {
                cache.personMap.set(
                    Transaction.ID,
                    personId
                );
            }

        }

        if (!personId) {

            const oStack =
                new Error().stack as string;

            const message =
                this.getMessage(
                    'error.invalidPersonId',
                    ServiceLocator.getRequest(),
                    this.entityCode()
                ) ||
                'error.invalidPersonId';

            return left(
                new PermissionDenied(
                    message,
                    403,
                    oStack
                )
            );

        }

        const key =
            ServiceLocator.buildPermissionKey(
                userId,
                personId,
                this.entityCode(),
                Permission
            );

        if (cache.permissionChecked.has(key)) {
            return right(true);
        }

        const result =
            await this.checkPermissionByPersonId(
                User,
                personId,
                Permission
            );

        if (result.isRight()) {
            cache.permissionChecked.add(key);
        }

        return result;

    }


    public async beforeCreate(
        entity: LiabilityTransaction,
        user: User
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const result =
            await this.processBeforeCreate(
                entity,
                user
            );

        if (result.isLeft()) {
            return result;
        }

        return this.validateTransaction(
            entity
        );

    }


    public async beforeUpdate(
        entity: LiabilityTransaction,
        user: User
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const result =
            await this.processBeforeUpdate(
                entity,
                user
            );

        if (result.isLeft()) {
            return result;
        }

        // Moving a transaction to another liability must recompute BOTH debts.
        // The previous liability is captured here (before the row changes) and
        // read again by the after-update recalculation.
        const existing =
            await this.Repository
                .findById(
                    entity.ID as string
                );

        if (existing?.Liability?.Id) {

            const newLiabilityId =
                entity?.Liability_ID ||
                entity?.Liability?.ID;

            const oldLiabilityId =
                existing.Liability.Id;

            if (
                newLiabilityId &&
                newLiabilityId !== oldLiabilityId
            ) {

                ServiceLocator
                    .getLiabilityMoveCache()
                    .set(
                        entity.ID as string,
                        oldLiabilityId
                    );

            }

        }

        return this.validateTransaction(
            entity
        );

    }


    public async beforeEdit(
        entity: LiabilityTransaction,
        user: User
    ): Promise<
        Either<AbstractError, boolean>
    > {

        return this.beforeUpdate(
            entity,
            user
        );

    }


    public async afterCreate(
        LiabilityTransactions:
            LiabilityTransactions
    ): Promise<
        Either<AbstractError, boolean>
    > {

        return this.recalculateForTransactions(
            LiabilityTransactions
        );

    }


    public async afterUpdate(
        LiabilityTransactions:
            LiabilityTransactions
    ): Promise<
        Either<AbstractError, boolean>
    > {

        return this.recalculateForTransactions(
            LiabilityTransactions
        );

    }


    public async onDelete(
        Transaction:
            LiabilityTransaction
    ): Promise<
        Either<AbstractError, boolean>
    > {

        try {

            const transactionId =
                Transaction?.ID as string;

            if (!transactionId) {
                return right(true);
            }

            const cache =
                ServiceLocator
                    .getLiabilityMoveCache();

            // The route invokes this handler before the delete runs (row still
            // exists) and again after it committed (row gone). On the first
            // call only resolve and remember the parent liability; recalculating
            // now would still count the row towards the balance.
            const alreadyResolved =
                cache.has(transactionId);

            if (!alreadyResolved) {

                let liabilityId =
                    Transaction?.Liability_ID ||
                    Transaction?.Liability?.ID;

                if (!liabilityId) {

                    const existing =
                        await this.Repository
                            .findById(
                                transactionId
                            );

                    liabilityId =
                        existing?.Liability?.Id as string;

                }

                if (liabilityId) {
                    cache.set(
                        transactionId,
                        liabilityId
                    );
                }

                return right(true);

            }

            // Second call: the row is gone, so the recalculation produces the
            // correct remaining balance.
            const liabilityId =
                cache.get(transactionId);

            if (!liabilityId) {
                return right(true);
            }

            return this.recalculateLiability(
                liabilityId
            );

        } catch (error) {

            const err =
                error as Error;

            return left(
                new AbstractError(
                    err.message,
                    400,
                    err.stack || ""
                )
            );

        }

    }


    /**
     * Recalculates the derived values of the parent debt from ALL its
     * persisted transactions (`TotalAmount + TotalOut - TotalIn`), never
     * incrementally and never from the payload.
     *
     * When a draft row exists for the liability (draft session in progress,
     * including activation), the transactions are read from and the values are
     * written to the draft tree, so a discarded draft never corrupts the
     * active balance and a delete inside a draft is recalculated against the
     * remaining draft rows.
     *
     * @param {string} liabilityId the parent debt ID
     * @returns {Either<AbstractError, boolean>} right on success
     */
    public async recalculateLiability(
        liabilityId: string
    ): Promise<
        Either<AbstractError, boolean>
    > {

        try {

            if (!liabilityId) {
                return right(true);
            }

            const draftExists =
                await this.LiabilityRepository
                    .hasDraftRow(
                        liabilityId
                    );

            const transactionsEntity =
                draftExists
                    ? this.Repository.getDraftsEntity()
                    : undefined;

            const rows =
                await this.Repository
                    .findByLiabilityId(
                        liabilityId,
                        transactionsEntity
                    ) || [];

            const debt =
                await this
                    .LiabilityRepository
                    .findById(
                        liabilityId
                    );

            if (!debt) {
                return right(true);
            }

            const summary =
                summarizeTransactions(
                    rows.map(row => ({
                        Id: row.Id,
                        Type: row.Type,
                        Amount: row.Amount,
                        Date: row.Date
                    }))
                );

            const balance =
                outstandingBalance(
                    debt.TotalAmount,
                    summary
                );

            const percentage =
                paymentPercentage(
                    debt.TotalAmount,
                    summary
                );

            const status =
                statusFromBalance(
                    balance
                );

            await this
                .LiabilityRepository
                .updateComputedValues(
                    liabilityId,
                    {
                        OutstandingBalance:
                            balance,

                        PaymentPercentage:
                            percentage,

                        Status:
                            status,

                        TotalIn:
                            summary.TotalIn,

                        TotalOut:
                            summary.TotalOut
                    },
                    draftExists
                        ? this.LiabilityRepository
                            .getDraftsEntity()
                        : undefined
                );

            return right(true);

        } catch (error) {

            const err =
                error as Error;

            return left(
                new AbstractError(
                    err.message,
                    400,
                    err.stack || ""
                )
            );

        }

    }


    private async recalculateForTransactions(
        LiabilityTransactions:
            LiabilityTransactions
    ): Promise<
        Either<AbstractError, boolean>
    > {

        try {

            const list =
                Array.isArray(LiabilityTransactions)
                    ? LiabilityTransactions
                    : [LiabilityTransactions];

            const ids =
                new Set<string>();

            for (const transaction of list) {

                const liabilityId =
                    transaction?.Liability_ID ||
                    transaction?.Liability?.ID;

                if (liabilityId) {
                    ids.add(liabilityId);
                }

                const previous =
                    ServiceLocator
                        .getLiabilityMoveCache()
                        .get(
                            transaction?.ID as string
                        );

                if (previous) {
                    ids.add(previous);
                }

            }

            for (const id of ids) {

                const result =
                    await this.recalculateLiability(id);

                if (result.isLeft()) {
                    return result;
                }

            }

            return right(true);

        } catch (error) {

            const err =
                error as Error;

            return left(
                new AbstractError(
                    err.message,
                    400,
                    err.stack || ""
                )
            );

        }

    }


    /**
     * Validates a transaction before it is persisted:
     * - the liability must exist;
     * - the type must be `IN` or `OUT`;
     * - the amount must be a positive number;
     * - the date is mandatory and must be a valid date (the UI sends
     *   `dd/MM/yyyy`, which is normalized to `yyyy-MM-dd`);
     * - an `IN` transaction can never make the outstanding balance negative,
     *   considering the transactions already persisted in the same request
     *   (batch).
     *
     * @param {LiabilityTransaction} entity the transaction being created/updated
     * @returns {Either<AbstractError, boolean>} left with a localized error
     */
    private async validateTransaction(
        entity: LiabilityTransaction
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const stack =
            new Error().stack || "";

        const request =
            ServiceLocator.getRequest();

        const entityCode =
            this.entityCode();

        const isNew =
            !entity?.ID;

        let liabilityId =
            entity?.Liability_ID ||
            entity?.Liability?.ID;

        let amount =
            entity?.Amount;

        let type =
            entity?.Type;

        let date =
            entity?.Date;

        let existing: any = null;

        if (!isNew) {

            existing =
                await this.Repository
                    .findById(
                        entity.ID as string
                    );

            if (existing) {

                liabilityId =
                    liabilityId ||
                    existing.Liability?.Id as string;

                if (
                    amount === undefined ||
                    amount === null
                ) {
                    amount =
                        existing.Amount?.toNumber();
                }

                if (!type) {
                    type =
                        existing.Type;
                }

                if (
                    date === undefined ||
                    date === null
                ) {
                    date =
                        existing.Date;
                }

            }

        }

        if (!liabilityId) {

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.invalidLiability",
                        request,
                        entityCode
                    ) ||
                    "error.invalidLiability",
                    400,
                    stack
                )
            );

        }

        if (type !== "IN" && type !== "OUT") {

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.transactionInvalidType",
                        request,
                        entityCode
                    ) ||
                    "error.transactionInvalidType",
                    400,
                    stack
                )
            );

        }

        if (
            amount === undefined ||
            amount === null ||
            !(Number(amount) > 0)
        ) {

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.transactionInvalidAmount",
                        request,
                        entityCode
                    ) ||
                    "error.transactionInvalidAmount",
                    400,
                    stack
                )
            );

        }

        if (!date) {

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.transactionDateRequired",
                        request,
                        entityCode
                    ) ||
                    "error.transactionDateRequired",
                    400,
                    stack
                )
            );

        }

        const normalized =
            normalizeDate(date);

        if (!normalized) {

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.invalidDate",
                        request,
                        entityCode,
                        { date }
                    ) ||
                    "error.invalidDate",
                    400,
                    stack
                )
            );

        }

        // Mirror the normalized value into the real request payload: on UPDATE
        // the controller works on a shallow copy, so only mutating
        // `Request.data` guarantees CAP persists the ISO date.
        if (request?.data && (request.data as any).Date !== normalized) {

            (request.data as any).Date =
                normalized;

        }

        const liability =
            await this.LiabilityRepository
                .findById(
                    liabilityId
                );

        if (!liability) {

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.invalidLiability",
                        request,
                        entityCode
                    ) ||
                    "error.invalidLiability",
                    404,
                    stack
                )
            );

        }

        const transactionCurrency =
            entity?.Currency_code ||
            entity?.Currency?.code;

        const liabilityCurrency =
            liability?.Currency?.Code;

        if (
            transactionCurrency &&
            liabilityCurrency &&
            transactionCurrency !== liabilityCurrency
        ) {

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.transactionCurrencyMismatch",
                        request,
                        entityCode
                    ) ||
                    "error.transactionCurrencyMismatch",
                    400,
                    stack
                )
            );

        }

        if (type === "IN") {

            const rows =
                await this.Repository
                    .findByLiabilityId(
                        liabilityId
                    ) || [];

            const others =
                rows.filter(
                    row =>
                        row.Id !== entity.ID
                );

            const summary =
                summarizeTransactions(
                    others.map(row => ({
                        Id: row.Id,
                        Type: row.Type,
                        Amount: row.Amount,
                        Date: row.Date
                    }))
                );

            const rawBalance =
                new Decimal(
                    Number(
                        liability.TotalAmount
                            ?.toNumber() || 0
                    )
                )
                    .plus(summary.TotalOut)
                    .minus(summary.TotalIn);

            if (
                new Decimal(Number(amount))
                    .greaterThan(rawBalance)
            ) {

                return left(
                    new PermissionDenied(
                        this.getMessage(
                            "error.transactionExceedsBalance",
                            request,
                            entityCode
                        ) ||
                        "error.transactionExceedsBalance",
                        400,
                        stack
                    )
                );

            }

        }

        return right(true);

    }

}