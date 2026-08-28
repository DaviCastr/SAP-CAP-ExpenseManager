import { BaseRepository } from "../base";
import { LiabilityModel } from "@/models/liability";
import {
    Liability,
    Liabilities,
    Person
} from "@models/apps/dflc/expensemanager/entities";
import { entity } from "@sap/cds";
import Decimal from "decimal.js";

export interface LiabilityRepository extends BaseRepository {

    findById(
        Id: Liability["ID"],
        ignoreDraft?: boolean
    ): Promise<LiabilityModel | null>;

    findByIds(
        Ids: Liability["ID"][]
    ): Promise<LiabilityModel[] | null>;

    findByPersonId(
        PersonId: Person["ID"] | Person["ID"][]
    ): Promise<LiabilityModel[] | null>;

    findByPersonIds(
        PersonIds: Person["ID"][],
        additionalFilters?: {}
    ): Promise<LiabilityModel[] | null>;

    findOpenByPersonId(
        PersonId: Person["ID"]
    ): Promise<LiabilityModel[] | null>;

    findByStatus(
        PersonId: Person["ID"],
        Status: string
    ): Promise<LiabilityModel[] | null>;

    createEntry(
        data: Liability | Liabilities
    ): Promise<LiabilityModel[] | null>;

    updateEntry(
        Id: Liability["ID"],
        data: Partial<Liability>
    ): Promise<boolean>;

    updateComputedValues(
        Id: Liability["ID"],
        data: {
            OutstandingBalance?: number | Decimal;
            PaymentPercentage?: number | Decimal;
            Status?: string;
            TotalIn?: number | Decimal;
            TotalOut?: number | Decimal;
        },
        Entity?: entity
    ): Promise<boolean>;

    hasDraftRow(
        Id: Liability["ID"]
    ): Promise<boolean>;

    getDraftsEntity(): entity | undefined;

}