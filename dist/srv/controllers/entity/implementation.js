"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityControllerImplementation = void 0;
const implementation_1 = require("../base/implementation");
class EntityControllerImplementation extends implementation_1.BaseControllerImplementation {
    Service;
    constructor(Service) {
        super();
        this.Service = Service;
    }
}
exports.EntityControllerImplementation = EntityControllerImplementation;
//# sourceMappingURL=implementation.js.map