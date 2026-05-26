"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
class BaseModel {
    static retrieveDecimal(value) {
        return value ? new decimal_js_1.default(value).toDecimalPlaces(2) : null;
    }
    cleanEntity(obj) {
        if (Array.isArray(obj)) {
            if (obj.length == 0)
                return;
            return obj.map((item) => this.cleanEntity(item));
        }
        if (obj && typeof obj === 'object') {
            return Object.fromEntries(Object.entries(obj)
                .filter(([_, v]) => v !== undefined && v !== null && JSON.stringify(v) != '{}' && v?.length !== 0)
                .map(([k, v]) => [k, this.cleanEntity(v)]));
        }
        return obj;
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=base.js.map