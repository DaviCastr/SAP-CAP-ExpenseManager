import { CardRepositoryImplementation } from "@/repositories/card/implementation";
import { CardRepository } from "@/repositories/card/protocols";


const makeCardRepository = (): CardRepository => {

    return new CardRepositoryImplementation();

}

export const oCardRepositoryFactory = makeCardRepository();