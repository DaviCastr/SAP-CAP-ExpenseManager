import cds, { entity } from "@sap/cds";

import { BackupModel } from "@/models/backup";
import { BackupRepository } from "./protocols";
import { Backup, Backups } from "@models/apps/dflc/expensemanager/entities";
import { Entities } from "@models/apps/dflc/expensemanager/entities";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class BackupRepositoryImplementation extends BaseRepositoryImplementation implements BackupRepository {


    public async findById(Id: Backup['ID']): Promise<BackupModel | null> {

        let oBackupEntity = this.getEntity();

        let oSql = SELECT.from(oBackupEntity).where({ ID: Id });

        let oBackups = await cds.run(oSql);

        if ((oBackupEntity as any)?.isDraft && !(oBackups || []).length) {

            oBackupEntity = this.getEntity(true);

            oSql = SELECT.from(oBackupEntity).where({ ID: Id });

            oBackups = await cds.run(oSql) || [];

        }

        const oBackupsModel = this.mapBackupResult(oBackups);

        return oBackupsModel?.[0] as BackupModel;

    }


    public async findByIds(Ids: Backup['ID'][]): Promise<BackupModel[] | null> {

        let oBackupEntity = this.getEntity();

        let oSql = SELECT.from(oBackupEntity).where({ ID: { in: Ids } });

        let oBackups = await cds.run(oSql);

        if ((oBackupEntity as any)?.isDraft) {

            const missingIds =
                this.missingIds(Ids, oBackups);

            if (missingIds.length > 0) {

                oBackupEntity = this.getEntity(true);

                const additionalBackupts =
                    await cds.run(
                        SELECT.from(oBackupEntity).where({ ID: { in: missingIds } })
                    ) || [];

                oBackups = this.mergeUnique(oBackups, additionalBackupts);

            }

        }

        const oBackupsModel = this.mapBackupResult(oBackups);

        return oBackupsModel;

    }


    public async createEntry(data: Backup | Backups): Promise<BackupModel[] | null> {

        let oBackupEntity = this.getEntity();

        let oSql = INSERT.into(oBackupEntity).entries(data);

        await cds.run(oSql);

        return this.mapBackupResult(Array.isArray(data) ? data : [data]);

    }


    public async deleteEntry(id: Backup['ID'] | Backup['ID'][]): Promise<boolean> {

        let oBackupEntity = this.getEntity();
 
        const ids = Array.isArray(id) ? id : [id];

        for (const backupId of ids) { 

            let oSql = DELETE.from(oBackupEntity).where({ ID: backupId });

            await cds.run(oSql);

        }

        return true;

    }


    public mapBackupResult(Entities: Entities): BackupModel[] | null {

        if (Entities.length === 0) {

            return null;

        }

        return BackupModel.mapModel(Entities);

    }


    protected getEntity(ignoreDraft = false): entity {

        return ServiceLocator.getEntity('Backups', ignoreDraft);

    }


    protected personPath(): string {

        return '';

    }


}