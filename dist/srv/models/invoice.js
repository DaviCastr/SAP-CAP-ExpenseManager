"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModel = void 0;
const currency_1 = require("@/models/currency");
const transaction_1 = require("./transaction");
const base_1 = require("./base");
class InvoiceModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new InvoiceModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(Invoices) {
        const oInvoicesModel = Invoices?.map((Invoice) => {
            const oCurrencyModel = currency_1.CurrencyModel.singleModel({
                ...Invoice?.Currency,
                code: Invoice?.Currency?.code || Invoice?.Currency_code
            });
            return InvoiceModel.with({
                Id: Invoice?.ID,
                Year: Invoice?.Year,
                Month: Invoice?.Month,
                Description: Invoice?.Description,
                TotalAmount: this.retrieveDecimal(Invoice?.TotalAmount),
                Currency: oCurrencyModel,
                InvoiceSent: Invoice?.InvoiceSent,
                CardId: Invoice?.Card_ID || Invoice?.Card?.ID,
                Transactions: transaction_1.TransactionModel.mapModel(Invoice?.Transactions || []),
                CreatedAt: Invoice?.createdAt,
                CreatedBy: Invoice?.createdBy,
                ModifiedAt: Invoice?.modifiedAt,
                ModifiedBy: Invoice?.modifiedBy
            });
        });
        return oInvoicesModel || [];
    }
    get Id() {
        return this.props.Id;
    }
    get Year() {
        return this.props.Year;
    }
    get Month() {
        return this.props.Month;
    }
    get Description() {
        return this.props.Description;
    }
    get TotalAmount() {
        return this.props.TotalAmount;
    }
    get Currency() {
        return this.props.Currency;
    }
    get InvoiceSent() {
        return this.props.InvoiceSent;
    }
    get CardId() {
        return this.props.CardId;
    }
    get Transactions() {
        return this.props.Transactions;
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
    set Description(description) {
        this.props.Description = description;
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            ID: this.props.Id,
            Year: this.props.Year,
            Month: this.props.Month,
            TotalAmount: this.props.TotalAmount?.toNumber(),
            Description: this.props.Description,
            Currency: this.props.Currency.toEntityObject(),
            InvoiceSent: this.props.InvoiceSent,
            Card: { ID: this.props.CardId },
            Transactions: this.props.Transactions?.map((item) => item.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });
    }
}
exports.InvoiceModel = InvoiceModel;
//# sourceMappingURL=invoice.js.map