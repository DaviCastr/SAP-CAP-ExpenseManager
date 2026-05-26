"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oInvoiceServiceFactory = void 0;
const implementation_1 = require("@/services/invoice/implementation");
const invoice_1 = require("../repositories/invoice");
const person_1 = require("../repositories/person");
const share_1 = require("../repositories/share");
const card_1 = require("../repositories/card");
const entity_1 = require("../repositories/entity");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const makeCustomerService = () => {
    const service = new implementation_1.InvoiceServiceImplementation(person_1.oPersonRepositoryFactory, share_1.oShareRepositoryFactory, entity_1.oEntityRepositoryFactory, invoice_1.oInvoiceRepositoryFactory, card_1.oCardRepositoryFactory);
    ServiceRegistry_1.ServiceRegistry.register('Invoices', service);
    return service;
};
exports.oInvoiceServiceFactory = makeCustomerService();
//# sourceMappingURL=invoice.js.map