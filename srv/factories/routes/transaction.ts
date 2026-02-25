import { TransactionRoute } from "@/routes/transaction/";
import { TransactionRouteImplementation } from "@/routes/transaction/implementation";
import { oTransactionControllerFactory } from "../controllers/transaction";

const makeTransactionRoute = (): TransactionRoute => {

    return new TransactionRouteImplementation(oTransactionControllerFactory);

}

export const oTransactionRouteFactory = makeTransactionRoute();
