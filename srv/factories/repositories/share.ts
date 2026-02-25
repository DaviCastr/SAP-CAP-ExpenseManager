import { ShareRepository } from "@/repositories/share";
import { ShareRepositoryImplementation } from "@/repositories/share/implementation";


const makeShareRepository = (): ShareRepository => {

    return new ShareRepositoryImplementation();

}

export const oShareRepositoryFactory = makeShareRepository();