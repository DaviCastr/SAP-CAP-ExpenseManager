import Decimal from 'decimal.js';
import { BaseModel } from './base';
import { CurrencyModel } from './currency';
import { Currency } from '@models/sap/common';

export type CategoryTransactionItem = {
    ID: string;
    Identifier?: string;
    Date?: string;
    Description?: string;
    Installment?: number;
    TotalInstallments?: number;
    Amount: Decimal;
    Currency?: CurrencyModel;
};

export type CategoryTransactionItemReturn = {
    ID: string;
    Identifier?: string;
    Date?: string;
    Description?: string;
    Installment?: number;
    TotalInstallments?: number;
    Amount: number;
    Currency?: Currency;
};

export type CategoryInvoice = {
    ID: string;
    Year: number;
    Month: number;
    Description?: string;
    TotalAmount: Decimal;
    Transactions: CategoryTransactionItem[];
};

export type CategoryInvoiceReturn = {
    ID: string;
    Year: number;
    Month: number;
    Description?: string;
    TotalAmount: number;
    Transactions: CategoryTransactionItemReturn[];
};

export type CategoryCard = {
    ID: string;
    Name: string;
    ImagePath?: string;
    TotalAmount: Decimal;
    Invoices: CategoryInvoice[];
};

export type CategoryCardReturn = {
    ID: string;
    Name: string;
    ImagePath?: string;
    TotalAmount: number;
    Invoices: CategoryInvoiceReturn[];
};

export type CategoryTransactionsProperties = {
    ID: string;
    Name: string;
    ImagePath?: string;
    Currency: CurrencyModel;
    TotalAmount: Decimal;
    Cards: CategoryCard[];
};

export type CategoryTransactionsReturnProperties = {
    ID: string;
    Name: string;
    ImagePath?: string;
    Currency: Currency;
    TotalAmount: number;
    Cards: CategoryCardReturn[];
};

/**************************************************************************************************
 * MODEL
 **************************************************************************************************/

export class CategoryTransactionsModel extends BaseModel {

    constructor(
        private readonly properties: CategoryTransactionsProperties
    ) {
        super();
    }

    public static with(
        properties: CategoryTransactionsProperties
    ): CategoryTransactionsModel {

        return new CategoryTransactionsModel(properties);

    }

    public static singleModel(
        data: CategoryTransactionsReturnProperties
    ): CategoryTransactionsModel {

        return this.mapModel([data])[0];

    }

    public static mapModel(
        rows: CategoryTransactionsReturnProperties[]
    ): CategoryTransactionsModel[] {

        return (rows || []).map(row => {

            return CategoryTransactionsModel.with({

                ID: row.ID,
                Name: row.Name,
                ImagePath: row.ImagePath,

                Currency: CurrencyModel.singleModel({
                    code: row.Currency?.code
                }),

                TotalAmount: this.retrieveDecimal(row.TotalAmount),

                Cards: (row.Cards || []).map(card => ({

                    ID: card.ID,
                    Name: card.Name,
                    ImagePath: card.ImagePath,

                    TotalAmount: this.retrieveDecimal(card.TotalAmount),

                    Invoices: (card.Invoices || []).map(invoice => ({

                        ID: invoice.ID,
                        Year: invoice.Year,
                        Month: invoice.Month,
                        Description: invoice.Description,

                        TotalAmount: this.retrieveDecimal(
                            invoice.TotalAmount
                        ),

                        Transactions: (invoice.Transactions || []).map(tx => ({

                            ID: tx.ID,
                            Identifier: tx.Identifier,
                            Date: tx.Date,
                            Description: tx.Description,
                            Installment: tx.Installment,
                            TotalInstallments: tx.TotalInstallments,

                            Amount: this.retrieveDecimal(tx.Amount),

                            Currency: CurrencyModel.singleModel({
                                code: tx.Currency?.code
                            })

                        }))

                    }))

                }))

            });

        });

    }
    
    public get ID() {
        return this.properties.ID;
    }

    public get Name() {
        return this.properties.Name;
    }

    public get ImagePath() {
        return this.properties.ImagePath;
    }

    public get Currency() {
        return this.properties.Currency;
    }

    public get TotalAmount() {
        return this.properties.TotalAmount;
    }

    public get Cards() {
        return this.properties.Cards;
    }

    public toObject(): CategoryTransactionsProperties {

        return this.properties;

    }

    public toEntityObject(): CategoryTransactionsReturnProperties {

        return this.cleanEntity({

            ID: this.properties.ID,
            Name: this.properties.Name,
            ImagePath: this.properties.ImagePath,

            Currency:
                this.properties.Currency?.toEntityObject(),

            TotalAmount:
                this.properties.TotalAmount?.toNumber(),

            Cards: this.properties.Cards?.map(card => ({

                ID: card.ID,
                Name: card.Name,
                ImagePath: card.ImagePath,

                TotalAmount:
                    card.TotalAmount?.toNumber(),

                Invoices: card.Invoices?.map(invoice => ({

                    ID: invoice.ID,
                    Year: invoice.Year,
                    Month: invoice.Month,
                    Description: invoice.Description,

                    TotalAmount:
                        invoice.TotalAmount?.toNumber(),

                    Transactions:
                        invoice.Transactions?.map(tx => ({

                            ID: tx.ID,
                            Identifier: tx.Identifier,
                            Date: tx.Date,
                            Description: tx.Description,
                            Installment: tx.Installment,
                            TotalInstallments:
                                tx.TotalInstallments,

                            Amount:
                                tx.Amount?.toNumber(),

                            Currency:
                                tx.Currency?.toEntityObject()

                        }))

                }))

            }))

        });

    }

}