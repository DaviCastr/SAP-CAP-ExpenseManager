import { Invoices } from "@models/apps/dflc/gestordegastos/entities";
import { BaseController, BaseControllerResponse } from "../base/";
import { Invoice } from "@models/apps/dflc/gestordegastos/entities";

export interface InvoiceController extends BaseController<Invoice> {
}