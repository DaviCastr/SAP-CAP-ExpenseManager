import { InvoiceModel } from "@/models/invoice";
import { Transaction } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepository } from "../base";
import { Request } from "@sap/cds";

export interface InvoiceRepository extends BaseRepository {
    updateTotalAmountByTransactionId(Id: Transaction['ID']): Promise<void>;
}