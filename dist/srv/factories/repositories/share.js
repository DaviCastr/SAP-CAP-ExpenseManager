"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oShareRepositoryFactory = void 0;
const implementation_1 = require("@/repositories/share/implementation");
const makeShareRepository = () => {
    return new implementation_1.ShareRepositoryImplementation();
};
exports.oShareRepositoryFactory = makeShareRepository();
//# sourceMappingURL=share.js.map