import { PersonRouteImplementation } from "@/routes/person/implementation";
import { PersonRoute } from "@/routes/person/protocols";
import { oPersonControllerFactory } from "../controllers/person";


const makePersonRoute = (): PersonRoute => {

    return new PersonRouteImplementation(oPersonControllerFactory);

}
 
export const oPersonRouteFactory = makePersonRoute();
