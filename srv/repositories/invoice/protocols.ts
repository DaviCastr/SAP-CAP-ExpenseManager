import { InvoiceModel } from "@/models/invoice";
import { Invoice, Invoices, Transaction } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepository } from "../base";

export interface InvoiceRepository extends BaseRepository {
    findById(Id: Invoice['ID']): Promise<InvoiceModel | null>;
    findByCardID(CardId: Invoice['Card_ID'], additionalFilters: {}, Limit?: number): Promise<InvoiceModel[] | null>;
    findByCardIDs(CardIds: Invoice['Card_ID'][], additionalFilters: {}, Limit?: number): Promise<InvoiceModel[] | null>;
    createEntry(data: Invoice | Invoices): Promise<InvoiceModel[] | null>;
    updateTotalAmountByTransactionId(TransactionId: Transaction['ID']): Promise<void>;
    updateTotalAmountById(Id: Invoice['ID']): Promise<void>;
}