"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardExpensesByCategoryModel = void 0;
const base_1 = require("./base");
const currency_1 = require("./currency");
class CardExpensesByCategoryModel extends base_1.BaseModel {
    properties;
    constructor(properties) {
        super();
        this.properties = properties;
    }
    static with(properties) {
        return new CardExpensesByCategoryModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(CardExpensesByCategory) {
        return CardExpensesByCategory?.map((Expense) => {
            return CardExpensesByCategoryModel.with({
                TotalAmount: this.retrieveDecimal(Expense.TotalAmount),
                Currency: currency_1.CurrencyModel.singleModel({ code: Expense.Currency?.code }),
                Categories: Expense?.Categories?.map((item) => {
                    return {
                        ID: item?.ID,
                        Name: item?.Name,
                        ImagePath: item?.ImagePath,
                        TotalAmount: this.retrieveDecimal(item?.TotalAmount),
                        Percent: this.retrieveDecimal(item?.Percent)
                    };
                })
            });
        });
    }
    get TotalAmount() {
        return this.properties.TotalAmount;
    }
    get Currency() {
        return this.properties.Currency;
    }
    get Categories() {
        return this.properties.Categories;
    }
    toObject() {
        return this.properties;
    }
    toEntityObject() {
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
                };
            })
        });
    }
}
exports.CardExpensesByCategoryModel = CardExpensesByCategoryModel;
//# sourceMappingURL=card-expenses-by-category.js.map