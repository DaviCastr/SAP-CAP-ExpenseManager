"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oPersonControllerFactory = void 0;
const implementation_1 = require("@/controllers/person/implementation");
const person_1 = require("../services/person");
const makePersonController = () => {
    return new implementation_1.PersonControllerImplementation(person_1.oPersonServiceFactory);
};
exports.oPersonControllerFactory = makePersonController();
//# sourceMappingURL=person.js.map