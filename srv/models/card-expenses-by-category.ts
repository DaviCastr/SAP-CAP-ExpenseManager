import { BaseModel } from './base';
import Decimal from 'decimal.js';
import { CurrencyModel } from './currency';
import { Currency } from '@models/sap/common';

export type CategoryExpenses = {
    ID: string,
    Name: string,
    ImagePath?: string,
    TotalAmount: Decimal,
    Percent: Decimal
}

export type CategoryExpensesReturn = {
    ID: string,
    Name: string,
    ImagePath?: string,
    TotalAmount: number,
    Percent: number
}

export type CardExpensesByCategoryProperties = {
    TotalAmount: Decimal,
    Currency: CurrencyModel,
    Categories: CategoryExpenses[]
}

export type CardExpensesByCategoryReturnProperties = {
    TotalAmount: number,
    Currency: Currency,
    Categories: CategoryExpensesReturn[]
}

export class CardExpensesByCategoryModel extends BaseModel {

    constructor(private properties: CardExpensesByCategoryProperties) { super() }

    public static with(properties: CardExpensesByCategoryProperties): CardExpensesByCategoryModel {
        return new CardExpensesByCategoryModel(properties);
    }

    public static singleModel(properties: CardExpensesByCategoryReturnProperties): CardExpensesByCategoryModel {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(CardExpensesByCategory: CardExpensesByCategoryReturnProperties[]): CardExpensesByCategoryModel[] {

        return CardExpensesByCategory?.map((Expense: CardExpensesByCategoryReturnProperties) => {

            return CardExpensesByCategoryModel.with({
                TotalAmount: this.retrieveDecimal(Expense.TotalAmount),
                Currency: CurrencyModel.singleModel({ code: Expense.Currency?.code }),
                Categories: Expense?.Categories?.map((item) => {

                    return {
                        ID: item?.ID,
                        Name: item?.Name,
                        ImagePath: item?.ImagePath,
                        TotalAmount: this.retrieveDecimal(item?.TotalAmount),
                        Percent: this.retrieveDecimal(item?.Percent)
                    }

                })

            });

        });

    }

    public get TotalAmount() {

        return this.properties.TotalAmount;

    }

    public get Currency() {

        return this.properties.Currency;

    }

    public get Categories() {

        return this.properties.Categories;

    }

    public toObject(): CardExpensesByCategoryProperties {

        return this.properties;

    }

    public toEntityObject(): CardExpensesByCategoryReturnProperties {

        return this.cleanEntity({
            TotalAmount: this.properties.TotalAmount?.toNumber(),
            Currency: this.properties.Currency?.toEntityObject(),
            Categories: this.properties.Categories?.map((item) => {

                return {
                    ID: item?.ID,
                    Name: item?.Name,
                    ImagePath: item?.ImagePath,
                    TotalAmount: item?.TotalAmount?.toNumber(),
                    Percent: item?.Percent?.toNumber()
                }

            })
        });

    }

}