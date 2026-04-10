import { ShareModel } from "@/models/share";
import { Share } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepository } from "../base";
import { Request } from "@sap/cds";

export interface ShareRepository extends BaseRepository{
    findById(Id: Share['ID']): Promise<ShareModel | null>;
    findByPersonId(PersonId: Share['Person_ID']): Promise<ShareModel[] | null>;
    findByUser(User: Share['User']): Promise<ShareModel[] | null>;
}