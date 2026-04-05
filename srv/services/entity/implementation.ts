import { User } from '@sap/cds';
import { AbstractError } from '@/errors';
import { Entity } from '@models/GestorDeGastos';
import { Either, left, right } from '@sweet-monads/either';
import { EntityService } from './protocols';
import { BaseServiceImplementation } from '../base/implementation';
import { ShareRepository } from '@/repositories/share';
import { PersonRepository } from '@/repositories/person';
import { EntityRepository } from '@/repositories/entity';
import { DuplicityError } from '@/errors/duplicity';
import { PermissionDenied } from '@/errors/permission-denied';

export class EntityServiceImplementation extends BaseServiceImplementation<Entity> implements EntityService {

    protected Repository: EntityRepository;

    constructor(
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
    ) {

        super(PersonRepository, ShareRepository, EntityRepository);

        this.Repository = EntityRepository;

    }


    public async beforeCreate(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.checkPermission(Entity, User, this.getPermissionForCreate());

        if (result.isLeft()) {
            return result;
        }

        return this.checkDuplicityByEntity(Entity);

    }


    public async beforeUpdate(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.checkPermission(Entity, User, this.getPermissionForUpdate());

        if (result.isLeft()) {
            return result;
        }

        return this.checkDuplicityByEntity(Entity);

    }


    protected async checkPermission(Entity: Entity, LoggedUser: User, Permision: number): Promise<Either<AbstractError, boolean>> {

        try {

            let oPersonID: string | null;

            if (!Entity.Share_ID) {

                oPersonID = Entity.Share_ID = await this.Repository.findPersonIdById(Entity.ID as string);

            } else {

                oPersonID = await this.ShareRepository.findPersonIdById(Entity.Share_ID);

            }

            if (oPersonID) {

                const oCheckPermission = await this.checkPermissionByPersonId(LoggedUser, oPersonID as string, Permision);

                if (oCheckPermission.isLeft()) {

                    return left(oCheckPermission.value);

                }

            } else {

                const oStack = new Error().stack as string;

                return left(new PermissionDenied('error.invalidPersonId', 403, oStack));

            }

            return right(true);

        } catch (oError) {

            const errorInstance: Error = oError as Error;

            return left(new AbstractError(errorInstance.message, 400, errorInstance.stack as string));

        }

    }


    protected personPath(): string[] {

        return ['Share', 'Person'];

    }


    protected entityCode(): number {

        return 3;

    }

    private async checkDuplicityByEntity(Entity: Entity): Promise<Either<DuplicityError, boolean>> {

        let oShareId: string | undefined;

        if (!Entity.Share_ID) {

            const oShare = await this.ShareRepository.findById(Entity.ID as string);
            oShareId = oShare?.Id;

        } else {

            oShareId = Entity.Share_ID;

        }

        const oEntities = await this.Repository.findByShareId(oShareId);

        if (oEntities?.length) {

            const exists = oEntities.find((item) => item.Entity == Entity?.Entity && item?.Id != Entity?.ID);

            if (exists) {

                const oStack = new Error().stack as string;

                return left(new DuplicityError(oStack));

            }

        }

        return right(true);

    }


}