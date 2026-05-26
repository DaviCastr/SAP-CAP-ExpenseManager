"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
class CategoryRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    constructor(Controller) {
        super();
        this.Controller = Controller;
    }
    main(Service) {
        const { Categories } = Service.entities;
        this.mainBase(Service, Categories);
    }
}
exports.CategoryRouteImplementation = CategoryRouteImplementation;
//# sourceMappingURL=implementation.js.map