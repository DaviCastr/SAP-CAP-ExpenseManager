"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oInvoiceRouteFactory = void 0;
const implementation_1 = require("@/routes/invoice/implementation");
const invoice_1 = require("../controllers/invoice");
const makeInvoiceRoute = () => {
    return new implementation_1.InvoiceRouteImplementation(invoice_1.oInvoiceControllerFactory);
};
exports.oInvoiceRouteFactory = makeInvoiceRoute();
//# sourceMappingURL=invoice.js.map