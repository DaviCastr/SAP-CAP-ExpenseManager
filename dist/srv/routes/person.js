"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("@/factories/routes/card");
const category_1 = require("@/factories/routes/category");
const entity_1 = require("@/factories/routes/entity");
const invoice_1 = require("@/factories/routes/invoice");
const person_1 = require("@/factories/routes/person");
const share_1 = require("@/factories/routes/share");
const transaction_1 = require("@/factories/routes/transaction");
const cds_1 = __importDefault(require("@sap/cds"));
class Person extends cds_1.default.ApplicationService {
    init() {
        person_1.oPersonRouteFactory.main(this);
        category_1.oCategoryRouteFactory.main(this);
        share_1.oShareRouteFactory.main(this);
        entity_1.oEntityRouteFactory.main(this);
        card_1.oCardRouteFactory.main(this);
        invoice_1.oInvoiceRouteFactory.main(this);
        transaction_1.oTransactionRouteFactory.main(this);
        return super.init();
    }
}
module.exports = Person;
//# sourceMappingURL=person.js.map