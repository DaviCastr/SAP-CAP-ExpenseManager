import { right } from "@sweet-monads/either";
import { ServiceRegistry } from "./ServiceRegistry";

export class Orchestrator {

    static async processBeforeCreate(obj: any, user: any) {

        for (const key of Object.keys(obj)) {

            const value = obj[key];
            const service = ServiceRegistry.get(key);

            if (!service) continue;

            if (Array.isArray(value)) {

                for (const item of value) {

                    const result = await service.beforeCreate?.(item, user);
                    if (result?.isLeft?.()) return result;

                    const nested = await Orchestrator.processBeforeCreate(item, user);
                    if (nested?.isLeft?.()) return nested;

                }

            } else if (this.isValidAssociation(key, value)) {

                const result = await service.beforeCreate?.(value, user);
                if (result?.isLeft?.()) return result;

                const nested = await Orchestrator.processBeforeCreate(value, user);
                if (nested?.isLeft?.()) return nested;

            }

        }

        return right(true);

    }


    static async processBeforeUpdate(obj: any, user: any) {

        for (const key of Object.keys(obj)) {

            const value = obj[key];
            const service = ServiceRegistry.get(key);

            if (!service) continue;

            if (Array.isArray(value)) {

                for (const item of value) {

                    const result = await service.beforeCreate?.(item, user);
                    if (result?.isLeft?.()) return result;

                    const nested = await Orchestrator.processBeforeUpdate(item, user);
                    if (nested?.isLeft?.()) return nested;

                }

            } else if (this.isValidAssociation(key, value)) {

                const result = await service.beforeCreate?.(value, user);
                if (result?.isLeft?.()) return result;

                const nested = await Orchestrator.processBeforeUpdate(value, user);
                if (nested?.isLeft?.()) return nested;

            }

        }

        return right(true);

    }


    static async processAfterRead(obj: any, user: any): Promise<any> {

        if (!obj) return obj;

        for (const key of Object.keys(obj)) {

            const value = obj[key];
            const service = ServiceRegistry.get(key);

            if (!service) continue;

            if (Array.isArray(value)) {

                let filtered: any[] = [];

                let result = await service.afterRead?.(value, user);

                if (result?.isRight()) result = result?.value;
                else result = []

                filtered = [...(filtered || []), ...result];

                obj[key] = filtered;

            } else if (this.isValidAssociation(key, value)) {

                const result = await service.processAfterRead?.([value], user);

                if (!result || result.length === 0) {

                    obj[key] = null;

                } else {

                    obj[key] = result[0];
                }

            }

        }

        return right(obj);
    }


    static isValidAssociation(key: string, value: any) {

        if (!value) return false;

        if (key.includes('Draft')) return false;

        if (typeof value !== 'object') return false;

        return true;

    }

}