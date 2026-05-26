"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyModel = void 0;
const base_1 = require("./base");
class CurrencyModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new CurrencyModel(properties);
    }
    static singleModel(properties) {
        return CurrencyModel.with({
            Code: properties?.code,
            Name: properties?.name || '',
            Description: properties?.descr,
            Symbol: properties?.symbol,
            MinorUnit: properties?.minorUnit
        });
    }
    get Code() {
        return this.props.Code;
    }
    get Symbol() {
        return this.props.Symbol;
    }
    get MinorUnit() {
        return this.props.MinorUnit;
    }
    toEntityObject() {
        return this.cleanEntity({
            code: this.props.Code,
            //name: this.props.Name,
            //descr: this.props.Description,
            //minorUnit: this.props.MinorUnit,
            //symbol: this.props.Symbol
        });
    }
}
exports.CurrencyModel = CurrencyModel;
//# sourceMappingURL=currency.js.map