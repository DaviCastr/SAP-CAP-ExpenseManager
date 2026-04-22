import { Persons } from "@models/apps/dflc/gestordegastos/entities";
import { BaseController, BaseControllerResponse } from "../base/";
import { Person } from "@models/apps/dflc/gestordegastos/entities";

export interface PersonController extends BaseController<Person> {
    addCardExpense(): Promise<BaseControllerResponse>;
    sendInvoices(): Promise<BaseControllerResponse>;
    cardExpensesByCategories(): Promise<BaseControllerResponse>;
    simulateExpenses(): Promise<BaseControllerResponse>;
    simulateFinancialFuture(): Promise<BaseControllerResponse>;
    retrieveTransactionsByCategory(): Promise<BaseControllerResponse>;
}