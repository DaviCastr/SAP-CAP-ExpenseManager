import { InvoiceController } from "@/controllers/invoice/";
import { InvoiceControllerImplementation } from "@/controllers/invoice/implementation";
import { oInvoiceServiceFactory } from "../services/invoice";

const makeInvoiceController = (): InvoiceController => {

    return new InvoiceControllerImplementation(oInvoiceServiceFactory);

}

export const oInvoiceControllerFactory = makeInvoiceController();