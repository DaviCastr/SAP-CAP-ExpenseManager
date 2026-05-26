"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oCardRepositoryFactory = void 0;
const implementation_1 = require("@/repositories/card/implementation");
const makeCardRepository = () => {
    return new implementation_1.CardRepositoryImplementation();
};
exports.oCardRepositoryFactory = makeCardRepository();
//# sourceMappingURL=card.js.map