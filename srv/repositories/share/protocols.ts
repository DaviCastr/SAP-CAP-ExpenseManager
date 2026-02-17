import { ShareModel } from "@/models/share";
import { Share } from "@models/GestorDeGastos";

export interface ShareRepository {
    findByPersonId(PersonId: Share['Person_ID']): Promise<ShareModel[] | null>;
}