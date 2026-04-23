import { User } from "@sap/cds";
import Decimal from "decimal.js";

import { left, right, Either }
    from "@sweet-monads/either";

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

import { ServiceLocator }
    from "@/infrastructure/ServiceLocator";

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
import { EntitiesCodes } from "@/constants/entities-codes";


export class LiabilityServiceImplementation
    extends BaseServiceImplementation<Liability>
    implements LiabilityService {

    public Repository:
        LiabilityRepository;

    constructor(
        Repository:
            LiabilityRepository,

        PersonRepository:
            PersonRepository,

        ShareRepository:
            ShareRepository,

        EntityRepository:
            EntityRepository,

        private readonly LiabilityTransactionRepository: LiabilityTransactionRepository

    ) {

        super(
            PersonRepository,
            ShareRepository,
            EntityRepository
        );

        this.Repository = Repository;

    }


    public entityCode(): number {

        return EntitiesCodes.Liabilities;

    }


    protected personPath(): string[] {

        return [];

    }


    protected parentField():
        string | null {

        return "Person_ID";

    }


    public async createLiability():
        Promise<any> {

        try {

            const request =
                ServiceLocator.getRequest();

            const {
                PersonId,
                Name,
                OriginalAmount,
                Currency
            } = request.data;

            const created =
                await this.Repository
                    .createEntry({
                        Person_ID: PersonId,
                        Name,
                        OriginalAmount,
                        CurrentBalance:
                            OriginalAmount,
                        PaidAmount: 0,
                        Currency_code:
                            Currency,
                        Status: "OPEN"
                    });

            const item = created?.[0];

            const model =
                LiabilityCreateModel.singleModel({
                    ID: item?.Id as string,
                    Name: item?.Name as string,
                    CurrentBalance: item?.CurrentBalance?.toNumber() as any,
                    Status: "OPEN"
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
                    err.stack as string
                )
            );

        }

    }


    public async dashboard():
        Promise<any> {

        try {

            const request =
                ServiceLocator.getRequest();

            const { PersonId } =
                request.data;

            const rows =
                await this.Repository
                    .findByPersonId(
                        PersonId
                    ) || [];

            let totalDebt =
                new Decimal(0);

            let openDebt =
                new Decimal(0);

            let paidDebt =
                new Decimal(0);

            for (const row of rows) {

                totalDebt =
                    totalDebt.plus(
                        row.OriginalAmount
                    );

                openDebt =
                    openDebt.plus(
                        row.CurrentBalance || 0
                    );

                paidDebt =
                    paidDebt.plus(
                        row.PaidAmount || 0
                    );

            }

            const model =
                LiabilityDashboardModel.with({

                    KPIs: {
                        TotalDebt:
                            totalDebt,
                        OpenDebt:
                            openDebt,
                        PaidDebt:
                            paidDebt,
                        OverdueDebt:
                            new Decimal(0),
                        MonthlyCommitment:
                            new Decimal(0)
                    },

                    HealthScore: 80,

                    Currency:
                        rows?.[0]
                            ?.Currency as any,

                    NextPayments: [],

                    Recommendations: [],

                    TopDebts:
                        rows
                            .slice(0, 5)

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
                    err.stack as string
                )
            );

        }

    }


    public async payLiability(): Promise<any> {

        try {

            const request =
                ServiceLocator.getRequest();

            const {
                LiabilityId,
                Amount,
                Notes
            } = request.data;

            const debt =
                await this.Repository
                    .findById(LiabilityId);

            if (!debt) {

                return left(
                    new AbstractError(
                        "Liability not found",
                        404,
                        ""
                    )
                );

            }

            const currentBalance =
                debt.CurrentBalance ||
                new Decimal(0);

            const payment =
                new Decimal(Amount || 0);

            let newBalance =
                currentBalance.minus(
                    payment
                );

            if (newBalance.lessThan(0)) {

                newBalance =
                    new Decimal(0);

            }

            await this.Repository
                .updateBalance(
                    LiabilityId,
                    newBalance.toNumber()
                );

            if (newBalance.equals(0)) {

                await this.Repository
                    .closeLiability(
                        LiabilityId
                    );

            }

            await this
                .LiabilityTransactionRepository
                .createEntry({

                    Liability_ID:
                        LiabilityId,

                    Type:
                        "PAYMENT",

                    Amount:
                        payment.toNumber(),

                    Description:
                        Notes

                });

            const model =
                LiabilityPayModel.with({

                    LiabilityId:
                        LiabilityId,

                    PaymentDate:
                        new Date()
                            .toISOString()
                            .slice(0, 10),

                    Amount:
                        payment,

                    Currency:
                        debt.Currency,

                    Notes:
                        Notes

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
                    err.stack as string
                )
            );

        }

    }


    // ======================================================
    // CLOSE LIABILITY
    // ======================================================

    public async closeLiability(): Promise<any> {

        try {

            const request =
                ServiceLocator.getRequest();

            const {
                LiabilityId
            } = request.data;

            const debt =
                await this.Repository
                    .findById(
                        LiabilityId
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

            await this.Repository
                .closeLiability(
                    LiabilityId
                );

            const model =
                LiabilityCloseModel.singleModel({

                    LiabilityId:
                        debt.Id,

                    Name:
                        debt.Name,

                    TotalPaidAmount: 0,

                    PaidAmount: 0,

                    ClosedAt:
                        new Date()
                            .toISOString(),

                    Currency:
                        debt.Currency as any,

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
                    err.stack as string
                )
            );

        }

    }


}