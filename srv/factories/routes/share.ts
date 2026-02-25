import { ShareRoute } from "@/routes/share/";
import { ShareRouteImplementation } from "@/routes/share/implementation";

const makeShareRoute = (): ShareRoute => {

    return new ShareRouteImplementation();

}

export const oShareRouteFactory = makeShareRoute();
