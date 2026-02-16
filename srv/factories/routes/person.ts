import { PersonRouteImplementation } from "@/routes/person/implementation";
import { PersonRoute } from "@/routes/person/protocols";


const makePersonRoute = (): PersonRoute => {

    return new PersonRouteImplementation();

}

export const oPersonRouteFactory = makePersonRoute();
