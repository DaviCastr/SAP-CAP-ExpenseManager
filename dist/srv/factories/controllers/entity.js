"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oEntityControllerFactory = void 0;
const entity_1 = require("../services/entity");
const implementation_1 = require("@/controllers/entity/implementation");
const makeEntityController = () => {
    return new implementation_1.EntityControllerImplementation(entity_1.oEntityServiceFactory);
};
exports.oEntityControllerFactory = makeEntityController();
//# sourceMappingURL=entity.js.map