"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityControllerImplementation = void 0;
const implementation_1 = require("../base/implementation");
class LiabilityControllerImplementation extends implementation_1.BaseControllerImplementation {
    Service;
    constructor(Service) {
        super();
        this.Service =
            Service;
    }
    async createLiability() {
        const result = await this.Service
            .createLiability();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(201, result.value);
    }
    async dashboard() {
        const result = await this.Service
            .dashboard();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
    async analytics() {
        const result = await this.Service
            .analytics();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
    async paymentSchedule() {
        const result = await this.Service
            .paymentSchedule();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
    async renegotiate() {
        const result = await this.Service
            .renegotiate();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(201, result.value);
    }
    async futureImpact() {
        const result = await this.Service
            .futureImpact();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
    async payLiability() {
        const result = await this.Service
            .payLiability();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(201, result.value);
    }
    async closeLiability() {
        const result = await this.Service
            .closeLiability();
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
}
exports.LiabilityControllerImplementation = LiabilityControllerImplementation;
//# sourceMappingURL=implementation.js.map