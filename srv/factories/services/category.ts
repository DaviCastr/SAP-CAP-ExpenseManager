import { CategoryService } from "@/services/category";
import { CategoryServiceImplementation } from "@/services/category/implementation";
import { oCategoryRepositoryFactory } from "../repositories/category";
import { oTransactionRepositoryFactory } from "../repositories/transaction";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";
import { oEntityRepositoryFactory } from "../repositories/entity";

const makeCustomerService = (): CategoryService => {

    return new CategoryServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
        oCategoryRepositoryFactory,
        oTransactionRepositoryFactory
    );

}

export const oCategoryServiceFactory = makeCustomerService();