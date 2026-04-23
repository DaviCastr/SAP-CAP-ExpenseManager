import { BaseModel } from "./base";
import {
    LiabilityModel
} from "./liability";

export type LiabilityListProperties = {
    Total: number;
    Items: LiabilityModel[];
};

export type LiabilityListReturnProperties = {
    Total: number;
    Items: any[];
};

export class LiabilityListModel extends BaseModel {

    constructor(
        private props: LiabilityListProperties
    ) {
        super();
    }

    public static with(
        props: LiabilityListProperties
    ): LiabilityListModel {

        return new LiabilityListModel(props);

    }

    public static singleModel(
        item: LiabilityListReturnProperties
    ): LiabilityListModel {

        return LiabilityListModel.with({
            Total: item.Total,
            Items:
                LiabilityModel.mapModel(
                    item.Items || []
                )
        });

    }

    public toObject():
        LiabilityListProperties {

        return this.props;

    }

    public toEntityObject():
        LiabilityListReturnProperties {

        return this.cleanEntity({
            Total: this.props.Total,
            Items:
                this.props.Items?.map(
                    item =>
                        item.toEntityObject()
                )
        });

    }

}