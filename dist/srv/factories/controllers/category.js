"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oCategoryControllerFactory = void 0;
const category_1 = require("../services/category");
const implementation_1 = require("@/controllers/category/implementation");
const makeCategoryController = () => {
    return new implementation_1.CategoryControllerImplementation(category_1.oCategoryServiceFactory);
};
exports.oCategoryControllerFactory = makeCategoryController();
//# sourceMappingURL=category.js.map