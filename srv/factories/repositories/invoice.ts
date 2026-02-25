import { InvoiceRepositoryImplementation } from "@/repositories/invoice/implementation";
import { InvoiceRepository } from "@/repositories/invoice/protocols";


const makeInvoiceRepository = (): InvoiceRepository => {

    return new InvoiceRepositoryImplementation();

}

export const oInvoiceRepositoryFactory = makeInvoiceRepository();