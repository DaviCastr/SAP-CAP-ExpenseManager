import { BaseRepository } from "../base";

import { LiabilityTransactionModel } from "@/models/liability-transaction";

import {
    Liability,
    LiabilityTransaction,
    LiabilityTransactions
} from "@models/apps/dflc/expensemanager/entities";

import { entity } from "@sap/cds";

export interface LiabilityTransactionRepository extends BaseRepository {

    findById(
        Id: LiabilityTransaction["ID"],
        ignoreDraft?: boolean
    ): Promise<LiabilityTransactionModel | null>;

    findByIds(
        Ids: LiabilityTransaction["ID"][]
    ): Promise<LiabilityTransactionModel[] | null>;

    findByLiabilityId(
        LiabilityId: Liability["ID"],
        Entity?: entity
    ): Promise<LiabilityTransactionModel[] | null>;

    findByLiabilityIds(
        LiabilityIds: Liability["ID"][],
        Entity?: entity
    ): Promise<LiabilityTransactionModel[] | null>;

    getDraftsEntity(): entity | undefined;

    createEntry(
        data: LiabilityTransaction | LiabilityTransactions
    ): Promise<LiabilityTransactionModel[] | null>;

    updateEntry(
        Id: LiabilityTransaction["ID"],
        data: Partial<LiabilityTransaction>
    ): Promise<boolean>;

}