import { TransactionRoute } from "@/routes/transaction/";
import { TransactionRouteImplementation } from "@/routes/transaction/";

const makeTransactionRoute = (): TransactionRoute => {

    return new TransactionRouteImplementation();

}

export const oTransactionRouteFactory = makeTransactionRoute();
