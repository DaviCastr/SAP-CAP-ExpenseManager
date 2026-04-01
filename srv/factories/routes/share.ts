import { ShareRoute } from "@/routes/share/";
import { ShareRouteImplementation } from "@/routes/share/implementation";
import { oShareControllerFactory } from "../controllers/share";

const makeShareRoute = (): ShareRoute => {

    return new ShareRouteImplementation(oShareControllerFactory);

}

export const oShareRouteFactory = makeShareRoute();
