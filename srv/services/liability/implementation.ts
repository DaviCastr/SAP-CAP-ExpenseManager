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
    LiabilityService
} from "./protocols";

import {
    Liability
} from "@models/apps/dflc/gestordegastos/entities";

import { AbstractError } from "@/errors";
import { PermissionDenied } from "@/errors/permission-denied";

import {
    ServiceLocator
} from "@/infrastructure/ServiceLocator";

import {
    ServiceRegistry
} from "@/infrastructure/ServiceRegistry";

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
    LiabilityCreateModel
} from "@/models/liability-create";

import {
    LiabilityDashboardModel
} from "@/models/liability-dashboard";

import {
    LiabilityPayModel
} from "@/models/liability-pay";

import {
    LiabilityCloseModel
} from "@/models/liability-close";

import {
    LiabilityAnalyticsModel,
    LiabilityAnalyticsReturnProperties
} from "@/models/liability-analytics";

import {
    LiabilityPaymentScheduleModel,
    LiabilityPaymentScheduleReturnProperties
} from "@/models/liability-payment-schedule";

import {
    LiabilityRenegotiationModel,
    LiabilityRenegotiationReturnProperties
} from "@/models/liability-renegotiation";

import {
    LiabilityFutureImpactModel,
    LiabilityFutureImpactReturnProperties
} from "@/models/liability-future-impact";

import {
    LiabilityPremiumScoreModel
} from "@/models/liability-premium-score";

import {
    CurrencyModel
} from "@/models/currency";

