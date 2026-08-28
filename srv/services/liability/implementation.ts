import Decimal from "decimal.js";
import { User } from "@sap/cds";

import {
    Either,
    left,
    right
} from "@sweet-monads/either";

import {
    BaseServiceImplementation
} from "../base/implementation";

import {
    LiabilityService
} from "./protocols";

import {
    Liability
} from "@models/apps/dflc/expensemanager/entities";

import { AbstractError } from "@/errors";
import { PermissionDenied } from "@/errors/permission-denied";

import {
    ServiceLocator
} from "@/infrastructure/ServiceLocator";

import {
    LiabilityRepository
} from "@/repositories/liability";

import {
    LiabilityTransactionRepository
} from "@/repositories/liability-transaction";

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
    LiabilityDashboardModel,
    LiabilityDashboardReturnProperties
} from "@/models/liability-dashboard";

import {
    LiabilityAnalyticsModel,
    LiabilityAnalyticsReturnProperties
} from "@/models/liability-analytics";

import {
    LiabilityPaymentScheduleModel,
    LiabilityPaymentScheduleReturnProperties
} from "@/models/liability-payment-schedule";

import {
    LiabilityFutureImpactModel,
    LiabilityFutureImpactReturnProperties
} from "@/models/liability-future-impact";

import {
    EntitiesCodes
} from "@/constants/entities-codes";

import {
    outstandingBalance,
    paymentPercentage,
    statusFromBalance,
    summarizeTransactions
} from "@/domain/liability-rules";

