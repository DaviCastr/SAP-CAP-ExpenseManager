"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oLiabilityRouteFactory = void 0;
const implementation_1 = require("@/routes/liability/implementation");
const liability_1 = require("../controllers/liability");
exports.oLiabilityRouteFactory = new implementation_1.LiabilityRouteImplementation(liability_1.oLiabilityControllerFactory);
//# sourceMappingURL=liability.js.map