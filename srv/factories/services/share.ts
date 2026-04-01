import { ShareService } from "@/services/share";
import { ShareServiceImplementation } from "@/services/share/implementation";
import { oShareRepositoryFactory } from "../repositories/share";
import { oTransactionRepositoryFactory } from "../repositories/transaction";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oEntityRepositoryFactory } from "../repositories/entity";

const makeShareService = (): ShareService => {

    return new ShareServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
        oTransactionRepositoryFactory
    );

}

export const oShareServiceFactory = makeShareService();