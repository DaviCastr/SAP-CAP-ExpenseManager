"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceLocator = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
class ServiceLocator {
    static GestorService;
    static setGestorService(Service) {
        this.GestorService = Service;
    }
    static getRequest() {
        return cds_1.default.context?._request;
    }
    static setRequestData(data) {
        const request = cds_1.default.context?._request;
        request.data = data;
    }
    static getGestorService() {
        if (!this.GestorService) {
            throw new Error("ExpenseManager service not initialized");
        }
        return this.GestorService;
    }
    static getServiceName() {
        return this.getRequest()?.target?.name?.split('.')[0];
    }
    static getEntity(EntityName, ignoreDraft = false) {
        if (this.getRequest()?.target?.name?.endsWith(`.${EntityName}.drafts`) && !ignoreDraft) {
            return this.getRequest().target;
        }
        const oServiceName = this.getServiceName();
        const oEntityName = oServiceName ? `${oServiceName}.${EntityName}` : EntityName;
        let oEntity = cds_1.default.entities[oEntityName];
        if (!oEntity) {
            oEntity = cds_1.default.entities[EntityName];
        }
        return oEntity;
    }
    static getPermissionCache() {
        const request = this.getRequest();
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
    static getEmailSendingCache() {
        const request = this.getRequest();
        if (!request?.context?.emailSendingCache) {
            request.context.emailSendingCache = {
                _mailTemplateCache: null,
                _predictionTemplateCache: null,
                _logoCache: null,
                _smtpInstance: null,
                _categoryImageCache: new Map()
            };
        }
        return request.context.emailSendingCache;
    }
    static buildPermissionKey(userId, personId, entityCode, permission) {
        return `${userId}|${personId}|${entityCode}|${permission}`;
    }
}
exports.ServiceLocator = ServiceLocator;
//# sourceMappingURL=ServiceLocator.js.map