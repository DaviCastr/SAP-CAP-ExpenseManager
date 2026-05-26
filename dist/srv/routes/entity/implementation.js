"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
class EntityRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    constructor(Controller) {
        super();
        this.Controller = Controller;
    }
    main(Service) {
        const { Entities } = Service.entities;
        this.mainBase(Service, Entities);
    }
}
exports.EntityRouteImplementation = EntityRouteImplementation;
//# sourceMappingURL=implementation.js.map