"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oMainRouteFactory = void 0;
const implementation_1 = require("@/routes/main/implementation");
const makeMainRoute = () => {
    return new implementation_1.MainRouteImplementation();
};
exports.oMainRouteFactory = makeMainRoute();
//# sourceMappingURL=main.js.map