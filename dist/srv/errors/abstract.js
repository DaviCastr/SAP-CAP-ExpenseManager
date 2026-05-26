"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractError = void 0;
class AbstractError extends Error {
    code;
    constructor(message, errorCode, stack) {
        super(message);
        this.code = errorCode;
        this.message = message;
        this.stack = stack;
    }
}
exports.AbstractError = AbstractError;
//# sourceMappingURL=abstract.js.map