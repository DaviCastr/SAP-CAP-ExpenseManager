"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oTransactionRepositoryFactory = void 0;
const implementation_1 = require("@/repositories/transaction/implementation");
const makeTransactionRepository = () => {
    return new implementation_1.TransactionRepositoryImplementation();
};
exports.oTransactionRepositoryFactory = makeTransactionRepository();
//# sourceMappingURL=transaction.js.map