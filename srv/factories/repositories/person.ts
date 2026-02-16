import { PersonRepositoryImplementation } from "@/repositories/person";
import { PersonRepository } from "@/repositories/person";


const makePersonRepository = (): PersonRepository => {

    return new PersonRepositoryImplementation();

}

export const oPersonRepositoryFactory = makePersonRepository();
