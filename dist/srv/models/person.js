"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonModel = void 0;
const share_1 = require("@/models/share");
const category_1 = require("@/models/category");
const card_1 = require("@/models/card");
const currency_1 = require("./currency");
const base_1 = require("./base");
class PersonModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new PersonModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(Persons) {
        return Persons?.map((Person) => {
            const oCurrencyModel = currency_1.CurrencyModel.singleModel({
                ...Person?.Currency,
                code: Person?.Currency?.code || Person?.Currency_code
            });
            return PersonModel.with({
                Id: Person.ID,
                Name: Person.Name,
                Image: Person?.Image,
                ImageType: Person.ImageType,
                Income: this.retrieveDecimal(Person.Income),
                Currency: oCurrencyModel,
                Email: Person.Email,
                Phone: Person.Phone,
                ExpenseTarget: this.retrieveDecimal(Person.ExpenseTarget),
                AmountToSave: this.retrieveDecimal(Person.AmountToSave),
                TotalExpenses: this.retrieveDecimal(Person.TotalExpenses),
                TotalExpensesMonth: this.retrieveDecimal(Person.TotalExpensesMonth),
                TotalExpensesPayed: this.retrieveDecimal(Person.TotalExpensesPayed),
                TotalExpensesToPay: this.retrieveDecimal(Person.TotalExpensesToPay),
                TotalExpensesClosed: this.retrieveDecimal(Person.TotalExpensesClosed),
                MonthCriticallity: Person.MonthCriticallity,
                CriticallityToPay: Person.CriticallityToPay,
                Shares: share_1.ShareModel?.mapModel(Person?.Shares || []),
                Categories: category_1.CategoryModel?.mapModel(Person?.Categories || []),
                Cards: card_1.CardModel?.mapModel(Person?.Cards || []),
                CreatedAt: Person.createdAt,
                CreatedBy: Person.createdBy,
                ModifiedAt: Person.modifiedAt,
                ModifiedBy: Person.modifiedBy
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
    get Income() {
        return this.props.Income;
    }
    get Currency() {
        return this.props.Currency;
    }
    get Email() {
        return this.props.Email;
    }
    get Phone() {
        return this.props.Phone;
    }
    get Shares() {
        return this.props.Shares;
    }
    get ExpenseTarget() {
        return this.props.ExpenseTarget;
    }
    get AmountToSave() {
        return this.props.AmountToSave;
    }
    get TotalExpenses() {
        return this.props.TotalExpenses;
    }
    get TotalExpensesMonth() {
        return this.props.TotalExpensesMonth;
    }
    get TotalExpensesPayed() {
        return this.props.TotalExpensesPayed;
    }
    get TotalExpensesToPay() {
        return this.props.TotalExpensesToPay;
    }
    get TotalExpensesClosed() {
        return this.props.TotalExpensesClosed;
    }
    get MonthCriticallity() {
        return this.props.MonthCriticallity;
    }
    get CriticallityToPay() {
        return this.props.CriticallityToPay;
    }
    get Categories() {
        return this.props.Categories;
    }
    get Cards() {
        return this.props.Cards;
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
    set ExpenseTarget(value) {
        this.props.ExpenseTarget = value;
    }
    set AmountToSave(value) {
        this.props.AmountToSave = value;
    }
    set TotalExpenses(value) {
        this.props.TotalExpenses = value;
    }
    set TotalExpensesMonth(value) {
        this.props.TotalExpensesMonth = value;
    }
    set TotalExpensesPayed(value) {
        this.props.TotalExpensesPayed = value;
    }
    set TotalExpensesToPay(value) {
        this.props.TotalExpensesToPay = value;
    }
    set TotalExpensesClosed(value) {
        this.props.TotalExpensesClosed = value;
    }
    set MonthCriticallity(value) {
        this.props.MonthCriticallity = value;
    }
    set CriticallityToPay(value) {
        this.props.CriticallityToPay = value;
    }
    setDefaultEmailDomain() {
        if (!this.props.Email?.includes("@")) {
            this.props.Email = `${this.props.Email}@gmail.com`;
        }
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
            Income: this.props.Income?.toNumber(),
            Currency: this.props.Currency?.toEntityObject(),
            Email: this.props.Email,
            Phone: this.props.Phone,
            ExpenseTarget: this.props.ExpenseTarget?.toNumber(),
            AmountToSave: this.props.AmountToSave?.toNumber(),
            TotalExpenses: this.props.TotalExpenses?.toNumber(),
            TotalExpensesMonth: this.props.TotalExpensesMonth?.toNumber(),
            TotalExpensesPayed: this.props.TotalExpensesPayed?.toNumber(),
            TotalExpensesToPay: this.props.TotalExpensesToPay?.toNumber(),
            TotalExpensesClosed: this.props.TotalExpensesClosed?.toNumber(),
            MonthCriticallity: this.props.MonthCriticallity,
            CriticallityToPay: this.props.CriticallityToPay,
            Shares: this.props.Shares?.map((Share) => Share.toEntityObject()),
            Categories: this.props.Categories?.map((Category) => Category.toEntityObject()),
            Cards: this.props.Cards?.map((Card) => Card.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });
    }
}
exports.PersonModel = PersonModel;
//# sourceMappingURL=person.js.map