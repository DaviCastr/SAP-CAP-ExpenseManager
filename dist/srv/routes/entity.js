"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("@/factories/routes/entity");
const cds_1 = __importDefault(require("@sap/cds"));
class Entity extends cds_1.default.ApplicationService {
    init() {
        entity_1.oEntityRouteFactory.main(this);
        return super.init();
    }
}
module.exports = Entity;
//# sourceMappingURL=entity.js.map