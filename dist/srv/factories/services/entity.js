"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oEntityServiceFactory = void 0;
const implementation_1 = require("@/services/entity/implementation");
const share_1 = require("../repositories/share");
const person_1 = require("../repositories/person");
const entity_1 = require("../repositories/entity");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const makeEntityService = () => {
    const service = new implementation_1.EntityServiceImplementation(person_1.oPersonRepositoryFactory, share_1.oShareRepositoryFactory, entity_1.oEntityRepositoryFactory);
    ServiceRegistry_1.ServiceRegistry.register('Entities', service);
    return service;
};
exports.oEntityServiceFactory = makeEntityService();
//# sourceMappingURL=entity.js.map