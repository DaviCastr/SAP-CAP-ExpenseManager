"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityTransactionRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
class LiabilityTransactionRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    constructor(Controller) {
        super();
        this.Controller =
            Controller;
    }
    main(Service) {
        const { LiabilityTransactions } = Service.entities;
        this.mainBase(Service, LiabilityTransactions);
        Service.on("ReverseTransaction", this.reverseTransaction.bind(this));
        Service.on("RecalculateLiability", this.recalculateLiability.bind(this));
    }
    async reverseTransaction(Request) {
        const result = await this.Controller
            .reverseTransaction();
        if (result.status !== 200) {
            return this.returnRejectMessage(Request, result);
        }
        return result;
    }
    async recalculateLiability(Request) {
        const result = await this.Controller
            .recalculateLiability();
        if (result.status !== 200) {
            return this.returnRejectMessage(Request, result);
        }
        return result;
    }
}
exports.LiabilityTransactionRouteImplementation = LiabilityTransactionRouteImplementation;
//# sourceMappingURL=implementation.js.map