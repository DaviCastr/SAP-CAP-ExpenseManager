import { TransactionRepositoryImplementation } from "@/repositories/transaction";
import { TransactionRepository } from "@/repositories/transaction";


const makeTransactionRepository = (): TransactionRepository => {

    return new TransactionRepositoryImplementation();

}

export const oTransactionRepositoryFactory = makeTransactionRepository();