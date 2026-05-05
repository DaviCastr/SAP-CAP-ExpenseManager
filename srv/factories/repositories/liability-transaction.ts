import { LiabilityTransactionRepository } from "@/repositories/liability-transaction";
import { LiabilityTransactionRepositoryImplementation } from "@/repositories/liability-transaction/implementation";


const makeLiabilityTransactionRepository = (): LiabilityTransactionRepository => {

    return new LiabilityTransactionRepositoryImplementation();

}

export const oLiabilityTransactionRepositoryFactory = makeLiabilityTransactionRepository();
