"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oCardRouteFactory = void 0;
const implementation_1 = require("@/routes/card/implementation");
const card_1 = require("../controllers/card");
const makeCardRoute = () => {
    return new implementation_1.CardRouteImplementation(card_1.oCardControllerFactory);
};
exports.oCardRouteFactory = makeCardRoute();
//# sourceMappingURL=card.js.map