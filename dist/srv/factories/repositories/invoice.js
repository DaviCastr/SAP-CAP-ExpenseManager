"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oInvoiceRepositoryFactory = void 0;
const implementation_1 = require("@/repositories/invoice/implementation");
const makeInvoiceRepository = () => {
    return new implementation_1.InvoiceRepositoryImplementation();
};
exports.oInvoiceRepositoryFactory = makeInvoiceRepository();
//# sourceMappingURL=invoice.js.map