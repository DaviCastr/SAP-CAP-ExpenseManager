import { Request, User } from '@sap/cds';
import { AbstractError } from '@/errors';
import { Category } from '@models/apps/dflc/gestordegastos/entities';
import { Either, left, right } from '@sweet-monads/either';
import { CategoryService } from './protocols';
import { BaseServiceImplementation } from '../base/implementation';
import { CategoryRepository } from '@/repositories/category';
import { PermissionDenied } from '@/errors/permission-denied';
import { TransactionRepository } from '@/repositories/transaction';
import { PersonRepository } from '@/repositories/person';
import { ShareRepository } from '@/repositories/share';
import { EntityRepository } from '@/repositories/entity';
import { ServiceLocator } from '@/infrastructure/ServiceLocator';

export class CategoryServiceImplementation extends BaseServiceImplementation<Category> implements CategoryService {

    public Repository: CategoryRepository;

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


    protected async checkPermission(Category: Category, User: User, Permission: number) {

        const cache = ServiceLocator.getPermissionCache();

        const userId = User?.id;

        let personId = cache.personMap.get(Category.ID);

        if (!personId) {

            if (!Category?.Person_ID && !Category?.Person?.ID) {

                personId =
                    await this.Repository.findPersonIdById(Category?.ID as string);

            } else {

                personId = Category?.Person_ID || Category?.Person?.ID;

            }

            if (personId) {
                cache.personMap.set(Category.ID, personId);
            }

        }

        if (!personId) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.invalidPersonId', ServiceLocator.getRequest(), this.entityCode()) ||
                'error.invalidPersonId';

            return left(new PermissionDenied(message, 403, oStack));

        }

        const key = ServiceLocator.buildPermissionKey(
            userId,
            personId,
            this.entityCode(),
            Permission
        );

        if (cache.permissionChecked.has(key)) {
            return right(true);
        }

        const result = await this.checkPermissionByPersonId(User, personId, Permission);

        if (result.isRight()) {
            cache.permissionChecked.add(key);
        }

        return result;

    }


    protected personPath(): string[] {

        return ['Person'];

    }


    public entityCode(): number {

        return 4;

    }


    protected parentField(): string | null {
        return 'Person.ID';
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