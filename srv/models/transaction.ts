import Decimal from 'decimal.js';
import { CurrencyModel } from '@/models/currency';
import { Invoice, Transaction, Transactions } from '@models/apps/dflc/expensemanager/entities';
import { BaseModel } from './base';
import { InvoiceModel } from './invoice';
import { CategoryModel } from './category';

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
    Invoice?: InvoiceModel;
    Category?: CategoryModel;
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

    public static singleModel(properties: Transaction): TransactionModel | undefined {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(Transactions: Transactions): TransactionModel[] | null {

        return Transactions?.map((Transaction) => {

            const oCurrencyModel = CurrencyModel.singleModel({
                ...Transaction?.Currency,
                code: Transaction?.Currency?.code || Transaction?.Currency_code as string
            });

            const oInvoiceModel = InvoiceModel.singleModel({
                ...Transaction.Invoice,
                ID: Transaction.Invoice?.ID || Transaction?.Invoice_ID as string
            });

            const oCategoryModel = CategoryModel.singleModel({
                ...Transaction.Category,
                ID: Transaction.Category?.ID || Transaction?.Category_ID as string
            });

            if('TotalAmount' in Transaction){
                Transaction.TotalAmount = 0;
            }

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
                Invoice: oInvoiceModel,
                Category: oCategoryModel,
                CreatedAt: Transaction.createdAt as string,
                CreatedBy: Transaction.createdBy as string,
                ModifiedAt: Transaction.modifiedAt as string,
                ModifiedBy: Transaction.modifiedBy as string
            }) as TransactionModel;

        });

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

    public get Invoice() {

        return this.props.Invoice;

    }

    public get Category() {

        return this.props.Category;

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
            Invoice: this.Invoice?.toEntityObject(),
            Category: this.Category?.toEntityObject(),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        } as Transaction);

    }

}