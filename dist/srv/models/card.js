"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardModel = void 0;
const currency_1 = require("@/models/currency");
const invoice_1 = require("@/models/invoice");
const base_1 = require("./base");
class CardModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new CardModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(Cards) {
        return Cards?.map((Card) => {
            const oCurrencyModel = currency_1.CurrencyModel.singleModel({
                ...Card?.Currency,
                code: Card?.Currency?.code || Card?.Currency_code
            });
            return CardModel.with({
                Id: Card.ID,
                Name: Card.Name,
                Image: Card.Image,
                ImageType: Card.ImageType,
                Limit: this.retrieveDecimal(Card.Limit),
                Currency: oCurrencyModel,
                AvailableLimit: this.retrieveDecimal(Card.AvailableLimit),
                DueDay: Card.DueDay,
                ClosingDay: Card.ClosingDay,
                InvoiceAmountForPayment: this.retrieveDecimal(Card.InvoiceAmountForPayment),
                InvoiceAmountToPay: this.retrieveDecimal(Card.InvoiceAmountToPay),
                PersonId: Card?.Person?.ID || Card?.Person_ID,
                Invoices: invoice_1.InvoiceModel.mapModel(Card?.Invoices || []),
                CreatedAt: Card.createdAt,
                CreatedBy: Card.createdBy,
                ModifiedAt: Card.modifiedAt,
                ModifiedBy: Card.modifiedBy
            });
        });
    }
    get Id() {
        return this.props.Id;
    }
    get Name() {
        return this.props.Name;
    }
    get Image() {
        return this.props.Image;
    }
    get ImageType() {
        return this.props.ImageType;
    }
    get Limit() {
        return this.props.Limit;
    }
    get Currency() {
        return this.props.Currency;
    }
    get AvailableLimit() {
        return this.props.AvailableLimit;
    }
    get DueDay() {
        return this.props.DueDay;
    }
    get ClosingDay() {
        return this.props.ClosingDay;
    }
    get InvoiceAmountForPayment() {
        return this.props.InvoiceAmountForPayment;
    }
    get InvoiceAmountToPay() {
        return this.props.InvoiceAmountToPay;
    }
    get PersonId() {
        return this.props.PersonId;
    }
    get Invoices() {
        return this.props.Invoices;
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
    set Image(value) {
        this.props.Image = value;
    }
    set AvailableLimit(availableLimit) {
        this.props.AvailableLimit = availableLimit;
    }
    set InvoiceAmountToPay(InvoiceAmountToPay) {
        this.props.InvoiceAmountToPay = InvoiceAmountToPay;
    }
    set InvoiceAmountForPayment(invoiceAmountForPayment) {
        this.props.InvoiceAmountForPayment = invoiceAmountForPayment;
    }
    set ClosingDay(closingDay) {
        this.props.ClosingDay = closingDay;
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            ID: this.props.Id,
            Name: this.props.Name,
            Image: this.props.Image,
            ImageType: this.props.ImageType,
            Limit: this.props.Limit?.toNumber(),
            Currency: this.Currency?.toEntityObject(),
            AvailableLimit: this.props.AvailableLimit?.toNumber(),
            DueDay: this.props.DueDay,
            ClosingDay: this.props.ClosingDay,
            InvoiceAmountForPayment: this.props.InvoiceAmountForPayment?.toNumber(),
            InvoiceAmountToPay: this.props.InvoiceAmountToPay?.toNumber(),
            Person: { ID: this.props.PersonId },
            Invoices: this.props.Invoices?.map((item) => item?.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });
    }
}
exports.CardModel = CardModel;
//# sourceMappingURL=card.js.map