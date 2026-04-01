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


    public async beforeDelete(Share: Share, LoggedUser: User): Promise<Either<AbstractError, boolean>> {

        const oPermission = await this.checkPermission(Share, LoggedUser, this.getPermissionForDelete());

        if (oPermission.isRight()) {

            return this.checkDeleteByTransactionExistence(Share);

        } else {

            return oPermission;

        }

    }



    protected async checkPermission(Share: Share, LoggedUser: User, Permision: number): Promise<Either<AbstractError, boolean>> {

        try {

            let oPersonID: string | null;

            if (!Share.Person_ID) {

                oPersonID = await this.Repository.findPersonIdById(Share.ID as string);

            } else {

                oPersonID = Share.Person_ID;

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

        return 3;

    }


    public async checkDeleteByTransactionExistence(Share: Share): Promise<Either<AbstractError, boolean>> {

        const oTransactions = await this.TransactionRepository.findByCategoryID(Share.ID, 1);

        if (Array.isArray(oTransactions)) {

            if (oTransactions.length > 0) {

                const stack = new Error().stack as string;

                return left(new PermissionDenied('error.exclusionOfShareInUsePermissionDenied', 403, stack));

            }

        }

        return right(true);

    }

}