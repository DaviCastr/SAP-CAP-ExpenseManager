"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oLiabilityTransactionRouteFactory = void 0;
const implementation_1 = require("@/routes/liability-transaction/implementation");
const liability_transaction_1 = require("../controllers/liability-transaction");
exports.oLiabilityTransactionRouteFactory = new implementation_1.LiabilityTransactionRouteImplementation(liability_transaction_1.oLiabilityTransactionControllerFactory);
//# sourceMappingURL=liability-transaction.js.map