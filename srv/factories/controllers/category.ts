import { CategoryController } from "@/controllers/category";
import { oCategoryServiceFactory } from "../services/category";
import { CategoryControllerImplementation } from "@/controllers/category/implementation";


const makeCategoryController = (): CategoryController => {

    return new CategoryControllerImplementation(oCategoryServiceFactory);

}

export const oCategoryControllerFactory = makeCategoryController();