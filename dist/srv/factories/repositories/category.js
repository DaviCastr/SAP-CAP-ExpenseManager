"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oCategoryRepositoryFactory = void 0;
const implementation_1 = require("@/repositories/category/implementation");
const makeCategoryRepository = () => {
    return new implementation_1.CategoryRepositoryImplementation();
};
exports.oCategoryRepositoryFactory = makeCategoryRepository();
//# sourceMappingURL=category.js.map