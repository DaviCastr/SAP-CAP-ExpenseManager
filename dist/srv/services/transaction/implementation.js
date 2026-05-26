"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServiceImplementation = void 0;
const errors_1 = require("@/errors");
const either_1 = require("@sweet-monads/either");
const transaction_1 = require("@/models/transaction");
const decimal_js_1 = __importDefault(require("decimal.js"));
const implementation_1 = require("../base/implementation");
const permission_denied_1 = require("@/errors/permission-denied");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class TransactionServiceImplementation extends implementation_1.BaseServiceImplementation {
    InvoiceRepository;
    Repository;
    constructor(PersonRepository, ShareRepository, EntityRepository, Repository, InvoiceRepository) {
        super(PersonRepository, ShareRepository, EntityRepository);
        this.InvoiceRepository = InvoiceRepository;
        this.Repository = Repository;
    }
    async onDelete(Transaction) {
        try {
            await this.InvoiceRepository.updateTotalAmountByTransactionId(Transaction?.ID);
            return (0, either_1.right)(undefined);
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    async afterRead(Transactions, User) {
        try {
            const result = await this.processAfterRead(Transactions, User);
            let oTransactionsFiltered = [];
            if (result.isRight())
                oTransactionsFiltered = result.value;
            else
                oTransactionsFiltered = [];
            let oTransactionReference = null;
            const oTransactionsData = [];
            for (let Transaction of oTransactionsFiltered) {
                const oTransactionModel = transaction_1.TransactionModel.singleModel(Transaction);
                if (oTransactionModel?.TotalAmount?.isZero() && 'TotalAmount' in Transaction) {
                    if (!oTransactionReference) {
                        oTransactionReference = await this.Repository.findById(oTransactionModel.Id);
                    }
                    else {
                        if (oTransactionModel?.Identifier != oTransactionReference?.Identifier) {
                            oTransactionReference = await this.Repository.findById(oTransactionModel.Id);
                        }
                    }
                    oTransactionModel.TotalAmount = oTransactionReference?.TotalAmount
                        ? oTransactionReference.TotalAmount
                        : new decimal_js_1.default(0);
                }
                const oTransactionData = oTransactionModel.toEntityObject();
                oTransactionsData.push({
                    ...oTransactionData
                });
            }
            ;
            return (0, either_1.right)(oTransactionsData);
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    async afterCreate(Transactions) {
        try {
            let oInvoiceID;
            for (const Transaction of Transactions) {
                if (oInvoiceID != Transaction?.Invoice_ID) {
                    await this.InvoiceRepository.updateTotalAmountByTransactionId(Transaction?.ID);
                    oInvoiceID = Transaction?.Invoice_ID;
                }
            }
            return (0, either_1.right)(undefined);
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    async afterUpdate(Transactions) {
        try {
            for (const Transaction of Transactions) {
                if ('TotalAmount' in Transaction || 'Amount' in Transaction) {
                    await this.InvoiceRepository.updateTotalAmountByTransactionId(Transaction?.ID);
                }
            }
            return (0, either_1.right)(undefined);
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    async checkPermission(Transaction, User, Permission) {
        const cache = ServiceLocator_1.ServiceLocator.getPermissionCache();
        const userId = User?.id;
        let personId = cache.personMap.get(Transaction.ID);
        if (!personId) {
            if (!Transaction?.Invoice_ID && !Transaction?.Invoice?.ID) {
                personId =
                    await this.Repository.findPersonIdById(Transaction?.ID);
            }
            else {
                let personIdByInvoice = cache.personMap.get(Transaction?.Invoice_ID || Transaction?.Invoice?.ID);
                personId =
                    personIdByInvoice ||
                        await this.InvoiceRepository.findPersonIdById((Transaction?.Invoice_ID || Transaction?.Invoice?.ID));
            }
            if (personId) {
                cache.personMap.set(Transaction.ID, personId);
            }
        }
        if (!personId) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.invalidPersonId', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                'error.invalidPersonId';
            return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
        }
        const key = ServiceLocator_1.ServiceLocator.buildPermissionKey(userId, personId, this.entityCode(), Permission);
        if (cache.permissionChecked.has(key)) {
            return (0, either_1.right)(true);
        }
        const result = await this.checkPermissionByPersonId(User, personId, Permission);
        if (result.isRight()) {
            cache.permissionChecked.add(key);
        }
        return result;
    }
    personPath() {
        return ['Invoice', 'Card', 'Person'];
    }
    entityCode() {
        return 7;
    }
    parentField() {
        return 'Invoice.ID';
    }
}
exports.TransactionServiceImplementation = TransactionServiceImplementation;
//# sourceMappingURL=implementation.js.map