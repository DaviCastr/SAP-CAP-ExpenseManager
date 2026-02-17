import { PermissionDenied } from "@/errors/permission-denied";
import { User } from "@sap/cds";
import { Either } from "@sweet-monads/either";

export interface BaseService {
    checkPermissionByPersonId(LoggedUser: User, PersonId: string, Permision: number): Promise<Either<PermissionDenied, boolean>>;
}