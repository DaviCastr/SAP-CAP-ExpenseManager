"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("@/factories/routes/entity");
const share_1 = require("@/factories/routes/share");
const cds_1 = __importDefault(require("@sap/cds"));
class Share extends cds_1.default.ApplicationService {
    init() {
        share_1.oShareRouteFactory.main(this);
        entity_1.oEntityRouteFactory.main(this);
        return super.init();
    }
}
module.exports = Share;
//# sourceMappingURL=share.js.map