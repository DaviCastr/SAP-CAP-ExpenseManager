import Decimal from "decimal.js";
import { BaseModel } from "./base";

export type LiabilityPremiumScoreProperties = {
    Score: number;
    Level: string;
    DebtRatio: Decimal;
    Message: string;
};

export class LiabilityPremiumScoreModel extends BaseModel {

    constructor(
        private props: LiabilityPremiumScoreProperties
    ) {
        super();
    }

    public static with(
        props: LiabilityPremiumScoreProperties
    ): LiabilityPremiumScoreModel {

        return new LiabilityPremiumScoreModel(props);

    }

    public get Score() { return this.props.Score; }

    public get Level() { return this.props.Level; }

    public get DebtRatio() { return this.props.DebtRatio; }

    public get Message() { return this.props.Message; }

    public toObject() {

        return this.props;

    }

    public toEntityObject() {

        return this.cleanEntity({
            Score: this.props.Score,
            Level: this.props.Level,
            DebtRatio: this.props.DebtRatio?.toNumber(),
            Message: this.props.Message
        });

    }

}