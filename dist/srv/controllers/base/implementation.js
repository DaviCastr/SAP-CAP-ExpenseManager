"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseControllerImplementation = void 0;
class BaseControllerImplementation {
    beforeRead(Request) {
        const result = this.Service.beforeRead(Request);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(200, result.value);
    }
    async beforeCreate(Entity, LoggedUser) {
        const result = await this.Service.beforeCreate(Entity, LoggedUser);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(201, result.value);
    }
    async beforeUpdate(Entity, LoggedUser) {
        const result = await this.Service.beforeUpdate(Entity, LoggedUser);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(204, result.value);
    }
    async beforeEdit(Entity, LoggedUser) {
        const result = await this.Service.beforeEdit(Entity, LoggedUser);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(204, result.value);
    }
    async beforeDelete(Entity, LoggedUser) {
        const result = await this.Service.beforeDelete(Entity, LoggedUser);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(204, result.value);
    }
    async afterRead(Entities, LoggedUser) {
        const oResult = await this.Service.afterRead(Entities, LoggedUser);
        if (oResult.isLeft()) {
            return this.error(oResult.value.code, oResult.value.message);
        }
        return this.success(200, oResult.value);
    }
    success(code, data) {
        return {
            data,
            status: code
        };
    }
    error(code, message) {
        return {
            status: code,
            data: message
        };
    }
}
exports.BaseControllerImplementation = BaseControllerImplementation;
//# sourceMappingURL=implementation.js.map