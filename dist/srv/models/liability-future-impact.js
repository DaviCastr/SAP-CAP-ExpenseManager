"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityFutureImpactModel = void 0;
const base_1 = require("./base");
class LiabilityFutureImpactModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(props) {
        return new LiabilityFutureImpactModel(props);
    }
    static singleModel(item) {
        return LiabilityFutureImpactModel.with({
            Next3Months: this.retrieveDecimal(item.Next3Months),
            Next6Months: this.retrieveDecimal(item.Next6Months),
            Next12Months: this.retrieveDecimal(item.Next12Months),
            MonthlyCommitment: item.MonthlyCommitment?.map(row => ({
                Year: row.Year,
                Month: row.Month,
                Amount: this.retrieveDecimal(row.Amount)
            })) || []
        });
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            Next3Months: this.props.Next3Months?.toNumber(),
            Next6Months: this.props.Next6Months?.toNumber(),
            Next12Months: this.props.Next12Months?.toNumber(),
            MonthlyCommitment: this.props.MonthlyCommitment?.map(row => ({
                Year: row.Year,
                Month: row.Month,
                Amount: row.Amount?.toNumber()
            }))
        });
    }
}
exports.LiabilityFutureImpactModel = LiabilityFutureImpactModel;
//# sourceMappingURL=liability-future-impact.js.map