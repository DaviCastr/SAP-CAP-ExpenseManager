"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oTransactionServiceFactory = void 0;
const implementation_1 = require("@/services/transaction/implementation");
const transaction_1 = require("../repositories/transaction");
const person_1 = require("../repositories/person");
const share_1 = require("../repositories/share");
const invoice_1 = require("../repositories/invoice");
const entity_1 = require("../repositories/entity");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const makeCustomerService = () => {
    const service = new implementation_1.TransactionServiceImplementation(person_1.oPersonRepositoryFactory, share_1.oShareRepositoryFactory, entity_1.oEntityRepositoryFactory, transaction_1.oTransactionRepositoryFactory, invoice_1.oInvoiceRepositoryFactory);
    ServiceRegistry_1.ServiceRegistry.register('Transactions', service);
    return service;
};
exports.oTransactionServiceFactory = makeCustomerService();
//# sourceMappingURL=transaction.js.map