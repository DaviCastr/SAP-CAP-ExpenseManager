"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oLiabilityTransactionControllerFactory = void 0;
const implementation_1 = require("@/controllers/liability-transaction/implementation");
const liability_transaction_1 = require("../services/liability-transaction");
exports.oLiabilityTransactionControllerFactory = new implementation_1.LiabilityTransactionControllerImplementation(liability_transaction_1.oLiabilityTransactionServiceFactory);
//# sourceMappingURL=liability-transaction.js.map