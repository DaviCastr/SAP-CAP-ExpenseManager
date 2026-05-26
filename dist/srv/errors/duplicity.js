"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicityError = void 0;
const abstract_1 = require("@/errors/abstract");
class DuplicityError extends abstract_1.AbstractError {
    constructor(stack, message = 'error.duplicity') {
        super(message, 403, stack);
    }
    get message() {
        return this.message;
    }
}
exports.DuplicityError = DuplicityError;
//# sourceMappingURL=duplicity.js.map