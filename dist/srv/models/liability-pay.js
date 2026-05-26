"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityPayModel = void 0;
const base_1 = require("./base");
const currency_1 = require("./currency");
class LiabilityPayModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(props) {
        return new LiabilityPayModel(props);
    }
    static singleModel(item) {
        return LiabilityPayModel.with({
            LiabilityId: item.LiabilityId,
            PaymentDate: item.PaymentDate,
            Amount: this.retrieveDecimal(item.Amount),
            Currency: item.Currency
                ? currency_1.CurrencyModel.singleModel(item.Currency)
                : undefined,
            Notes: item.Notes
        });
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            LiabilityId: this.props.LiabilityId,
            PaymentDate: this.props.PaymentDate,
            Amount: this.props.Amount?.toNumber(),
            Currency: this.props.Currency?.toEntityObject(),
            Notes: this.props.Notes
        });
    }
}
exports.LiabilityPayModel = LiabilityPayModel;
//# sourceMappingURL=liability-pay.js.map