import { ShareModel } from "@/models/share";
import { Share, Shares } from "@models/apps/dflc/expensemanager/entities";
import { BaseRepository } from "../base";
import { Request } from "@sap/cds";

export interface ShareRepository extends BaseRepository {
    findById(Id: Share['ID']): Promise<ShareModel | null>;
    findByPersonId(PersonId: Share['Person_ID']): Promise<ShareModel[] | null>;
    findByPersonIds(PersonIds: Share['Person_ID'][]): Promise<ShareModel[] | null>;
    findByUser(User: Share['User']): Promise<ShareModel[] | null>;
    createEntry(data: Share | Shares): Promise<ShareModel[] | null>;
}