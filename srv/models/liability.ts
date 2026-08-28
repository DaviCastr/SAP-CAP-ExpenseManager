import Decimal from 'decimal.js';
import { BaseModel } from './base';
import { Liability, Liabilities } from '@models/apps/dflc/expensemanager/entities';
import { LiabilityTransactionModel } from './liability-transaction';
import { PersonModel } from './person';
import { CurrencyModel } from './currency';

type LiabilityProperties = {
    Id: string;
    Name: string;
    Description?: string;

    Currency?: CurrencyModel;

    TotalAmount: Decimal;
    OutstandingBalance?: Decimal;
    PaymentPercentage?: Decimal;

    TotalIn?: Decimal;
    TotalOut?: Decimal;

    Status?: string;

    DueDay?: number;

    InvoiceSentMonth?: number;
    InvoiceSentYear?: number;

    Person?: PersonModel;

    LiabilityTransactions?: LiabilityTransactionModel[];

    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
};

export class LiabilityModel extends BaseModel {

    constructor(private props: LiabilityProperties) { super(); }

    public static with(properties: LiabilityProperties): LiabilityModel {
        return new LiabilityModel(properties);
    }

    public static singleModel(properties: Liability): LiabilityModel {
        return this.mapModel([properties])?.[0];
    }

    public static mapModel(entities: Liabilities): LiabilityModel[] {

        return entities?.map((item: Liability) => {

            const oPersonModel = PersonModel.singleModel({
                ...item?.Person,
                ID: item?.Person?.ID || item?.Person_ID as string
            });

            return LiabilityModel.with({
                Id: item.ID as string,
                Name: item.Name as string,
                Description: item.Description as string,

                Currency: CurrencyModel.singleModel({
                    ...(item?.Currency as any),
                    code: (item?.Currency as any)?.code || item?.Currency_code as string
                }),

                TotalAmount: this.retrieveDecimal(item.TotalAmount),
                OutstandingBalance: this.retrieveDecimal(item.OutstandingBalance),
                PaymentPercentage: this.retrieveDecimal(item.PaymentPercentage),

                TotalIn: this.retrieveDecimal(item.TotalIn),
                TotalOut: this.retrieveDecimal(item.TotalOut),

                Status: item.Status as string,

                DueDay: item.DueDay as number,

                InvoiceSentMonth: item.InvoiceSentMonth as number,
                InvoiceSentYear: item.InvoiceSentYear as number,

                Person: oPersonModel,

                LiabilityTransactions: LiabilityTransactionModel.mapModel(item?.LiabilityTransactions || []),

                CreatedAt: item.createdAt as string,
                CreatedBy: item.createdBy as string,
                ModifiedAt: item.modifiedAt as string,
                ModifiedBy: item.modifiedBy as string
            });

        });

    }

    public get Id() { return this.props.Id; }
    public get Name() { return this.props.Name; }
    public get Description() { return this.props.Description; }

    public get Currency() { return this.props.Currency; }

    public get TotalAmount() { return this.props.TotalAmount; }
    public get OutstandingBalance() { return this.props.OutstandingBalance; }
    public get PaymentPercentage() { return this.props.PaymentPercentage; }

    public get TotalIn() { return this.props.TotalIn; }
    public get TotalOut() { return this.props.TotalOut; }

    public get Status() { return this.props.Status; }

    public get DueDay() { return this.props.DueDay; }

    public get InvoiceSentMonth() { return this.props.InvoiceSentMonth; }

    public get InvoiceSentYear() { return this.props.InvoiceSentYear; }

    public get Person() { return this.props.Person; }

    public get LiabilityTransactions() { return this.props.LiabilityTransactions || []; }

    public get CreatedAt() { return this.props.CreatedAt; }
    public get CreatedBy() { return this.props.CreatedBy; }
    public get ModifiedAt() { return this.props.ModifiedAt; }
    public get ModifiedBy() { return this.props.ModifiedBy; }

    public toObject(): LiabilityProperties {
        return this.props;
    }

    public toEntityObject(): Liability {

        return this.cleanEntity({
            ID: this.props.Id,
            Name: this.props.Name,
            Description: this.props.Description,

            Currency: this.props.Currency?.toEntityObject(),

            TotalAmount: this.props.TotalAmount?.toNumber(),
            OutstandingBalance: this.props.OutstandingBalance?.toNumber(),
            PaymentPercentage: this.props.PaymentPercentage?.toNumber(),

            TotalIn: this.props.TotalIn?.toNumber(),
            TotalOut: this.props.TotalOut?.toNumber(),

            Status: this.props.Status,

            DueDay: this.props.DueDay,

            InvoiceSentMonth: this.props.InvoiceSentMonth,
            InvoiceSentYear: this.props.InvoiceSentYear,

            Person: this.props.Person?.toEntityObject(),

            LiabilityTransactions: this.props.LiabilityTransactions?.map(x => x.toEntityObject()),

            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });

    }

}