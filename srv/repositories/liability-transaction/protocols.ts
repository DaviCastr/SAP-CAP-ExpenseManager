import { BaseRepository } from "../base";

import { LiabilityTransactionModel } from "@/models/liability-transaction";

import {
    Liability,
    LiabilityTransaction,
    LiabilityTransactions
} from "@models/apps/dflc/gestordegastos/entities";

export interface LiabilityTransactionRepository extends BaseRepository {

    findById(
        Id: LiabilityTransaction["ID"],
        ignoreDraft?: boolean
    ): Promise<LiabilityTransactionModel | null>;

    findByIds(
        Ids: LiabilityTransaction["ID"][]
    ): Promise<LiabilityTransactionModel[] | null>;

    findByLiabilityId(
        LiabilityId: Liability["ID"]
    ): Promise<LiabilityTransactionModel[] | null>;

    findByLiabilityIds(
        LiabilityIds: Liability["ID"][]
    ): Promise<LiabilityTransactionModel[] | null>;

    findPaymentsByLiabilityId(
        LiabilityId: Liability["ID"]
    ): Promise<LiabilityTransactionModel[] | null>;

    sumPaidAmount(
        LiabilityId: Liability["ID"]
    ): Promise<number>;

    createEntry(
        data: LiabilityTransaction | LiabilityTransactions
    ): Promise<LiabilityTransactionModel[] | null>;

    updateEntry(
        Id: LiabilityTransaction["ID"],
        data: Partial<LiabilityTransaction>
    ): Promise<boolean>;

    findByExternalReference(
        ExternalReference: string
    ): Promise<
        LiabilityTransactionModel | null
    > 
    
}