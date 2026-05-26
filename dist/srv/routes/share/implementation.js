"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
class ShareRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    constructor(Controller) {
        super();
        this.Controller = Controller;
    }
    main(Service) {
        const { Shares } = Service.entities;
        this.mainBase(Service, Shares);
    }
}
exports.ShareRouteImplementation = ShareRouteImplementation;
//# sourceMappingURL=implementation.js.map