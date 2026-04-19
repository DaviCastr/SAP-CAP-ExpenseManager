import { Person } from "@models/apps/dflc/gestordegastos/entities";
import { BaseService } from "../base";
import { AbstractError } from "@/errors";
import { Either } from "@sweet-monads/either";
import { CardExpensesByCategoryReturnProperties } from "@/models/card-expenses-by-category";

export interface PersonService extends BaseService<Person> {
    addCardExpense(): Promise<Either<AbstractError, boolean>>;
    sendInvoices(): Promise<Either<AbstractError, boolean>>;
    cardExpensesByCategories(): Promise<Either<AbstractError, CardExpensesByCategoryReturnProperties>>;
}