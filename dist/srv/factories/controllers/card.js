"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oCardControllerFactory = void 0;
const implementation_1 = require("@/controllers/card/implementation");
const card_1 = require("../services/card");
const makeCardController = () => {
    return new implementation_1.CardControllerImplementation(card_1.oCardServiceFactory);
};
exports.oCardControllerFactory = makeCardController();
//# sourceMappingURL=card.js.map