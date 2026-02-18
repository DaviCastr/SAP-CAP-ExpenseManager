// entity Transactions : cuid, managed {
//     Indentifier       : UUID;
//     Date              : Date;
//     TotalAmount       : Decimal;
//     Amount            : Decimal;
//     Currency          : Currency;
//     TotalInstallments : Integer;
//     Installment       : Integer;
//     Description       : String(255);
//     Invoice           : Association to Invoices @mandatory; //@assert.target
//     Category          : Association to Categories
// }

import Decimal from 'decimal.js';
import { CurrencyModel } from '@/models/currency';

type TransactionProperties = {
    Id: string;
    Identifier: string;
    Date: string;
    TotalAmount: Decimal;
    Amount: Decimal;
    Currency: CurrencyModel;
    TotalInstallments: number;
    Installment: number;
    Description: string;
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class TransactionModel {

    constructor(private props: TransactionProperties) { }

    public static with(properties: TransactionProperties): TransactionModel {

        return new TransactionModel(properties);
    
    }

    public get Id() {

        return this.props.Id;

    }

    public get Identifier() {

        return this.props.Identifier;

    }

    public get Date() {

        return this.props.Date;

    }

    public get TotalAmount() {

        return this.props.TotalAmount;

    }

    public get Amount() {

        return this.props.Amount;

    }

    public get Currency() {

        return this.props.Currency;

    }

    public get TotalInstallments() {

        return this.props.TotalInstallments;

    }

    public get Installment() {

        return this.props.Installment;

    }

    public get Description() {

        return this.props.Description;

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