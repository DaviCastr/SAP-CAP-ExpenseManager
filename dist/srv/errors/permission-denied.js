"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionDenied = void 0;
const abstract_1 = require("@/errors/abstract");
class PermissionDenied extends abstract_1.AbstractError {
    constructor(message, errorCode = 403, stack) {
        super(message, errorCode, stack);
    }
    get message() {
        return this.message;
    }
}
exports.PermissionDenied = PermissionDenied;
//# sourceMappingURL=permission-denied.js.map