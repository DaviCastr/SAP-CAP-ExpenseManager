import { ShareController } from "@/controllers/share";
import { oShareServiceFactory } from "../services/share";
import { ShareControllerImplementation } from "@/controllers/share/implementation";


const makeShareController = (): ShareController => {

    return new ShareControllerImplementation(oShareServiceFactory);

}

export const oShareControllerFactory = makeShareController();