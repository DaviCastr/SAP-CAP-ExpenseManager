"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backup_1 = require("@/factories/routes/backup");
const cds_1 = __importDefault(require("@sap/cds"));
class Backup extends cds_1.default.ApplicationService {
    init() {
        backup_1.oBackupRouteFactory.main(this);
        return super.init();
    }
}
module.exports = Backup;
//# sourceMappingURL=backup.js.map