"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oBackupControllerFactory = void 0;
const backup_1 = require("../services/backup");
const implementation_1 = require("@/controllers/backup/implementation");
const makeBackupController = () => {
    return new implementation_1.BackupControllerImplementation(backup_1.oBackupServiceFactory);
};
exports.oBackupControllerFactory = makeBackupController();
//# sourceMappingURL=backup.js.map