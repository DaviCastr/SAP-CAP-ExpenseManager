"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
class TransactionRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    constructor(Controller) {
        super();
        this.Controller = Controller;
    }
    main(Service) {
        const { Transactions } = Service.entities;
        this.mainBase(Service, Transactions);
        //On
        Service.on("DELETE", Transactions, this.onDelete.bind(this));
        //After
        Service.after("CREATE", Transactions, this.afterCreate.bind(this));
        Service.after("UPDATE", Transactions, this.afterUpdate.bind(this));
    }
    async afterCreate(Transactions, Request) {
        const oTransactions = Array.isArray(Transactions)
            ? Transactions
            : [Transactions];
        const oResult = await this.Controller.afterCreate(oTransactions);
        if (oResult.status != 201) {
            return this.returnRejectMessage(Request, oResult);
        }
    }
    async afterUpdate(Transactions, Request) {
        const oTransactions = Array.isArray(Transactions)
            ? Transactions
            : [Transactions];
        const oResult = await this.Controller.afterUpdate(oTransactions);
        if (oResult.status != 204) {
            return this.returnRejectMessage(Request, oResult);
        }
    }
    async onDelete(Request, Next) {
        const oTransaction = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };
        const oResult = await this.Controller.onDelete(oTransaction);
        if (oResult.status != 204) {
            return this.returnRejectMessage(Request, oResult);
        }
        await Next();
    }
}
exports.TransactionRouteImplementation = TransactionRouteImplementation;
//# sourceMappingURL=implementation.js.map