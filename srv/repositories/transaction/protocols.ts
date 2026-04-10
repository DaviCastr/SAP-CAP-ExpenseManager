import { TransactionModel } from "@/models/transaction";
import { Transaction } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepository } from "../base";
import { Request } from "@sap/cds";

export interface TransactionRepository extends BaseRepository {
    findByID(Id: Transaction['ID']): Promise<TransactionModel | null>;
    findByCategoryID(CategoryID: Transaction['Category_ID'], Limit?: number): Promise<TransactionModel[] | null>;
}