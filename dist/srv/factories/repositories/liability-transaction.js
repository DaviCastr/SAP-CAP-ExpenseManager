"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oLiabilityTransactionRepositoryFactory = void 0;
const implementation_1 = require("@/repositories/liability-transaction/implementation");
const makeLiabilityTransactionRepository = () => {
    return new implementation_1.LiabilityTransactionRepositoryImplementation();
};
exports.oLiabilityTransactionRepositoryFactory = makeLiabilityTransactionRepository();
//# sourceMappingURL=liability-transaction.js.map