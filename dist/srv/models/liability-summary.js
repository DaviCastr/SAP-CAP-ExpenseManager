"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilitySummaryModel = void 0;
const base_1 = require("./base");
class LiabilitySummaryModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(props) {
        return new LiabilitySummaryModel(props);
    }
    static mapModel(items) {
        return items?.map(item => LiabilitySummaryModel.with({
            ID: item.ID,
            Name: item.Name,
            CurrentBalance: this.retrieveDecimal(item.CurrentBalance),
            Status: item.Status,
            NextDueDate: item.NextDueDate
        }));
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            ID: this.props.ID,
            Name: this.props.Name,
            CurrentBalance: this.props.CurrentBalance?.toNumber(),
            Status: this.props.Status,
            NextDueDate: this.props.NextDueDate
        });
    }
}
exports.LiabilitySummaryModel = LiabilitySummaryModel;
//# sourceMappingURL=liability-summary.js.map