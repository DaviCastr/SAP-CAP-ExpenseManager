import { PermissionDenied } from "@/errors/permission-denied";
import { User } from "@sap/cds";
import { Either } from "@sweet-monads/either";

export interface BaseService {
    checkModificationPermissionByPerson(LoggedUser: User, PersonId: string): Promise<Either<PermissionDenied, boolean>>;
}