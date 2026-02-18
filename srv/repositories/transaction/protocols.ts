import { TransactionModel } from "@/models/transaction";
import { Transaction } from "@models/GestorDeGastos";

export interface TransactionRepository {
    findByCategoryID(CategoryID: Transaction['Category_ID'], Limit?: number): Promise<TransactionModel[] | null>;
}