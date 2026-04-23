import Decimal from "decimal.js";
import { BaseModel } from "./base";
import { CurrencyModel } from "./currency";
import { Currency } from "@models/sap/common";

export type LiabilityCloseProperties = {
    LiabilityId: string;
    Name: string;
    PaidAmount: Decimal;
    TotalPaidAmount: Decimal;
    ClosedAt: string;
    Currency?: CurrencyModel;
    Status: string;
};

export type LiabilityCloseReturnProperties = {
    LiabilityId: string;
    Name: string;
    PaidAmount: number;
    TotalPaidAmount: number;
    ClosedAt: string;
    Currency?: Currency;
    Status: string;
};

export class LiabilityCloseModel extends BaseModel {

    constructor(
        private props: LiabilityCloseProperties
    ) {
        super();
    }

    public static with(
        props: LiabilityCloseProperties
    ): LiabilityCloseModel {

        return new LiabilityCloseModel(props);

    }

    public static singleModel(
        item: LiabilityCloseReturnProperties
    ): LiabilityCloseModel {

        return LiabilityCloseModel.with({
            LiabilityId: item.LiabilityId,
            Name: item.Name,
            PaidAmount: this.retrieveDecimal(
                item.PaidAmount
            ),
            TotalPaidAmount: this.retrieveDecimal(
                item.TotalPaidAmount
            ),
            ClosedAt: item.ClosedAt,
            Currency: item.Currency
                ? CurrencyModel.singleModel(
                    item.Currency
                )
                : undefined,
            Status: item.Status
        });

    }

    public toObject():
        LiabilityCloseProperties {

        return this.props;

    }

    public toEntityObject():
        LiabilityCloseReturnProperties {

        return this.cleanEntity({
            LiabilityId: this.props.LiabilityId,
            Name: this.props.Name,
            PaidAmount:
                this.props.PaidAmount?.toNumber(),
            TotalPaidAmount:
                this.props.TotalPaidAmount?.toNumber(),
            ClosedAt: this.props.ClosedAt,
            Currency:
                this.props.Currency?.toEntityObject(),
            Status: this.props.Status
        });

    }

}