"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const currency_1 = require("@/models/currency");
const base_1 = require("./base");
class TransactionModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new TransactionModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(Transactions) {
        return Transactions?.map((Transaction) => {
            const oCurrencyModel = currency_1.CurrencyModel.singleModel({
                ...Transaction?.Currency,
                code: Transaction?.Currency?.code || Transaction?.Currency_code
            });
            return TransactionModel.with({
                Id: Transaction.ID,
                Identifier: Transaction.Identifier,
                Date: Transaction.Date,
                TotalAmount: this.retrieveDecimal(Transaction.TotalAmount),
                Amount: this.retrieveDecimal(Transaction.Amount),
                Currency: oCurrencyModel,
                TotalInstallments: Transaction.TotalInstallments,
                Installment: Transaction.Installment,
                Description: Transaction.Description,
                InvoiceId: Transaction.Invoice_ID || Transaction?.Invoice?.ID,
                CategoryId: Transaction.Category_ID || Transaction?.Category?.ID,
                CreatedAt: Transaction.createdAt,
                CreatedBy: Transaction.createdBy,
                ModifiedAt: Transaction.modifiedAt,
                ModifiedBy: Transaction.modifiedBy
            });
        });
    }
    get Id() {
        return this.props.Id;
    }
    get Identifier() {
        return this.props.Identifier;
    }
    get Date() {
        return this.props.Date;
    }
    get TotalAmount() {
        return this.props.TotalAmount;
    }
    get Amount() {
        return this.props.Amount;
    }
    get Currency() {
        return this.props.Currency;
    }
    get TotalInstallments() {
        return this.props.TotalInstallments;
    }
    get Installment() {
        return this.props.Installment;
    }
    get Description() {
        return this.props.Description;
    }
    get InvoiceId() {
        return this.props.InvoiceId;
    }
    get CategoryId() {
        return this.props.CategoryId;
    }
    get CreatedAt() {
        return this.props.CreatedAt;
    }
    get CreatedBy() {
        return this.props.CreatedBy;
    }
    get ModifiedAt() {
        return this.props.ModifiedAt;
    }
    get ModifiedBy() {
        return this.props.ModifiedBy;
    }
    set TotalAmount(TotalAmount) {
        this.props.TotalAmount = TotalAmount;
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            ID: this.props.Id,
            Identifier: this.props.Identifier,
            Date: this.props.Date,
            TotalAmount: this.props.TotalAmount?.toNumber(),
            Amount: this.props.Amount?.toNumber(),
            Currency: this.props.Currency?.toEntityObject(),
            TotalInstallments: this.props.TotalInstallments,
            Installment: this.props.Installment,
            Description: this.props.Description,
            Invoice: { ID: this.props.InvoiceId },
            Category: { ID: this.props.CategoryId },
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });
    }
}
exports.TransactionModel = TransactionModel;
//# sourceMappingURL=transaction.js.map