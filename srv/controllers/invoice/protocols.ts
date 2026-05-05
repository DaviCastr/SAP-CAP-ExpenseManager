import { Invoices } from "@models/apps/dflc/expensemanager/entities";
import { BaseController, BaseControllerResponse } from "../base/";
import { Invoice } from "@models/apps/dflc/expensemanager/entities";

export interface InvoiceController extends BaseController<Invoice> {
}