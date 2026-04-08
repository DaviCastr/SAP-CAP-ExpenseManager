import { BaseController, BaseControllerResponse } from './protocols';
import { Request, User } from '@sap/cds';
import { BaseService } from '@/services/base';

export abstract class BaseControllerImplementation<Entity> implements BaseController<Entity> {

    protected abstract Service: BaseService<Entity>;

    public beforeRead(Request: Request): BaseControllerResponse {

        const result = this.Service.beforeRead(Request);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(200, result.value);

    }


    public async beforeCreate(Entity: Entity, LoggedUser: User): Promise<BaseControllerResponse> {

        const result = await this.Service.beforeCreate(Entity, LoggedUser);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(201, result.value);

    }


    public async beforeUpdate(Entity: Entity, LoggedUser: User): Promise<BaseControllerResponse> {

        const result = await this.Service.beforeUpdate(Entity, LoggedUser);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(204, result.value);

    }


    public async beforeEdit(Entity: Entity, LoggedUser: User): Promise<BaseControllerResponse> {

        const result = await this.Service.beforeEdit(Entity, LoggedUser);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(204, result.value);

    }


    public async beforeDelete(Entity: Entity, LoggedUser: User): Promise<BaseControllerResponse> {

        const result = await this.Service.beforeDelete(Entity, LoggedUser);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(204, result.value);

    }


    public async afterRead(Entities: Entity[], LoggedUser: User): Promise<BaseControllerResponse> {

        const oResult = await this.Service.afterRead(Entities, LoggedUser);

        if (oResult.isLeft()) {
            return this.error(oResult.value.code, oResult.value.message);
        }

        return this.success(200, oResult.value);

    }


    public success(code: number, data: unknown): BaseControllerResponse {
        return {
            data,
            status: code
        };
    }


    public error(code: number, message: string): BaseControllerResponse {
        return {
            status: code,
            data: message
        };
    }


}