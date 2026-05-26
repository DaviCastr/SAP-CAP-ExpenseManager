"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const category_1 = require("@/models/category");
const implementation_1 = require("../base/implementation");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class CategoryRepositoryImplementation extends implementation_1.BaseRepositoryImplementation {
    async findById(Id) {
        let oCategoryEntity = this.getEntity();
        let oSql = SELECT.from(oCategoryEntity).where({ ID: Id });
        let oCategories = await cds_1.default.run(oSql);
        if (oCategoryEntity?.isDraft) {
            oCategoryEntity = this.getEntity(true);
            oSql = SELECT.from(oCategoryEntity).where({ ID: Id });
            const additionalCategories = await cds_1.default.run(oSql) || [];
            oCategories = [...(oCategories || []), ...additionalCategories];
        }
        const oCategoriesModel = this.mapCategoryResult(oCategories);
        if (oCategoriesModel) {
            return oCategoriesModel[0];
        }
        else {
            return null;
        }
    }
    async findByIds(Ids) {
        let oCategoryEntity = this.getEntity();
        let oSql = SELECT.from(oCategoryEntity).where({ ID: { in: Ids } });
        let oCategorys = await cds_1.default.run(oSql);
        if (oCategoryEntity?.isDraft) {
            oCategoryEntity = this.getEntity(true);
            oSql = SELECT.from(oCategoryEntity).where({ ID: { in: Ids } });
            const additionalCategoryts = await cds_1.default.run(oSql) || [];
            oCategorys = [...(oCategorys || []), ...additionalCategoryts];
        }
        const oCategorysModel = this.mapCategoryResult(oCategorys);
        return oCategorysModel;
    }
    async findByPersonIds(PersonIds) {
        let oCategoryEntity = this.getEntity();
        const personIds = Array.isArray(PersonIds) ? PersonIds : [PersonIds];
        let oSql = SELECT.from(oCategoryEntity).where({ Person_ID: { in: personIds } });
        let oCategorys = await cds_1.default.run(oSql);
        if (oCategoryEntity?.isDraft) {
            oCategoryEntity = this.getEntity(true);
            oSql = SELECT.from(oCategoryEntity).where({ Person_ID: { in: personIds } });
            const additionalCategoryts = await cds_1.default.run(oSql) || [];
            oCategorys = [...(oCategorys || []), ...additionalCategoryts];
        }
        const oCategorysModel = this.mapCategoryResult(oCategorys);
        return oCategorysModel;
    }
    async createEntry(data) {
        let oCategoryEntity = this.getEntity();
        let oSql = INSERT.into(oCategoryEntity).entries(data);
        await cds_1.default.run(oSql);
        return this.mapCategoryResult(Array.isArray(data) ? data : [data]);
    }
    getEntity(ignoreDraft) {
        return ServiceLocator_1.ServiceLocator.getEntity('Categories', ignoreDraft);
    }
    personPath() {
        return 'Person';
    }
    mapCategoryResult(Categories) {
        if (Categories.length === 0) {
            return null;
        }
        return category_1.CategoryModel.mapModel(Categories);
    }
}
exports.CategoryRepositoryImplementation = CategoryRepositoryImplementation;
//# sourceMappingURL=implementation.js.map