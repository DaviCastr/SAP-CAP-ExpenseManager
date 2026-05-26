"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityTransactionControllerImplementation = void 0;
const implementation_1 = require("../base/implementation");
class LiabilityTransactionControllerImplementation extends implementation_1.BaseControllerImplementation {
    Service;
    constructor(Service) {
        super();
        this.Service =
            Service;
    }
    async reverseTransaction() {
        const result = await this.Service
            .reverseTransaction();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
    async recalculateLiability() {
        const result = await this.Service
            .recalculateLiability();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
}
exports.LiabilityTransactionControllerImplementation = LiabilityTransactionControllerImplementation;
//# sourceMappingURL=implementation.js.map