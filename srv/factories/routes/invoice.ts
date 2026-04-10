import { InvoiceRoute } from "@/routes/invoice/";
import { InvoiceRouteImplementation } from "@/routes/invoice/implementation";
import { oInvoiceControllerFactory } from "../controllers/invoice";

const makeInvoiceRoute = (): InvoiceRoute => {

    return new InvoiceRouteImplementation(oInvoiceControllerFactory);

}

export const oInvoiceRouteFactory = makeInvoiceRoute();
