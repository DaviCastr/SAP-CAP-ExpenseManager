"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
const abstract_1 = require("@/errors/abstract");
class ServerError extends abstract_1.AbstractError {
    constructor(stack, message = 'internalServerError') {
        super(message, 500, stack);
    }
    get message() {
        return this.message;
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=server-error.js.map