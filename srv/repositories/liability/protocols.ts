import { BaseRepository } from "../base";
import { LiabilityModel } from "@/models/liability";
import {
    Liability,
    Liabilities,
    Person
} from "@models/apps/dflc/gestordegastos/entities";

export interface LiabilityRepository extends BaseRepository {

    findById(
        Id: Liability["ID"],
        ignoreDraft?: boolean
    ): Promise<LiabilityModel | null>;

    findByIds(
        Ids: Liability["ID"][]
    ): Promise<LiabilityModel[] | null>;

    findByPersonId(
        PersonId: Person["ID"]
    ): Promise<LiabilityModel[] | null>;

    findOpenByPersonId(
        PersonId: Person["ID"]
    ): Promise<LiabilityModel[] | null>;

    findOverdueByPersonId(
        PersonId: Person["ID"]
    ): Promise<LiabilityModel[] | null>;

    findByStatus(
        PersonId: Person["ID"],
        Status: string
    ): Promise<LiabilityModel[] | null>;

    createEntry(
        data: Liability | Liabilities
    ): Promise<LiabilityModel[] | null>;

    updateBalance(
        Id: Liability["ID"],
        Balance: number
    ): Promise<boolean>;

    closeLiability(
        Id: Liability["ID"]
    ): Promise<boolean>;
}