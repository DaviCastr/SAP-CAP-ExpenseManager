import { Request, User } from '@sap/cds';

import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/errors';

import { Category } from '@models/GestorDeGastos';

export interface CategoryService {
    beforeRead(Request: Request): Either<AbstractError, boolean>
    beforeCreate(Category: Category, LoggedUser: User): Promise<Either<AbstractError, boolean>>
    beforeEdit(Category: Category, LoggedUser: User): Promise<Either<AbstractError, boolean>>
    beforeDelete(Category: Category, LoggedUser: User): Promise<Either<AbstractError, boolean>>
}