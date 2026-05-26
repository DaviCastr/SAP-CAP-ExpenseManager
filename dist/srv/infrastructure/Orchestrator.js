"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orchestrator = void 0;
const either_1 = require("@sweet-monads/either");
const ServiceRegistry_1 = require("./ServiceRegistry");
class Orchestrator {
    static async processBeforeCreate(obj, user) {
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            const service = ServiceRegistry_1.ServiceRegistry.get(key);
            if (!service)
                continue;
            if (Array.isArray(value)) {
                for (const item of value) {
                    const result = await service.beforeCreate?.(item, user);
                    if (result?.isLeft?.())
                        return result;
                    const nested = await Orchestrator.processBeforeCreate(item, user);
                    if (nested?.isLeft?.())
                        return nested;
                }
            }
            else if (this.isValidAssociation(key, value)) {
                const result = await service.beforeCreate?.(value, user);
                if (result?.isLeft?.())
                    return result;
                const nested = await Orchestrator.processBeforeCreate(value, user);
                if (nested?.isLeft?.())
                    return nested;
            }
        }
        return (0, either_1.right)(true);
    }
    static async processBeforeUpdate(obj, user) {
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            const service = ServiceRegistry_1.ServiceRegistry.get(key);
            if (!service)
                continue;
            if (Array.isArray(value)) {
                for (const item of value) {
                    const result = await service.beforeCreate?.(item, user);
                    if (result?.isLeft?.())
                        return result;
                    const nested = await Orchestrator.processBeforeUpdate(item, user);
                    if (nested?.isLeft?.())
                        return nested;
                }
            }
            else if (this.isValidAssociation(key, value)) {
                const result = await service.beforeCreate?.(value, user);
                if (result?.isLeft?.())
                    return result;
                const nested = await Orchestrator.processBeforeUpdate(value, user);
                if (nested?.isLeft?.())
                    return nested;
            }
        }
        return (0, either_1.right)(true);
    }
    static async processAfterRead(obj, user) {
        if (!obj)
            return obj;
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            const service = ServiceRegistry_1.ServiceRegistry.get(key);
            if (!service)
                continue;
            if (Array.isArray(value)) {
                let filtered = [];
                let result = await service.afterRead?.(value, user);
                if (result?.isRight())
                    result = result?.value;
                else
                    result = [];
                filtered = [...(filtered || []), ...result];
                obj[key] = filtered;
            }
            else if (this.isValidAssociation(key, value)) {
                const result = await service.processAfterRead?.([value], user);
                if (!result || result.length === 0) {
                    obj[key] = null;
                }
                else {
                    obj[key] = result[0];
                }
            }
        }
        return (0, either_1.right)(obj);
    }
    static isValidAssociation(key, value) {
        if (!value)
            return false;
        if (key.includes('Draft'))
            return false;
        if (typeof value !== 'object')
            return false;
        return true;
    }
}
exports.Orchestrator = Orchestrator;
//# sourceMappingURL=Orchestrator.js.map