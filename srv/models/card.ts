// entity Cards : cuid, managed {
//         Name                    : String(50);
//         Image                   : LargeBinary;
//         ImageType               : String;
//         Limit                   : Decimal;
//         Currency                : Currency;
// virtual AvailableLimit          : Decimal;
//         DueDay                  : Integer;
//         ClosingDay              : Integer;
// virtual InvoiceAmountForPayment : Decimal;
// virtual OpenInvoiceAmount       : Decimal;
//         Invoice                 : Composition of many Invoices on Invoice.Card = $self;
//         Person                  : Association to Persons @mandatory; // @assert.target
// }

import Decimal from 'decimal.js';
import { CurrencyModel } from '@/models/currency';
import { InvoiceModel } from '@/models/invoice';

type CardProperties = {
    Id: string;
    Name: string;
    Image: Buffer;
    ImageType: string;
    Limit: Decimal;
    Currency: CurrencyModel;
    AvailableLimit: Decimal;
    DueDay: number;
    ClosingDay: number;
    InvoiceAmountForPayment: Decimal;
    OpenInvoiceAmount: Decimal;
    Invoices: InvoiceModel[];
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class CardModel {

    constructor(private props: CardProperties) { }

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

    public get Limit() {

        return this.props.Limit;

    }

    public get Currency() {

        return this.props.Currency;

    }

    public get AvailableLimit() {

        return this.props.AvailableLimit;

    }

    public get DueDay() {

        return this.props.DueDay;

    }

    public get ClosingDay() {

        return this.props.ClosingDay;

    }

    public get InvoiceAmountForPayment() {

        return this.props.InvoiceAmountForPayment;

    }

    public get OpenInvoiceAmount() {

        return this.props.OpenInvoiceAmount;

    }

    public get Invoices() {

        return this.props.Invoices;

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