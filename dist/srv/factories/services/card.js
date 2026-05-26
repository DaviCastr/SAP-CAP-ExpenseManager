"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oCardServiceFactory = void 0;
const implementation_1 = require("@/services/card/implementation");
const card_1 = require("../repositories/card");
const person_1 = require("../repositories/person");
const share_1 = require("../repositories/share");
const entity_1 = require("../repositories/entity");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const invoice_1 = require("../repositories/invoice");
const makeCustomerService = () => {
    const service = new implementation_1.CardServiceImplementation(person_1.oPersonRepositoryFactory, share_1.oShareRepositoryFactory, entity_1.oEntityRepositoryFactory, card_1.oCardRepositoryFactory, invoice_1.oInvoiceRepositoryFactory);
    ServiceRegistry_1.ServiceRegistry.register('Cards', service);
    return service;
};
exports.oCardServiceFactory = makeCustomerService();
//# sourceMappingURL=card.js.map