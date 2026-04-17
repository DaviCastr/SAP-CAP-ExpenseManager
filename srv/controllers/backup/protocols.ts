import { Backup } from "@models/apps/dflc/gestordegastos/entities";
import { BaseController, BaseControllerResponse } from '@/controllers/base';
import { User } from "@sap/cds";

export interface BackupController extends BaseController<Backup> {

    processBackupDelete(Backup: Backup): Promise<BaseControllerResponse>;
    exportBackup(): Promise<BaseControllerResponse>;

}