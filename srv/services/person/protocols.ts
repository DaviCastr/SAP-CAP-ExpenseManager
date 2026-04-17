import { Person } from "@models/apps/dflc/gestordegastos/entities";
import { BaseService } from "../base";
import { AbstractError } from "@/errors";
import { Either } from "@sweet-monads/either";

export interface PersonService extends BaseService<Person> {
    addCardExpense(): Promise<Either<AbstractError, boolean>>
}