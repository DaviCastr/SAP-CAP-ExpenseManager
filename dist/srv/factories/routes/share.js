"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oShareRouteFactory = void 0;
const implementation_1 = require("@/routes/share/implementation");
const share_1 = require("../controllers/share");
const makeShareRoute = () => {
    return new implementation_1.ShareRouteImplementation(share_1.oShareControllerFactory);
};
exports.oShareRouteFactory = makeShareRoute();
//# sourceMappingURL=share.js.map