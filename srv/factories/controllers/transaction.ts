import { TransactionController } from "@/controllers/transaction/";
import { TransactionControllerImplementation } from "@/controllers/transaction/implementation";
import { oTransactionServiceFactory } from "../services/transaction";

const makeTransactionController = (): TransactionController => {

    return new TransactionControllerImplementation(oTransactionServiceFactory);

}

export const oTransactionControllerFactory = makeTransactionController();