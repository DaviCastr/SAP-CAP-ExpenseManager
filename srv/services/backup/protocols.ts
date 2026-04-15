import { Backup } from "@models/apps/dflc/gestordegastos/entities";
import { BaseService } from "../base";
import { AbstractError } from "@/errors";
import { Either } from "@sweet-monads/either";
import { User } from "@sap/cds";

export interface BackupService extends BaseService<Backup> {
    processBackupDelete(Backup: Backup): Promise<Either<AbstractError, boolean>>
    exportBackup(User: User): Promise<Either<AbstractError, string>>
}