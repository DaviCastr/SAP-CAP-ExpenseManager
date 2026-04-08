import { ShareService } from "@/services/share";
import { ShareServiceImplementation } from "@/services/share/implementation";
import { oShareRepositoryFactory } from "../repositories/share";
import { oTransactionRepositoryFactory } from "../repositories/transaction";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oEntityRepositoryFactory } from "../repositories/entity";
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";

const makeShareService = (): ShareService => {

    const service = new ShareServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
        oTransactionRepositoryFactory
    );

    ServiceRegistry.register('Shares', service);

    return service;
    
}

export const oShareServiceFactory = makeShareService();