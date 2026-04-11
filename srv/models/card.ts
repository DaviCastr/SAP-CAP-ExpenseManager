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
import { Readable } from "stream";
import Decimal from 'decimal.js';
import { CurrencyModel } from '@/models/currency';
import { InvoiceModel } from '@/models/invoice';
import { Card as CardEntityType } from '@models/apps/dflc/gestordegastos/entities';

type CardProperties = {
    Id: string;
    Name: string;
    Image: Readable;
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

type CardEntityProperties = CardEntityType;

export class CardModel {

    constructor(private props: CardProperties) { }

    public static with(properties: CardProperties): CardModel {

        return new CardModel(properties);

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

    public set AvailableLimit(availableLimit: Decimal) {

        this.props.AvailableLimit = availableLimit;

    }

    public set OpenInvoiceAmount(openInvoiceAmount: Decimal) {

        this.props.OpenInvoiceAmount = openInvoiceAmount;

    }

    public set InvoiceAmountForPayment(invoiceAmountForPayment: Decimal) {

        this.props.InvoiceAmountForPayment = invoiceAmountForPayment;

    }

    public set ClosingDay(closingDay:number) {

        this.props.ClosingDay = closingDay;

    }

    public toObject(): CardProperties {

        return this.props;

    }

    public toEntityObject(): CardEntityProperties {

        return {
            ID: this.props.Id,
            Name: this.props.Name,
            Image: this.props.Image as Readable,
            ImageType: this.props.ImageType,
            Limit: this.props.Limit?.toNumber(),
            Currency: this.Currency?.toEntityObject(),
            AvailableLimit: this.props.AvailableLimit?.toNumber(),
            DueDay: this.props.DueDay,
            ClosingDay: this.props.ClosingDay,
            InvoiceAmountForPayment: this.props.InvoiceAmountForPayment?.toNumber(),
            OpenInvoiceAmount: this.props.OpenInvoiceAmount?.toNumber(),
            Invoices: this.props.Invoices?.map((item)=> item.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        };

    }

}