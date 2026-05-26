"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oBackupServiceFactory = void 0;
const implementation_1 = require("@/services/backup/implementation");
const share_1 = require("../repositories/share");
const person_1 = require("../repositories/person");
const backup_1 = require("../repositories/backup");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const entity_1 = require("../repositories/entity");
const makeBackupService = () => {
    const service = new implementation_1.BackupServiceImplementation(person_1.oPersonRepositoryFactory, share_1.oShareRepositoryFactory, entity_1.oEntityRepositoryFactory, backup_1.oBackupRepositoryFactory);
    ServiceRegistry_1.ServiceRegistry.register('Backups', service);
    return service;
};
exports.oBackupServiceFactory = makeBackupService();
//# sourceMappingURL=backup.js.map