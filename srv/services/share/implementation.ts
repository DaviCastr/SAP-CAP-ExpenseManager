import { Request, User } from '@sap/cds';
import { AbstractError } from '@/errors';
import { Share } from '@models/GestorDeGastos';
import { Either, left, right } from '@sweet-monads/either';
import { ShareService } from './protocols';
import { BaseServiceImplementation } from '../base/implementation';
import { ShareRepository } from '@/repositories/share';
import { PermissionDenied } from '@/errors/permission-denied';
import { TransactionRepository } from '@/repositories/transaction';
import { PersonRepository } from '@/repositories/person';
import { EntityRepository } from '@/repositories/entity';
import { DuplicityError } from '@/errors/duplicity';

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

        const result = await this.checkPermission(Entity, User, this.getPermissionForCreate());

        if (result.isLeft()) {
            return result;
        }

        return this.checkDuplicityByUser(Entity);

    }


    public async beforeUpdate(Entity: Share, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.checkPermission(Entity, User, this.getPermissionForUpdate());

        if (result.isLeft()) {
            return result;
        }

        return this.checkDuplicityByUser(Entity);

    }


    protected async checkPermission(Entity: Share, LoggedUser: User, Permision: number): Promise<Either<AbstractError, boolean>> {

        try {

            let oPersonID: string | null;

            if (!Entity.Person_ID) {

                oPersonID = Entity.Person_ID = await this.Repository.findPersonIdById(Entity.ID as string);

            } else {

                oPersonID = Entity.Person_ID;

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

        return ['Person'];

    }


    protected entityCode(): number {

        return 2;

    }

    private async checkDuplicityByUser(Share: Share): Promise<Either<DuplicityError, boolean>> {

        let oPersonID: string | null;

        if (!Share.Person_ID) {

            oPersonID = await this.Repository.findPersonIdById(Share.ID as string);

        } else {

            oPersonID = Share.Person_ID;

        }

        const oShares = await this.Repository.findByPersonId(oPersonID);

        if (oShares?.length) {

            const exists = oShares.find((item) => item.User == Share?.User && item?.Id != Share.ID);

            if (exists) {

                const oStack = new Error().stack as string;

                return left(new DuplicityError(oStack));

            }

        }

        return right(true);

    }


}