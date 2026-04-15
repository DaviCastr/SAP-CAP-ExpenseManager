import { Request, User } from "@sap/cds";

export type BaseControllerResponse = {

    data: unknown;
    status: number;

};

export interface BaseController<Entity> {
    beforeRead(Request: Request): BaseControllerResponse;
    beforeCreate(Entity: Entity, LoggedUser: User): Promise<BaseControllerResponse>;
    beforeUpdate(Entity: Entity, LoggedUser: User): Promise<BaseControllerResponse>;
    beforeEdit(Entity: Entity, LoggedUser: User): Promise<BaseControllerResponse>;
    beforeDelete(Entity: Entity, LoggedUser: User): Promise<BaseControllerResponse>;
    afterRead(Entities: Entity[], LoggedUser: User): Promise<BaseControllerResponse>;
    success(code: number, data: unknown): BaseControllerResponse;
    error(code: number, message: string): BaseControllerResponse;

}
