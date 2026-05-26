"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulateExpenseModel = void 0;
const base_1 = require("./base");
const currency_1 = require("./currency");
class SimulateExpenseModel extends base_1.BaseModel {
    properties;
    constructor(properties) {
        super();
        this.properties = properties;
    }
    static with(properties) {
        return new SimulateExpenseModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(SimulateExpense) {
        return SimulateExpense?.map((Expense) => {
            return SimulateExpenseModel.with({
                TotalAmount: this.retrieveDecimal(Expense.TotalAmount),
                TotalMonth: this.retrieveDecimal(Expense.TotalMonth),
                AmountSaving: this.retrieveDecimal(Expense.AmountSaving),
                Currency: currency_1.CurrencyModel.singleModel({ code: Expense.Currency?.code })
            });
        });
    }
    get TotalAmount() {
        return this.properties.TotalAmount;
    }
    get TotalMonth() {
        return this.properties.TotalMonth;
    }
    get AmountSaving() {
        return this.properties.AmountSaving;
    }
    get Currency() {
        return this.properties.Currency;
    }
    toObject() {
        return this.properties;
    }
    toEntityObject() {
        return this.cleanEntity({
            TotalAmount: this.properties.TotalAmount?.toNumber(),
            TotalMonth: this.properties.TotalMonth?.toNumber(),
            AmountSaving: this.properties.AmountSaving?.toNumber(),
            Currency: this.properties.Currency?.toEntityObject()
        });
    }
}
exports.SimulateExpenseModel = SimulateExpenseModel;
//# sourceMappingURL=simulate-expense.js.map