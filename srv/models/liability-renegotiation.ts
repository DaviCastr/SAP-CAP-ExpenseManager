import Decimal from "decimal.js";
import { BaseModel } from "./base";
import { CurrencyModel } from "./currency";
import { Currency } from "@models/sap/common";

export type LiabilityRenegotiationProperties = {
    LiabilityId: string;
    Name: string;

    PreviousBalance: Decimal;
    NewBalance: Decimal;
    DiscountAmount: Decimal;

    PreviousInstallments?: number;
    NewInstallments?: number;

    PreviousInstallmentAmount?: Decimal;
    NewInstallmentAmount?: Decimal;

    PreviousInterestRate?: Decimal;
    NewInterestRate?: Decimal;

    RenegotiatedAt: string;

    Currency?: CurrencyModel;

    Notes?: string;
};

export type LiabilityRenegotiationReturnProperties = {
    LiabilityId: string;
    Name: string;

    PreviousBalance: number;
    NewBalance: number;
    DiscountAmount: number;

    PreviousInstallments?: number;
    NewInstallments?: number;

    PreviousInstallmentAmount?: number;
    NewInstallmentAmount?: number;

    PreviousInterestRate?: number;
    NewInterestRate?: number;

    RenegotiatedAt: string;

    Currency?: Currency;

    Notes?: string;
};

export class LiabilityRenegotiationModel
    extends BaseModel {

    constructor(
        private props:
            LiabilityRenegotiationProperties
    ) {
        super();
    }

    public static with(
        props:
            LiabilityRenegotiationProperties
    ): LiabilityRenegotiationModel {

        return new LiabilityRenegotiationModel(
            props
        );

    }

    public static singleModel(
        item:
            LiabilityRenegotiationReturnProperties
    ): LiabilityRenegotiationModel {

        return LiabilityRenegotiationModel.with({

            LiabilityId: item.LiabilityId,
            Name: item.Name,

            PreviousBalance:
                this.retrieveDecimal(
                    item.PreviousBalance
                ),

            NewBalance:
                this.retrieveDecimal(
                    item.NewBalance
                ),

            DiscountAmount:
                this.retrieveDecimal(
                    item.DiscountAmount
                ),

            PreviousInstallments:
                item.PreviousInstallments,

            NewInstallments:
                item.NewInstallments,

            PreviousInstallmentAmount:
                this.retrieveDecimal(
                    item.PreviousInstallmentAmount
                ),

            NewInstallmentAmount:
                this.retrieveDecimal(
                    item.NewInstallmentAmount
                ),

            PreviousInterestRate:
                this.retrieveDecimal(
                    item.PreviousInterestRate
                ),

            NewInterestRate:
                this.retrieveDecimal(
                    item.NewInterestRate
                ),

            RenegotiatedAt:
                item.RenegotiatedAt,

            Currency:
                item.Currency
                    ? CurrencyModel.singleModel(
                        item.Currency
                    )
                    : undefined,

            Notes:
                item.Notes

        });

    }

    public toObject():
        LiabilityRenegotiationProperties {

        return this.props;

    }

    public toEntityObject():
        LiabilityRenegotiationReturnProperties {

        return this.cleanEntity({

            LiabilityId:
                this.props.LiabilityId,

            Name:
                this.props.Name,

            PreviousBalance:
                this.props
                    .PreviousBalance
                    ?.toNumber(),

            NewBalance:
                this.props
                    .NewBalance
                    ?.toNumber(),

            DiscountAmount:
                this.props
                    .DiscountAmount
                    ?.toNumber(),

            PreviousInstallments:
                this.props
                    .PreviousInstallments,

            NewInstallments:
                this.props
                    .NewInstallments,

            PreviousInstallmentAmount:
                this.props
                    .PreviousInstallmentAmount
                    ?.toNumber(),

            NewInstallmentAmount:
                this.props
                    .NewInstallmentAmount
                    ?.toNumber(),

            PreviousInterestRate:
                this.props
                    .PreviousInterestRate
                    ?.toNumber(),

            NewInterestRate:
                this.props
                    .NewInterestRate
                    ?.toNumber(),

            RenegotiatedAt:
                this.props
                    .RenegotiatedAt,

            Currency:
                this.props
                    .Currency
                    ?.toEntityObject(),

            Notes:
                this.props
                    .Notes

        });

    }

}