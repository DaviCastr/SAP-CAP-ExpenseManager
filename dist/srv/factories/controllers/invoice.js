"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oInvoiceControllerFactory = void 0;
const implementation_1 = require("@/controllers/invoice/implementation");
const invoice_1 = require("../services/invoice");
const makeInvoiceController = () => {
    return new implementation_1.InvoiceControllerImplementation(invoice_1.oInvoiceServiceFactory);
};
exports.oInvoiceControllerFactory = makeInvoiceController();
//# sourceMappingURL=invoice.js.map