export class LiabilityServiceImplementation
    extends BaseServiceImplementation<Liability>
    implements LiabilityService {

    public Repository:
        LiabilityRepository;

    constructor(
        Repository: LiabilityRepository,
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
        private readonly LiabilityTransactionRepository:
            LiabilityTransactionRepository
    ) {

        super(
            PersonRepository,
            ShareRepository,
            EntityRepository
        );

        this.Repository =
            Repository;

    }

    // ==================================================
    // CONFIG
    // ==================================================

    public entityCode(): number {

        return EntitiesCodes.Liabilities;

    }

    protected personPath(): string[] {

        return ["Person"];

    }

    protected parentField():
        string | null {

        return "Person_ID";

    }

    // ==================================================
    // HELPERS
    // ==================================================

    private forbidden() {

        const stack =
            new Error().stack as string;

        const message =
            this.getMessage(
                "error.modificationPermissionDenied",
                ServiceLocator.getRequest(),
                this.entityCode()
            ) ||
            "error.modificationPermissionDenied";

        return left(
            new PermissionDenied(
                message,
                403,
                stack
            )
        );

    }

    private async authorizeRows(
        rows: any[],
        user: any
    ) {

        const auth =
            await this.enrichRows(
                rows,
                user
            );

        if (auth.isLeft()) {
            return auth;
        }

        return right(
            auth.value || []
        );

    }

    private async authorizeSingle(
        row: any,
        user: any
    ) {

        const auth =
            await this.enrichRows(
                [row],
                user
            );

        if (auth.isLeft()) {
            return auth;
        }

        if (!auth.value?.length) {
            return this.forbidden();
        }

        return right(
            auth.value[0]
        );

    }

    private invalidDueDayError(
        day: unknown
    ): Either<AbstractError, boolean> {

        const stack =
            new Error().stack || "";

        const request =
            ServiceLocator.getRequest();

        return left(
            new PermissionDenied(
                this.getMessage(
                    "error.invalidDueDay",
                    request,
                    this.entityCode(),
                    { day }
                ) ||
                "error.invalidDueDay",
                400,
                stack
            )
        );

    }

    /**
     * Validates the due day of month (the UI sends `1`-`31`) and mirrors the
     * parsed integer into the real request payload, because on UPDATE the
     * controller works on a shallow copy of `Request.data` and only mutations
     * applied to the original payload are persisted by CAP.
     *
     * @param {any} data the liability payload
     * @returns {boolean} `true` when the day is fine, `false` when it is
     * present but not an integer between 1 and 31
     */
    private normalizeDueDay(
        data: any
    ): boolean {

        if (
            data.DueDay === undefined ||
            data.DueDay === null ||
            data.DueDay === ""
        ) {
            return true;
        }

        const day =
            Number(data.DueDay);

        if (
            !Number.isInteger(day) ||
            day < 1 ||
            day > 31
        ) {
            return false;
        }

        data.DueDay =
            day;

        const request =
            ServiceLocator.getRequest();

        if (request?.data) {

            (request.data as any).DueDay =
                day;

        }

        return true;

    }

    /**
     * A debt cannot have a currency different from its owner person. When the
     * liability carries a `Person_ID` and a `Currency_code`, reads the person
     * and rejects the write if the currencies diverge.
     *
     * @param {any} data the liability payload/entity being written
     * @param {any} request the current request (for error localization)
     * @param {string} stack the error stack
     * @returns {Either<AbstractError, boolean>} left with a localized error, or
     *   right when it matches (or the check cannot be performed)
     */
    private async validateCurrencyAgainstPerson(
        data: any,
        request: any,
        stack: string
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const personId =
            data?.Person_ID;

        const currencyCode =
            data?.Currency_code;

        if (
            !personId ||
            !currencyCode
        ) {
            return right(true);
        }

        const person =
            await this.PersonRepository
                .findById(
                    personId
                );

        const personCurrency =
            person?.Currency?.Code;

        if (
            personCurrency &&
            currencyCode !== personCurrency
        ) {

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.liabilityCurrencyMismatch",
                        request,
                        this.entityCode()
                    ) ||
                    "error.liabilityCurrencyMismatch",
                    400,
                    stack
                )
            );

        }

        return right(true);

    }

    /**
     * Recomputes the derived values of a debt from ALL its persisted
     * transactions (never incremental, never from the payload). The write goes
     * to the entity set the current request works on, so during a draft
     * session the draft row is updated and a discarded draft never corrupts
     * the active balance.
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
                await this.Repository
                    .hasDraftRow(
                        liabilityId
                    );

            const transactionsEntity =
                draftExists
                    ? this.LiabilityTransactionRepository
                        .getDraftsEntity()
                    : undefined;

            const rows =
                await this
                    .LiabilityTransactionRepository
                    .findByLiabilityId(
                        liabilityId,
                        transactionsEntity
                    ) || [];

            const debt =
                await this.Repository
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

            await this.Repository
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
                        ? this.Repository
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

    // ==================================================
    // CRUD HOOKS
    // ==================================================

    public async beforeCreate(
        entity: Liability,
        user: User
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const data =
            entity as any;

        if (!this.normalizeDueDay(data)) {
            return this.invalidDueDayError(data.DueDay);
        }

        const totalAmount =
            Number(
                data.TotalAmount ?? 0
            );

        if (
            !Number.isFinite(totalAmount) ||
            totalAmount < 0
        ) {

            const stack =
                new Error().stack || "";

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.liabilityInvalidTotalAmount",
                        ServiceLocator.getRequest(),
                        this.entityCode()
                    ) ||
                    "error.liabilityInvalidTotalAmount",
                    400,
                    stack
                )
            );

        }

        // The derived values are never trusted from the payload; a brand new
        // debt has no transactions, so its balance equals the total amount.
        // During draft activation the same handler runs again on the deep
        // upsert of the draft tree, which already carries the correctly
        // recalculated values - those must be preserved, not reset.
        if (
            data.OutstandingBalance === undefined ||
            data.OutstandingBalance === null
        ) {
            data.OutstandingBalance =
                new Decimal(totalAmount)
                    .toDecimalPlaces(2)
                    .toNumber();
        }

        if (
            data.PaymentPercentage === undefined ||
            data.PaymentPercentage === null
        ) {
            data.PaymentPercentage =
                0;
        }

        if (
            data.TotalIn === undefined ||
            data.TotalIn === null
        ) {
            data.TotalIn =
                0;
        }

        if (
            data.TotalOut === undefined ||
            data.TotalOut === null
        ) {
            data.TotalOut =
                0;
        }

        if (!data.Status) {
            data.Status =
                "OPEN";
        }

        const currencyCheck =
            await this.validateCurrencyAgainstPerson(
                data,
                ServiceLocator.getRequest(),
                new Error().stack || ""
            );

        if (currencyCheck.isLeft()) {
            return currencyCheck;
        }

        return super.beforeCreate(
            entity,
            user
        );

    }

    public async beforeUpdate(
        entity: Liability,
        user: User
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const result =
            await super.beforeUpdate(
                entity,
                user
            );

        if (result.isLeft()) {
            return result;
        }

        const data =
            entity as any;

        if (!this.normalizeDueDay(data)) {
            return this.invalidDueDayError(data.DueDay);
        }

        // Derived fields are read-only: only the backend may write them.
        delete data.OutstandingBalance;
        delete data.PaymentPercentage;
        delete data.Status;
        delete data.TotalIn;
        delete data.TotalOut;

        const request =
            ServiceLocator.getRequest();

        if (request?.data) {

            const payload =
                request.data as any;

            delete payload.OutstandingBalance;
            delete payload.PaymentPercentage;
            delete payload.Status;
            delete payload.TotalIn;
            delete payload.TotalOut;

        }

        const currencyCheck =
            await this.validateCurrencyAgainstPerson(
                data,
                request,
                new Error().stack || ""
            );

        if (currencyCheck.isLeft()) {
            return currencyCheck;
        }

        if (
            data.TotalAmount === undefined ||
            data.TotalAmount === null
        ) {
            return right(true);
        }

        const stack =
            new Error().stack || "";

        const totalAmount =
            Number(data.TotalAmount);

        if (
            !Number.isFinite(totalAmount) ||
            totalAmount < 0
        ) {

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.liabilityInvalidTotalAmount",
                        ServiceLocator.getRequest(),
                        this.entityCode()
                    ) ||
                    "error.liabilityInvalidTotalAmount",
                    400,
                    stack
                )
            );

        }

        const existing =
            await this.Repository
                .findById(
                    data.ID,
                    true
                );

        if (!existing) {
            return right(true);
        }

        const rows =
            await this
                .LiabilityTransactionRepository
                .findByLiabilityId(
                    data.ID
                ) || [];

        const summary =
            summarizeTransactions(
                rows.map(row => ({
                    Id: row.Id,
                    Type: row.Type,
                    Amount: row.Amount,
                    Date: row.Date
                }))
            );

        const rawBalance =
            new Decimal(totalAmount)
                .plus(summary.TotalOut)
                .minus(summary.TotalIn);

        if (rawBalance.lessThan(0)) {

            return left(
                new PermissionDenied(
                    this.getMessage(
                        "error.liabilityBalanceCannotBeNegative",
                        ServiceLocator.getRequest(),
                        this.entityCode()
                    ) ||
                    "error.liabilityBalanceCannotBeNegative",
                    400,
                    stack
                )
            );

        }

        return right(true);

    }

    public async afterCreate(
        Entities: Liability[]
    ): Promise<
        Either<AbstractError, boolean>
    > {

        return this.recalculateForLiabilities(
            Entities
        );

    }

    public async afterUpdate(
        Entities: Liability[]
    ): Promise<
        Either<AbstractError, boolean>
    > {

        return this.recalculateForLiabilities(
            Entities
        );

    }

    private async recalculateForLiabilities(
        Entities:
            Liability | Liability[]
    ): Promise<
        Either<AbstractError, boolean>
    > {

        try {

            const list =
                Array.isArray(Entities)
                    ? Entities
                    : [Entities];

            const ids =
                new Set<string>();

            for (const entity of list) {

                if (entity?.ID) {
                    ids.add(entity.ID);
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

    public async afterRead(
        Entities: Liability[],
        User: User
    ): Promise<
        Either<AbstractError, Liability[]>
    > {

        const result =
            await super.afterRead(
                Entities,
                User
            );

        if (result.isLeft()) {
            return result;
        }

        return right(
            result.value
        );

    }

    private async enrichRows(
        rows: Liability[],
        user: User
    ): Promise<
        Either<AbstractError, Liability[]>
    > {

        return this.afterRead(
            rows,
            user
        );

    }

    // ==================================================
    // FUNCTIONS
    // ==================================================

    public async dashboard():
        Promise<
            Either<
                AbstractError,
                LiabilityDashboardReturnProperties
            >
        > {

        try {

            const request =
                ServiceLocator.getRequest();

            const rows =
                await this.Repository
                    .findByPersonId(
                        request.data.PersonId
                    ) || [];

            const auth =
                await this.authorizeRows(
                    rows?.map(item => item.toEntityObject()) as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth as any;
            }

            const safeRows =
                auth.value;

            const todayDay =
                new Date().getDate();

            let total =
                new Decimal(0);

            let open =
                new Decimal(0);

            let paid =
                new Decimal(0);

            let overdue =
                new Decimal(0);

            let percentageSum =
                new Decimal(0);

            let count = 0;

            for (const row of safeRows) {

                const totalAmount =
                    new Decimal(
                        Number(row.TotalAmount) || 0
                    );

                const balance =
                    new Decimal(
                        Number(row.OutstandingBalance) ??
                            totalAmount
                    );

                total =
                    total.plus(totalAmount);

                open =
                    open.plus(
                        row.Status === "OPEN"
                            ? balance
                            : new Decimal(0)
                    );

                paid =
                    paid.plus(
                        totalAmount.minus(balance)
                    );

                if (
                    row.Status === "OPEN" &&
                    row.DueDay &&
                    Number(row.DueDay) < todayDay
                ) {

                    overdue =
                        overdue.plus(balance);

                }

                percentageSum =
                    percentageSum.plus(
                        Number(row.PaymentPercentage) || 0
                    );

                count += 1;

            }

            const healthScore =
                count > 0
                    ? Math.round(
                        percentageSum
                            .div(count)
                            .toNumber()
                    )
                    : 100;

            const model =
                LiabilityDashboardModel.with({

                    KPIs: {

                        TotalDebt:
                            total,

                        OpenDebt:
                            open,

                        PaidDebt:
                            paid,

                        OverdueDebt:
                            overdue,

                        MonthlyCommitment:
                            new Decimal(0)

                    },

                    HealthScore:
                        healthScore,

                    Currency:
                        undefined as any,

                    NextPayments: [],

                    Recommendations: [],

                    TopDebts: []

                });

            return right(
                model.toEntityObject()
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

    public async analytics():
        Promise<
            Either<
                AbstractError,
                LiabilityAnalyticsReturnProperties
            >
        > {

        try {

            const request =
                ServiceLocator.getRequest();

            const rows =
                await this.Repository
                    .findByPersonId(
                        request.data.PersonId
                    ) || [];

            const auth =
                await this.authorizeRows(
                    rows?.map(item => item?.toEntityObject()) as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth as any;
            }

            const safeRows =
                auth.value as any[];

            const byStatus:
                Record<string, {
                    TotalAmount: Decimal;
                    Contracts: number;
                }> = {};

            for (const row of safeRows) {

                const status =
                    row.Status || "OPEN";

                if (!byStatus[status]) {

                    byStatus[status] = {
                        TotalAmount:
                            new Decimal(0),
                        Contracts: 0
                    };

                }

                byStatus[status].TotalAmount =
                    byStatus[status].TotalAmount.plus(
                        Number(row.OutstandingBalance) ??
                            (Number(row.TotalAmount) || 0)
                    );

                byStatus[status].Contracts += 1;

            }

            const liabilityIds =
                safeRows
                    .map((row: any) => row.ID)
                    .filter(Boolean);

            const transactions =
                liabilityIds.length
                    ? (
                        await this
                            .LiabilityTransactionRepository
                            .findByLiabilityIds(
                                liabilityIds
                            ) || []
                    )
                    : [];

            const monthly:
                Record<string, Decimal> = {};

            for (const transaction of transactions) {

                const date =
                    transaction.Date;

                if (!date) continue;

                const key =
                    date.slice(0, 7);

                if (!monthly[key]) {
                    monthly[key] =
                        new Decimal(0);
                }

                monthly[key] =
                    monthly[key].plus(
                        Number(
                            transaction.Amount
                                ?.toNumber()
                        ) || 0
                    );

            }

            const model =
                LiabilityAnalyticsModel.with({

                    ByType: [],

                    ByStatus:
                        Object.entries(byStatus).map(
                            ([status, value]) => ({
                                Status: status,
                                TotalAmount:
                                    value.TotalAmount,
                                Contracts:
                                    value.Contracts
                            })
                        ),

                    MonthlyTrend:
                        Object.entries(monthly)
                            .sort(([a], [b]) =>
                                a < b ? -1 : 1
                            )
                            .map(([key, amount]) => ({
                                Year:
                                    Number(
                                        key.slice(0, 4)
                                    ),
                                Month:
                                    Number(
                                        key.slice(5, 7)
                                    ),
                                Amount: amount
                            }))

                });

            return right(
                model.toEntityObject()
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

    public async paymentSchedule():
        Promise<
            Either<
                AbstractError,
                LiabilityPaymentScheduleReturnProperties
            >
        > {

        try {

            const request =
                ServiceLocator.getRequest();

            const debt =
                await this.Repository
                    .findById(
                        request.data
                            .LiabilityId
                    );

            if (!debt) {

                return left(
                    new AbstractError(
                        this.getMessage(
                            "error.liabilityNotFound",
                            request,
                            this.entityCode()
                        ) ||
                        "error.liabilityNotFound",
                        404,
                        ""
                    )
                );

            }

            const auth =
                await this.authorizeSingle(
                    debt?.toEntityObject(),
                    request.user
                );

            if (auth.isLeft()) {
                return auth as any;
            }

            const safeDebt =
                auth.value;

            const paid =
                safeDebt.Status === "PAID";

            const model =
                LiabilityPaymentScheduleModel.with({

                    LiabilityId:
                        safeDebt.ID as string,

                    Name:
                        safeDebt.Name as string,

                    TotalInstallments:
                        1,

                    PaidInstallments:
                        paid ? 1 : 0,

                    RemainingInstallments:
                        paid ? 0 : 1,

                    Items: []

                });

            return right(
                model.toEntityObject()
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

    public async futureImpact():
        Promise<
            Either<
                AbstractError,
                LiabilityFutureImpactReturnProperties
            >
        > {

        try {

            const request =
                ServiceLocator.getRequest();

            const rows =
                await this.Repository
                    .findOpenByPersonId(
                        request.data.PersonId
                    ) || [];

            const auth =
                await this.authorizeRows(
                    rows?.map(item => item?.toEntityObject()) as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth as any;
            }

            const model =
                LiabilityFutureImpactModel.singleModel({

                    Next3Months: 0,

                    Next6Months: 0,

                    Next12Months: 0,

                    MonthlyCommitment: []

                });

            return right(
                model.toEntityObject()
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

}