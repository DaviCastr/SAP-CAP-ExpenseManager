"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oPersonRouteFactory = void 0;
const implementation_1 = require("@/routes/person/implementation");
const person_1 = require("../controllers/person");
const makePersonRoute = () => {
    return new implementation_1.PersonRouteImplementation(person_1.oPersonControllerFactory);
};
exports.oPersonRouteFactory = makePersonRoute();
//# sourceMappingURL=person.js.map