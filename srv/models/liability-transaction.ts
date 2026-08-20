import Decimal from 'decimal.js';
import { BaseModel } from './base';

import {
    LiabilityTransaction,
    LiabilityTransactions
} from '@models/apps/dflc/expensemanager/entities';
import { LiabilityModel } from './liability';
import { CurrencyModel } from './currency';

export type LiabilityTransactionProperties = {
    Id: string;

    Liability?: LiabilityModel;

    Date: string;

    Description?: string;

    Currency?: CurrencyModel;

    Amount: Decimal;

    Type: string;

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

            const oLiabilityModel = LiabilityModel.singleModel({
                ...item?.Liability,
                ID: item?.Liability?.ID || item?.Liability_ID as string
            });

            return LiabilityTransactionModel.with({
                Id: item.ID as string,

                Liability: oLiabilityModel,

                Date: item.Date as string,

                Description: item.Description as string,

                Currency: CurrencyModel.singleModel(item?.Currency as any),

                Amount: this.retrieveDecimal(item.Amount),

                Type: item.Type as string,

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

    public get Liability() { return this.props.Liability; }

    public get Type() { return this.props.Type; }

    public get Currency() { return this.props.Currency; }

    public get Amount() { return this.props.Amount; }

    public get Date() { return this.props.Date; }

    public get Description() { return this.props.Description; }

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

            Liability: this.props.Liability?.toEntityObject(),

            Date: this.props.Date,

            Description: this.props.Description,

            Currency: this.props.Currency?.toEntityObject(),

            Amount: this.props.Amount?.toNumber(),

            Type: this.props.Type,

            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy

        });

    }

}