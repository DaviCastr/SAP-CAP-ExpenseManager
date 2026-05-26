"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_1 = require("@/factories/routes/invoice");
const transaction_1 = require("@/factories/routes/transaction");
const cds_1 = __importDefault(require("@sap/cds"));
class Invoice extends cds_1.default.ApplicationService {
    init() {
        invoice_1.oInvoiceRouteFactory.main(this);
        transaction_1.oTransactionRouteFactory.main(this);
        return super.init();
    }
}
module.exports = Invoice;
//# sourceMappingURL=invoice.js.map