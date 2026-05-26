"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oBackupRouteFactory = void 0;
const implementation_1 = require("@/routes/backup/implementation");
const backup_1 = require("../controllers/backup");
const makeBackupRoute = () => {
    return new implementation_1.BackupRouteImplementation(backup_1.oBackupControllerFactory);
};
exports.oBackupRouteFactory = makeBackupRoute();
//# sourceMappingURL=backup.js.map