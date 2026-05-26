"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityPremiumScoreModel = void 0;
const base_1 = require("./base");
class LiabilityPremiumScoreModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(props) {
        return new LiabilityPremiumScoreModel(props);
    }
    get Score() { return this.props.Score; }
    get Level() { return this.props.Level; }
    get DebtRatio() { return this.props.DebtRatio; }
    get Message() { return this.props.Message; }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            Score: this.props.Score,
            Level: this.props.Level,
            DebtRatio: this.props.DebtRatio?.toNumber(),
            Message: this.props.Message
        });
    }
}
exports.LiabilityPremiumScoreModel = LiabilityPremiumScoreModel;
//# sourceMappingURL=liability-premium-score.js.map