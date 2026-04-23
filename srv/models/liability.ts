import Decimal from 'decimal.js';
import { BaseModel } from './base';
import { CurrencyModel } from './currency';
import { Liability, Liabilities } from '@models/apps/dflc/gestordegastos/entities';
import { LiabilityTransactionModel } from './liability-transaction';
import { InterestMode, LiabilityStatus, LiabilityType } from '@models/apps/dflc/gestordegastos/types';

type LiabilityProperties = {
    Id: string;
    Name: string;
    Creditor?: string;
    Description?: string;

    Type?: string;
    Status?: string;

    OriginalAmount: Decimal;
    CurrentBalance?: Decimal;
    PaidAmount?: Decimal;

    Currency?: CurrencyModel;

    InterestMode?: string;
    InterestRate?: Decimal;

    Installments?: number;
    InstallmentAmount?: Decimal;

    StartDate?: string;
    FirstDueDate?: string;
    EndDate?: string;
    LastPaymentDate?: string;

    ExternalReference?: string;

    RemainingAmount?: Decimal;
    ProgressPercent?: Decimal;
    PaidInstallments?: number;
    RemainingInstallments?: number;
    NextDueDate?: string;
    IsOverdue?: boolean;
    HealthScore?: number;

    PersonId?: string;

    Transactions?: LiabilityTransactionModel[];

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

            const currency = CurrencyModel.singleModel({
                ...item?.Currency,
                code: item?.Currency?.code || item?.Currency_code as string
            });

            return LiabilityModel.with({
                Id: item.ID as string,
                Name: item.Name as string,
                Creditor: item.Creditor as string,
                Description: item.Description as string,

                Type: item.Type as LiabilityType,
                Status: item.Status as LiabilityStatus,

                OriginalAmount: this.retrieveDecimal(item.OriginalAmount),
                CurrentBalance: this.retrieveDecimal(item.CurrentBalance),
                PaidAmount: this.retrieveDecimal(item.PaidAmount),

                Currency: currency,

                InterestMode: item.InterestMode as InterestMode,
                InterestRate: this.retrieveDecimal(item.InterestRate),

                Installments: item.Installments as number,
                InstallmentAmount: this.retrieveDecimal(item.InstallmentAmount),

                StartDate: item.StartDate as string,
                FirstDueDate: item.FirstDueDate as string,
                EndDate: item.EndDate as string,
                LastPaymentDate: item.LastPaymentDate as string,

                ExternalReference: item.ExternalReference as string,

                RemainingAmount: this.retrieveDecimal(item.RemainingAmount),
                ProgressPercent: this.retrieveDecimal(item.ProgressPercent),
                PaidInstallments: item.PaidInstallments as number,
                RemainingInstallments: item.RemainingInstallments as number,
                NextDueDate: item.NextDueDate as string,
                IsOverdue: item.IsOverdue as boolean,
                HealthScore: item.HealthScore as number,

                PersonId: item.Person_ID || item?.Person?.ID,

                Transactions: LiabilityTransactionModel.mapModel(item?.Transactions || []),

                CreatedAt: item.createdAt as string,
                CreatedBy: item.createdBy as string,
                ModifiedAt: item.modifiedAt as string,
                ModifiedBy: item.modifiedBy as string
            });

        });

    }

    public get Id() { return this.props.Id; }
    public get Name() { return this.props.Name; }
    public get OriginalAmount() { return this.props.OriginalAmount }
    public get CurrentBalance() { return this.props.CurrentBalance }
    public get PaidAmount() { return this.props.PaidAmount }
    public get Currency() { return this.props.Currency; }
    public get Transactions() { return this.props.Transactions || []; }

    public toObject(): LiabilityProperties {
        return this.props;
    }

    public toEntityObject(): Liability {

        return this.cleanEntity({
            ID: this.props.Id,
            Name: this.props.Name,
            Creditor: this.props.Creditor,
            Description: this.props.Description,

            Type: this.props.Type,
            Status: this.props.Status,

            OriginalAmount: this.props.OriginalAmount?.toNumber(),
            CurrentBalance: this.props.CurrentBalance?.toNumber(),
            PaidAmount: this.props.PaidAmount?.toNumber(),

            Currency: this.props.Currency?.toEntityObject(),

            InterestMode: this.props.InterestMode,
            InterestRate: this.props.InterestRate?.toNumber(),

            Installments: this.props.Installments,
            InstallmentAmount: this.props.InstallmentAmount?.toNumber(),

            StartDate: this.props.StartDate,
            FirstDueDate: this.props.FirstDueDate,
            EndDate: this.props.EndDate,
            LastPaymentDate: this.props.LastPaymentDate,

            ExternalReference: this.props.ExternalReference,

            RemainingAmount: this.props.RemainingAmount?.toNumber(),
            ProgressPercent: this.props.ProgressPercent?.toNumber(),
            PaidInstallments: this.props.PaidInstallments,
            RemainingInstallments: this.props.RemainingInstallments,
            NextDueDate: this.props.NextDueDate,
            IsOverdue: this.props.IsOverdue,
            HealthScore: this.props.HealthScore,

            Person: this.props.PersonId ? { ID: this.props.PersonId } : undefined,

            Transactions: this.props.Transactions?.map(x => x.toEntityObject()),

            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });

    }

}