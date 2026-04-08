import { CategoryService } from "@/services/category";
import { CategoryServiceImplementation } from "@/services/category/implementation";
import { oCategoryRepositoryFactory } from "../repositories/category";
import { oTransactionRepositoryFactory } from "../repositories/transaction";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";
import { oEntityRepositoryFactory } from "../repositories/entity";
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";

const makeCustomerService = (): CategoryService => {

    const service = new CategoryServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
        oCategoryRepositoryFactory,
        oTransactionRepositoryFactory
    );

    ServiceRegistry.register('Categories', service);

    return service;

}

export const oCategoryServiceFactory = makeCustomerService();