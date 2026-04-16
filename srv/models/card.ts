import { Readable } from "stream";
import Decimal from 'decimal.js';
import { CurrencyModel } from '@/models/currency';
import { InvoiceModel } from '@/models/invoice';
import { Card, Card as CardEntityType, Cards } from '@models/apps/dflc/gestordegastos/entities';
import { BaseModel } from "./base";

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
    InvoiceAmountToPay: Decimal;
    PersonId: string;
    Invoices: InvoiceModel[];
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

type CardEntityProperties = CardEntityType;

export class CardModel extends BaseModel {

    constructor(private props: CardProperties) { super() }

    public static with(properties: CardProperties): CardModel {

        return new CardModel(properties);

    }

    public static singleModel(properties: Card): CardModel {

        return this.mapModel([properties])?.[0] as CardModel;

    }

    public static mapModel(Cards: Cards): CardModel[] {

        return Cards?.map((Card: Card) => {

            const oCurrencyModel = CurrencyModel.singleModel({
                ...Card?.Currency,
                code: Card?.Currency?.code || Card?.Currency_code as string
            });

            return CardModel.with({
                Id: Card.ID as string,
                Name: Card.Name as string,
                Image: Card.Image as Readable,
                ImageType: Card.ImageType as string,
                Limit: new Decimal(Card.Limit ?? 0),
                Currency: oCurrencyModel,
                AvailableLimit: new Decimal(Card.AvailableLimit ?? 0),
                DueDay: Card.DueDay as number,
                ClosingDay: Card.ClosingDay as number,
                InvoiceAmountForPayment: new Decimal(Card.InvoiceAmountForPayment ?? 0),
                InvoiceAmountToPay: new Decimal(Card.InvoiceAmountToPay ?? 0),
                PersonId: Card?.Person?.ID || Card?.Person_ID as string,
                Invoices: InvoiceModel.mapModel(Card?.Invoices || []),
                CreatedAt: Card.createdAt as string,
                CreatedBy: Card.createdBy as string,
                ModifiedAt: Card.modifiedAt as string,
                ModifiedBy: Card.modifiedBy as string
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

    public get InvoiceAmountToPay() {

        return this.props.InvoiceAmountToPay;

    }

    public get PersonId() {

        return this.props.PersonId;

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

    public set Image(value: Readable) {

        this.props.Image = value;

    }

    public set AvailableLimit(availableLimit: Decimal) {

        this.props.AvailableLimit = availableLimit;

    }

    public set InvoiceAmountToPay(InvoiceAmountToPay: Decimal) {

        this.props.InvoiceAmountToPay = InvoiceAmountToPay;

    }

    public set InvoiceAmountForPayment(invoiceAmountForPayment: Decimal) {

        this.props.InvoiceAmountForPayment = invoiceAmountForPayment;

    }

    public set ClosingDay(closingDay: number) {

        this.props.ClosingDay = closingDay;

    }

    public toObject(): CardProperties {

        return this.props;

    }

    public toEntityObject(): CardEntityProperties {

        return this.cleanEntity({
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