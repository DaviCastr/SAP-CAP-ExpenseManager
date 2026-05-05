import { LiabilityTransactionService } from "@/services/liability-transaction";
import { LiabilityTransactionServiceImplementation } from "@/services/liability-transaction/implementation";

import { oLiabilityTransactionRepositoryFactory } from "../repositories/liability-transaction";

import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";
import { oEntityRepositoryFactory } from "../repositories/entity";

import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";
import { oLiabilityRepositoryFactory } from "../repositories/liability";

const makeService =
(): LiabilityTransactionService => {

    const service =
        new LiabilityTransactionServiceImplementation(
            oPersonRepositoryFactory,
            oShareRepositoryFactory,
            oEntityRepositoryFactory,
            oLiabilityTransactionRepositoryFactory,
            oLiabilityRepositoryFactory
        );

    ServiceRegistry.register(
        "LiabilityTransactions",
        service
    );

    return service;

};

export const oLiabilityTransactionServiceFactory =
    makeService();