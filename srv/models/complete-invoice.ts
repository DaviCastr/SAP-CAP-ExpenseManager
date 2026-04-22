import Decimal from 'decimal.js';
import { BaseModel } from './base';

export type CompleteInvoiceTransactionReturn = {
    ID: string;
    Identifier?: string;
    Date?: string;
    Description?: string;
    Amount: number;
    TotalAmount: number;
    Installment?: number;
    TotalInstallments?: number;

    Card: {
        ID: string;
        Name: string;
        ImagePath?: string;
    };

    Category?: {
        ID: string;
        Name: string;
        ImagePath?: string;
    };

    Invoice: {
        ID: string;
    };
};

export type CompleteInvoiceReturnProperties = {
    Year: number;
    Month: number;
    Description: string;
    Currency: { code: string };
    TotalAmount: number;

    KPIs: {
        TotalTransactions: number;
        TotalCards: number;
        TotalCategories: number;
    };

    Transactions: CompleteInvoiceTransactionReturn[];
};

export class CompleteInvoiceModel extends BaseModel {

    constructor(
        private readonly properties: CompleteInvoiceReturnProperties
    ) {
        super();
    }

    public static empty(
        Year: number,
        Month: number
    ): CompleteInvoiceModel {

        return new CompleteInvoiceModel({
            Year,
            Month,
            Description: '',
            Currency: { code: 'BRL' },
            TotalAmount: 0,
            KPIs: {
                TotalTransactions: 0,
                TotalCards: 0,
                TotalCategories: 0
            },
            Transactions: []
        });

    }

    public static fromRepositoryRows(
        rows: any[],
        Year: number,
        Month: number,
        Description: string
    ): CompleteInvoiceModel {

        let total = new Decimal(0);

        const cards = new Set<string>();
        const categories = new Set<string>();

        const transactions =
            rows.map(row => {

                cards.add(row.CardID);

                if (row.CategoryID) {
                    categories.add(row.CategoryID);
                }

                total = total.plus(
                    row.Amount || 0
                );

                return {

                    ID: row.TransactionID,
                    Identifier: row.Identifier,
                    Date: row.Date,
                    Description: row.Description,
                    Amount: Number(row.Amount || 0),
                    TotalAmount: Number(
                        row.TotalAmount || 0
                    ),
                    Installment: row.Installment,
                    TotalInstallments:
                        row.TotalInstallments,

                    Card: {
                        ID: row.CardID,
                        Name: row.CardName,
                        ImagePath:
                            row.CardImageType
                                ? `Cards(ID='${row.CardID}',IsActiveEntity=true)/Image`
                                : undefined
                    },

                    Category: row.CategoryID
                        ? {
                            ID: row.CategoryID,
                            Name: row.CategoryName,
                            ImagePath:
                                row.CategoryImageType
                                    ? `Categories(ID='${row.CategoryID}',IsActiveEntity=true)/Image`
                                    : undefined
                        }
                        : undefined,

                    Invoice: {
                        ID: row.InvoiceID
                    }

                };

            });

        return new CompleteInvoiceModel({

            Year,
            Month,
            Description,

            Currency: {
                code:
                    rows[0]?.CurrencyCode ||
                    'BRL'
            },

            TotalAmount:
                total.toDecimalPlaces(2).toNumber(),

            KPIs: {
                TotalTransactions:
                    transactions.length,
                TotalCards:
                    cards.size,
                TotalCategories:
                    categories.size
            },

            Transactions: transactions

        });

    }

    public toEntityObject():
    CompleteInvoiceReturnProperties {

        return this.cleanEntity(
            this.properties
        );

    }

}