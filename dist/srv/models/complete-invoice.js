"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteInvoiceModel = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const base_1 = require("./base");
class CompleteInvoiceModel extends base_1.BaseModel {
    properties;
    constructor(properties) {
        super();
        this.properties = properties;
    }
    static empty(Year, Month) {
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
    static fromRepositoryRows(rows, Year, Month, Description) {
        let total = new decimal_js_1.default(0);
        const cards = new Set();
        const categories = new Set();
        const transactions = rows.map(row => {
            cards.add(row.CardID);
            if (row.CategoryID) {
                categories.add(row.CategoryID);
            }
            total = total.plus(row.Amount || 0);
            return {
                ID: row.TransactionID,
                Identifier: row.Identifier,
                Date: row.Date,
                Description: row.Description,
                Amount: Number(row.Amount || 0),
                TotalAmount: Number(row.TotalAmount || 0),
                Installment: row.Installment,
                TotalInstallments: row.TotalInstallments,
                Card: {
                    ID: row.CardID,
                    Name: row.CardName,
                    ImagePath: row.CardImageType
                        ? `Cards(ID='${row.CardID}',IsActiveEntity=true)/Image`
                        : undefined
                },
                Category: row.CategoryID
                    ? {
                        ID: row.CategoryID,
                        Name: row.CategoryName,
                        ImagePath: row.CategoryImageType
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
                code: rows[0]?.CurrencyCode ||
                    'BRL'
            },
            TotalAmount: total.toDecimalPlaces(2).toNumber(),
            KPIs: {
                TotalTransactions: transactions.length,
                TotalCards: cards.size,
                TotalCategories: categories.size
            },
            Transactions: transactions
        });
    }
    toEntityObject() {
        return this.cleanEntity(this.properties);
    }
}
exports.CompleteInvoiceModel = CompleteInvoiceModel;
//# sourceMappingURL=complete-invoice.js.map