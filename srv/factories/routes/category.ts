import { CategoryRoute, CategoryRouteImplementation } from "@/routes/category/index";
import { oCategoryControllerFactory } from "../controllers/category";


const makeCategoryRoute = (): CategoryRoute => {

    return new CategoryRouteImplementation(oCategoryControllerFactory);

}

export const oCategoryRouteFactory = makeCategoryRoute();
