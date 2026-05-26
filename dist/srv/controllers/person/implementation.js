"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonControllerImplementation = void 0;
const implementation_1 = require("../base/implementation");
class PersonControllerImplementation extends implementation_1.BaseControllerImplementation {
    Service;
    constructor(Service) {
        super();
        this.Service = Service;
    }
    async addCardExpense() {
        const result = await this.Service.addCardExpense();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(201, result.value);
    }
    async sendInvoices() {
        const result = await this.Service.sendInvoices();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(201, result.value);
    }
    async cardExpensesByCategories() {
        const result = await this.Service.cardExpensesByCategories();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
    async simulateExpenses() {
        const result = await this.Service.simulateExpenses();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(201, result.value);
    }
    async simulateFinancialFuture() {
        const result = await this.Service.simulateFinancialFuture();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(201, result.value);
    }
    async retrieveTransactionsByCategory() {
        const result = await this.Service.retrieveTransactionsByCategory();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
    async retrieveCompleteInvoice() {
        const result = await this.Service.retrieveCompleteInvoice();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
}
exports.PersonControllerImplementation = PersonControllerImplementation;
//# sourceMappingURL=implementation.js.map