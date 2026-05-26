"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionControllerImplementation = void 0;
const implementation_1 = require("../base/implementation");
class TransactionControllerImplementation extends implementation_1.BaseControllerImplementation {
    Service;
    constructor(Service) {
        super();
        this.Service = Service;
    }
    async onDelete(Transaction) {
        const oResult = await this.Service.onDelete(Transaction);
        if (oResult.isLeft()) {
            return this.error(oResult.value.code, oResult.value.message);
        }
        return this.success(204, oResult.value);
    }
    async afterCreate(Transactions) {
        const oResult = await this.Service.afterCreate(Transactions);
        if (oResult.isLeft()) {
            return this.error(oResult.value.code, oResult.value.message);
        }
        return this.success(201, oResult.value);
    }
    async afterUpdate(Transactions) {
        const oResult = await this.Service.afterUpdate(Transactions);
        if (oResult.isLeft()) {
            return this.error(oResult.value.code, oResult.value.message);
        }
        return this.success(204, oResult.value);
    }
}
exports.TransactionControllerImplementation = TransactionControllerImplementation;
//# sourceMappingURL=implementation.js.map