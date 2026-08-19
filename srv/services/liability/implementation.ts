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
    LiabilityTransactionModel
} from "@/models/liability-transaction";

import {
    LiabilityModel
} from "@/models/liability";

import {
    LiabilityDashboardModel
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

        if (
            data.CurrentBalance === undefined ||
            data.CurrentBalance === null
        ) {

            data.CurrentBalance =
                new Decimal(
                    data.OriginalAmount || 0
                );

        }

        if (
            data.PaidAmount === undefined ||
            data.PaidAmount === null
        ) {

            data.PaidAmount =
                new Decimal(0);

        }

        if (!data.StartDate) {

            data.StartDate =
                new Date()
                    .toISOString()
                    .slice(0, 10);

        }

        if (!data.Status) {
            data.Status =
                "OPEN";
        }

        const installments =
            Number(data.Installments) || 1;

        if (
            installments > 1 &&
            (
                data.InstallmentAmount === undefined ||
                data.InstallmentAmount === null
            ) &&
            data.OriginalAmount
        ) {

            data.InstallmentAmount =
                new Decimal(
                    data.OriginalAmount
                ).div(installments)
                    .toDecimalPlaces(2);

        }

        return super.beforeCreate(
            entity,
            user
        );

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

        const enriched =
            await this.enrichLiabilities(
                result.value
            );

        return right(
            enriched
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


    private async enrichLiabilities(
        entities: Liability[]
    ): Promise<Liability[]> {

        if (!entities?.length) {
            return entities;
        }

        const ids =
            entities
                .map(e => e.ID)
                .filter(Boolean);

        if (!ids.length) {
            return entities;
        }

        let rows:
            LiabilityTransactionModel[] = [];

        try {

            rows =
                await this
                    .LiabilityTransactionRepository
                    .findByLiabilityIds(
                        ids
                    ) || [];

        } catch {
            rows = [];
        }

        const grouped =
            new Map<string, LiabilityTransactionModel[]>();

        for (const transaction of rows) {

            const key =
                transaction.Liability?.Id as string;

            if (!key) continue;

            if (!grouped.has(key)) {
                grouped.set(key, []);
            }

            grouped
                .get(key)!
                .push(transaction);

        }

        const today =
            new Date()
                .toISOString()
                .slice(0, 10);

        const enriched: Liability[] = [];

        for (const entity of entities) {

            const model =
                LiabilityModel.singleModel(
                    entity
                );

            if (!model) {
                enriched.push(entity);
                continue;
            }

            const data =
                entity as any;

            const liabilityTransactions =
                grouped.get(
                    data.ID as string
                ) || [];

            const original =
                new Decimal(
                    data.OriginalAmount || 0
                );

            const paid =
                new Decimal(
                    data.PaidAmount || 0
                );

            const balance =
                new Decimal(
                    data.CurrentBalance ??
                        original.minus(paid)
                );

            model.RemainingAmount =
                balance;

            model.ProgressPercent =
                original.greaterThan(0)
                    ? new Decimal(
                        Number(
                            paid
                                .div(original)
                                .mul(100)
                                .toFixed(2)
                        )
                    )
                    : new Decimal(0);

            const totalInstallments =
                Number(data.Installments) || 1;

            const paidInstallments =
                liabilityTransactions.filter(t =>
                    t.Type === "PAYMENT" ||
                    t.Type === "AMORTIZATION"
                ).length;

            model.PaidInstallments =
                paidInstallments;

            model.RemainingInstallments =
                Math.max(
                    totalInstallments - paidInstallments,
                    0
                );

            model.NextDueDate =
                this.computeNextDueDate(
                    entity,
                    paidInstallments
                );

            model.IsOverdue =
                data.Status === "OPEN" &&
                !!model.NextDueDate &&
                model.NextDueDate < today;

            model.HealthScore =
                this.computeHealthScore({
                    ...entity,
                    IsOverdue:
                        model.IsOverdue
                });

            enriched.push(
                model.toEntityObject() as Liability
            );

        }

        return enriched;

    }


    private computeNextDueDate(
        entity: Liability,
        paidInstallments: number
    ): string | null {

        const total =
            Number(entity.Installments) || 1;

        if (!entity.FirstDueDate) {
            return null;
        }

        if (paidInstallments >= total) {
            return null;
        }

        const date =
            new Date(
                `${entity.FirstDueDate}T00:00:00`
            );

        const monthsToAdd =
            Math.min(
                paidInstallments,
                total - 1
            );

        date.setMonth(
            date.getMonth() + monthsToAdd
        );

        return date
            .toISOString()
            .slice(0, 10);

    }


    private computeHealthScore(
        entity: Liability
    ): number {

        const balance =
            Number(
                entity.CurrentBalance || 0
            );

        const original =
            Number(
                entity.OriginalAmount || 0
            );

        let score = 100;

        if (entity.IsOverdue) {
            score -= 30;
        }

        if (original > 0) {

            const ratio =
                balance / original;

            if (ratio > 0.8) {
                score -= 20;
            } else if (ratio > 0.5) {
                score -= 10;
            }

        }

        return Math.max(
            Math.min(score, 100),
            0
        );

    }

    // ==================================================
    // FUNCTIONS
    // ==================================================

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
                        safeRows?.[0]?.Currency
                            ? CurrencyModel.singleModel({
                                ...safeRows?.[0]?.Currency,
                                code:
                                    safeRows?.[0]?.Currency?.code ||
                                    safeRows?.[0]?.Currency_code
                            } as any)
                            : undefined as any,

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
                    rows?.map(item=>item?.toEntityObject()) as any,
                    request.user
                );

            if (auth.isLeft()) {
                return auth as any;
            }

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

}