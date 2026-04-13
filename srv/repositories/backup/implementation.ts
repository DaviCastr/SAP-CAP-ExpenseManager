import cds, { entity } from "@sap/cds";

import { BackupModel } from "@/models/backup";
import { BackupRepository } from "./protocols";
import { Backup, Backups } from "@models/apps/dflc/gestordegastos/entities";
import { Entities } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class BackupRepositoryImplementation extends BaseRepositoryImplementation implements BackupRepository {


    public async findById(Id: Backup['ID']): Promise<BackupModel | null> {

        let oBackupEntity = this.getEntity();

        let oSql = SELECT.from(oBackupEntity).where({ ID: Id });

        let oBackups = await cds.run(oSql);

        if ((oBackupEntity as any)?.isDraft) {

            oBackupEntity = this.getEntity(true);

            oSql = SELECT.from(oBackupEntity).where({ ID: Id });

            const additionalBackupts = await cds.run(oSql) || [];
            oBackups = [...(oBackups || []), ...additionalBackupts];

        }

        const oBackupsModel = this.mapBackupResult(oBackups);

        return oBackupsModel?.[0] as BackupModel;

    }


    public async createEntry(data: Backup | Backups): Promise<BackupModel[] | null> {

        let oBackupEntity = this.getEntity();

        let oSql = INSERT.into(oBackupEntity).entries(data);

        await cds.run(oSql);

        return this.mapBackupResult(Array.isArray(data) ? data : [data]);

    }


    public mapBackupResult(Entities: Entities): BackupModel[] | null {

        if (Entities.length === 0) {

            return null;

        }

        return BackupModel.mapModel(Entities);

    }


    protected getEntity(ignoreDraft = false): entity {

        return ServiceLocator.getEntity('Entities', ignoreDraft);

    }


    protected personPath(): string {

        return '';

    }


}