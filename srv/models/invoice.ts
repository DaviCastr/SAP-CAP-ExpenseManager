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
import { Invoice, Invoices } from '@models/apps/dflc/gestordegastos/entities';
import { TransactionModel } from './transaction';

type InvoiceProperties = {
    Id: string;
    Year: number;
    Month: number;
    Description: string;
    TotalAmount: Decimal;
    Currency: CurrencyModel;
    InvoiceSent: boolean;
    CardId: string;
    Transactions: TransactionModel[];
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class InvoiceModel {

    constructor(private props: InvoiceProperties) { }

    public static with(properties: InvoiceProperties): InvoiceModel {

        return new InvoiceModel(properties);

    }

    public static singleModel(properties: Invoice): InvoiceModel {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(Invoices: Invoices): InvoiceModel[] {

        const oInvoicesModel: InvoiceModel[] =

            Invoices.map((Invoice) => {

                const oCurrencyModel = CurrencyModel.singleModel({
                    ...Invoice?.Currency,
                    code: Invoice?.Currency?.code || Invoice?.Currency_code as string
                });

                return InvoiceModel.with({
                    Id: Invoice.ID as string,
                    Year: Invoice.Year as number,
                    Month: Invoice.Month as number,
                    Description: Invoice.Description as string,
                    TotalAmount: new Decimal(Invoice.TotalAmount ?? 0),
                    Currency: oCurrencyModel,
                    InvoiceSent: Invoice.InvoiceSent as boolean,
                    CardId: Invoice?.Card_ID as string,
                    Transactions: TransactionModel.mapModel(Invoice?.Transactions || []),
                    CreatedAt: Invoice.createdAt as string,
                    CreatedBy: Invoice.createdBy as string,
                    ModifiedAt: Invoice.modifiedAt as string,
                    ModifiedBy: Invoice.modifiedBy as string
                });

            });

        return oInvoicesModel || [] as InvoiceModel[];

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

    public get CardId() {

        return this.props.CardId;

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

        return {
            ID: this.props.Id,
            Year: this.props.Year,
            Month: this.props.Month,
            TotalAmount: this.props.TotalAmount.toNumber(),
            Description: this.props.Description,
            Currency: this.props.Currency.toEntityObject(),
            InvoiceSent: this.props.InvoiceSent,
            Card_ID: this.props.CardId,
            Transactions: this.props.Transactions?.map((item) => item.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        };

    }

}