import { CategoryRoute } from "@/routes/category/index";
import { oCategoryControllerFactory } from "../controllers/category";
import { CategoryRouteImplementation } from "@/routes/category/implementation";


const makeCategoryRoute = (): CategoryRoute => {

    return new CategoryRouteImplementation(oCategoryControllerFactory);

}

export const oCategoryRouteFactory = makeCategoryRoute();
