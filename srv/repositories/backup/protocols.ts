import { BackupModel } from "@/models/backup";
import { Backup, Backups } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepository } from "../base";

export interface BackupRepository extends BaseRepository {
    findById(Id: Backup['ID']): Promise<BackupModel | null>;
    createEntry(data: Backup | Backups): Promise<BackupModel[] | null>;
}