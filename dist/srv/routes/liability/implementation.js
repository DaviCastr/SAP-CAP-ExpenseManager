"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
class LiabilityRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    constructor(Controller) {
        super();
        this.Controller =
            Controller;
    }
    main(Service) {
        const { Liabilities } = Service.entities;
        this.mainBase(Service, Liabilities);
        Service.on("CreateLiability", this.createLiability.bind(this));
        Service.on("Dashboard", this.dashboard.bind(this));
        Service.on("Analytics", this.analytics.bind(this));
        Service.on("PaymentSchedule", this.paymentSchedule.bind(this));
        Service.on("Renegotiate", this.renegotiate.bind(this));
        Service.on("FutureImpact", this.futureImpact.bind(this));
        Service.on("PayLiability", this.payLiability.bind(this));
        Service.on("CloseLiability", this.closeLiability.bind(this));
    }
    async createLiability(Request) {
        const result = await this.Controller
            .createLiability();
        if (result.status !== 201) {
            return this.returnRejectMessage(Request, result);
        }
        return result;
    }
    async dashboard(Request) {
        const result = await this.Controller
            .dashboard();
        if (result.status !== 200) {
            return this.returnRejectMessage(Request, result);
        }
        return result;
    }
    async analytics(Request) {
        const result = await this.Controller
            .analytics();
        if (result.status !== 200) {
            return this.returnRejectMessage(Request, result);
        }
        return result;
    }
    async paymentSchedule(Request) {
        const result = await this.Controller
            .paymentSchedule();
        if (result.status !== 200) {
            return this.returnRejectMessage(Request, result);
        }
        return result;
    }
    async renegotiate(Request) {
        const result = await this.Controller
            .renegotiate();
        if (result.status !== 201) {
            return this.returnRejectMessage(Request, result);
        }
        return result;
    }
    async futureImpact(Request) {
        const result = await this.Controller
            .futureImpact();
        if (result.status !== 200) {
            return this.returnRejectMessage(Request, result);
        }
        return result;
    }
    async payLiability(Request) {
        const result = await this.Controller
            .payLiability();
        if (result.status !== 201) {
            return this.returnRejectMessage(Request, result);
        }
        return result;
    }
    async closeLiability(Request) {
        const result = await this.Controller
            .closeLiability();
        if (result.status !== 200) {
            return this.returnRejectMessage(Request, result);
        }
        return result;
    }
}
exports.LiabilityRouteImplementation = LiabilityRouteImplementation;
//# sourceMappingURL=implementation.js.map