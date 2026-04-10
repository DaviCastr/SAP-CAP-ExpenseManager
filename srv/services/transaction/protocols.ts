import { AbstractError } from "@/errors";
import { Transaction, Transactions } from "@models/apps/dflc/gestordegastos/entities";
import { Request, User } from "@sap/cds";
import { Either } from "@sweet-monads/either";
import { BaseService } from "../base";

export interface TransactionService extends BaseService<Transaction> {
    onDelete(Transaction: Transaction): Promise<Either<AbstractError, void>>;
    afterCreate(Transactions: Transactions): Promise<Either<AbstractError, void>>;
    afterUpdate(Transactions: Transactions): Promise<Either<AbstractError, void>>; 
}