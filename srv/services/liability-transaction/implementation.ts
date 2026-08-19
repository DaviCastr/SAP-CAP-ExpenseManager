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

            const tx =
                Transaction as any;

            if (!tx?._resolvedLiabilityId) {

                const liabilityId =
                    Transaction?.Liability_ID ||
                    Transaction?.Liability?.ID;

                if (liabilityId) {

                    tx._resolvedLiabilityId =
                        liabilityId;

                } else if (Transaction?.ID) {

                    const existing =
                        await this.Repository
                            .findById(
                                Transaction.ID as string,
                                true
                            );

                    tx._resolvedLiabilityId =
                        existing?.LiabilityId;

                }

            }

            if (!tx?._resolvedLiabilityId) {
                return right(true);
            }

            return this.recalculateLiability(
                tx._resolvedLiabilityId
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


    public async recalculateLiability(
        liabilityId: string
    ): Promise<
        Either<AbstractError, boolean>
    > {

        try {

            if (!liabilityId) {
                return right(true);
            }

            const rows =
                await this.Repository
                    .findByLiabilityId(
                        liabilityId
                    ) || [];

            let paid =
                new Decimal(0);

            let delta =
                new Decimal(0);

            for (const row of rows) {

                const amount =
                    new Decimal(
                        row.Amount || 0
                    );

                const signs =
                    this.getTypeSigns(
                        row.Type as string
                    );

                delta =
                    delta.plus(
                        amount.mul(signs.balance)
                    );

                paid =
                    paid.plus(
                        amount.mul(signs.paid)
                    );

            }

            if (paid.lessThan(0)) {
                paid =
                    new Decimal(0);
            }

            const debt =
                await this
                    .LiabilityRepository
                    .findById(
                        liabilityId,
                        true
                    );

            if (!debt) {
                return right(true);
            }

            const original =
                new Decimal(
                    debt.OriginalAmount || 0
                );

            let balance =
                original.plus(delta);

            if (balance.lessThan(0)) {
                balance =
                    new Decimal(0);
            }

            await this
                .LiabilityRepository
                .updateAmounts(
                    liabilityId,
                    {
                        CurrentBalance:
                            balance,

                        PaidAmount:
                            paid,

                        Status:
                            balance.equals(0)
                                ? "PAID"
                                : "OPEN"
                    }
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


    private getTypeSigns(
        type: string | null | undefined
    ): {
        balance: number;
        paid: number
    } {

        switch (type) {

            case "PAYMENT":
                return { balance: -1, paid: 1 };

            case "AMORTIZATION":
                return { balance: -1, paid: 1 };

            case "DISCOUNT":
                return { balance: -1, paid: 0 };

            case "INTEREST":
                return { balance: 1, paid: 0 };

            case "FEE":
                return { balance: 1, paid: 0 };

            case "RENEGOTIATION":
                return { balance: 1, paid: 0 };

            case "REVERSAL":
            case "PAYMENT_REVERSAL":
                return { balance: 1, paid: -1 };

            case "OPENING":
            default:
                return { balance: 0, paid: 0 };

        }

    }


    private async validateTransaction(
        entity: LiabilityTransaction
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const isNew =
            !entity?.ID;

        let liabilityId =
            entity?.Liability_ID ||
            entity?.Liability?.ID;

        let amount =
            entity?.Amount;

        if (!isNew) {

            const existing =
                await this.Repository
                    .findById(
                        entity.ID as string,
                        true
                    );

            if (existing) {

                liabilityId =
                    liabilityId ||
                    existing.LiabilityId as string;

                if (
                    amount === undefined ||
                    amount === null
                ) {
                    amount =
                        existing.Amount?.toNumber();
                }

            }

        }

        if (!liabilityId) {

            return left(
                new PermissionDenied(
                    "error.invalidLiability",
                    400,
                    new Error().stack || ""
                )
            );

        }

        if (
            amount === undefined ||
            amount === null
        ) {

            if (isNew) {

                return left(
                    new PermissionDenied(
                        "error.invalidAmount",
                        400,
                        new Error().stack || ""
                    )
                );

            }

        } else if (
            Number(amount) === 0
        ) {

            return left(
                new PermissionDenied(
                    "error.invalidAmount",
                    400,
                    new Error().stack || ""
                )
            );

        }

        const liability =
            await this.LiabilityRepository
                .findById(
                    liabilityId,
                    true
                );

        if (!liability) {

            return left(
                new PermissionDenied(
                    "error.invalidLiability",
                    404,
                    new Error().stack || ""
                )
            );

        }

        return right(true);

    }

}
