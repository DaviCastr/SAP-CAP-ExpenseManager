"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oLiabilityControllerFactory = void 0;
const implementation_1 = require("@/controllers/liability/implementation");
const liability_1 = require("../services/liability");
exports.oLiabilityControllerFactory = new implementation_1.LiabilityControllerImplementation(liability_1.oLiabilityServiceFactory);
//# sourceMappingURL=liability.js.map