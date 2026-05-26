"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
const category_1 = require("@/factories/routes/category");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
const transaction_1 = require("@/factories/routes/transaction");
const share_1 = require("@/factories/routes/share");
const entity_1 = require("@/factories/routes/entity");
const invoice_1 = require("@/factories/routes/invoice");
const liability_1 = require("@/factories/routes/liability");
const liability_transaction_1 = require("@/factories/routes/liability-transaction");
const card_1 = require("@/factories/routes/card");
const person_1 = require("@/factories/routes/person");
class MainRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    constructor() {
        super();
        this.Controller = null;
    }
    main(Service) {
        ServiceLocator_1.ServiceLocator.setGestorService(Service);
        person_1.oPersonRouteFactory.main(Service);
        share_1.oShareRouteFactory.main(Service);
        entity_1.oEntityRouteFactory.main(Service);
        category_1.oCategoryRouteFactory.main(Service);
        card_1.oCardRouteFactory.main(Service);
        invoice_1.oInvoiceRouteFactory.main(Service);
        transaction_1.oTransactionRouteFactory.main(Service);
        liability_1.oLiabilityRouteFactory.main(Service);
        liability_transaction_1.oLiabilityTransactionRouteFactory.main(Service);
    }
}
exports.MainRouteImplementation = MainRouteImplementation;
//# sourceMappingURL=implementation.js.map