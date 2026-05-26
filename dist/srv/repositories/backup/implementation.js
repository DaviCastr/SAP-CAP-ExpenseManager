"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const backup_1 = require("@/models/backup");
const implementation_1 = require("../base/implementation");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class BackupRepositoryImplementation extends implementation_1.BaseRepositoryImplementation {
    async findById(Id) {
        let oBackupEntity = this.getEntity();
        let oSql = SELECT.from(oBackupEntity).where({ ID: Id });
        let oBackups = await cds_1.default.run(oSql);
        if (oBackupEntity?.isDraft) {
            oBackupEntity = this.getEntity(true);
            oSql = SELECT.from(oBackupEntity).where({ ID: Id });
            const additionalBackupts = await cds_1.default.run(oSql) || [];
            oBackups = [...(oBackups || []), ...additionalBackupts];
        }
        const oBackupsModel = this.mapBackupResult(oBackups);
        return oBackupsModel?.[0];
    }
    async findByIds(Ids) {
        let oBackupEntity = this.getEntity();
        let oSql = SELECT.from(oBackupEntity).where({ ID: { in: Ids } });
        let oBackups = await cds_1.default.run(oSql);
        if (oBackupEntity?.isDraft) {
            oBackupEntity = this.getEntity(true);
            oSql = SELECT.from(oBackupEntity).where({ ID: { in: Ids } });
            const additionalBackupts = await cds_1.default.run(oSql) || [];
            oBackups = [...(oBackups || []), ...additionalBackupts];
        }
        const oBackupsModel = this.mapBackupResult(oBackups);
        return oBackupsModel;
    }
    async createEntry(data) {
        let oBackupEntity = this.getEntity();
        let oSql = INSERT.into(oBackupEntity).entries(data);
        await cds_1.default.run(oSql);
        return this.mapBackupResult(Array.isArray(data) ? data : [data]);
    }
    async deleteEntry(id) {
        let oBackupEntity = this.getEntity();
        const ids = Array.isArray(id) ? id : [id];
        for (const backupId of ids) {
            let oSql = DELETE.from(oBackupEntity).where({ ID: backupId });
            await cds_1.default.run(oSql);
        }
        return true;
    }
    mapBackupResult(Entities) {
        if (Entities.length === 0) {
            return null;
        }
        return backup_1.BackupModel.mapModel(Entities);
    }
    getEntity(ignoreDraft = false) {
        return ServiceLocator_1.ServiceLocator.getEntity('Backups', ignoreDraft);
    }
    personPath() {
        return '';
    }
}
exports.BackupRepositoryImplementation = BackupRepositoryImplementation;
//# sourceMappingURL=implementation.js.map