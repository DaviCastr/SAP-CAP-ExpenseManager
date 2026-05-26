"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const liability_1 = require("@/factories/routes/liability");
const liability_transaction_1 = require("@/factories/routes/liability-transaction");
const cds_1 = __importDefault(require("@sap/cds"));
class Liability extends cds_1.default.ApplicationService {
    init() {
        liability_1.oLiabilityRouteFactory.main(this);
        liability_transaction_1.oLiabilityTransactionRouteFactory.main(this);
        return super.init();
    }
}
module.exports = Liability;
//# sourceMappingURL=liability.js.map