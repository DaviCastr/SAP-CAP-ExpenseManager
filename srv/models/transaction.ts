import Decimal from 'decimal.js';
import { CurrencyModel } from '@/models/currency';
import { Transaction, Transactions } from '@models/apps/dflc/gestordegastos/entities';

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

    public static singleModel(properties: Transaction): TransactionModel {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(Transactions: Transactions): TransactionModel[] {

        return Transactions.map((Transaction) =>
            TransactionModel.with({
                Id: Transaction.ID as string,
                Identifier: Transaction.Identifier as string,
                Date: Transaction.Date as string,
                TotalAmount: new Decimal(Transaction.TotalAmount ?? 0),
                Amount: new Decimal(Transaction.Amount ?? 0),
                Currency: Transaction.Currency as CurrencyModel,
                TotalInstallments: Transaction.TotalInstallments as number,
                Installment: Transaction.Installment as number,
                Description: Transaction.Description as string,
                CreatedAt: Transaction.createdAt as string,
                CreatedBy: Transaction.createdBy as string,
                ModifiedAt: Transaction.modifiedAt as string,
                ModifiedBy: Transaction.modifiedBy as string
            })
        ) || [] as TransactionModel[];

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

    public set TotalAmount(TotalAmount: Decimal) {

        this.props.TotalAmount = TotalAmount;

    }

    public toObject(): TransactionProperties {

        return this.props;

    }

    public toEntityObject(): Transaction {

        return {
            ID: this.props.Id,
            Identifier: this.props.Identifier,
            Date: this.props.Date as Transaction['Date'],
            TotalAmount: this.props.TotalAmount.toNumber(),
            Amount: this.props.Amount.toNumber(),
            Currency: this.props.Currency.toEntityObject(),
            TotalInstallments: this.props.TotalInstallments,
            Installment: this.props.Installment,
            Description: this.props.Description,
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        };

    }

}