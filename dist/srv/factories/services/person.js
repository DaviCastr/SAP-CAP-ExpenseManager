"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oPersonServiceFactory = void 0;
const implementation_1 = require("@/services/person/implementation");
const person_1 = require("../repositories/person");
const share_1 = require("../repositories/share");
const entity_1 = require("../repositories/entity");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const invoice_1 = require("../repositories/invoice");
const card_1 = require("../repositories/card");
const category_1 = require("../repositories/category");
const transaction_1 = require("../repositories/transaction");
const makePersonService = () => {
    const service = new implementation_1.PersonServiceImplementation(share_1.oShareRepositoryFactory, entity_1.oEntityRepositoryFactory, person_1.oPersonRepositoryFactory, category_1.oCategoryRepositoryFactory, card_1.oCardRepositoryFactory, invoice_1.oInvoiceRepositoryFactory, transaction_1.oTransactionRepositoryFactory);
    ServiceRegistry_1.ServiceRegistry.register('Persons', service);
    return service;
};
exports.oPersonServiceFactory = makePersonService();
//# sourceMappingURL=person.js.map