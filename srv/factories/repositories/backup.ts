import { BackupRepository } from "@/repositories/backup";
import { BackupRepositoryImplementation } from "@/repositories/backup/implementation";


const makeBackupRepository = (): BackupRepository => {

    return new BackupRepositoryImplementation();

}

export const oBackupRepositoryFactory = makeBackupRepository();