import { EntityService } from "@/services/entity";
import { EntityServiceImplementation } from "@/services/entity/implementation";
import { oShareRepositoryFactory } from "../repositories/share";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oEntityRepositoryFactory } from "../repositories/entity";
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";

const makeEntityService = (): EntityService => {

    const service = new EntityServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
    );

    ServiceRegistry.register('Entities', service);

    return service;

}

export const oEntityServiceFactory = makeEntityService();