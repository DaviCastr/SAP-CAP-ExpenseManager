import { Request, User } from '@sap/cds';
import { AbstractError } from '@/errors';
import { Share } from '@models/apps/dflc/gestordegastos/entities';
import { Either, left, right } from '@sweet-monads/either';
import { ShareService } from './protocols';
import { BaseServiceImplementation } from '../base/implementation';
import { ShareRepository } from '@/repositories/share';
import { PermissionDenied } from '@/errors/permission-denied';
import { TransactionRepository } from '@/repositories/transaction';
import { PersonRepository } from '@/repositories/person';
import { EntityRepository } from '@/repositories/entity';
import { DuplicityError } from '@/errors/duplicity';
import { ServiceLocator } from '@/infrastructure/ServiceLocator';

export class ShareServiceImplementation extends BaseServiceImplementation<Share> implements ShareService {

    protected Repository: ShareRepository;

    constructor(
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
        private readonly TransactionRepository: TransactionRepository
    ) {

        super(PersonRepository, ShareRepository, EntityRepository);

        this.Repository = ShareRepository;

    }


    public async beforeCreate(Entity: Share, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeCreate(Entity, User);

        if (result.isLeft()) {
            return result;
        }

        return this.checkDuplicityByUser(Entity);

    }


    public async beforeEdit(Entity: Share, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeCreate(Entity, User);

        if (result.isLeft()) {
            return result;
        }

        return this.checkDuplicityByUser(Entity);

    }


    public async beforeUpdate(Entity: Share, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeUpdate(Entity, User);

        if (result.isLeft()) {
            return result;
        }

        return this.checkDuplicityByUser(Entity);

    }


    protected async checkPermission(Share: Share, User: User, Permission: number) {

        const cache = ServiceLocator.getPermissionCache();

        const userId = User?.id;

        let personId = cache.personMap.get(Share.ID);

        if (!personId) {

            if (!Share?.Person_ID && !Share?.Person?.ID) {

                personId =
                    await this.Repository.findPersonIdById(Share?.ID as string);

            } else {

                personId = Share?.Person_ID || Share?.Person?.ID;

            }

            if (personId) {
                cache.personMap.set(Share.ID, personId);
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


    protected entityCode(): number {

        return 2;

    }


    protected parentField(): string | null {
        return 'Person.ID';
    }


    private async checkDuplicityByUser(Share: Share): Promise<Either<DuplicityError, boolean>> {

        const cache = ServiceLocator.getPermissionCache();

        let personId: string | null;

        if (!Share?.Person_ID && !Share?.Person?.ID) {

            personId =
                Share.Person?.ID ||
                await this.Repository.findPersonIdById(Share.ID as string);

        } else {

            personId = (Share?.Person_ID || Share?.Person?.ID) as string;

        }

        if (!personId) {
            return right(true);
        }

        let shares = cache.sharesByPerson.get(personId);

        if (!shares) {

            shares = await this.Repository.findByPersonId(personId);

            if (shares?.length) {
                cache.sharesByPerson.set(personId, shares);
            } else {
                shares = [];
                cache.sharesByPerson.set(personId, shares);
            }

        }

        const exists = shares.find(
            (item) =>
                item.User === Share?.User &&
                item.Id !== Share.ID
        );

        if (exists) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.duplicity', ServiceLocator.getRequest(), this.entityCode()) ||
                'error.duplicity';

            return left(new DuplicityError(oStack, message));

        }

        shares.push(
            (this.Repository as any)?.mapShareResult([Share])?.[0] ||
            {
                ...Share,
                Id: Share.ID
            }
        );

        return right(true);
    }


}