// entity Persons : cuid, managed {
//             Name                : String(100)  @mandatory;
//             Image               : LargeBinary
//             ImageType           : String;
//             Income              : Decimal      @mandatory;
//             Currency            : Currency     @mandatory;
//             Email               : String(100)  @mandatory;
//             Phoene              : String(20);
//             Share               : Composition of many Shares on Share.Person = $self;
//             ExpenseTarget       : Decimal      @mandatory;
//     virtual AmountToSave        : Decimal;
//     virtual TotalExpenses       : Decimal;
//     virtual TotalExpensesMonth  : Decimal;
//     virtual TotalExpensesPayed  : Decimal;
//     virtual TotalExpensesToPay  : Decimal;
//     virtual TotalExpensesClosed : Decimal;
//     virtual MonthCriticallity   : Integer;
//     virtual CriticallityToPay   : Integer;
//             Category            : Composition of many Categories on Category.Person = $self;
//             Card                : Composition of many Cards on Card.Person = $self;
// }

import Decimal from 'decimal.js';
import { ShareModel } from '@/models/share';
import { CategoryModel } from '@/models/category';
import { CardModel } from '@/models/card';
import { Readable } from 'stream';

type PersonProperties = {
    Id: string;
    Name: string;
    Image?: Readable;
    ImageType: string;
    Income: Decimal;
    Currency: string;
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
    Share?: ShareModel[];
    Category?: CategoryModel[];
    Card?: CardModel[];  
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class PersonModel {

    constructor(private props: PersonProperties) { }

    public static with(properties: PersonProperties): PersonModel {
        return new PersonModel(properties);
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

    public get Share() {

        return this.props.Share;

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

    public get Category() {

        return this.props.Category;

    }

    public get Card() {

        return this.props.Card;

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

    public setDefaultEmailDomain() {

        if (!this.props.Email?.includes("@")) {

            this.props.Email = `${this.props.Email}@gmail.com`;

        }

    }

}