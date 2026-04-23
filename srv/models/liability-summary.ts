import Decimal from "decimal.js";
import { BaseModel } from "./base";

export type LiabilitySummaryProperties = {
    ID: string;
    Name: string;
    CurrentBalance: Decimal;
    Status: string;
    NextDueDate?: string;
};

export type LiabilitySummaryReturnProperties = {
    ID: string;
    Name: string;
    CurrentBalance: number;
    Status: string;
    NextDueDate?: string;
};

export class LiabilitySummaryModel extends BaseModel {

    constructor(
        private props: LiabilitySummaryProperties
    ) { super(); }

    public static with(
        props: LiabilitySummaryProperties
    ): LiabilitySummaryModel {

        return new LiabilitySummaryModel(props);

    }

    public static mapModel(
        items: LiabilitySummaryReturnProperties[]
    ): LiabilitySummaryModel[] {

        return items?.map(item =>
            LiabilitySummaryModel.with({
                ID: item.ID,
                Name: item.Name,
                CurrentBalance: this.retrieveDecimal(item.CurrentBalance),
                Status: item.Status,
                NextDueDate: item.NextDueDate
            })
        );

    }

    public toObject(): LiabilitySummaryProperties {

        return this.props;

    }

    public toEntityObject():
        LiabilitySummaryReturnProperties {

        return this.cleanEntity({
            ID: this.props.ID,
            Name: this.props.Name,
            CurrentBalance:
                this.props.CurrentBalance?.toNumber(),
            Status: this.props.Status,
            NextDueDate: this.props.NextDueDate
        });

    }

}