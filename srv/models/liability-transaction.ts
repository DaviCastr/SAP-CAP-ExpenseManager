import Decimal from 'decimal.js';
import { BaseModel } from './base';
import { CurrencyModel } from './currency';

import {
    LiabilityTransaction,
    LiabilityTransactions
} from '@models/apps/dflc/gestordegastos/entities';

export type LiabilityTransactionProperties = {
    Id: string;

    LiabilityId?: string;

    Type: string;
    Description?: string;

    MovementDate: string;

    Installment?: number;
    TotalInstallments?: number;

    Amount: Decimal;
    BalanceAfter?: Decimal;

    Currency?: CurrencyModel;

    IsAutomatic?: boolean;

    ExternalReference?: string;

    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
};

export class LiabilityTransactionModel extends BaseModel {

    constructor(private props: LiabilityTransactionProperties) {
        super();
    }

    public static with(
        properties: LiabilityTransactionProperties
    ): LiabilityTransactionModel {

        return new LiabilityTransactionModel(properties);

    }

    public static singleModel(
        properties: LiabilityTransaction
    ): LiabilityTransactionModel {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(
        entities: LiabilityTransactions
    ): LiabilityTransactionModel[] {

        return entities?.map((item: LiabilityTransaction) => {

            const currency = CurrencyModel.singleModel({
                ...item?.Currency,
                code: item?.Currency?.code || item?.Currency_code as string
            });

            return LiabilityTransactionModel.with({
                Id: item.ID as string,

                LiabilityId:
                    item.Liability_ID as string ||
                    item?.Liability?.ID as string,

                Type: item.Type as string,
                Description: item.Description as string,

                MovementDate: item.MovementDate as string,

                Installment: item.Installment as number,
                TotalInstallments: item.TotalInstallments as number,

                Amount: this.retrieveDecimal(item.Amount),
                BalanceAfter: this.retrieveDecimal(item.BalanceAfter),

                Currency: currency,

                IsAutomatic: item.IsAutomatic as boolean,

                ExternalReference: item.ExternalReference as string,

                CreatedAt: item.createdAt as string,
                CreatedBy: item.createdBy as string,
                ModifiedAt: item.modifiedAt as string,
                ModifiedBy: item.modifiedBy as string
            });

        });

    }

    // ========================================================
    // GETTERS
    // ========================================================

    public get Id() { return this.props.Id; }

    public get LiabilityId() { return this.props.LiabilityId; }

    public get Type() { return this.props.Type; }

    public get Amount() { return this.props.Amount; }

    public get BalanceAfter() { return this.props.BalanceAfter; }

    public get MovementDate() { return this.props.MovementDate; }

    public get Currency() { return this.props.Currency; }

    // ========================================================
    // RAW OBJECT
    // ========================================================

    public toObject(): LiabilityTransactionProperties {

        return this.props;

    }

    // ========================================================
    // ENTITY OBJECT
    // ========================================================

    public toEntityObject(): LiabilityTransaction {

        return this.cleanEntity({

            ID: this.props.Id,

            Liability: this.props.LiabilityId
                ? { ID: this.props.LiabilityId }
                : undefined,

            Type: this.props.Type,
            Description: this.props.Description,

            MovementDate: this.props.MovementDate,

            Installment: this.props.Installment,
            TotalInstallments: this.props.TotalInstallments,

            Amount: this.props.Amount?.toNumber(),
            BalanceAfter: this.props.BalanceAfter?.toNumber(),

            Currency: this.props.Currency?.toEntityObject(),

            IsAutomatic: this.props.IsAutomatic,

            ExternalReference: this.props.ExternalReference,

            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy

        });

    }

}