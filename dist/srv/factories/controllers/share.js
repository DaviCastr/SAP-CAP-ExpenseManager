"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oShareControllerFactory = void 0;
const share_1 = require("../services/share");
const implementation_1 = require("@/controllers/share/implementation");
const makeShareController = () => {
    return new implementation_1.ShareControllerImplementation(share_1.oShareServiceFactory);
};
exports.oShareControllerFactory = makeShareController();
//# sourceMappingURL=share.js.map