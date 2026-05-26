"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oShareServiceFactory = void 0;
const implementation_1 = require("@/services/share/implementation");
const share_1 = require("../repositories/share");
const transaction_1 = require("../repositories/transaction");
const person_1 = require("../repositories/person");
const entity_1 = require("../repositories/entity");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const makeShareService = () => {
    const service = new implementation_1.ShareServiceImplementation(person_1.oPersonRepositoryFactory, share_1.oShareRepositoryFactory, entity_1.oEntityRepositoryFactory, transaction_1.oTransactionRepositoryFactory);
    ServiceRegistry_1.ServiceRegistry.register('Shares', service);
    return service;
};
exports.oShareServiceFactory = makeShareService();
//# sourceMappingURL=share.js.map