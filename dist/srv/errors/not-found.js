"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const abstract_1 = require("@/errors/abstract");
class NotFoundError extends abstract_1.AbstractError {
    constructor(message, stack) {
        super(message, 404, stack);
    }
    get message() {
        return this.message;
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=not-found.js.map