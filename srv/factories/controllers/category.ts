import { CategoryController, CategoryControllerImplementation } from "@/controllers/category";
import { CategoryServiceImplementation } from "@/services/category";
import { oCategoryServiceFactory } from "../services/category";


const makeCategoryController = (): CategoryController => {

    return new CategoryControllerImplementation(oCategoryServiceFactory);

}

export const oCategoryControllerFactory = makeCategoryController();