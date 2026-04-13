import { User } from '@sap/cds';
import { AbstractError } from '@/errors';
import { Entity } from '@models/apps/dflc/gestordegastos/entities';
import { Either, left, right } from '@sweet-monads/either';
import { EntityService } from './protocols';
import { BaseServiceImplementation } from '../base/implementation';
import { ShareRepository } from '@/repositories/share';
import { PersonRepository } from '@/repositories/person';
import { EntityRepository } from '@/repositories/entity';
import { DuplicityError } from '@/errors/duplicity';
import { PermissionDenied } from '@/errors/permission-denied';
import { ServiceLocator } from '@/infrastructure/ServiceLocator';

export class EntityServiceImplementation extends BaseServiceImplementation<Entity> implements EntityService {

    public Repository: EntityRepository;

    constructor(
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        Repository: EntityRepository,
    ) {

        super(PersonRepository, ShareRepository, Repository);

        this.Repository = Repository;

    }


    public async beforeCreate(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeCreate(Entity, User);

        if (result.isLeft()) {
            return result;
        }

        return this.checkDuplicityByEntity(Entity);

    }


    public async beforeUpdate(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeUpdate(Entity, User);

        if (result.isLeft()) {
            return result;
        }

        return this.checkDuplicityByEntity(Entity);

    }


    public async beforeEdit(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeUpdate(Entity, User);

        if (result.isLeft()) {
            return result;
        }

        return this.checkDuplicityByEntity(Entity);

    }


    protected async checkPermission(Entity: Entity, User: User, Permission: number) {

        const cache = ServiceLocator.getPermissionCache();

        const userId = User?.id;

        let personId = cache.personMap.get(Entity.ID);

        if (!personId) {

            if (!Entity?.Share_ID && !Entity?.Share?.ID) {

                personId =
                    await this.Repository.findPersonIdById(Entity?.ID as string);

            } else {

                let personIdByShare = cache.personMap.get(Entity?.Share_ID || Entity?.Share?.ID);

                personId =
                    personIdByShare ||
                    await this.ShareRepository.findPersonIdById((Entity?.Share_ID || Entity?.Share?.ID) as string);

            }

            if (personId) {
                cache.personMap.set(Entity.ID, personId);
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

        return ['Share', 'Person'];

    }


    protected entityCode(): number {

        return 3;

    }


    protected parentField(): string | null {
        return 'Share.ID';
    }


    private async checkDuplicityByEntity(Entity: Entity): Promise<Either<DuplicityError, boolean>> {

        const cache = ServiceLocator.getPermissionCache();

        let shareId: string | undefined;

        if (!Entity?.Share_ID && !Entity?.Share?.ID) {

            const oShare = await this.ShareRepository.findById(Entity.ID as string);
            shareId = oShare?.Id;

        } else {

            shareId = Entity.Share_ID || Entity?.Share?.ID;

        }

        if (!shareId) {
            return right(true);
        }

        let entities = cache.entitiesByShare.get(shareId);

        if (!entities) {

            entities = await this.Repository.findByShareId(shareId);

            if (entities?.length) {
                cache.entitiesByShare.set(shareId, entities);
            } else {
                entities = [];
                cache.entitiesByShare.set(shareId, entities);
            }

        }

        const exists = entities.find(
            (item) =>
                item.Entity == Entity?.Entity &&
                item.Id != Entity?.ID
        );

        if (exists) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.duplicity', ServiceLocator.getRequest(), this.entityCode()) ||
                'error.duplicity';

            return left(new DuplicityError(oStack, message));

        }

        entities.push(
            (this.Repository as any)?.mapEntityResult([Entity])?.[0] ||
            {
                ...Entity,
                Id: Entity.ID
            }
        );

        return right(true);
    }


}