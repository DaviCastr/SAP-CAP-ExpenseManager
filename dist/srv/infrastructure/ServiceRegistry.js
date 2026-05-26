"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRegistry = void 0;
class ServiceRegistry {
    static services = new Map();
    static register(entityName, service) {
        this.services.set(entityName, service);
    }
    static get(entityName) {
        return this.services.get(entityName);
    }
}
exports.ServiceRegistry = ServiceRegistry;
//# sourceMappingURL=ServiceRegistry.js.map