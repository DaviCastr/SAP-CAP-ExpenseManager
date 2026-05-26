"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityCreateModel = void 0;
const base_1 = require("./base");
class LiabilityCreateModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(props) {
        return new LiabilityCreateModel(props);
    }
    static singleModel(item) {
        return LiabilityCreateModel.with({
            ID: item.ID,
            Name: item.Name,
            CurrentBalance: this.retrieveDecimal(item.CurrentBalance),
            Status: item.Status
        });
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            ID: this.props.ID,
            Name: this.props.Name,
            CurrentBalance: this.props.CurrentBalance?.toNumber(),
            Status: this.props.Status
        });
    }
}
exports.LiabilityCreateModel = LiabilityCreateModel;
//# sourceMappingURL=liability-create.js.map