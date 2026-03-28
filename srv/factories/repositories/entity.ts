import { EntityRepository } from "@/repositories/entity";
import { EntityRepositoryImplementation } from "@/repositories/entity/implementation";


const makeEntityRepository = (): EntityRepository => {

    return new EntityRepositoryImplementation();

}

export const oEntityRepositoryFactory = makeEntityRepository();