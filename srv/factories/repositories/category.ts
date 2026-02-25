import { CategoryRepository } from "@/repositories/category";
import { CategoryRepositoryImplementation } from "@/repositories/category/implementation";


const makeCategoryRepository = (): CategoryRepository => {

    return new CategoryRepositoryImplementation();

}

export const oCategoryRepositoryFactory = makeCategoryRepository();
