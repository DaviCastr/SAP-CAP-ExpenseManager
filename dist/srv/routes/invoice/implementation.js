"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
class InvoiceRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    constructor(Controller) {
        super();
        this.Controller = Controller;
    }
    main(Service) {
        const { Invoices } = Service.entities;
        this.mainBase(Service, Invoices);
    }
}
exports.InvoiceRouteImplementation = InvoiceRouteImplementation;
//# sourceMappingURL=implementation.js.map