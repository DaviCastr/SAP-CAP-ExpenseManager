"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const entity_1 = require("@/models/entity");
const implementation_1 = require("../base/implementation");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class EntityRepositoryImplementation extends implementation_1.BaseRepositoryImplementation {
    async findById(Id) {
        let oEntityEntity = this.getEntity();
        let oSql = SELECT.from(oEntityEntity).where({ ID: Id });
        let oEntities = await cds_1.default.run(oSql);
        if (oEntityEntity?.isDraft) {
            oEntityEntity = this.getEntity(true);
            oSql = SELECT.from(oEntityEntity).where({ ID: Id });
            const additionalEntities = await cds_1.default.run(oSql) || [];
            oEntities = [...(oEntities || []), ...additionalEntities];
        }
        const oEntitiesModel = this.mapEntityResult(oEntities);
        return oEntitiesModel?.[0];
    }
    async findByShareId(ShareId) {
        let oEntityEntity = this.getEntity();
        let oSql = SELECT.from(oEntityEntity).where({ Share_ID: ShareId });
        let oEntities = await cds_1.default.run(oSql);
        if (oEntityEntity?.isDraft) {
            oEntityEntity = this.getEntity(true);
            oSql = SELECT.from(oEntityEntity).where({ Share_ID: ShareId });
            const additionalEntities = await cds_1.default.run(oSql) || [];
            oEntities = [...(oEntities || []), ...additionalEntities];
        }
        const oEntitiesModel = this.mapEntityResult(oEntities);
        return oEntitiesModel;
    }
    async findByShareIds(ShareIds) {
        let oEntityEntity = this.getEntity();
        const shareIds = Array.isArray(ShareIds) ? ShareIds : [ShareIds];
        let oSql = SELECT.from(oEntityEntity).where({ Share_ID: { in: ShareIds } });
        let oEntities = await cds_1.default.run(oSql);
        if (oEntityEntity?.isDraft) {
            oEntityEntity = this.getEntity(true);
            oSql = SELECT.from(oEntityEntity).where({ Share_ID: { in: ShareIds } });
            const additionalEntities = await cds_1.default.run(oSql) || [];
            oEntities = [...(oEntities || []), ...additionalEntities];
        }
        const oEntitiesModel = this.mapEntityResult(oEntities);
        return oEntitiesModel;
    }
    async findByIds(Ids) {
        let oEntityEntity = this.getEntity();
        let oSql = SELECT.from(oEntityEntity).where({ ID: { in: Ids } });
        let oEntitys = await cds_1.default.run(oSql);
        if (oEntityEntity?.isDraft) {
            oEntityEntity = this.getEntity(true);
            oSql = SELECT.from(oEntityEntity).where({ ID: { in: Ids } });
            const additionalEntityts = await cds_1.default.run(oSql) || [];
            oEntitys = [...(oEntitys || []), ...additionalEntityts];
        }
        const oEntitysModel = this.mapEntityResult(oEntitys);
        return oEntitysModel;
    }
    async createEntry(data) {
        let oEntityEntity = this.getEntity();
        let oSql = INSERT.into(oEntityEntity).entries(data);
        await cds_1.default.run(oSql);
        return this.mapEntityResult(Array.isArray(data) ? data : [data]);
    }
    mapEntityResult(Entities) {
        if (Entities.length === 0) {
            return null;
        }
        return entity_1.EntityModel.mapModel(Entities);
    }
    getEntity(ignoreDraft = false) {
        return ServiceLocator_1.ServiceLocator.getEntity('Entities', ignoreDraft);
    }
    personPath() {
        return 'Share.Person';
    }
}
exports.EntityRepositoryImplementation = EntityRepositoryImplementation;
//# sourceMappingURL=implementation.js.map