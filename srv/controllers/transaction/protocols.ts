import { Transactions } from "@models/apps/dflc/expensemanager/entities";
import { BaseController, BaseControllerResponse } from "../base/";
import { Transaction } from "@models/apps/dflc/expensemanager/entities";

export interface TransactionController extends BaseController<Transaction> {
    onDelete(Transaction: Transaction): Promise<BaseControllerResponse>;
    afterCreate(Transactions: Transactions): Promise<BaseControllerResponse>;
    afterUpdate(Transactions: Transactions): Promise<BaseControllerResponse>;
}