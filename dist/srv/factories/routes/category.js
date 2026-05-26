"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oCategoryRouteFactory = void 0;
const category_1 = require("../controllers/category");
const implementation_1 = require("@/routes/category/implementation");
const makeCategoryRoute = () => {
    return new implementation_1.CategoryRouteImplementation(category_1.oCategoryControllerFactory);
};
exports.oCategoryRouteFactory = makeCategoryRoute();
//# sourceMappingURL=category.js.map