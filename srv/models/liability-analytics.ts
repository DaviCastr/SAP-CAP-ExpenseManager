import Decimal from "decimal.js";
import { BaseModel } from "./base";

export type LiabilityAnalyticsByType = {
    Type: string;
    TotalAmount: Decimal;
    Percent: Decimal;
};

export type LiabilityAnalyticsByTypeReturn = {
    Type: string;
    TotalAmount: number;
    Percent: number;
};

export type LiabilityAnalyticsByStatus = {
    Status: string;
    TotalAmount: Decimal;
    Contracts: number;
};

export type LiabilityAnalyticsByStatusReturn = {
    Status: string;
    TotalAmount: number;
    Contracts: number;
};

export type LiabilityAnalyticsMonthlyTrend = {
    Year: number;
    Month: number;
    Amount: Decimal;
};

export type LiabilityAnalyticsMonthlyTrendReturn = {
    Year: number;
    Month: number;
    Amount: number;
};

export type LiabilityAnalyticsProperties = {
    ByType: LiabilityAnalyticsByType[];
    ByStatus: LiabilityAnalyticsByStatus[];
    MonthlyTrend: LiabilityAnalyticsMonthlyTrend[];
};

export type LiabilityAnalyticsReturnProperties = {
    ByType: LiabilityAnalyticsByTypeReturn[];
    ByStatus: LiabilityAnalyticsByStatusReturn[];
    MonthlyTrend: LiabilityAnalyticsMonthlyTrendReturn[];
};

export class LiabilityAnalyticsModel
    extends BaseModel {

    constructor(
        private props:
            LiabilityAnalyticsProperties
    ) {
        super();
    }

    public static with(
        props:
            LiabilityAnalyticsProperties
    ): LiabilityAnalyticsModel {

        return new LiabilityAnalyticsModel(
            props
        );

    }

    public static singleModel(
        item:
            LiabilityAnalyticsReturnProperties
    ): LiabilityAnalyticsModel {

        return LiabilityAnalyticsModel.with({

            ByType:
                item.ByType?.map(row => ({
                    Type: row.Type,
                    TotalAmount:
                        this.retrieveDecimal(
                            row.TotalAmount
                        ),
                    Percent:
                        this.retrieveDecimal(
                            row.Percent
                        )
                })) || [],

            ByStatus:
                item.ByStatus?.map(row => ({
                    Status: row.Status,
                    TotalAmount:
                        this.retrieveDecimal(
                            row.TotalAmount
                        ),
                    Contracts:
                        row.Contracts
                })) || [],

            MonthlyTrend:
                item.MonthlyTrend?.map(row => ({
                    Year: row.Year,
                    Month: row.Month,
                    Amount:
                        this.retrieveDecimal(
                            row.Amount
                        )
                })) || []

        });

    }

    public toObject():
        LiabilityAnalyticsProperties {

        return this.props;

    }

    public toEntityObject():
        LiabilityAnalyticsReturnProperties {

        return this.cleanEntity({

            ByType:
                this.props.ByType?.map(
                    item => ({
                        Type: item.Type,
                        TotalAmount:
                            item.TotalAmount?.toNumber(),
                        Percent:
                            item.Percent?.toNumber()
                    })
                ),

            ByStatus:
                this.props.ByStatus?.map(
                    item => ({
                        Status: item.Status,
                        TotalAmount:
                            item.TotalAmount?.toNumber(),
                        Contracts:
                            item.Contracts
                    })
                ),

            MonthlyTrend:
                this.props.MonthlyTrend?.map(
                    item => ({
                        Year: item.Year,
                        Month: item.Month,
                        Amount:
                            item.Amount?.toNumber()
                    })
                )

        });

    }

}