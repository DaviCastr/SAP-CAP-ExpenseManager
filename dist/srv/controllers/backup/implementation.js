"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupControllerImplementation = void 0;
const implementation_1 = require("../base/implementation");
class BackupControllerImplementation extends implementation_1.BaseControllerImplementation {
    Service;
    constructor(Service) {
        super();
        this.Service = Service;
    }
    async processBackupDelete(Backup) {
        const result = await this.Service.processBackupDelete(Backup);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(204, result.value);
    }
    async exportBackup() {
        const result = await this.Service.exportBackup();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(201, result.value);
    }
}
exports.BackupControllerImplementation = BackupControllerImplementation;
//# sourceMappingURL=implementation.js.map