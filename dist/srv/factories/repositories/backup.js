"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oBackupRepositoryFactory = void 0;
const implementation_1 = require("@/repositories/backup/implementation");
const makeBackupRepository = () => {
    return new implementation_1.BackupRepositoryImplementation();
};
exports.oBackupRepositoryFactory = makeBackupRepository();
//# sourceMappingURL=backup.js.map