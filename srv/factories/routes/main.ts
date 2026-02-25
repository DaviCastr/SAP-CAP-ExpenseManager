import { MainRoute } from "@/routes/main/index";
import { MainRouteImplementation } from "@/routes/main/implementation";


const makeMainRoute = (): MainRoute => {

    return new MainRouteImplementation();

}

export const oMainRouteFactory = makeMainRoute();
