"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
class BaseRepositoryImplementation {
    async findImageByIds(Ids) {
        let oEntity = this.getEntity();
        let oSql = SELECT.columns('ID', 'Image', 'ImageType').from(oEntity).where({ ID: { in: Ids } });
        let oEntities = await cds_1.default.run(oSql);
        if (oEntity?.isDraft) {
            oEntity = this.getEntity(true);
            oSql = SELECT.from(oEntity).where({ ID: { in: Ids } });
            const additionalEntities = await cds_1.default.run(oSql) || [];
            oEntities = [...(oEntities || []), ...additionalEntities];
        }
        return oEntities;
    }
    async findPersonIdById(Id) {
        const Entity = this.getEntity();
        let oPath = this.personPath();
        if (oPath != '') {
            oPath += '.ID';
        }
        else {
            oPath = 'ID';
        }
        let oResult = await cds_1.default.run(SELECT.one(`${oPath} as PersonID`)
            .from(Entity)
            .where({ ID: Id }));
        if (oResult?.PersonID) {
            return oResult.PersonID;
        }
        if (Entity.drafts) {
            oResult = await cds_1.default.run(SELECT.one(`${oPath} as PersonID`)
                .from(Entity.drafts)
                .where({ ID: Id }));
            if (oResult?.PersonID) {
                return oResult.PersonID;
            }
        }
        return null;
    }
}
exports.BaseRepositoryImplementation = BaseRepositoryImplementation;
//# sourceMappingURL=implementation.js.map