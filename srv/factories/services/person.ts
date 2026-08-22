import { PersonService } from "@/services/person/";
import { PersonServiceImplementation } from "@/services/person/implementation";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";
import { oEntityRepositoryFactory } from "../repositories/entity";
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";
import { oInvoiceRepositoryFactory } from "../repositories/invoice";
import { oCardRepositoryFactory } from "../repositories/card";
import { oCategoryRepositoryFactory } from "../repositories/category";
import { oTransactionRepositoryFactory } from "../repositories/transaction";
import { oLiabilityRepositoryFactory } from "../repositories/liability";
import { oLiabilityTransactionRepositoryFactory } from "../repositories/liability-transaction";

const makePersonService = (): PersonService => {

    const service = new PersonServiceImplementation(
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
        oPersonRepositoryFactory,
        oCategoryRepositoryFactory,
        oCardRepositoryFactory,
        oInvoiceRepositoryFactory,
        oTransactionRepositoryFactory,
        oLiabilityRepositoryFactory,
        oLiabilityTransactionRepositoryFactory
    );

    ServiceRegistry.register('Persons', service);

    return service;

}

export const oPersonServiceFactory = makePersonService();