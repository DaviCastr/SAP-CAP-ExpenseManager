import { PermissionDenied } from "@/errors/permission-denied";
import { User } from "@sap/cds";
import { Either, left, right } from "@sweet-monads/either";
import { BaseService } from "./protocols";
import { oPersonRepositoryFactory } from "@/factories/repositories/person";
import { oShareRepositoryFactory } from "@/factories/repositories/share";
import { ShareModel } from "@/models/share";

export class BaseServiceImplementation implements BaseService {

    public async checkPermissionByPersonId(LoggedUser: User, PersonId: string, Permision: number): Promise<Either<PermissionDenied, boolean>> {

        const oPerson = await oPersonRepositoryFactory.findById(PersonId);

        if (LoggedUser && oPerson) {

            if (LoggedUser?.id !== oPerson.CreatedBy) {

                const oShares = await oShareRepositoryFactory.findByPersonId(PersonId);

                if (oShares) {

                    let oPermissionByShare: Boolean = false;

                    if (Permision == 2){

                        oPermissionByShare = oShares.filter((oShare: ShareModel) => oShare.User == LoggedUser?.id && oShare.Permission == 2).length > 0;
                    
                    } else {

                        oPermissionByShare = oShares.filter((oShare: ShareModel) => oShare.User == LoggedUser?.id && oShare.Permission == 1).length > 0;

                    }

                    if (!oPermissionByShare) {

                        const stack = new Error().stack as string;

                        return left(new PermissionDenied('error.modificationPermissionDenied', 403, stack));

                    }

                } else {

                    const stack = new Error().stack as string;

                    return left(new PermissionDenied('error.modificationPermissionDenied', 403, stack));

                }

            }

        }

        return right(true);

    }

}