"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityTransactionRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const implementation_1 = require("../base/implementation");
const liability_transaction_1 = require("@/models/liability-transaction");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class LiabilityTransactionRepositoryImplementation extends implementation_1.BaseRepositoryImplementation {
    async findById(Id, ignoreDraft) {
        let Entity = this.getEntity(ignoreDraft);
        let sql = SELECT.from(Entity)
            .where({ ID: Id });
        let rows = await cds_1.default.run(sql);
        if (Entity?.isDraft) {
            Entity =
                this.getEntity(true);
            sql =
                SELECT.from(Entity)
                    .where({ ID: Id });
            const activeRows = await cds_1.default.run(sql) || [];
            rows = [
                ...(rows || []),
                ...activeRows
            ];
        }
        const models = liability_transaction_1.LiabilityTransactionModel.mapModel(rows);
        return models?.[0] || null;
    }
    async findByIds(Ids) {
        let Entity = this.getEntity();
        let sql = SELECT.from(Entity)
            .where({
            ID: { in: Ids }
        });
        let rows = await cds_1.default.run(sql);
        if (Entity?.isDraft) {
            Entity =
                this.getEntity(true);
            sql =
                SELECT.from(Entity)
                    .where({
                    ID: { in: Ids }
                });
            const activeRows = await cds_1.default.run(sql) || [];
            rows = [
                ...(rows || []),
                ...activeRows
            ];
        }
        return liability_transaction_1.LiabilityTransactionModel.mapModel(rows);
    }
    async findByLiabilityId(LiabilityId) {
        return this.findByLiabilityIds([LiabilityId]);
    }
    async findByLiabilityIds(LiabilityIds) {
        let Entity = this.getEntity();
        let sql = SELECT.from(Entity)
            .where({
            Liability_ID: {
                in: LiabilityIds
            }
        });
        let rows = await cds_1.default.run(sql);
        if (Entity?.isDraft) {
            Entity =
                this.getEntity(true);
            sql =
                SELECT.from(Entity)
                    .where({
                    Liability_ID: {
                        in: LiabilityIds
                    }
                });
            const activeRows = await cds_1.default.run(sql) || [];
            rows = [
                ...(rows || []),
                ...activeRows
            ];
        }
        return liability_transaction_1.LiabilityTransactionModel.mapModel(rows);
    }
    async findPaymentsByLiabilityId(LiabilityId) {
        let Entity = this.getEntity();
        let sql = SELECT.from(Entity)
            .where({
            Liability_ID: LiabilityId,
            Type: "PAYMENT"
        });
        let rows = await cds_1.default.run(sql);
        if (Entity?.isDraft) {
            Entity =
                this.getEntity(true);
            sql =
                SELECT.from(Entity)
                    .where({
                    Liability_ID: LiabilityId,
                    Type: "PAYMENT"
                });
            const activeRows = await cds_1.default.run(sql) || [];
            rows = [
                ...(rows || []),
                ...activeRows
            ];
        }
        return liability_transaction_1.LiabilityTransactionModel.mapModel(rows);
    }
    async findByExternalReference(ExternalReference) {
        let Entity = this.getEntity();
        let sql = SELECT.from(Entity)
            .where({
            ExternalReference
        });
        let rows = await cds_1.default.run(sql);
        if (Entity?.isDraft) {
            Entity =
                this.getEntity(true);
            sql =
                SELECT.from(Entity)
                    .where({
                    ExternalReference
                });
            const activeRows = await cds_1.default.run(sql) || [];
            rows = [
                ...(rows || []),
                ...activeRows
            ];
        }
        const models = liability_transaction_1.LiabilityTransactionModel.mapModel(rows);
        return models?.[0] || null;
    }
    async sumPaidAmount(LiabilityId) {
        const rows = await this.findPaymentsByLiabilityId(LiabilityId) || [];
        return rows.reduce((sum, item) => {
            return sum +
                Number(item.Amount
                    ?.toNumber() || 0);
        }, 0);
    }
    async createEntry(data) {
        const payload = Array.isArray(data)
            ? data
            : [data];
        await INSERT
            .into(this.getEntity(true))
            .entries(payload);
        return this.findByIds(payload.map(item => item.ID));
    }
    async updateEntry(Id, data) {
        await UPDATE(this.getEntity(true))
            .set(data)
            .where({
            ID: Id
        });
        return true;
    }
    getEntity(ignoreDraft) {
        return ServiceLocator_1.ServiceLocator.getEntity("LiabilityTransactions", ignoreDraft);
    }
    personPath() {
        return "Liability.Person";
    }
}
exports.LiabilityTransactionRepositoryImplementation = LiabilityTransactionRepositoryImplementation;
//# sourceMappingURL=implementation.js.map