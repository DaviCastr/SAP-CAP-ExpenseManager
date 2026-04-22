import { TransactionModel } from "@/models/transaction";
import { Transaction, Transactions } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepository } from "../base";

export interface TransactionRepository extends BaseRepository {
    findById(Id: Transaction['ID']): Promise<TransactionModel | null>;
    findByCategoryID(CategoryID: Transaction['Category_ID'], Limit?: number): Promise<TransactionModel[] | null>;
    findByInvoiceIds(InvoiceIds: Transaction['Invoice_ID'] | Transaction['Invoice_ID'][], additionalFilters?: {}, Limit?: number): Promise<TransactionModel[] | null>;
    retrieveTotalAmountByInvoiceIds(InvoiceIds: Transaction['Invoice_ID'][], additionalFilters?: {}): Promise<TransactionModel | null>;
    retrieveTotalsGroupedByCategory(invoiceIds: string[]): Promise<TransactionModel[] | null>;
    createEntry(data: Transaction | Transactions): Promise<TransactionModel[] | null>;
}