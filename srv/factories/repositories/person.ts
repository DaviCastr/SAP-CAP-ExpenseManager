import { PersonRepository } from "@/repositories/person";
import { PersonRepositoryImplementation } from "@/repositories/person/implementation";


const makePersonRepository = (): PersonRepository => {

    return new PersonRepositoryImplementation();

}

export const oPersonRepositoryFactory = makePersonRepository();
