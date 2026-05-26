"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryTransactionsModel = void 0;
const base_1 = require("./base");
const currency_1 = require("./currency");
/**************************************************************************************************
 * MODEL
 **************************************************************************************************/
class CategoryTransactionsModel extends base_1.BaseModel {
    properties;
    constructor(properties) {
        super();
        this.properties = properties;
    }
    static with(properties) {
        return new CategoryTransactionsModel(properties);
    }
    static singleModel(data) {
        return this.mapModel([data])[0];
    }
    static mapModel(rows) {
        return (rows || []).map(row => {
            return CategoryTransactionsModel.with({
                ID: row.ID,
                Name: row.Name,
                ImagePath: row.ImagePath,
                Currency: currency_1.CurrencyModel.singleModel({
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
                        TotalAmount: this.retrieveDecimal(invoice.TotalAmount),
                        Transactions: (invoice.Transactions || []).map(tx => ({
                            ID: tx.ID,
                            Identifier: tx.Identifier,
                            Date: tx.Date,
                            Description: tx.Description,
                            Installment: tx.Installment,
                            TotalInstallments: tx.TotalInstallments,
                            Amount: this.retrieveDecimal(tx.Amount),
                            Currency: currency_1.CurrencyModel.singleModel({
                                code: tx.Currency?.code
                            })
                        }))
                    }))
                }))
            });
        });
    }
    get ID() {
        return this.properties.ID;
    }
    get Name() {
        return this.properties.Name;
    }
    get ImagePath() {
        return this.properties.ImagePath;
    }
    get Currency() {
        return this.properties.Currency;
    }
    get TotalAmount() {
        return this.properties.TotalAmount;
    }
    get Cards() {
        return this.properties.Cards;
    }
    toObject() {
        return this.properties;
    }
    toEntityObject() {
        return this.cleanEntity({
            ID: this.properties.ID,
            Name: this.properties.Name,
            ImagePath: this.properties.ImagePath,
            Currency: this.properties.Currency?.toEntityObject(),
            TotalAmount: this.properties.TotalAmount?.toNumber(),
            Cards: this.properties.Cards?.map(card => ({
                ID: card.ID,
                Name: card.Name,
                ImagePath: card.ImagePath,
                TotalAmount: card.TotalAmount?.toNumber(),
                Invoices: card.Invoices?.map(invoice => ({
                    ID: invoice.ID,
                    Year: invoice.Year,
                    Month: invoice.Month,
                    Description: invoice.Description,
                    TotalAmount: invoice.TotalAmount?.toNumber(),
                    Transactions: invoice.Transactions?.map(tx => ({
                        ID: tx.ID,
                        Identifier: tx.Identifier,
                        Date: tx.Date,
                        Description: tx.Description,
                        Installment: tx.Installment,
                        TotalInstallments: tx.TotalInstallments,
                        Amount: tx.Amount?.toNumber(),
                        Currency: tx.Currency?.toEntityObject()
                    }))
                }))
            }))
        });
    }
}
exports.CategoryTransactionsModel = CategoryTransactionsModel;
//# sourceMappingURL=transactions-by-category.js.map