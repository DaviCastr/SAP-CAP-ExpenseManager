"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oTransactionRouteFactory = void 0;
const implementation_1 = require("@/routes/transaction/implementation");
const transaction_1 = require("../controllers/transaction");
const makeTransactionRoute = () => {
    return new implementation_1.TransactionRouteImplementation(transaction_1.oTransactionControllerFactory);
};
exports.oTransactionRouteFactory = makeTransactionRoute();
//# sourceMappingURL=transaction.js.map