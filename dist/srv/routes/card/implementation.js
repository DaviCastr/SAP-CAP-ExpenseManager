"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
class CardRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    constructor(Controller) {
        super();
        this.Controller = Controller;
    }
    main(Service) {
        const { Cards } = Service.entities;
        this.mainBase(Service, Cards);
    }
}
exports.CardRouteImplementation = CardRouteImplementation;
//# sourceMappingURL=implementation.js.map