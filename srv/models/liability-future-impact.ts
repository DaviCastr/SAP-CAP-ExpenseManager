import Decimal from "decimal.js";
import { BaseModel } from "./base";

export type LiabilityFutureMonth = {
    Year: number;
    Month: number;
    Amount: Decimal;
};

export type LiabilityFutureMonthReturn = {
    Year: number;
    Month: number;
    Amount: number;
};

export type LiabilityFutureImpactProperties = {
    Next3Months: Decimal;
    Next6Months: Decimal;
    Next12Months: Decimal;
    MonthlyCommitment:
        LiabilityFutureMonth[];
};

export type LiabilityFutureImpactReturnProperties = {
    Next3Months: number;
    Next6Months: number;
    Next12Months: number;
    MonthlyCommitment:
        LiabilityFutureMonthReturn[];
};

export class LiabilityFutureImpactModel
    extends BaseModel {

    constructor(
        private props:
            LiabilityFutureImpactProperties
    ) {
        super();
    }

    public static with(
        props:
            LiabilityFutureImpactProperties
    ): LiabilityFutureImpactModel {

        return new LiabilityFutureImpactModel(
            props
        );

    }

    public static singleModel(
        item:
            LiabilityFutureImpactReturnProperties
    ): LiabilityFutureImpactModel {

        return LiabilityFutureImpactModel.with({

            Next3Months:
                this.retrieveDecimal(
                    item.Next3Months
                ),

            Next6Months:
                this.retrieveDecimal(
                    item.Next6Months
                ),

            Next12Months:
                this.retrieveDecimal(
                    item.Next12Months
                ),

            MonthlyCommitment:
                item.MonthlyCommitment?.map(
                    row => ({
                        Year: row.Year,
                        Month: row.Month,
                        Amount:
                            this.retrieveDecimal(
                                row.Amount
                            )
                    })
                ) || []

        });

    }

    public toObject():
        LiabilityFutureImpactProperties {

        return this.props;

    }

    public toEntityObject():
        LiabilityFutureImpactReturnProperties {

        return this.cleanEntity({

            Next3Months:
                this.props.Next3Months?.toNumber(),

            Next6Months:
                this.props.Next6Months?.toNumber(),

            Next12Months:
                this.props.Next12Months?.toNumber(),

            MonthlyCommitment:
                this.props.MonthlyCommitment?.map(
                    row => ({
                        Year: row.Year,
                        Month: row.Month,
                        Amount:
                            row.Amount?.toNumber()
                    })
                )

        });

    }

}