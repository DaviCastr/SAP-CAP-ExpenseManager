import { CardController } from "@/controllers/card/";
import { CardControllerImplementation } from "@/controllers/card/implementation";
import { oCardServiceFactory } from "../services/card";

const makeCardController = (): CardController => {

    return new CardControllerImplementation(oCardServiceFactory);

}

export const oCardControllerFactory = makeCardController();