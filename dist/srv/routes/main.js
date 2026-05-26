"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("@/factories/routes/main");
const cds_1 = __importDefault(require("@sap/cds"));
class GestaoGastos extends cds_1.default.ApplicationService {
    init() {
        main_1.oMainRouteFactory.main(this);
        return super.init();
    }
}
module.exports = GestaoGastos;
//# sourceMappingURL=main.js.map