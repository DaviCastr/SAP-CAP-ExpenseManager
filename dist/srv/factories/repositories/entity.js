"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oEntityRepositoryFactory = void 0;
const implementation_1 = require("@/repositories/entity/implementation");
const makeEntityRepository = () => {
    return new implementation_1.EntityRepositoryImplementation();
};
exports.oEntityRepositoryFactory = makeEntityRepository();
//# sourceMappingURL=entity.js.map