import { Person } from "@models/apps/dflc/gestordegastos/entities";
import { BaseService } from "../base";
import { AbstractError } from "@/errors";
import { Either } from "@sweet-monads/either";
import { CardExpensesByCategoryReturnProperties } from "@/models/card-expenses-by-category";
import { SimulateExpenseReturnProperties } from "@/models/simulate-expense";
import { FinancialFutureReturn } from "@/models/financial-future";
import { CategoryTransactionsReturnProperties } from "@/models/transactions-by-category";
import { CompleteInvoiceReturnProperties } from "@/models/complete-invoice";

export interface PersonService extends BaseService<Person> {
    addCardExpense(): Promise<Either<AbstractError, boolean>>;
    sendInvoices(): Promise<Either<AbstractError, boolean>>;
    cardExpensesByCategories(): Promise<Either<AbstractError, CardExpensesByCategoryReturnProperties>>;
    simulateExpenses(): Promise<Either<AbstractError, SimulateExpenseReturnProperties>>;
    simulateFinancialFuture(): Promise<Either<AbstractError, FinancialFutureReturn>>;
    retrieveTransactionsByCategory(): Promise<Either<AbstractError, CategoryTransactionsReturnProperties>>;
    retrieveCompleteInvoice(): Promise<Either<AbstractError, CompleteInvoiceReturnProperties>>;
}