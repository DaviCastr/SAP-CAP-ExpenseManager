import { TransactionService } from "@/services/transaction/";
import { TransactionServiceImplementation } from "@/services/transaction/implementation";
import { oTransactionRepositoryFactory } from "../repositories/transaction";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";
import { oInvoiceRepositoryFactory } from "../repositories/invoice";

const makeCustomerService = (): TransactionService => {

    return new TransactionServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oTransactionRepositoryFactory,
        oInvoiceRepositoryFactory
    );

}

export const oTransactionServiceFactory = makeCustomerService();