import { CardService } from "@/services/card/";
import { CardServiceImplementation } from "@/services/card/implementation";
import { oCardRepositoryFactory } from "../repositories/card";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";
import { oEntityRepositoryFactory } from "../repositories/entity";
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";
import { oInvoiceRepositoryFactory } from "../repositories/invoice";

const makeCustomerService = (): CardService => {

    const service = new CardServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
        oCardRepositoryFactory,
        oInvoiceRepositoryFactory
    );

    ServiceRegistry.register('Cards', service);

    return service;

}

export const oCardServiceFactory = makeCustomerService();