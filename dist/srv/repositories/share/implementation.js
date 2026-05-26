"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const share_1 = require("@/models/share");
const implementation_1 = require("../base/implementation");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class ShareRepositoryImplementation extends implementation_1.BaseRepositoryImplementation {
    async findById(Id) {
        let oShareEntity = this.getEntity();
        let oSql = SELECT.from(oShareEntity).where({ ID: Id });
        let oShares = await cds_1.default.run(oSql);
        if (oShareEntity?.isDraft) {
            oShareEntity = this.getEntity(true);
            oSql = SELECT.from(oShareEntity).where({ Id: Id });
            const additionalShares = await cds_1.default.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalShares];
        }
        const oSharesModel = this.mapShareResult(oShares);
        return oSharesModel?.[0];
    }
    async findByPersonId(PersonId) {
        let oShareEntity = this.getEntity();
        let oSql = SELECT.from(oShareEntity).where({ Person_ID: PersonId });
        let oShares = await cds_1.default.run(oSql);
        if (oShareEntity?.isDraft) {
            oShareEntity = this.getEntity(true);
            oSql = SELECT.from(oShareEntity).where({ Person_ID: PersonId });
            const additionalShares = await cds_1.default.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalShares];
        }
        const oSharesModel = this.mapShareResult(oShares);
        return oSharesModel;
    }
    async findByPersonIds(PersonIds) {
        let oShareEntity = this.getEntity();
        const personIds = Array.isArray(PersonIds) ? PersonIds : [PersonIds];
        let oSql = SELECT.from(oShareEntity).where({ Person_ID: { in: personIds } });
        let oShares = await cds_1.default.run(oSql);
        if (oShareEntity?.isDraft) {
            oShareEntity = this.getEntity(true);
            oSql = SELECT.from(oShareEntity).where({ Person_ID: { in: personIds } });
            const additionalShares = await cds_1.default.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalShares];
        }
        const oSharesModel = this.mapShareResult(oShares);
        return oSharesModel;
    }
    async findByIds(Ids) {
        let oShareEntity = this.getEntity();
        let oSql = SELECT.from(oShareEntity).where({ ID: { in: Ids } });
        let oShares = await cds_1.default.run(oSql);
        if (oShareEntity?.isDraft) {
            oShareEntity = this.getEntity(true);
            oSql = SELECT.from(oShareEntity).where({ ID: { in: Ids } });
            const additionalSharets = await cds_1.default.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalSharets];
        }
        const oSharesModel = this.mapShareResult(oShares);
        return oSharesModel;
    }
    async findByUser(User) {
        let oShareEntity = this.getEntity();
        let oSql = SELECT.from(oShareEntity).where({ User: User });
        let oShares = await cds_1.default.run(oSql);
        if (oShareEntity?.isDraft) {
            oShareEntity = this.getEntity(true);
            oSql = SELECT.from(oShareEntity).where({ User: User });
            const additionalShares = await cds_1.default.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalShares];
        }
        const oSharesModel = this.mapShareResult(oShares);
        return oSharesModel;
    }
    async createEntry(data) {
        let oShareEntity = this.getEntity();
        let oSql = INSERT.into(oShareEntity).entries(data);
        await cds_1.default.run(oSql);
        return this.mapShareResult(Array.isArray(data) ? data : [data]);
    }
    mapShareResult(Shares) {
        if (Shares.length === 0) {
            return null;
        }
        return share_1.ShareModel.mapModel(Shares);
    }
    getEntity(ignoreDraft = false) {
        return ServiceLocator_1.ServiceLocator.getEntity('Shares', ignoreDraft);
    }
    personPath() {
        return 'Person';
    }
}
exports.ShareRepositoryImplementation = ShareRepositoryImplementation;
//# sourceMappingURL=implementation.js.map