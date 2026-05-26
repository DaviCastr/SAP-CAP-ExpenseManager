"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityCloseModel = void 0;
const base_1 = require("./base");
const currency_1 = require("./currency");
class LiabilityCloseModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(props) {
        return new LiabilityCloseModel(props);
    }
    static singleModel(item) {
        return LiabilityCloseModel.with({
            LiabilityId: item.LiabilityId,
            Name: item.Name,
            PaidAmount: this.retrieveDecimal(item.PaidAmount),
            TotalPaidAmount: this.retrieveDecimal(item.TotalPaidAmount),
            ClosedAt: item.ClosedAt,
            Currency: item.Currency
                ? currency_1.CurrencyModel.singleModel(item.Currency)
                : undefined,
            Status: item.Status
        });
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            LiabilityId: this.props.LiabilityId,
            Name: this.props.Name,
            PaidAmount: this.props.PaidAmount?.toNumber(),
            TotalPaidAmount: this.props.TotalPaidAmount?.toNumber(),
            ClosedAt: this.props.ClosedAt,
            Currency: this.props.Currency?.toEntityObject(),
            Status: this.props.Status
        });
    }
}
exports.LiabilityCloseModel = LiabilityCloseModel;
//# sourceMappingURL=liability-close.js.map