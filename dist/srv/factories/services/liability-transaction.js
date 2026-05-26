"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oLiabilityTransactionServiceFactory = void 0;
const implementation_1 = require("@/services/liability-transaction/implementation");
const liability_transaction_1 = require("../repositories/liability-transaction");
const person_1 = require("../repositories/person");
const share_1 = require("../repositories/share");
const entity_1 = require("../repositories/entity");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const liability_1 = require("../repositories/liability");
const makeService = () => {
    const service = new implementation_1.LiabilityTransactionServiceImplementation(person_1.oPersonRepositoryFactory, share_1.oShareRepositoryFactory, entity_1.oEntityRepositoryFactory, liability_transaction_1.oLiabilityTransactionRepositoryFactory, liability_1.oLiabilityRepositoryFactory);
    ServiceRegistry_1.ServiceRegistry.register("LiabilityTransactions", service);
    return service;
};
exports.oLiabilityTransactionServiceFactory = makeService();
//# sourceMappingURL=liability-transaction.js.map