import {
    EntitiesCodes
} from "@/constants/entities-codes";

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

    private getTransactionService(): any {

        return ServiceRegistry.get(
            "LiabilityTransactions"
        );

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
            await this.afterRead(
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
            await this.afterRead(
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

    // ==================================================
    // ACTIONS
    // ==================================================

    public async createLiability():
        Promise<any> {

        try {

            const request =
                ServiceLocator.getRequest();

            if (!request.data.PersonId) {

                return left(
                    new AbstractError(
                        "PersonId is required",
                        400,
                        ""
                    )
                );

            }

            const data: Liability = {

                Person_ID:
                    request.data.PersonId,

                Name:
                    request.data.Name,

                OriginalAmount:
                    request.data.OriginalAmount,

                CurrentBalance:
                    request.data.OriginalAmount,

                PaidAmount:
                    0,

                Currency_code:
                    request.data.Currency,

                Status:
                    "OPEN"

            };

            const auth =
                await this.beforeCreate(
                    data as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth;
            }

            const created =
                await this.Repository
                    .createEntry(data);

            const row =
                created?.[0];

            const model =
                LiabilityCreateModel.singleModel({

                    ID:
                        row?.Id as string,

                    Name:
                        row?.Name as string,

                    CurrentBalance:
                        row?.CurrentBalance
                            ?.toNumber() as number,

                    Status:
                        row?.Status as string

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

    public async dashboard():
        Promise<any> {

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
                    rows?.map(item=>item.toEntityObject()) as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth;
            }

            const safeRows =
                auth.value;

            let total =
                new Decimal(0);

            let open =
                new Decimal(0);

            let paid =
                new Decimal(0);

            for (const row of safeRows) {

                total =
                    total.plus(
                        row.OriginalAmount || 0
                    );

                open =
                    open.plus(
                        row.CurrentBalance || 0
                    );

                paid =
                    paid.plus(
                        row.PaidAmount || 0
                    );

            }

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
                            new Decimal(0),

                        MonthlyCommitment:
                            new Decimal(0)

                    },

                    HealthScore:
                        80,

                    Currency:
                        safeRows?.[0]
                            ?.Currency as CurrencyModel,

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

    public async payLiability():
        Promise<any> {

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
                        "Liability not found",
                        404,
                        ""
                    )
                );

            }

            const auth =
                await this.beforeUpdate(
                    debt as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth;
            }

            const payment =
                new Decimal(
                    request.data.Amount || 0
                );

            let balance =
                (
                    debt.CurrentBalance ||
                    new Decimal(0)
                ).minus(payment);

            if (balance.lessThan(0)) {
                balance =
                    new Decimal(0);
            }

            const paid =
                (
                    debt.PaidAmount ||
                    new Decimal(0)
                ).plus(payment);

            await this.Repository
                .updateAmounts(
                    debt.Id,
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

            const trxService =
                this.getTransactionService();

            if (trxService) {

                const trxAuth =
                    await trxService
                        .beforeCreate(
                            {
                                Liability_ID:
                                    debt.Id
                            },
                            request.user
                        );

                if (trxAuth.isLeft()) {
                    return trxAuth;
                }

            }

            await this
                .LiabilityTransactionRepository
                .createEntry({

                    Liability_ID:
                        debt.Id,

                    Type:
                        "PAYMENT",

                    Amount:
                        payment.toNumber(),

                    Description:
                        request.data.Notes

                });

            const model =
                LiabilityPayModel.with({

                    LiabilityId:
                        debt.Id,

                    PaymentDate:
                        new Date()
                            .toISOString()
                            .slice(0, 10),

                    Amount:
                        payment,

                    Currency:
                        debt.Currency,

                    Notes:
                        request.data.Notes

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

    public async closeLiability():
        Promise<any> {

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
                        "Liability not found",
                        404,
                        ""
                    )
                );

            }

            const auth =
                await this.beforeUpdate(
                    debt as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth;
            }

            await this.Repository
                .closeLiability(
                    debt.Id
                );

            const model =
                LiabilityCloseModel.singleModel({

                    LiabilityId:
                        debt.Id,

                    Name:
                        debt.Name,

                    TotalPaidAmount:
                        debt.OriginalAmount
                            ?.toNumber(),

                    PaidAmount:
                        debt.PaidAmount
                            ?.toNumber() as number,

                    ClosedAt:
                        new Date()
                            .toISOString(),

                    Currency:
                        debt.Currency
                            ?.toEntityObject(),

                    Status:
                        "PAID"

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
                    rows?.map(item=>item?.toEntityObject()) as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth as any;
            }

            const safeRows =
                auth.value;

            const model =
                LiabilityAnalyticsModel.with({

                    ByType: [],

                    ByStatus: [],

                    MonthlyTrend: []

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
                        "Liability not found",
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

            const model =
                LiabilityPaymentScheduleModel.with({

                    LiabilityId:
                        safeDebt.ID as string,

                    Name:
                        safeDebt.Name as string,

                    TotalInstallments:
                        safeDebt.Installments || 0,

                    PaidInstallments:
                        safeDebt.PaidInstallments || 0,

                    RemainingInstallments:
                        safeDebt.RemainingInstallments || 0,

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

    public async renegotiate():
        Promise<
            Either<
                AbstractError,
                LiabilityRenegotiationReturnProperties
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
                        "Liability not found",
                        404,
                        ""
                    )
                );

            }

            const auth =
                await this.beforeUpdate(
                    debt as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth as any;
            }

            const previous =
                debt.CurrentBalance ||
                new Decimal(0);

            const current =
                new Decimal(
                    request.data
                        .NewBalance || 0
                );

            const installments =
                Number(
                    request.data
                        .NewInstallments || 1
                );

            const installmentValue =
                current.div(
                    installments
                );

            await this.Repository
                .renegotiate(
                    debt.Id,
                    {
                        CurrentBalance:
                            current?.toNumber(),

                        Installments:
                            installments,

                        RemainingInstallments:
                            installments,

                        InstallmentAmount:
                            installmentValue?.toNumber(),

                        InterestRate:
                            request.data
                                .NewInterestRate,

                        Status:
                            current.equals(0)
                                ? "PAID"
                                : "OPEN"
                    }
                );

            const model =
                LiabilityRenegotiationModel.with({

                    LiabilityId:
                        debt.Id,

                    Name:
                        debt.Name,

                    PreviousBalance:
                        previous,

                    NewBalance:
                        current,

                    DiscountAmount:
                        previous.minus(
                            current
                        ),

                    PreviousInstallments:
                        debt.Installments,

                    NewInstallments:
                        installments,

                    PreviousInstallmentAmount:
                        debt.InstallmentAmount,

                    NewInstallmentAmount:
                        installmentValue,

                    PreviousInterestRate:
                        debt.InterestRate,

                    NewInterestRate:
                        new Decimal(
                            request.data
                                .NewInterestRate || 0
                        ),

                    RenegotiatedAt:
                        new Date()
                            .toISOString(),

                    Currency:
                        debt.Currency,

                    Notes:
                        request.data.Notes

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
                    rows?.map(item=>item?.toEntityObject()) as any,
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

    public async premiumScore() {

        try {

            const request =
                ServiceLocator.getRequest();

            const personId =
                request.data.PersonId;

            const auth =
                await this.authorizeRows(
                    [{ Person_ID: personId }] as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth;
            }

            if (!auth.value?.length) {
                return this.forbidden();
            }

            const rows =
                await this.Repository
                    .findOpenByPersonId(
                        personId
                    ) || [];

            let totalDebt =
                new Decimal(0);

            for (const item of rows) {

                totalDebt =
                    totalDebt.plus(
                        item.CurrentBalance || 0
                    );

            }

            const person =
                await this.PersonRepository
                    .findById(
                        personId
                    );

            const income =
                new Decimal(
                    person?.Income || 0
                );

            let ratio =
                new Decimal(0);

            if (income.greaterThan(0)) {

                ratio =
                    totalDebt.div(income);

            }

            let score =
                100;

            if (ratio.greaterThan(1))
                score -= 40;
            else if (
                ratio.greaterThan(0.6)
            )
                score -= 25;
            else if (
                ratio.greaterThan(0.3)
            )
                score -= 10;

            if (rows.length > 5) {
                score -= 15;
            }

            let level =
                "EXCELLENT";

            if (score < 80)
                level = "GOOD";

            if (score < 60)
                level = "WARNING";

            if (score < 40)
                level = "CRITICAL";

            const model =
                LiabilityPremiumScoreModel.with({

                    Score:
                        score,

                    Level:
                        level,

                    DebtRatio:
                        ratio,

                    Message:
                        "Calculated successfully"

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