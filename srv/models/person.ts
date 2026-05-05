import Decimal from 'decimal.js';
import { ShareModel } from '@/models/share';
import { CategoryModel } from '@/models/category';
import { CardModel } from '@/models/card';
import { Readable } from 'stream';
import { CurrencyModel } from './currency';
import { Person, Persons } from '@models/apps/dflc/expensemanager/entities';
import { BaseModel } from './base';

type PersonProperties = {
    Id: string;
    Name: string;
    Image: Readable;
    ImageType: string;
    Income: Decimal;
    Currency?: CurrencyModel;
    Email: string;
    Phone: string;
    ExpenseTarget: Decimal;
    AmountToSave: Decimal;
    TotalExpenses: Decimal;
    TotalExpensesMonth: Decimal;
    TotalExpensesPayed: Decimal;
    TotalExpensesToPay: Decimal;
    TotalExpensesClosed: Decimal;
    MonthCriticallity: number;
    CriticallityToPay: number;
    Shares?: ShareModel[];
    Categories?: CategoryModel[];
    Cards?: CardModel[];
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class PersonModel extends BaseModel {

    constructor(private props: PersonProperties) { super() }

    public static with(properties: PersonProperties): PersonModel {
        return new PersonModel(properties);
    }

    public static singleModel(properties: Person): PersonModel {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(Persons: Persons): PersonModel[] {

        return Persons?.map((Person: Person) => {

            const oCurrencyModel = CurrencyModel.singleModel({
                ...Person?.Currency,
                code: Person?.Currency?.code || Person?.Currency_code as string
            });

            return PersonModel.with({
                Id: Person.ID as string,
                Name: Person.Name as string,
                Image: Person?.Image as Readable,
                ImageType: Person.ImageType as string,
                Income: this.retrieveDecimal(Person.Income),
                Currency: oCurrencyModel,
                Email: Person.Email as string,
                Phone: Person.Phone as string,
                ExpenseTarget: this.retrieveDecimal(Person.ExpenseTarget),
                AmountToSave: this.retrieveDecimal(Person.AmountToSave),
                TotalExpenses: this.retrieveDecimal(Person.TotalExpenses),
                TotalExpensesMonth: this.retrieveDecimal(Person.TotalExpensesMonth),
                TotalExpensesPayed: this.retrieveDecimal(Person.TotalExpensesPayed),
                TotalExpensesToPay: this.retrieveDecimal(Person.TotalExpensesToPay),
                TotalExpensesClosed: this.retrieveDecimal(Person.TotalExpensesClosed),
                MonthCriticallity: Person.MonthCriticallity as number,
                CriticallityToPay: Person.CriticallityToPay as number,
                Shares: ShareModel?.mapModel(Person?.Shares || []),
                Categories: CategoryModel?.mapModel(Person?.Categories || []),
                Cards: CardModel?.mapModel(Person?.Cards || []),
                CreatedAt: Person.createdAt as string,
                CreatedBy: Person.createdBy as string,
                ModifiedAt: Person.modifiedAt as string,
                ModifiedBy: Person.modifiedBy as string
            });

        });

    }

    public get Id() {

        return this.props.Id;

    }

    public get Name() {

        return this.props.Name;

    }

    public get Image() {

        return this.props.Image;

    }

    public get ImageType() {

        return this.props.ImageType;

    }

    public get Income() {

        return this.props.Income;

    }

    public get Currency() {

        return this.props.Currency;

    }

    public get Email() {

        return this.props.Email;

    }

    public get Phone() {

        return this.props.Phone;

    }

    public get Shares() {

        return this.props.Shares;

    }

    public get ExpenseTarget() {

        return this.props.ExpenseTarget;

    }

    public get AmountToSave() {

        return this.props.AmountToSave;

    }

    public get TotalExpenses() {

        return this.props.TotalExpenses;

    }

    public get TotalExpensesMonth() {

        return this.props.TotalExpensesMonth;

    }

    public get TotalExpensesPayed() {

        return this.props.TotalExpensesPayed;

    }

    public get TotalExpensesToPay() {

        return this.props.TotalExpensesToPay;

    }

    public get TotalExpensesClosed() {

        return this.props.TotalExpensesClosed;

    }

    public get MonthCriticallity() {

        return this.props.MonthCriticallity;

    }

    public get CriticallityToPay() {

        return this.props.CriticallityToPay;

    }

    public get Categories() {

        return this.props.Categories;

    }

    public get Cards() {

        return this.props.Cards;

    }

    public get CreatedAt() {

        return this.props.CreatedAt;

    }

    public get CreatedBy() {

        return this.props.CreatedBy;

    }

    public get ModifiedAt() {

        return this.props.ModifiedAt;

    }

    public get ModifiedBy() {

        return this.props.ModifiedBy;

    }

    public set Image(value: Readable) {

        this.props.Image = value;

    }

    public set ExpenseTarget(value: Decimal) {

        this.props.ExpenseTarget = value;

    }

    public set AmountToSave(value: Decimal) {

        this.props.AmountToSave = value;

    }

    public set TotalExpenses(value: Decimal) {

        this.props.TotalExpenses = value;

    }

    public set TotalExpensesMonth(value: Decimal) {

        this.props.TotalExpensesMonth = value;

    }

    public set TotalExpensesPayed(value: Decimal) {

        this.props.TotalExpensesPayed = value;

    }

    public set TotalExpensesToPay(value: Decimal) {

        this.props.TotalExpensesToPay = value;

    }

    public set TotalExpensesClosed(value: Decimal) {

        this.props.TotalExpensesClosed = value;

    }

    public set MonthCriticallity(value: number) {

        this.props.MonthCriticallity = value;

    }

    public set CriticallityToPay(value: number) {

        this.props.CriticallityToPay = value;

    }

    public setDefaultEmailDomain() {

        if (!this.props.Email?.includes("@")) {

            this.props.Email = `${this.props.Email}@gmail.com`;

        }

    }

    public toObject(): PersonProperties {

        return this.props;

    }

    public toEntityObject(): Person {

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
            Shares: this.props.Shares?.map((Share)=> Share.toEntityObject()),
            Categories: this.props.Categories?.map((Category)=> Category.toEntityObject()),
            Cards: this.props.Cards?.map((Card)=> Card.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });

    }

}