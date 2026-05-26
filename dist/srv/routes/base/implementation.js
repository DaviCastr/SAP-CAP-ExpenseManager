"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouteImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
class BaseRouteImplementation {
    mainBase(Service, EntityDB) {
        //Before
        Service.before("*", this.beforeAll.bind(this));
        Service.before("READ", EntityDB, this.beforeRead.bind(this));
        Service.before("UPDATE", EntityDB, this.beforeUpdate.bind(this));
        Service.before("PATCH", EntityDB, this.beforeUpdate.bind(this));
        Service.before("EDIT", EntityDB, this.beforeEdit.bind(this));
        Service.before("DELETE", EntityDB, this.beforeDelete.bind(this));
        //After
        Service.after("READ", EntityDB, this.afterRead.bind(this));
        if (EntityDB?.drafts) {
            Service.before("READ", EntityDB?.drafts, this.beforeRead.bind(this));
            Service.before("CREATE", EntityDB?.drafts, this.beforeCreate.bind(this));
            Service.before("PATCH", EntityDB?.drafts, this.beforeUpdate.bind(this));
            Service.before("DELETE", EntityDB?.drafts, this.beforeDelete.bind(this));
            Service.after("READ", EntityDB?.drafts, this.afterRead.bind(this));
        }
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
    returnRejectMessage(Request, Result) {
        const oMessages = cds_1.default.i18n.messages;
        let oLocalizedMessage = oMessages.at(Result.data, Request.locale);
        if (!oLocalizedMessage) {
            oLocalizedMessage = Result.data;
        }
        return Request?.reject(Result.status, oLocalizedMessage);
    }
    returnErrorMessage(Request, Result) {
        const oMessages = cds_1.default.i18n.messages;
        let oLocalizedMessage = oMessages.at(Result.data, Request.locale);
        if (!oLocalizedMessage) {
            oLocalizedMessage = Result.data;
        }
        return Request?.error(Result.status, oLocalizedMessage);
    }
    async beforeAll(Request) {
        cds_1.default.context._request = Request;
        cds_1.default.context._meta = {
            event: Request.event,
            hasTarget: !!Request.target,
            isDraft: Request.data?.IsActiveEntity === false
        };
    }
    async beforeRead(Request) {
        const oResult = this.Controller.beforeRead(Request);
        if (oResult.status != 200) {
            return this.returnRejectMessage(Request, oResult);
        }
    }
    async beforeCreate(Request) {
        const oEntity = Request.data;
        const oResult = await this.Controller.beforeCreate(oEntity, Request.user);
        if (oResult.status != 201) {
            return this.returnRejectMessage(Request, oResult);
        }
    }
    async beforeUpdate(Request) {
        const oEntity = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };
        const oResult = await this.Controller.beforeUpdate(oEntity, Request.user);
        if (oResult.status != 204) {
            return this.returnRejectMessage(Request, oResult);
        }
    }
    async beforeEdit(Request) {
        const oEntity = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };
        const oResult = await this.Controller.beforeEdit(oEntity, Request.user);
        if (oResult.status != 204) {
            return this.returnRejectMessage(Request, oResult);
        }
    }
    async beforeDelete(Request) {
        const oEntity = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };
        const oResult = await this.Controller.beforeDelete(oEntity, Request.user);
        if (oResult.status != 204) {
            return this.returnRejectMessage(Request, oResult);
        }
    }
    async afterRead(Entities, Request) {
        const oEntities = Array.isArray(Entities)
            ? Entities
            : [Entities];
        const oResult = await this.Controller.afterRead(oEntities, Request.user);
        if (oResult.status >= 400) {
            return this.returnRejectMessage(Request, oResult);
        }
        const oResultData = oResult.data;
        if (oEntities != oResultData) {
            oEntities.length = 0;
            oEntities.push(...oResultData);
        }
    }
}
exports.BaseRouteImplementation = BaseRouteImplementation;
//# sourceMappingURL=implementation.js.map