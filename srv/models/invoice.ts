// entity Invoices : cuid, managed {
//     Year         : Integer;
//     Month        : Integer;
//     Description  : String(255);
//     TotalAmount  : Decimal;
//     Currency     : Currency;
//     InvoiceSent  : Boolean;
//     Card         : Association to Cards;
//     Transactions : Composition of many Transactions on Transactions.Invoice = $self
// }

import Decimal from 'decimal.js';
import { CurrencyModel } from '@/models/currency';
import { TransactionModel } from '@/models/transaction';

type InvoiceProperties = {
    Id: string;
    Year: number;
    Month: number;
    Description: string;
    TotalAmount: Decimal;
    Currency: CurrencyModel;
    InvoiceSent: boolean;
    Transactions: TransactionModel[];
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class InvoiceModel {

    constructor(private props: InvoiceProperties) { }

    public get Id() {

        return this.props.Id;

    }

    public get Year() {

        return this.props.Year;

    }

    public get Month() {

        return this.props.Month;

    }

    public get Description() {

        return this.props.Description;

    }

    public get TotalAmount() {

        return this.props.TotalAmount;

    }

    public get Currency() {

        return this.props.Currency;

    }

    public get InvoiceSent() {

        return this.props.InvoiceSent;

    }

    public get Transactions() {

        return this.props.Transactions;

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

}