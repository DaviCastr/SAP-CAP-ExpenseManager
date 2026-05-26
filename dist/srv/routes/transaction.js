"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("@/factories/routes/transaction");
const cds_1 = __importDefault(require("@sap/cds"));
class Transaction extends cds_1.default.ApplicationService {
    init() {
        transaction_1.oTransactionRouteFactory.main(this);
        return super.init();
    }
}
module.exports = Transaction;
//# sourceMappingURL=transaction.js.map