import { ShareRepositoryImplementation } from "@/repositories/share";
import { ShareRepository } from "@/repositories/share";


const makeShareRepository = (): ShareRepository => {

    return new ShareRepositoryImplementation();

}

export const oShareRepositoryFactory = makeShareRepository();