import { BackupRoute } from "@/routes/backup/";
import { BackupRouteImplementation } from "@/routes/backup/implementation";
import { oBackupControllerFactory } from "../controllers/backup";

const makeBackupRoute = (): BackupRoute => {

    return new BackupRouteImplementation(oBackupControllerFactory);

}

export const oBackupRouteFactory = makeBackupRoute();
