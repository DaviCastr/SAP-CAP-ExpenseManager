import Decimal from "decimal.js";
import { BaseModel } from "./base";
import { CurrencyModel } from "./currency";
import { Currency } from "@models/sap/common";

export type LiabilityPayProperties = {
    LiabilityId: string;
    PaymentDate: string;
    Amount: Decimal;
    Currency?: CurrencyModel;
    Notes?: string;
};

export type LiabilityPayReturnProperties = {
    LiabilityId: string;
    PaymentDate: string;
    Amount: number;
    Currency?: Currency;
    Notes?: string;
};

export class LiabilityPayModel extends BaseModel {

    constructor(
        private props: LiabilityPayProperties
    ) { super(); }

    public static with(
        props: LiabilityPayProperties
    ): LiabilityPayModel {

        return new LiabilityPayModel(props);

    }

    public static singleModel(
        item: LiabilityPayReturnProperties
    ): LiabilityPayModel {

        return LiabilityPayModel.with({
            LiabilityId: item.LiabilityId,
            PaymentDate: item.PaymentDate,
            Amount: this.retrieveDecimal(item.Amount),
            Currency: item.Currency
                ? CurrencyModel.singleModel(item.Currency)
                : undefined,
            Notes: item.Notes
        });

    }

    public toObject():
        LiabilityPayProperties {

        return this.props;

    }

    public toEntityObject():
        LiabilityPayReturnProperties {

        return this.cleanEntity({
            LiabilityId: this.props.LiabilityId,
            PaymentDate: this.props.PaymentDate,
            Amount: this.props.Amount?.toNumber(),
            Currency:
                this.props.Currency?.toEntityObject(),
            Notes: this.props.Notes
        });

    }

}