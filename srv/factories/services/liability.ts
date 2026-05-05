import { LiabilityService } from "@/services/liability";
import { LiabilityServiceImplementation } from "@/services/liability/implementation";

import { oLiabilityRepositoryFactory } from "../repositories/liability";
import { oLiabilityTransactionRepositoryFactory } from "../repositories/liability-transaction";

import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";
import { oEntityRepositoryFactory } from "../repositories/entity";

import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";

const makeLiabilityService = (): LiabilityService => {

    const service =
        new LiabilityServiceImplementation(

            oLiabilityRepositoryFactory,

            oPersonRepositoryFactory,
            oShareRepositoryFactory,
            oEntityRepositoryFactory,

            oLiabilityTransactionRepositoryFactory
        );

    ServiceRegistry.register(
        "Liabilities",
        service
    );

    return service;

};

export const oLiabilityServiceFactory =
    makeLiabilityService();