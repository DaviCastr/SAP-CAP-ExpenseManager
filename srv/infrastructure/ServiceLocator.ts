import cds, { entity, Request } from "@sap/cds";

export class ServiceLocator {

    private static ExpenseManagerService: cds.Service;


    public static setExpenseManagerService(Service: any) {

        this.ExpenseManagerService = Service;

    }


    public static getRequest(): Request {

        return (cds.context as any)?._request as Request;

    }


    public static setRequestData(data: {}) {

        const request = (cds.context as any)?._request as Request;

        request.data = data;

    }


    public static getExpenseManagerService(): cds.Service {

        if (!this.ExpenseManagerService) {

            throw new Error("ExpenseManager service not initialized");

        }

        return this.ExpenseManagerService;

    }


    public static getServiceName(): string {

        return this.getRequest()?.target?.name?.split('.')[0];

    }


    public static getEntity(EntityName: string, ignoreDraft = false): entity {

        if (this.getRequest()?.target?.name?.endsWith(`.${EntityName}.drafts`) && !ignoreDraft) {

            return this.getRequest().target as entity;

        }

        const oServiceName = this.getServiceName();

        const targetIsDraft = this.targetIsDraft();

        if (!ignoreDraft && targetIsDraft && oServiceName) {

            // During a draft session the request may target the drafts table of
            // one entity while the caller needs a sibling of the same service
            // (e.g. recalculating Liabilities from a LiabilityTransactions.drafts
            // request). Resolving the sibling to its own drafts table keeps the
            // recalculation inside the draft, so a discarded draft never corrupts
            // the active rows. Without this, the write would target the active
            // entity and the next movement would appear to have no effect.
            const sibling = cds.entities[`${oServiceName}.${EntityName}`] as entity;

            if (sibling?.drafts) {

                return sibling.drafts as entity;

            }

            // The service owning the request may not project the entity at all
            // (e.g. LiabilityTransactionService does not expose Liabilities).
            // Fall back to the main ExpenseManager service drafts.
            const oExpenseEntity = (this.ExpenseManagerService as any)?.entities?.[EntityName];

            if (oExpenseEntity?.drafts) {

                return oExpenseEntity.drafts as entity;

            }

        }

        const oEntityName = oServiceName ? `${oServiceName}.${EntityName}` : EntityName;

        let oEntity: entity = cds.entities[oEntityName];

        if (!ignoreDraft
            && targetIsDraft
            && oEntity?.drafts) {

            oEntity = oEntity?.drafts;

        }


        if (!oEntity) {

            oEntity = cds.entities[EntityName];

        }

        if (!oEntity && this.ExpenseManagerService) {

            oEntity = (this.ExpenseManagerService as any).entities?.[EntityName];

        }

        return oEntity as entity;

    }

    public static targetIsDraft(): boolean {

        return this.getRequest()?.target?.name?.endsWith(`.drafts`) ? true : false;

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


    /**
     * Per-request map of transactions whose liability changed during an update
     * (transaction ID -> previous liability ID). Lets the after-update
     * recalculation also recompute the liability the transaction was moved
     * away from.
     */
    public static getLiabilityMoveCache() {

        const request = this.getRequest() as any;

        if (!request?.context?.liabilityMoveCache) {
            request.context.liabilityMoveCache = new Map<string, string>();
        }

        return request.context.liabilityMoveCache as Map<string, string>;

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