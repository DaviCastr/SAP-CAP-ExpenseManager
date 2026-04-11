import { CardRoute } from "@/routes/card/";
import { CardRouteImplementation } from "@/routes/card/implementation";
import { oCardControllerFactory } from "../controllers/card";

const makeCardRoute = (): CardRoute => {

    return new CardRouteImplementation(oCardControllerFactory);

}

export const oCardRouteFactory = makeCardRoute();
