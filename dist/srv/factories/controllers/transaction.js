"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oTransactionControllerFactory = void 0;
const implementation_1 = require("@/controllers/transaction/implementation");
const transaction_1 = require("../services/transaction");
const makeTransactionController = () => {
    return new implementation_1.TransactionControllerImplementation(transaction_1.oTransactionServiceFactory);
};
exports.oTransactionControllerFactory = makeTransactionController();
//# sourceMappingURL=transaction.js.map