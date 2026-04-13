import { BackupController } from "@/controllers/backup";
import { oBackupServiceFactory } from "../services/backup";
import { BackupControllerImplementation } from "@/controllers/backup/implementation";


const makeBackupController = (): BackupController => {

    return new BackupControllerImplementation(oBackupServiceFactory);

}

export const oBackupControllerFactory = makeBackupController();