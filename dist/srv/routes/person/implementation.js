"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
class PersonRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    constructor(Controller) {
        super();
        this.Controller = Controller;
    }
    main(Service) {
        const { Persons } = Service.entities;
        this.mainBase(Service, Persons);
        Service.on('AddCardExpense', this.addCardExpense.bind(this));
        Service.on('SendInvoices', this.sendInvoices.bind(this));
        Service.on('CardExpensesByCategories', this.cardExpensesByCategories.bind(this));
        Service.on('SimulateExpenses', this.simulateExpenses.bind(this));
        Service.on('SimulateFinancialFuture', this.simulateFinancialFuture.bind(this));
        Service.on('RetrieveTransactionsByCategory', this.retrieveTransactionsByCategory.bind(this));
        Service.on('RetrieveCompleteInvoice', this.retrieveCompleteInvoice.bind(this));
    }
    async addCardExpense(Request) {
        const oResult = await this.Controller.addCardExpense();
        if (oResult.status != 201) {
            return this.returnRejectMessage(Request, oResult);
        }
        return oResult;
    }
    async sendInvoices(Request) {
        const oResult = await this.Controller.sendInvoices();
        if (oResult.status != 201) {
            return this.returnRejectMessage(Request, oResult);
        }
        return oResult;
    }
    async cardExpensesByCategories(Request) {
        const oResult = await this.Controller.cardExpensesByCategories();
        if (oResult.status != 200) {
            return this.returnRejectMessage(Request, oResult);
        }
        return oResult;
    }
    async simulateExpenses(Request) {
        const oResult = await this.Controller.simulateExpenses();
        if (oResult.status != 201) {
            return this.returnRejectMessage(Request, oResult);
        }
        return oResult;
    }
    async simulateFinancialFuture(Request) {
        const oResult = await this.Controller.simulateFinancialFuture();
        if (oResult.status != 201) {
            return this.returnRejectMessage(Request, oResult);
        }
        return oResult;
    }
    async retrieveTransactionsByCategory(Request) {
        const oResult = await this.Controller.retrieveTransactionsByCategory();
        if (oResult.status != 200) {
            return this.returnRejectMessage(Request, oResult);
        }
        return oResult;
    }
    async retrieveCompleteInvoice(Request) {
        const oResult = await this.Controller.retrieveCompleteInvoice();
        if (oResult.status != 200) {
            return this.returnRejectMessage(Request, oResult);
        }
        return oResult;
    }
}
exports.PersonRouteImplementation = PersonRouteImplementation;
//# sourceMappingURL=implementation.js.map