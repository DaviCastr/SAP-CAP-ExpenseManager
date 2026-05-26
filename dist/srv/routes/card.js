"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("@/factories/routes/card");
const invoice_1 = require("@/factories/routes/invoice");
const transaction_1 = require("@/factories/routes/transaction");
const cds_1 = __importDefault(require("@sap/cds"));
class Card extends cds_1.default.ApplicationService {
    init() {
        card_1.oCardRouteFactory.main(this);
        invoice_1.oInvoiceRouteFactory.main(this);
        transaction_1.oTransactionRouteFactory.main(this);
        return super.init();
    }
}
module.exports = Card;
//# sourceMappingURL=card.js.map