import { PermissionDenied } from "@/errors/permission-denied";
import { User } from "@sap/cds";
import { Either, left, right } from "@sweet-monads/either";
import { BaseService } from "./protocols";
import { PersonRepositoryImplementation } from "@/repositories/person";
import { oPersonRepositoryFactory } from "@/factories/repositories/person";

export class BaseServiceImplementation implements BaseService {

    public async checkModificationPermissionByPerson(LoggedUser: User, PersonId: string): Promise<Either<PermissionDenied, boolean>> {

        const oPerson = await oPersonRepositoryFactory.findById(PersonId);

        if (LoggedUser && oPerson) {

            if (LoggedUser?.id !== oPerson.CreatedBy) {

                const stack = new Error().stack as string;

                return left(new PermissionDenied('error.modificationPermissionDenied', 403, stack));

            }

        }

        return right(true);

    }

}