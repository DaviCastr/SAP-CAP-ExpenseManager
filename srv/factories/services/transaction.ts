import { TransactionService } from "@/services/transaction/";
import { TransactionServiceImplementation } from "@/services/transaction/implementation";
import { oTransactionRepositoryFactory } from "../repositories/transaction";
import { oPersonRepositoryFactory } from "../repositories/person";
import { oShareRepositoryFactory } from "../repositories/share";
import { oInvoiceRepositoryFactory } from "../repositories/invoice";
import { oEntityRepositoryFactory } from "../repositories/entity";
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";

const makeCustomerService = (): TransactionService => {

    const service = new TransactionServiceImplementation(
        oPersonRepositoryFactory,
        oShareRepositoryFactory,
        oEntityRepositoryFactory,
        oTransactionRepositoryFactory,
        oInvoiceRepositoryFactory
    );

    ServiceRegistry.register('Transactions', service);

    return service;

}

export const oTransactionServiceFactory = makeCustomerService();