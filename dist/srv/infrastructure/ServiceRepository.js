"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepository = void 0;
class ServiceRepository {
    static repositories = new Map();
    static register(entityName, repository) {
        this.repositories.set(entityName, repository);
    }
    static get(entityName) {
        return this.repositories.get(entityName);
    }
}
exports.ServiceRepository = ServiceRepository;
//# sourceMappingURL=ServiceRepository.js.map