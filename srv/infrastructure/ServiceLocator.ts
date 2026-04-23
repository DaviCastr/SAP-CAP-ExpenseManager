import cds, { entity, Request } from "@sap/cds";

export class ServiceLocator {

    private static GestorService: cds.Service;


    public static setGestorService(Service: any) {

        this.GestorService = Service;

    }


    public static getRequest(): Request {

        return (cds.context as any)?._request as Request;

    }


    public static setRequestData(data: {}) {

        const request = (cds.context as any)?._request as Request;

        request.data = data;

    }


    public static getGestorService(): cds.Service {

        if (!this.GestorService) {

            throw new Error("ExpenseManager service not initialized");

        }

        return this.GestorService;

    }


    public static getServiceName(): string {

        return this.getRequest()?.target?.name?.split('.')[0];

    }


    public static getEntity(EntityName: string, ignoreDraft = false): entity {

        if (this.getRequest()?.target?.name?.endsWith(`.${EntityName}.drafts`) && !ignoreDraft) {

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


    public static getPermissionCache() {

        const request = this.getRequest() as any;

        if (!request?.context?.permissionCache) {
            request.context.permissionCache = {
                personMap: new Map(),
                permissionChecked: new Set(),
                sharesByPerson: new Map(),
                entitiesByShare: new Map(),
            };
        }

        return request.context.permissionCache;

    }


    public static getEmailSendingCache() {

        const request = this.getRequest() as any;

        if (!request?.context?.emailSendingCache) {
            request.context.emailSendingCache = {
                _mailTemplateCache: null,
                _predictionTemplateCache: null,
                _logoCache: null,
                _smtpInstance: null,
                _categoryImageCache: new Map<string, Buffer>()
            };
        }

        return request.context.emailSendingCache;

    }


    public static buildPermissionKey(
        userId: string,
        personId: string,
        entityCode: number,
        permission: number
    ) {
        return `${userId}|${personId}|${entityCode}|${permission}`;
    }


}