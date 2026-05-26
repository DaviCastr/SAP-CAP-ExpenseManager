"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oEntityRouteFactory = void 0;
const implementation_1 = require("@/routes/entity/implementation");
const entity_1 = require("../controllers/entity");
const makeEntityRoute = () => {
    return new implementation_1.EntityRouteImplementation(entity_1.oEntityControllerFactory);
};
exports.oEntityRouteFactory = makeEntityRoute();
//# sourceMappingURL=entity.js.map