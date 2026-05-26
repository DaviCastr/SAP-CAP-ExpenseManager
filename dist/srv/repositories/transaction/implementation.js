"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepositoryImplementation = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const transaction_1 = require("@/models/transaction");
const implementation_1 = require("../base/implementation");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class TransactionRepositoryImplementation extends implementation_1.BaseRepositoryImplementation {
    async findById(Id) {
        let oSql = this.getReportBaseSql();
        oSql.where({ ID: Id });
        let oTransactions = await cds_1.default.run(oSql);
        if (this.getEntity()?.isDraft) {
            oSql = this.getReportBaseSql(true);
            oSql.where({ ID: Id });
            const additionalTransactions = await cds_1.default.run(oSql) || [];
            oTransactions = [...(oTransactions || []), ...additionalTransactions];
        }
        const oTransactionsModel = await this.mapTransactionResult(oTransactions);
        if (Array.isArray(oTransactionsModel)) {
            return oTransactionsModel[0];
        }
        return null;
    }
    async findByIds(Ids) {
        let oTransactionEntity = this.getEntity();
        let oSql = SELECT.from(oTransactionEntity).where({ ID: { in: Ids } });
        let oTransactions = await cds_1.default.run(oSql);
        if (oTransactionEntity?.isDraft) {
            oTransactionEntity = this.getEntity(true);
            oSql = SELECT.from(oTransactionEntity).where({ ID: { in: Ids } });
            const additionalTransactionts = await cds_1.default.run(oSql) || [];
            oTransactions = [...(oTransactions || []), ...additionalTransactionts];
        }
        const oTransactionsModel = this.mapTransactionResult(oTransactions);
        return oTransactionsModel;
    }
    async findByCategoryID(CategoryID, Limit) {
        let oSql = this.getReportBaseSql();
        oSql.where({ Category_ID: CategoryID });
        if (Limit != 0 && Limit) {
            oSql.limit(Limit);
        }
        let oTransactions = await cds_1.default.run(oSql);
        if (this.getEntity()?.isDraft) {
            oSql = this.getReportBaseSql(true);
            oSql.where({ Category_ID: CategoryID });
            if (Limit != 0 && Limit) {
                oSql.limit(Limit);
            }
            const additionalTransactions = await cds_1.default.run(oSql) || [];
            oTransactions = [...(oTransactions || []), ...additionalTransactions];
        }
        const oTransactionsModel = await this.mapTransactionResult(oTransactions);
        return oTransactionsModel;
    }
    async findByInvoiceIds(InvoiceIds, additionalFilters, Limit) {
        let oSql = this.getReportBaseSql();
        const invoiceIds = Array.isArray(InvoiceIds) ? InvoiceIds : [InvoiceIds];
        oSql.where({ Invoice_ID: { in: invoiceIds }, ...additionalFilters });
        if (Limit != 0 && Limit) {
            oSql.limit(Limit);
        }
        let oTransactions = await cds_1.default.run(oSql);
        if (this.getEntity()?.isDraft) {
            oSql = this.getReportBaseSql(true);
            oSql.where({ Invoice_ID: { in: invoiceIds }, ...additionalFilters });
            if (Limit != 0 && Limit) {
                oSql.limit(Limit);
            }
            const additionalTransactions = await cds_1.default.run(oSql) || [];
            oTransactions = [...(oTransactions || []), ...additionalTransactions];
        }
        const oTransactionsModel = await this.mapTransactionResult(oTransactions);
        return oTransactionsModel;
    }
    async retrieveTotalAmountByInvoiceIds(InvoiceIds, additionalFilters) {
        const oTransactionEntity = this.getEntity();
        let invoiceIds = Array.isArray(InvoiceIds) ? InvoiceIds : [InvoiceIds];
        let oSql = SELECT.one('Currency_code, coalesce(sum(Amount), 0) as TotalAmount')
            .from(oTransactionEntity)
            .where `Invoice.ID in ${invoiceIds}`;
        if (additionalFilters) {
            oSql.where(additionalFilters);
        }
        const oTransaction = await cds_1.default.run(oSql);
        const oTransactionModel = await this.mapTransactionResult([oTransaction]);
        return oTransactionModel?.[0];
    }
    async retrieveTotalsGroupedByCategory(invoiceIds) {
        const entity = this.getEntity();
        const result = await cds_1.default.run(SELECT.from(entity)
            .columns([
            'Category_ID',
            'Currency_code',
            `coalesce(sum(Amount), 0) as TotalAmount`
        ])
            .where({ Invoice_ID: { in: invoiceIds } })
            .groupBy('Category_ID', 'Currency_code'));
        return this.mapTransactionResult(result);
    }
    async createEntry(data) {
        let oTransactionEntity = this.getEntity();
        let oSql = INSERT.into(oTransactionEntity).entries(data);
        await cds_1.default.run(oSql);
        return this.mapTransactionResult(Array.isArray(data) ? data : [data], true);
    }
    getReportBaseSql(ignoreDraft) {
        const oTransactionEntity = this.getEntity(ignoreDraft);
        return SELECT.from(oTransactionEntity);
    }
    getEntity(ignoreDraft) {
        return ServiceLocator_1.ServiceLocator.getEntity('Transactions', ignoreDraft);
    }
    personPath() {
        return 'Invoice.Transaction.Person';
    }
    async mapTransactionResult(Transactions, ignoreTotalAmount) {
        if (Transactions.length === 0) {
            return null;
        }
        const oTransactionsModel = [];
        let totalAmounts = new Map;
        for (let Transaction of Transactions) {
            if (!ignoreTotalAmount && (!Transaction.TotalAmount || Transaction.TotalAmount == 0) && Transaction?.Identifier) {
                const totalAmount = totalAmounts.get(Transaction?.Identifier);
                if (totalAmount != null) {
                    Transaction.TotalAmount = totalAmount;
                }
                else {
                    const oTotalAmountData = await this.selectTotalAmount(Transaction);
                    Transaction.Identifier = oTotalAmountData.Identifier;
                    Transaction.TotalAmount = oTotalAmountData.TotalAmount;
                    totalAmounts.set(Transaction.Identifier, Transaction.TotalAmount);
                }
            }
            oTransactionsModel.push(transaction_1.TransactionModel.singleModel(Transaction));
        }
        ;
        return oTransactionsModel;
    }
    async selectTotalAmount(Transaction) {
        const oTransactionEntity = this.getEntity();
        const returnTotalAmount = async (Identifier) => {
            const oTotalAmount = await cds_1.default.run(SELECT.one `Identifier, coalesce(sum(TotalAmount),0) as TotalAmount`
                .from(oTransactionEntity)
                .where({ Identifier: Identifier }));
            return {
                Identifier: Identifier,
                TotalAmount: oTotalAmount?.TotalAmount ?? 0
            };
        };
        if (Transaction.Identifier) {
            return returnTotalAmount(Transaction.Identifier);
        }
        else {
            const oIdentifier = await cds_1.default
                .run(SELECT.one
                .from(oTransactionEntity)
                .columns('Identifier')
                .where({ ID: Transaction.ID }));
            return returnTotalAmount(oIdentifier?.Identifier);
        }
    }
}
exports.TransactionRepositoryImplementation = TransactionRepositoryImplementation;
//# sourceMappingURL=implementation.js.map