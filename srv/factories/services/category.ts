import { CategoryService } from "@/services/category";
import { CategoryServiceImplementation } from "@/services/category/implementation";
import { oCategoryRepositoryFactory } from "../repositories/category";
import { oTransactionRepositoryFactory } from "../repositories/transaction";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";

const makeCustomerService = (): CategoryService => {

    return new CategoryServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oCategoryRepositoryFactory,
        oTransactionRepositoryFactory
    );

}

export const oCategoryServiceFactory = makeCustomerService();