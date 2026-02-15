// entity Backups : cuid, managed {
//     Backup     : LargeBinary
//     BackupType : String;
// }

type BackupProperties = {
    Id: string;
    Backup: Buffer;
    BackupType: string;
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class BackupModel {

    constructor(private props: BackupProperties) { }

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

}