"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("@/factories/routes/category");
const cds_1 = __importDefault(require("@sap/cds"));
class Category extends cds_1.default.ApplicationService {
    init() {
        category_1.oCategoryRouteFactory.main(this);
        return super.init();
    }
}
module.exports = Category;
//# sourceMappingURL=category.js.map