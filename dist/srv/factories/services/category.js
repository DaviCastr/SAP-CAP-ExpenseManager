"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oCategoryServiceFactory = void 0;
const implementation_1 = require("@/services/category/implementation");
const category_1 = require("../repositories/category");
const transaction_1 = require("../repositories/transaction");
const person_1 = require("../repositories/person");
const share_1 = require("../repositories/share");
const entity_1 = require("../repositories/entity");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const makeCustomerService = () => {
    const service = new implementation_1.CategoryServiceImplementation(person_1.oPersonRepositoryFactory, share_1.oShareRepositoryFactory, entity_1.oEntityRepositoryFactory, category_1.oCategoryRepositoryFactory, transaction_1.oTransactionRepositoryFactory);
    ServiceRegistry_1.ServiceRegistry.register('Categories', service);
    return service;
};
exports.oCategoryServiceFactory = makeCustomerService();
//# sourceMappingURL=category.js.map