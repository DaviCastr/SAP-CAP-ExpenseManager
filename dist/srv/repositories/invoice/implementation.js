"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const implementation_1 = require("../base/implementation");
const invoice_1 = require("@/models/invoice");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class InvoiceRepositoryImplementation extends implementation_1.BaseRepositoryImplementation {
    async findById(Id) {
        let oSql = this.getReportBaseSql();
        oSql.where({ ID: Id });
        let oInvoices = await cds_1.default.run(oSql);
        if (this.getEntity()?.isDraft) {
            oSql = this.getReportBaseSql(true);
            oSql.where({ ID: Id });
            const additionalInvoices = await cds_1.default.run(oSql) || [];
            oInvoices = [...(oInvoices || []), ...additionalInvoices];
        }
        const oInvoicesModel = await this.mapInvoiceResult(oInvoices);
        if (Array.isArray(oInvoicesModel)) {
            return oInvoicesModel[0];
        }
        return null;
    }
    async findByIds(Ids) {
        let oInvoiceEntity = this.getEntity();
        let oSql = SELECT.from(oInvoiceEntity).where({ ID: { in: Ids } });
        let oInvoices = await cds_1.default.run(oSql);
        if (oInvoiceEntity?.isDraft) {
            oInvoiceEntity = this.getEntity(true);
            oSql = SELECT.from(oInvoiceEntity).where({ ID: { in: Ids } });
            const additionalInvoicets = await cds_1.default.run(oSql) || [];
            oInvoices = [...(oInvoices || []), ...additionalInvoicets];
        }
        const oInvoicesModel = this.mapInvoiceResult(oInvoices);
        return oInvoicesModel;
    }
    async findByCardID(CardId, additionalFilters, Limit) {
        let oSql = this.getReportBaseSql();
        oSql.where({ ...additionalFilters, Card_ID: CardId });
        let oInvoices = await cds_1.default.run(oSql);
        if (this.getEntity()?.isDraft) {
            oSql = this.getReportBaseSql(true);
            oSql.where({ ...additionalFilters, Card_ID: CardId });
            const additionalInvoices = await cds_1.default.run(oSql) || [];
            oInvoices = [...(oInvoices || []), ...additionalInvoices];
        }
        const oinvoicesModel = await this.mapInvoiceResult(oInvoices);
        return oinvoicesModel;
    }
    async findByCardIDs(CardIds, additionalFilters, Limit) {
        let oSql = this.getReportBaseSql();
        oSql.where({ ...additionalFilters, Card_ID: { 'in': CardIds } });
        let oInvoices = await cds_1.default.run(oSql);
        if (this.getEntity()?.isDraft) {
            oSql = this.getReportBaseSql(true);
            oSql.where({ ...additionalFilters, Card_ID: { 'in': CardIds } });
            const additionalInvoices = await cds_1.default.run(oSql) || [];
            oInvoices = [...(oInvoices || []), ...additionalInvoices];
        }
        const oinvoicesModel = await this.mapInvoiceResult(oInvoices);
        return oinvoicesModel;
    }
    async retrieveTotalAmountByCardIDs(CardIds, additionalFilters) {
        let oInvoiceEntity = this.getEntity();
        let oSql = SELECT.one `coalesce (sum (TotalAmount),0) as TotalAmount, Currency_code`.from(oInvoiceEntity);
        oSql.where({ ...additionalFilters, Card_ID: { 'in': CardIds } });
        oSql.groupBy("Currency_code");
        let oInvoice = await cds_1.default.run(oSql);
        const oInvoiceModel = this.mapInvoiceResult([oInvoice]);
        return oInvoiceModel?.[0];
    }
    async retrieveTotalAmountByIDs(Ids, additionalFilters) {
        let oInvoiceEntity = this.getEntity();
        let oSql = SELECT.one `coalesce (sum (TotalAmount),0) as TotalAmount, Currency_code`.from(oInvoiceEntity);
        oSql.where({ ...additionalFilters, ID: { 'in': Ids } });
        oSql.groupBy("Currency_code");
        let oInvoice = await cds_1.default.run(oSql);
        const oInvoiceModel = this.mapInvoiceResult([oInvoice]);
        return oInvoiceModel?.[0];
    }
    async createEntry(data) {
        let oInvoiceEntity = this.getEntity();
        let oSql = INSERT.into(oInvoiceEntity).entries(data);
        await cds_1.default.run(oSql);
        return this.mapInvoiceResult(Array.isArray(data) ? data : [data]);
    }
    async updateTotalAmountByTransactionId(TransactionId) {
        let oInvoiceEntity = this.getEntity();
        let oInvoice = await cds_1.default.run(SELECT.one `ID`
            .from(oInvoiceEntity)
            .where `Transactions.ID = ${TransactionId}`);
        if (!oInvoice && oInvoiceEntity?.isDraft) {
            oInvoiceEntity = this.getEntity(true);
            oInvoice = await cds_1.default.run(SELECT.one `ID`
                .from(oInvoiceEntity)
                .where `Transactions.ID = ${TransactionId}`);
        }
        if (oInvoice.ID) {
            const oTotalAmount = await cds_1.default.run(SELECT.one `coalesce(sum(Transactions.Amount),0) as TotalAmount`
                .from(oInvoiceEntity)
                .where({ ID: oInvoice.ID }));
            await cds_1.default.update(oInvoiceEntity, oInvoice.ID).with({ TotalAmount: oTotalAmount.TotalAmount });
        }
    }
    async updateTotalAmountById(Id) {
        let oInvoiceEntity = this.getEntity();
        const oTotalAmount = await cds_1.default.run(SELECT.one `coalesce(sum(Transactions.Amount),0) as TotalAmount`
            .from(oInvoiceEntity)
            .where({ ID: Id }));
        await cds_1.default.update(oInvoiceEntity, Id).with({ TotalAmount: oTotalAmount.TotalAmount });
    }
    async update(Id, fields) {
        let oInvoiceEntity = this.getEntity();
        if (fields) {
            await cds_1.default.update(oInvoiceEntity, Id).with(fields);
        }
    }
    getReportBaseSql(ignoreDraft) {
        const oInvoiceEntity = this.getEntity(ignoreDraft || false);
        return SELECT.from(oInvoiceEntity);
    }
    mapInvoiceResult(Invoices) {
        if (Invoices.length === 0) {
            return null;
        }
        return invoice_1.InvoiceModel.mapModel(Invoices);
    }
    getEntity(ignoreDraft) {
        return ServiceLocator_1.ServiceLocator.getEntity('Invoices', ignoreDraft);
    }
    personPath() {
        return 'Card.Person';
    }
}
exports.InvoiceRepositoryImplementation = InvoiceRepositoryImplementation;
//# sourceMappingURL=implementation.js.map