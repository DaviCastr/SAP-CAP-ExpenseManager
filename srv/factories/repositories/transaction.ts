import { TransactionRepositoryImplementation } from "@/repositories/transaction/implementation";
import { TransactionRepository } from "@/repositories/transaction/protocols";


const makeTransactionRepository = (): TransactionRepository => {

    return new TransactionRepositoryImplementation();

}

export const oTransactionRepositoryFactory = makeTransactionRepository();