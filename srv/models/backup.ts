import { Backup, Backups } from "@models/apps/dflc/gestordegastos/entities";
import { Readable } from "stream";
import { BaseModel } from "./base";

type BackupProperties = {
    Id: string;
    Backup: Readable;
    BackupType: string;
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class BackupModel extends BaseModel {

    constructor(private props: BackupProperties) { super() }

    public static with(properties: BackupProperties): BackupModel {
        return new BackupModel(properties);
    }

    public static singleModel(properties: Backup): BackupModel {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(Backups: Backups): BackupModel[] {

        return Backups?.map((Backup: Backup) => {

            return BackupModel.with({
                Id: Backup.ID as string,
                Backup: Backup.Backup as Readable,
                BackupType: Backup.BackupType as string,
                CreatedAt: Backup.createdAt as string,
                CreatedBy: Backup.createdBy as string,
                ModifiedAt: Backup.modifiedAt as string,
                ModifiedBy: Backup.modifiedBy as string
            });

        });

    }

    public get Id() {

        return this.props.Id;

    }

    public get Backup() {

        return this.props.Backup;

    }

    public get BackupType() {

        return this.props.BackupType;

    }

    public get CreatedAt() {

        return this.props.CreatedAt;

    }

    public get CreatedBy() {

        return this.props.CreatedBy;

    }

    public get ModifiedAt() {

        return this.props.ModifiedAt;

    }

    public get ModifiedBy() {

        return this.props.ModifiedBy;

    }

    public toObject(): BackupProperties {

        return this.props;

    }

    public toEntityObject(): Backup {

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