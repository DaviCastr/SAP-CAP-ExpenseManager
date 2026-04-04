import { EntityController } from "@/controllers/entity";
import { oEntityServiceFactory } from "../services/entity";
import { EntityControllerImplementation } from "@/controllers/entity/implementation";


const makeEntityController = (): EntityController => {

    return new EntityControllerImplementation(oEntityServiceFactory);

}

export const oEntityControllerFactory = makeEntityController();