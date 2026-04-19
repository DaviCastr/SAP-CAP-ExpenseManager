import { BackupService } from "@/services/backup";
import { BackupServiceImplementation } from "@/services/backup/implementation";
import { oShareRepositoryFactory } from "../repositories/share";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oBackupRepositoryFactory } from "../repositories/backup";
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";
import { oEntityRepositoryFactory } from "../repositories/entity";

const makeBackupService = (): BackupService => {

    const service = new BackupServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
        oBackupRepositoryFactory,
    );

    ServiceRegistry.register('Backups', service);

    return service;

}

export const oBackupServiceFactory = makeBackupService();