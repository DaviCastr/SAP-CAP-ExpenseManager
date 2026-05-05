import { LiabilityRepository } from "@/repositories/liability";
import { LiabilityRepositoryImplementation } from "@/repositories/liability/implementation";


const makeLiabilityRepository = (): LiabilityRepository => {

    return new LiabilityRepositoryImplementation();

}

export const oLiabilityRepositoryFactory = makeLiabilityRepository();
