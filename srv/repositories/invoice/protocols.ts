import { InvoiceModel } from "@/models/invoice";
import { Invoice } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepository } from "../base";

export interface InvoiceRepository extends BaseRepository {
    findByID(Id: Invoice['ID']): Promise<InvoiceModel | null>;
    findByCardID(CardId: Invoice['Card_ID'], additionalFilters: {}, Limit?: number): Promise<InvoiceModel[] | null>;
    findByCardIDs(CardIds: Invoice['Card_ID'][], additionalFilters: {}, Limit?: number): Promise<InvoiceModel[] | null>;
    updateTotalAmountByTransactionId(Id: Invoice['ID']): Promise<void>;
}