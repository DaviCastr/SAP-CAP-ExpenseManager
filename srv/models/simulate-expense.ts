import { BaseModel } from './base';
import Decimal from 'decimal.js';
import { CurrencyModel } from './currency';
import { Currency } from '@models/sap/common';

export type SimulateExpenseProperties = {
    TotalAmount: Decimal,
    TotalMonth: Decimal,
    AmountSaving: Decimal,
    Currency: CurrencyModel
}

export type SimulateExpenseReturnProperties = {
    TotalAmount: number,
    TotalMonth: number,
    AmountSaving: number,
    Currency: Currency
}

export class SimulateExpenseModel extends BaseModel {

    constructor(private properties: SimulateExpenseProperties) { super() }

    public static with(properties: SimulateExpenseProperties): SimulateExpenseModel {
        return new SimulateExpenseModel(properties);
    }

    public static singleModel(properties: SimulateExpenseReturnProperties): SimulateExpenseModel {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(SimulateExpense: SimulateExpenseReturnProperties[]): SimulateExpenseModel[] {

        return SimulateExpense?.map((Expense: SimulateExpenseReturnProperties) => {

            return SimulateExpenseModel.with({
                TotalAmount: this.retrieveDecimal(Expense.TotalAmount),
                TotalMonth: this.retrieveDecimal(Expense.TotalMonth),
                AmountSaving: this.retrieveDecimal(Expense.AmountSaving),
                Currency: CurrencyModel.singleModel({ code: Expense.Currency?.code })
            });

        });

    }

    public get TotalAmount() {

        return this.properties.TotalAmount;

    }

    public get TotalMonth() {

        return this.properties.TotalMonth;

    }

    public get AmountSaving() {

        return this.properties.AmountSaving;

    }

    public get Currency() {

        return this.properties.Currency;

    }

    public toObject(): SimulateExpenseProperties {

        return this.properties;

    }

    public toEntityObject(): SimulateExpenseReturnProperties {

        return this.cleanEntity({
            TotalAmount: this.properties.TotalAmount?.toNumber(),
            TotalMonth: this.properties.TotalMonth?.toNumber(),
            AmountSaving: this.properties.AmountSaving?.toNumber(),
            Currency: this.properties.Currency?.toEntityObject()
        });

    }

}