import { ShareModel } from "@/models/share";
import { Share } from "@models/GestorDeGastos";
import { BaseRepository } from "../base";
import { Request } from "@sap/cds";

export interface ShareRepository extends BaseRepository{
    findByPersonId(PersonId: Share['Person_ID']): Promise<ShareModel[] | null>;
    findByUser(User: Share['User']): Promise<ShareModel[] | null>;
}