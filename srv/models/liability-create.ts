import Decimal from "decimal.js";
import { BaseModel } from "./base";

export type LiabilityCreateProperties = {
    ID: string;
    Name: string;
    CurrentBalance: Decimal;
    Status: string;
};

export type LiabilityCreateReturnProperties = {
    ID: string;
    Name: string;
    CurrentBalance: number;
    Status: string;
};

export class LiabilityCreateModel extends BaseModel {

    constructor(
        private props: LiabilityCreateProperties
    ) {
        super();
    }

    public static with(
        props: LiabilityCreateProperties
    ): LiabilityCreateModel {

        return new LiabilityCreateModel(props);

    }

    public static singleModel(
        item: LiabilityCreateReturnProperties
    ): LiabilityCreateModel {

        return LiabilityCreateModel.with({
            ID: item.ID,
            Name: item.Name,
            CurrentBalance:
                this.retrieveDecimal(
                    item.CurrentBalance
                ),
            Status: item.Status
        });

    }

    public toObject():
        LiabilityCreateProperties {

        return this.props;

    }

    public toEntityObject():
        LiabilityCreateReturnProperties {

        return this.cleanEntity({
            ID: this.props.ID,
            Name: this.props.Name,
            CurrentBalance:
                this.props.CurrentBalance?.toNumber(),
            Status: this.props.Status
        });

    }

}