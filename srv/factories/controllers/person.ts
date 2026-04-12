import { PersonController } from "@/controllers/person/";
import { PersonControllerImplementation } from "@/controllers/person/implementation";
import { oPersonServiceFactory } from "../services/person";

const makePersonController = (): PersonController => {

    return new PersonControllerImplementation(oPersonServiceFactory);

}

export const oPersonControllerFactory = makePersonController();