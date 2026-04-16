import cds, { entity, Request, Service } from "@sap/cds";
import { BaseRoute } from "./protocols";
import { BaseController, BaseControllerResponse } from "@/controllers/base";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

export abstract class BaseRouteImplementation<Entity> implements BaseRoute {

    protected abstract Controller: BaseController<Entity>;

    protected mainBase(Service: Service, EntityDB: entity) {

        //Before
        Service.before("*", this.beforeAll.bind(this));
        Service.before("READ", EntityDB?.drafts as entity, this.beforeRead.bind(this));
        Service.before("READ", EntityDB as entity, this.beforeRead.bind(this));
        Service.before("CREATE", EntityDB?.drafts as entity, this.beforeCreate.bind(this));
        Service.before("UPDATE", EntityDB as entity, this.beforeUpdate.bind(this));
        Service.before("PATCH", EntityDB as entity, this.beforeUpdate.bind(this));
        Service.before("PATCH", EntityDB?.drafts as entity, this.beforeUpdate.bind(this));
        Service.before("EDIT", EntityDB as entity, this.beforeEdit.bind(this));
        Service.before("DELETE", EntityDB as entity, this.beforeDelete.bind(this));
        Service.before("DELETE", EntityDB?.drafts as entity, this.beforeDelete.bind(this));

        //After
        Service.after("READ", EntityDB as entity, this.afterRead.bind(this));
        Service.after("READ", EntityDB?.drafts as entity, this.afterRead.bind(this));

        // Service.on("READ", EntityDB, async (req, next) => {

        //     let active = await next(); // ativos

        //     if(!Array.isArray(active)){
        //         active = [active];
        //     }

        //     const draftsOnly = await cds.run(
        //         SELECT.from(Categories.drafts!) 
        //             .where({ HasActiveEntity: false })
        //     );

        //     return [...active, ...draftsOnly];

        // });


    }

    public returnRejectMessage(Request: Request, Result: BaseControllerResponse): never {

        const oMessages = cds.i18n.messages;

        let oLocalizedMessage = oMessages.at(
            Result.data as string,
            Request.locale
        )

        if (!oLocalizedMessage) {

            oLocalizedMessage = Result.data as string;

        }

        return Request?.reject(Result.status, oLocalizedMessage as string);

    }


    public returnErrorMessage(Request: Request, Result: BaseControllerResponse): Error {

        const oMessages = cds.i18n.messages;

        let oLocalizedMessage = oMessages.at(
            Result.data as string,
            Request.locale
        )

        if (!oLocalizedMessage) {

            oLocalizedMessage = Result.data as string;

        }

        return Request?.error(Result.status, oLocalizedMessage as string);

    }


    protected async beforeAll(Request: Request): Promise<void> {

        (cds.context as any)._request = Request;

        (cds.context as any)._meta = {
            event: Request.event,
            hasTarget: !!Request.target,
            isDraft: Request.data?.IsActiveEntity === false
        };

    }


    protected async beforeRead(Request: Request): Promise<void> {

        const oResult = this.Controller.beforeRead(Request);

        if (oResult.status != 200) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    protected async beforeCreate(Request: Request): Promise<void> {

        const oEntity: Entity = Request.data;

        const oResult = await this.Controller.beforeCreate(oEntity, Request.user);

        if (oResult.status != 201) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    protected async beforeUpdate(Request: Request): Promise<void> {

        const oEntity: Entity = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult = await this.Controller.beforeUpdate(oEntity, Request.user);

        if (oResult.status != 204) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    protected async beforeEdit(Request: Request): Promise<void> {

        const oEntity: Entity = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult = await this.Controller.beforeEdit(oEntity, Request.user);

        if (oResult.status != 204) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    protected async beforeDelete(Request: Request): Promise<void> {

        const oEntity: Entity = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult = await this.Controller.beforeDelete(oEntity, Request.user);

        if (oResult.status != 204) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    protected async afterRead(Entities: Entity[] | Entity, Request: Request): Promise<void> {

        const oEntities = Array.isArray(Entities)
            ? Entities
            : [Entities];

        const oResult = await this.Controller.afterRead(oEntities, Request.user);

        if (oResult.status >= 400) {
            return this.returnRejectMessage(Request, oResult);
        }
 
        const oResultData = oResult.data as Entity[];

        if (oEntities != oResultData) {
            oEntities.length = 0;
            oEntities.push(...oResultData);
        }

    }


}