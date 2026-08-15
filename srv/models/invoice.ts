import Decimal from 'decimal.js';
import { CurrencyModel } from '@/models/currency';
import { Card, Invoice, Invoices } from '@models/apps/dflc/expensemanager/entities';
import { TransactionModel } from './transaction';
import { BaseModel } from './base';
import { CardModel } from './card';

type InvoiceProperties = {
    Id: string;
    Year: number;
    Month: number;
    Description: string;
    TotalAmount: Decimal;
    Currency: CurrencyModel;
    InvoiceSent: boolean;
    Card?: CardModel;
    Transactions: TransactionModel[];
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class InvoiceModel extends BaseModel {

    constructor(private props: InvoiceProperties) { super() }

    public static with(properties: InvoiceProperties): InvoiceModel {

        return new InvoiceModel(properties);

    }

    public static singleModel(properties: Invoice): InvoiceModel | undefined {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(Invoices: Invoices): InvoiceModel[] | null {

        const oInvoicesModel: InvoiceModel[] =

            Invoices?.map((Invoice) => {

                const oCurrencyModel = CurrencyModel.singleModel({
                    ...Invoice?.Currency,
                    code: Invoice?.Currency?.code || Invoice?.Currency_code as string
                });

                const oCardModel = CardModel.singleModel({
                    ...Invoice.Card,
                    ID: Invoice.Card?.ID || Invoice.Card_ID as string
                });

                return InvoiceModel.with({
                    Id: Invoice?.ID as string,
                    Year: Invoice?.Year as number,
                    Month: Invoice?.Month as number,
                    Description: Invoice?.Description as string,
                    TotalAmount: this.retrieveDecimal(Invoice?.TotalAmount),
                    Currency: oCurrencyModel,
                    InvoiceSent: Invoice?.InvoiceSent as boolean,
                    Card: oCardModel,
                    Transactions: TransactionModel.mapModel(Invoice?.Transactions as []) as TransactionModel[],
                    CreatedAt: Invoice?.createdAt as string,
                    CreatedBy: Invoice?.createdBy as string,
                    ModifiedAt: Invoice?.modifiedAt as string,
                    ModifiedBy: Invoice?.modifiedBy as string
                });

            });

        return oInvoicesModel;

    }

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

    public get Card() {

        return this.props.Card;

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

    public set Description(description: string) {

        this.props.Description = description;

    }

    public toObject(): InvoiceProperties {

        return this.props;

    }

    public toEntityObject(): Invoice {

        return this.cleanEntity({
            ID: this.props.Id,
            Year: this.props.Year,
            Month: this.props.Month,
            TotalAmount: this.props.TotalAmount?.toNumber(),
            Description: this.props.Description,
            Currency: this.props.Currency.toEntityObject(),
            InvoiceSent: this.props.InvoiceSent,
            Card: this.Card?.toEntityObject(),
            Transactions: this.props.Transactions?.map((item) => item.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        } as Invoice);

    }

}