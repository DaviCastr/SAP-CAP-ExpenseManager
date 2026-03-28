import { Request, User } from '@sap/cds';
import { AbstractError } from '@/errors';
import { Category } from '@models/GestorDeGastos';
import { Either, left, right } from '@sweet-monads/either';
import { CategoryService } from './protocols';
import { BaseServiceImplementation } from '../base/implementation';
import { CategoryRepository } from '@/repositories/category';
import { PermissionDenied } from '@/errors/permission-denied';
import { TransactionRepository } from '@/repositories/transaction';
import { PersonRepository } from '@/repositories/person';
import { ShareRepository } from '@/repositories/share';
import { EntityRepository } from '@/repositories/entity';

export class CategoryServiceImplementation extends BaseServiceImplementation<Category> implements CategoryService {

    protected Repository: CategoryRepository;

    constructor(
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
        Repository: CategoryRepository,
        private readonly TransactionRepository: TransactionRepository
    ) {

        super(PersonRepository, ShareRepository, EntityRepository);

        this.Repository = Repository;

    }


    public async beforeDelete(Category: Category, LoggedUser: User): Promise<Either<AbstractError, boolean>> {

        const oPermission = await this.checkPermission(Category, LoggedUser, this.getPermissionForDelete());

        if (oPermission.isRight()) {

            return this.checkDeleteByTransactionExistence(Category);

        } else {

            return oPermission;

        }

    }



    protected async checkPermission(Category: Category, LoggedUser: User, Permision: number): Promise<Either<AbstractError, boolean>> {

        try {

            let oPersonID: string | null;

            if (!Category.Person_ID) {

                oPersonID = await this.Repository.findPersonIdById(Category.ID as string);

            } else {

                oPersonID = Category.Person_ID;

            }

            if (oPersonID) {

                const oCheckPermission = await this.checkPermissionByPersonId(LoggedUser, oPersonID as string, Permision);

                if (oCheckPermission.isLeft()) {

                    return left(oCheckPermission.value);

                }

            }

            return right(true);

        } catch (oError) {

            const errorInstance: Error = oError as Error;

            return left(new AbstractError(errorInstance.message, 400, errorInstance.stack as string));

        }
 
    }


    protected personPath(): string[] {

        return ['Person'];

    }


    protected entityCode(): number {

        return 2;

    }


    public async checkDeleteByTransactionExistence(Category: Category): Promise<Either<AbstractError, boolean>> {

        const oTransactions = await this.TransactionRepository.findByCategoryID(Category.ID, 1);

        if (Array.isArray(oTransactions)) {

            if (oTransactions.length > 0) {

                const stack = new Error().stack as string;

                return left(new PermissionDenied('error.exclusionOfCategoryInUsePermissionDenied', 403, stack));

            }

        }

        return right(true);

    }

}