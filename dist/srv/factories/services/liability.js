"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oLiabilityServiceFactory = void 0;
const implementation_1 = require("@/services/liability/implementation");
const liability_1 = require("../repositories/liability");
const liability_transaction_1 = require("../repositories/liability-transaction");
const person_1 = require("../repositories/person");
const share_1 = require("../repositories/share");
const entity_1 = require("../repositories/entity");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const makeLiabilityService = () => {
    const service = new implementation_1.LiabilityServiceImplementation(liability_1.oLiabilityRepositoryFactory, person_1.oPersonRepositoryFactory, share_1.oShareRepositoryFactory, entity_1.oEntityRepositoryFactory, liability_transaction_1.oLiabilityTransactionRepositoryFactory);
    ServiceRegistry_1.ServiceRegistry.register("Liabilities", service);
    return service;
};
exports.oLiabilityServiceFactory = makeLiabilityService();
//# sourceMappingURL=liability.js.map