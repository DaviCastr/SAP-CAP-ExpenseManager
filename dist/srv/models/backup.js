"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupModel = void 0;
const base_1 = require("./base");
class BackupModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new BackupModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(Backups) {
        return Backups?.map((Backup) => {
            return BackupModel.with({
                Id: Backup.ID,
                Backup: Backup.Backup,
                BackupType: Backup.BackupType,
                CreatedAt: Backup.createdAt,
                CreatedBy: Backup.createdBy,
                ModifiedAt: Backup.modifiedAt,
                ModifiedBy: Backup.modifiedBy
            });
        });
    }
    get Id() {
        return this.props.Id;
    }
    get Backup() {
        return this.props.Backup;
    }
    get BackupType() {
        return this.props.BackupType;
    }
    get CreatedAt() {
        return this.props.CreatedAt;
    }
    get CreatedBy() {
        return this.props.CreatedBy;
    }
    get ModifiedAt() {
        return this.props.ModifiedAt;
    }
    get ModifiedBy() {
        return this.props.ModifiedBy;
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            ID: this.props.Id,
            Backup: this.props.Backup,
            BackupType: this.props.BackupType,
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });
    }
}
exports.BackupModel = BackupModel;
//# sourceMappingURL=backup.js.map