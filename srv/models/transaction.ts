import Decimal from 'decimal.js';
import { CurrencyModel } from '@/models/currency';
import { Transaction, Transactions } from '@models/apps/dflc/expensemanager/entities';
import { BaseModel } from './base';

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
    InvoiceId: string;
    CategoryId: string;
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class TransactionModel extends BaseModel {

    constructor(private props: TransactionProperties) { super() }

    public static with(properties: TransactionProperties): TransactionModel {

        return new TransactionModel(properties);

    }

    public static singleModel(properties: Transaction): TransactionModel {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(Transactions: Transactions): TransactionModel[] {

        return Transactions?.map((Transaction) => {

            const oCurrencyModel = CurrencyModel.singleModel({
                ...Transaction?.Currency,
                code: Transaction?.Currency?.code || Transaction?.Currency_code as string
            });

            return TransactionModel.with({
                Id: Transaction.ID as string,
                Identifier: Transaction.Identifier as string,
                Date: Transaction.Date as string,
                TotalAmount: this.retrieveDecimal(Transaction.TotalAmount),
                Amount: this.retrieveDecimal(Transaction.Amount),
                Currency: oCurrencyModel,
                TotalInstallments: Transaction.TotalInstallments as number,
                Installment: Transaction.Installment as number,
                Description: Transaction.Description as string,
                InvoiceId: Transaction.Invoice_ID || Transaction?.Invoice?.ID as string,
                CategoryId: Transaction.Category_ID || Transaction?.Category?.ID as string,
                CreatedAt: Transaction.createdAt as string,
                CreatedBy: Transaction.createdBy as string,
                ModifiedAt: Transaction.modifiedAt as string,
                ModifiedBy: Transaction.modifiedBy as string
            }) as TransactionModel;

        }) as TransactionModel[];

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

    public get InvoiceId() {

        return this.props.InvoiceId;

    }

    public get CategoryId() {

        return this.props.CategoryId;

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

    public set TotalAmount(TotalAmount: Decimal) {

        this.props.TotalAmount = TotalAmount;

    }

    public toObject(): TransactionProperties {

        return this.props;

    }

    public toEntityObject(): Transaction {

        return this.cleanEntity({
            ID: this.props.Id,
            Identifier: this.props.Identifier,
            Date: this.props.Date as Transaction['Date'],
            TotalAmount: this.props.TotalAmount?.toNumber(),
            Amount: this.props.Amount?.toNumber(),
            Currency: this.props.Currency?.toEntityObject(),
            TotalInstallments: this.props.TotalInstallments,
            Installment: this.props.Installment,
            Description: this.props.Description,
            Invoice: { ID: this.props.InvoiceId },
            Category: { ID: this.props.CategoryId },
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        } as Transaction);
 
    }

}