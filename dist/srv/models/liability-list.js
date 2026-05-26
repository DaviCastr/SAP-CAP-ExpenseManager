"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityListModel = void 0;
const base_1 = require("./base");
const liability_1 = require("./liability");
class LiabilityListModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(props) {
        return new LiabilityListModel(props);
    }
    static singleModel(item) {
        return LiabilityListModel.with({
            Total: item.Total,
            Items: liability_1.LiabilityModel.mapModel(item.Items || [])
        });
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            Total: this.props.Total,
            Items: this.props.Items?.map(item => item.toEntityObject())
        });
    }
}
exports.LiabilityListModel = LiabilityListModel;
//# sourceMappingURL=liability-list.js.map