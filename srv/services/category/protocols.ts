import { User } from '@sap/cds';

import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/errors';

import { Category } from '@models/GestorDeGastos';

export interface CategoryService {
    beforeUpdate(Category: Category, LoggedUser: User): Promise<Either<AbstractError, boolean>>
}