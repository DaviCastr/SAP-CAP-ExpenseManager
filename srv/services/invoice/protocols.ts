import { AbstractError } from "@/errors";
import { Invoice, Invoices } from "@models/apps/dflc/gestordegastos/entities";
import { Request, User } from "@sap/cds";
import { Either } from "@sweet-monads/either";
import { BaseService } from "../base";

export interface InvoiceService extends BaseService<Invoice> {
}