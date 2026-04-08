import { AbstractError } from "@/errors";
import { Request, User } from "@sap/cds";
import { Either } from "@sweet-monads/either";

export interface BaseService<Entity> {
    beforeRead(Request: Request): Either<AbstractError, boolean>
    beforeCreate(Entity: Entity, LoggedUser: User): Promise<Either<AbstractError, boolean>>
    beforeUpdate(Entity: Entity, LoggedUser: User): Promise<Either<AbstractError, boolean>>
    beforeEdit(Entity: Entity, LoggedUser: User): Promise<Either<AbstractError, boolean>>
    beforeDelete(Entity: Entity, LoggedUser: User): Promise<Either<AbstractError, boolean>>
    afterRead(Entities: Entity[], LoggedUser: User): Promise<Either<AbstractError, Entity[]>>;
}