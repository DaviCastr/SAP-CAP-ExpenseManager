import { EntityRoute } from "@/routes/entity/";
import { EntityRouteImplementation } from "@/routes/entity/implementation";
import { oEntityControllerFactory } from "../controllers/entity";

const makeEntityRoute = (): EntityRoute => {

    return new EntityRouteImplementation(oEntityControllerFactory);

}

export const oEntityRouteFactory = makeEntityRoute();
