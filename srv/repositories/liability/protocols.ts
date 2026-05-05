import { BaseRepository } from "../base";
import { LiabilityModel } from "@/models/liability";
import {
    Liability,
    Liabilities,
    Person
} from "@models/apps/dflc/expensemanager/entities";
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

    updateEntry(
        Id: Liability["ID"],
        data: Partial<Liability>
    ): Promise<boolean>;

    updateAmounts(
        Id: Liability["ID"],
        data: {
            CurrentBalance?: number | Decimal;
            PaidAmount?: number | Decimal;
            Status?: string;
        }
    ): Promise<boolean>;

    closeLiability(
        Id: Liability["ID"]
    ): Promise<boolean>;

    renegotiate(
        Id: Liability["ID"],
        data: {
            CurrentBalance: number;
            Installments: number;
            RemainingInstallments: number;
            InstallmentAmount: number;
            InterestRate: number;
            Status: string;
        }
    ): Promise<boolean>;

}