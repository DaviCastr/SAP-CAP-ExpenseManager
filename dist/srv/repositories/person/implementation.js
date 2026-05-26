"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const person_1 = require("@/models/person");
const implementation_1 = require("../base/implementation");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class PersonRepositoryImplementation extends implementation_1.BaseRepositoryImplementation {
    async findById(Id, ignoreDraft) {
        let oPersonEntity = this.getEntity(ignoreDraft);
        let oSql = SELECT.from(oPersonEntity).where({ ID: Id });
        let oPersons = await cds_1.default.run(oSql);
        if (oPersonEntity?.isDraft) {
            oPersonEntity = this.getEntity(true);
            oSql = SELECT.from(oPersonEntity).where({ ID: Id });
            const additionalPersons = await cds_1.default.run(oSql) || [];
            oPersons = [...(oPersons || []), ...additionalPersons];
        }
        const oPersonsModel = this.mapPersonResult(oPersons);
        if (oPersonsModel) {
            return oPersonsModel[0];
        }
        else {
            return null;
        }
    }
    async findByCardId(CardId) {
        let oPersonEntity = this.getEntity();
        let oSql = SELECT.from(oPersonEntity).where `Cards.ID = ${CardId} `;
        let oPersons = await cds_1.default.run(oSql);
        if (oPersonEntity?.isDraft) {
            oPersonEntity = this.getEntity(true);
            oSql = SELECT.from(oPersonEntity).where `Cards.ID = ${CardId} `;
            const additionalPersons = await cds_1.default.run(oSql) || [];
            oPersons = [...(oPersons || []), ...additionalPersons];
        }
        const oPersonsModel = this.mapPersonResult(oPersons);
        if (oPersonsModel) {
            return oPersonsModel[0];
        }
        else {
            return null;
        }
    }
    async findByIds(Ids) {
        let oPersonEntity = this.getEntity();
        let oSql = SELECT.from(oPersonEntity).where({ ID: { in: Ids } });
        let oPersons = await cds_1.default.run(oSql);
        if (oPersonEntity?.isDraft) {
            oPersonEntity = this.getEntity(true);
            oSql = SELECT.from(oPersonEntity).where({ ID: { in: Ids } });
            const additionalPersons = await cds_1.default.run(oSql) || [];
            oPersons = [...(oPersons || []), ...additionalPersons];
        }
        const oPersonsModel = this.mapPersonResult(oPersons);
        return oPersonsModel;
    }
    async findByUser(createdBy) {
        let oPersonEntity = this.getEntity();
        let oSql = SELECT.from(oPersonEntity).where({ createdBy: createdBy });
        let oPersons = await cds_1.default.run(oSql);
        if (oPersonEntity?.isDraft) {
            oPersonEntity = this.getEntity(true);
            oSql = SELECT.from(oPersonEntity).where({ createdBy: createdBy });
            const additionalPersons = await cds_1.default.run(oSql) || [];
            oPersons = [...(oPersons || []), ...additionalPersons];
        }
        const oPersonsModel = this.mapPersonResult(oPersons);
        return oPersonsModel;
    }
    async findAll(genericFilters) {
        let oPersonEntity = this.getEntity();
        let oSql = SELECT.from(oPersonEntity);
        if (genericFilters) {
            oSql.where(genericFilters);
        }
        let oPersons = await cds_1.default.run(oSql);
        if (oPersonEntity?.isDraft) {
            oPersonEntity = this.getEntity(true);
            oSql = SELECT.from(oPersonEntity);
            if (genericFilters) {
                oSql.where(genericFilters);
            }
            const additionalPersons = await cds_1.default.run(oSql) || [];
            oPersons = [...(oPersons || []), ...additionalPersons];
        }
        const oPersonsModel = this.mapPersonResult(oPersons);
        return oPersonsModel;
    }
    async createEntry(data) {
        let oPersonEntity = this.getEntity();
        let oSql = INSERT.into(oPersonEntity).entries(data);
        await cds_1.default.run(oSql);
        return this.mapPersonResult(Array.isArray(data) ? data : [data]);
    }
    getEntity(ignoreDraft) {
        return ServiceLocator_1.ServiceLocator.getEntity('Persons', ignoreDraft);
    }
    personPath() {
        return '';
    }
    mapPersonResult(Persons) {
        if (Persons.length === 0) {
            return null;
        }
        return person_1.PersonModel.mapModel(Persons);
    }
}
exports.PersonRepositoryImplementation = PersonRepositoryImplementation;
//# sourceMappingURL=implementation.js.map