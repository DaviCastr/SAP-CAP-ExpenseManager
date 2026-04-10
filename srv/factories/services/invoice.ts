import { InvoiceService } from "@/services/invoice/";
import { InvoiceServiceImplementation } from "@/services/invoice/implementation";
import { oInvoiceRepositoryFactory } from "../repositories/invoice";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";
import { oCardRepositoryFactory } from "../repositories/card";
import { oEntityRepositoryFactory } from "../repositories/entity";
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";

const makeCustomerService = (): InvoiceService => {

    const service = new InvoiceServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
        oInvoiceRepositoryFactory,
        oCardRepositoryFactory
    );

    ServiceRegistry.register('Invoices', service);

    return service;

}

export const oInvoiceServiceFactory = makeCustomerService();