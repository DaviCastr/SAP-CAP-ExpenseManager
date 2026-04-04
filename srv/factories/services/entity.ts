import { EntityService } from "@/services/entity";
import { EntityServiceImplementation } from "@/services/entity/implementation";
import { oShareRepositoryFactory } from "../repositories/share";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oEntityRepositoryFactory } from "../repositories/entity";

const makeEntityService = (): EntityService => {

    return new EntityServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
    );

}

export const oEntityServiceFactory = makeEntityService();