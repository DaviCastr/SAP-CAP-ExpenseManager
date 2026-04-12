import { PersonService } from "@/services/person/";
import { PersonServiceImplementation } from "@/services/person/implementation";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";
import { oEntityRepositoryFactory } from "../repositories/entity";
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";
import { oInvoiceRepositoryFactory } from "../repositories/invoice";
import { oCardRepositoryFactory } from "../repositories/card";

const makeCustomerService = (): PersonService => {

    const service = new PersonServiceImplementation(
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
        oPersonRepositoryFactory,
        oCardRepositoryFactory,
        oInvoiceRepositoryFactory
    );

    ServiceRegistry.register('Persons', service);

    return service;

}

export const oPersonServiceFactory = makeCustomerService();