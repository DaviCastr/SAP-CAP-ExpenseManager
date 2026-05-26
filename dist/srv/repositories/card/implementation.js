"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const card_1 = require("@/models/card");
const implementation_1 = require("../base/implementation");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class CardRepositoryImplementation extends implementation_1.BaseRepositoryImplementation {
    async findById(Id) {
        let oCardEntity = this.getEntity();
        let oSql = SELECT.from(oCardEntity).where({ ID: Id });
        let oCards = await cds_1.default.run(oSql);
        if (oCardEntity?.isDraft) {
            oCardEntity = this.getEntity(true);
            oSql = SELECT.from(oCardEntity).where({ Id: Id });
            const additionalCards = await cds_1.default.run(oSql) || [];
            oCards = [...(oCards || []), ...additionalCards];
        }
        const oCardsModel = this.mapCardResult(oCards);
        return oCardsModel?.[0];
    }
    async findByIds(Ids, additionalFilters) {
        let oCardEntity = this.getEntity();
        let oSql = SELECT.from(oCardEntity).where({ ID: { in: Ids }, ...additionalFilters });
        let oCards = await cds_1.default.run(oSql);
        if (oCardEntity?.isDraft) {
            oCardEntity = this.getEntity(true);
            oSql = SELECT.from(oCardEntity).where({ ID: { in: Ids }, ...additionalFilters });
            const additionalCardts = await cds_1.default.run(oSql) || [];
            oCards = [...(oCards || []), ...additionalCardts];
        }
        const oCardsModel = this.mapCardResult(oCards);
        return oCardsModel;
    }
    async findByPersonId(PersonId) {
        let oCardEntity = this.getEntity();
        let oSql = SELECT.from(oCardEntity).where({ Person_ID: PersonId });
        let oCards = await cds_1.default.run(oSql);
        if (oCardEntity?.isDraft) {
            oCardEntity = this.getEntity(true);
            oSql = SELECT.from(oCardEntity).where({ Person_ID: PersonId });
            const additionalCards = await cds_1.default.run(oSql) || [];
            oCards = [...(oCards || []), ...additionalCards];
        }
        const oCardsModel = this.mapCardResult(oCards);
        return oCardsModel;
    }
    async findByPersonIds(PersonIds, additionalFilters) {
        let oCardEntity = this.getEntity();
        let oSql = SELECT.from(oCardEntity).where({ Person_ID: { 'in': PersonIds }, ...additionalFilters });
        let oCards = await cds_1.default.run(oSql);
        if (oCardEntity?.isDraft) {
            oCardEntity = this.getEntity(true);
            oSql = SELECT.from(oCardEntity).where({ Person_ID: { 'in': PersonIds }, ...additionalFilters });
            const additionalCards = await cds_1.default.run(oSql) || [];
            oCards = [...(oCards || []), ...additionalCards];
        }
        const oCardsModel = this.mapCardResult(oCards);
        return oCardsModel;
    }
    async findByInvoiceIds(InvoiceIds) {
        let oCardEntity = this.getEntity();
        let invoiceIds = Array.isArray(InvoiceIds) ? InvoiceIds : [InvoiceIds];
        let oSql = SELECT.from(oCardEntity).where `Invoices.ID in ${invoiceIds}`;
        let oCards = await cds_1.default.run(oSql);
        if (oCardEntity?.isDraft) {
            oCardEntity = this.getEntity(true);
            oSql = SELECT.from(oCardEntity).where `Invoices.ID in ${invoiceIds}`;
            const additionalCardts = await cds_1.default.run(oSql) || [];
            oCards = [...(oCards || []), ...additionalCardts];
        }
        const oCardsModel = this.mapCardResult(oCards);
        return oCardsModel;
    }
    async retrieveCompleteInvoiceTransactions(PersonId, Year, Month) {
        const { Cards } = cds_1.default.entities;
        let rows = await SELECT.from(Cards)
            .columns('ID as CardID', 'Name as CardName', 'ImageType as CardImageType', 'Invoices.ID as InvoiceID', 'Invoices.Transactions.ID as TransactionID', 'Invoices.Transactions.Identifier as Identifier', 'Invoices.Transactions.Date as Date', 'Invoices.Transactions.Amount as Amount', 'Invoices.Transactions.TotalAmount as TotalAmount', 'Invoices.Transactions.Installment as Installment', 'Invoices.Transactions.TotalInstallments as TotalInstallments', 'Invoices.Transactions.Description as Description', 'Invoices.Transactions.Category_ID as CategoryID', 'Invoices.Transactions.Category.Name as CategoryName', 'Invoices.Transactions.Category.ImageType as CategoryImageType', 'Currency_code as CurrencyCode')
            .where({
            Person_ID: PersonId,
            'Invoices.Year': Year,
            'Invoices.Month': Month
        })
            .orderBy([
            { ref: ['ID'], sort: 'asc' },
            {
                ref: [
                    'Invoices',
                    'Transactions',
                    'Date'
                ],
                sort: 'asc'
            }
        ]);
        return rows || [];
    }
    async createEntry(data) {
        let oCardEntity = this.getEntity();
        let oSql = INSERT.into(oCardEntity).entries(data);
        await cds_1.default.run(oSql);
        return this.mapCardResult(Array.isArray(data) ? data : [data]);
    }
    mapCardResult(Cards) {
        if (Cards.length === 0) {
            return null;
        }
        return card_1.CardModel.mapModel(Cards);
    }
    getEntity(ignoreDraft = false) {
        return ServiceLocator_1.ServiceLocator.getEntity('Cards', ignoreDraft);
    }
    personPath() {
        return 'Person';
    }
}
exports.CardRepositoryImplementation = CardRepositoryImplementation;
//# sourceMappingURL=implementation.js.map