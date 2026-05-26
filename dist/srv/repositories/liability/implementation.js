"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const implementation_1 = require("../base/implementation");
const liability_1 = require("@/models/liability");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
const decimal_js_1 = __importDefault(require("decimal.js"));
class LiabilityRepositoryImplementation extends implementation_1.BaseRepositoryImplementation {
    async findById(Id, ignoreDraft) {
        let Entity = this.getEntity(ignoreDraft);
        let sql = SELECT.from(Entity).where({ ID: Id });
        let rows = await cds_1.default.run(sql);
        if (Entity?.isDraft) {
            Entity = this.getEntity(true);
            sql = SELECT.from(Entity).where({ ID: Id });
            const activeRows = await cds_1.default.run(sql) || [];
            rows = [...(rows || []), ...activeRows];
        }
        const model = liability_1.LiabilityModel.mapModel(rows);
        return model?.[0] || null;
    }
    async findByIds(Ids) {
        let Entity = this.getEntity();
        let sql = SELECT.from(Entity).where({
            ID: { in: Ids }
        });
        let rows = await cds_1.default.run(sql);
        if (Entity?.isDraft) {
            Entity = this.getEntity(true);
            sql = SELECT.from(Entity).where({
                ID: { in: Ids }
            });
            const activeRows = await cds_1.default.run(sql) || [];
            rows = [...(rows || []), ...activeRows];
        }
        return liability_1.LiabilityModel.mapModel(rows);
    }
    async findByPersonId(PersonId) {
        let Entity = this.getEntity();
        let sql = SELECT.from(Entity).where({
            Person_ID: PersonId
        });
        let rows = await cds_1.default.run(sql);
        if (Entity?.isDraft) {
            Entity = this.getEntity(true);
            sql = SELECT.from(Entity).where({
                Person_ID: PersonId
            });
            const activeRows = await cds_1.default.run(sql) || [];
            rows = [...(rows || []), ...activeRows];
        }
        return liability_1.LiabilityModel.mapModel(rows);
    }
    async findOpenByPersonId(PersonId) {
        return this.findByStatus(PersonId, "OPEN");
    }
    async findOverdueByPersonId(PersonId) {
        return this.findByStatus(PersonId, "OVERDUE");
    }
    async findByStatus(PersonId, Status) {
        let Entity = this.getEntity();
        let sql = SELECT.from(Entity).where({
            Person_ID: PersonId,
            Status
        });
        let rows = await cds_1.default.run(sql);
        if (Entity?.isDraft) {
            Entity = this.getEntity(true);
            sql = SELECT.from(Entity).where({
                Person_ID: PersonId,
                Status
            });
            const activeRows = await cds_1.default.run(sql) || [];
            rows = [...(rows || []), ...activeRows];
        }
        return liability_1.LiabilityModel.mapModel(rows);
    }
    async createEntry(data) {
        const payload = Array.isArray(data) ? data : [data];
        await INSERT.into(this.getEntity(true)).entries(payload);
        return this.findByIds(payload.map(x => x.ID));
    }
    async updateBalance(Id, Balance) {
        await UPDATE(this.getEntity(true))
            .set({
            CurrentBalance: Balance
        })
            .where({ ID: Id });
        return true;
    }
    async updateEntry(Id, data) {
        await UPDATE(this.getEntity(true))
            .set(data)
            .where({ ID: Id });
        return true;
    }
    async updateAmounts(Id, data) {
        await UPDATE(this.getEntity(true))
            .set({
            CurrentBalance: data.CurrentBalance instanceof decimal_js_1.default
                ? data.CurrentBalance.toNumber()
                : data.CurrentBalance,
            PaidAmount: data.PaidAmount instanceof decimal_js_1.default
                ? data.PaidAmount.toNumber()
                : data.PaidAmount,
            Status: data.Status
        })
            .where({
            ID: Id
        });
        return true;
    }
    async closeLiability(Id) {
        await UPDATE(this.getEntity(true))
            .set({
            Status: "PAID",
            CurrentBalance: 0
        })
            .where({ ID: Id });
        return true;
    }
    async renegotiate(Id, data) {
        await UPDATE(this.getEntity(true))
            .set({
            CurrentBalance: data.CurrentBalance,
            Installments: data.Installments,
            RemainingInstallments: data.RemainingInstallments,
            InstallmentAmount: data.InstallmentAmount,
            InterestRate: data.InterestRate,
            Status: data.Status
        })
            .where({
            ID: Id
        });
        return true;
    }
    getEntity(ignoreDraft) {
        return ServiceLocator_1.ServiceLocator.getEntity('Invoices', ignoreDraft);
    }
    personPath() {
        return "Person";
    }
}
exports.LiabilityRepositoryImplementation = LiabilityRepositoryImplementation;
//# sourceMappingURL=implementation.js.map