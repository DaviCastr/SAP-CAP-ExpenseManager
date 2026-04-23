import Decimal from 'decimal.js';
import { BaseModel } from './base';
import { CurrencyModel } from './currency';
import { Currency } from '@models/sap/common';
import { LiabilityModel } from './liability';

export type LiabilityDashboardNextPayment = {
    ID: string;
    Name: string;
    DueDate?: string;
    Amount: Decimal;
};

export type LiabilityDashboardNextPaymentReturn = {
    ID: string;
    Name: string;
    DueDate?: string;
    Amount: number;
};

export type LiabilityDashboardRecommendation = {
    Code: string;
    Title: string;
    Description: string;
    Priority: number;
};

export type LiabilityDashboardKpis = {
    TotalDebt: Decimal;
    OpenDebt: Decimal;
    PaidDebt: Decimal;
    OverdueDebt: Decimal;
    MonthlyCommitment: Decimal;
};

export type LiabilityDashboardKpisReturn = {
    TotalDebt: number;
    OpenDebt: number;
    PaidDebt: number;
    OverdueDebt: number;
    MonthlyCommitment: number;
};


export type LiabilityDashboardProperties = {
    KPIs: LiabilityDashboardKpis;

    HealthScore: number;

    Currency: CurrencyModel;

    NextPayments: LiabilityDashboardNextPayment[];

    Recommendations: LiabilityDashboardRecommendation[];

    TopDebts?: LiabilityModel[];
};

export type LiabilityDashboardReturnProperties = {
    KPIs: LiabilityDashboardKpisReturn;

    HealthScore: number;

    Currency: Currency;

    NextPayments: LiabilityDashboardNextPaymentReturn[];

    Recommendations: LiabilityDashboardRecommendation[];

    TopDebts?: any[];
};

export class LiabilityDashboardModel extends BaseModel {

    constructor(
        private props: LiabilityDashboardProperties
    ) {
        super();
    }

    public static with(
        properties: LiabilityDashboardProperties
    ): LiabilityDashboardModel {

        return new LiabilityDashboardModel(properties);

    }

    public static singleModel(
        properties: LiabilityDashboardReturnProperties
    ): LiabilityDashboardModel {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(
        items: LiabilityDashboardReturnProperties[]
    ): LiabilityDashboardModel[] {

        return items?.map((item) => {

            return LiabilityDashboardModel.with({

                KPIs: {
                    TotalDebt: this.retrieveDecimal(item?.KPIs?.TotalDebt),
                    OpenDebt: this.retrieveDecimal(item?.KPIs?.OpenDebt),
                    PaidDebt: this.retrieveDecimal(item?.KPIs?.PaidDebt),
                    OverdueDebt: this.retrieveDecimal(item?.KPIs?.OverdueDebt),
                    MonthlyCommitment: this.retrieveDecimal(item?.KPIs?.MonthlyCommitment)
                },

                HealthScore: item?.HealthScore as number,

                Currency: CurrencyModel.singleModel({
                    code: item?.Currency?.code as string
                }),

                NextPayments:
                    item?.NextPayments?.map((payment) => ({
                        ID: payment?.ID,
                        Name: payment?.Name,
                        DueDate: payment?.DueDate,
                        Amount: this.retrieveDecimal(payment?.Amount)
                    })) || [],

                Recommendations:
                    item?.Recommendations || [],

                TopDebts:
                    LiabilityModel.mapModel(item?.TopDebts || [])

            });

        });

    }

    public get KPIs() {
        return this.props.KPIs;
    }

    public get HealthScore() {
        return this.props.HealthScore;
    }

    public get Currency() {
        return this.props.Currency;
    }

    public get NextPayments() {
        return this.props.NextPayments;
    }

    public get Recommendations() {
        return this.props.Recommendations;
    }

    public get TopDebts() {
        return this.props.TopDebts;
    }

    public toObject(): LiabilityDashboardProperties {

        return this.props;

    }

    public toEntityObject(): LiabilityDashboardReturnProperties {

        return this.cleanEntity({

            KPIs: {
                TotalDebt: this.props.KPIs.TotalDebt?.toNumber(),
                OpenDebt: this.props.KPIs.OpenDebt?.toNumber(),
                PaidDebt: this.props.KPIs.PaidDebt?.toNumber(),
                OverdueDebt: this.props.KPIs.OverdueDebt?.toNumber(),
                MonthlyCommitment:
                    this.props.KPIs.MonthlyCommitment?.toNumber()
            },

            HealthScore: this.props.HealthScore,

            Currency: this.props.Currency?.toEntityObject(),

            NextPayments:
                this.props.NextPayments?.map((payment) => ({
                    ID: payment.ID,
                    Name: payment.Name,
                    DueDate: payment.DueDate,
                    Amount: payment.Amount?.toNumber()
                })),

            Recommendations:
                this.props.Recommendations,

            TopDebts:
                this.props.TopDebts?.map((debt) =>
                    debt.toEntityObject()
                )

        });

    }

}