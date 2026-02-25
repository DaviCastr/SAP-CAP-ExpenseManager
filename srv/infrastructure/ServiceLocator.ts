import cds, { entity, Request } from "@sap/cds";

export class ServiceLocator {

    private static GestorService: cds.Service;
    private static Request: Request;


    public static setGestorService(Service: any) {

        this.GestorService = Service;

    }


    public static setRequest(Request: Request) {

        this.Request = Request;

    }


    public static getRequest(): Request {

        return this.Request;

    }


    public static getGestorService(): cds.Service {

        if (!this.GestorService) {

            throw new Error("GestorDeGastos service not initialized");

        }

        return this.GestorService;

    }


    public static getServiceName(): string {

        return this.Request?.target?.name?.split('.')[0];

    }


    public static getEntity(EntityName: string): entity {

        if (this.getRequest()?.target?.name?.endsWith(`.${EntityName}.drafts`)) {

            return this.getRequest().target as entity;

        }

        const oServiceName = this.getServiceName();

        const oEntityName = oServiceName ? `${oServiceName}.${EntityName}` : EntityName;

        let oEntity = cds.entities[oEntityName];

        if (!oEntity) {

            oEntity = cds.entities[EntityName];

        }

        return oEntity as entity;

    }


}