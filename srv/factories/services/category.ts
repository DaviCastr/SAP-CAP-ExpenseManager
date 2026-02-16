import { CategoryService, CategoryServiceImplementation } from "@/services/category";
import { CategoryRepositoryImplementation } from "@/repositories/category";

const makeCustomerService = (): CategoryService => {

    const oCategoryRepository = new CategoryRepositoryImplementation();

    return new CategoryServiceImplementation(oCategoryRepository);

}

export const oCategoryServiceFactory = makeCustomerService();