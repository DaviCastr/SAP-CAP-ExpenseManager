"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oPersonRepositoryFactory = void 0;
const implementation_1 = require("@/repositories/person/implementation");
const makePersonRepository = () => {
    return new implementation_1.PersonRepositoryImplementation();
};
exports.oPersonRepositoryFactory = makePersonRepository();
//# sourceMappingURL=person.js.map