"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oLiabilityRepositoryFactory = void 0;
const implementation_1 = require("@/repositories/liability/implementation");
const makeLiabilityRepository = () => {
    return new implementation_1.LiabilityRepositoryImplementation();
};
exports.oLiabilityRepositoryFactory = makeLiabilityRepository();
//# sourceMappingURL=liability.js.map