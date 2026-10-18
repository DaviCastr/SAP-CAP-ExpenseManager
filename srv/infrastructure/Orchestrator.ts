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
            const service = ServiceRegistry.get(key) ?? Orchestrator.toOneService(key, value);

            if (!service) continue;

            if (Array.isArray(value)) {

                let filtered: any[] = [];

                let result = await service.afterRead?.(value, user);

                if (result?.isRight()) result = result?.value;
                else result = []

                filtered = [...(filtered || []), ...result];

                obj[key] = filtered;

            } else if (this.isValidAssociation(key, value)) {

                // processAfterRead devolve um Either com as linhas permitidas.
                const result = await service.processAfterRead?.([value], user);
                const allowed = result?.isRight?.() ? result.value : [];

                obj[key] = allowed?.length ? allowed[0] : null;

            }

        }

        return right(obj);
    }


    /**
     * Associações to-one usam o nome no singular (Person, Card, Invoice,
     * Category, Liability, Share), mas o registro é pelo nome da entidade no
     * plural. Só para leitura: o CAP não aplica where em $expand to-one, então
     * a permissão delas é checada aqui.
     */
    static toOneService(key: string, value: any) {

        if (!value || Array.isArray(value) || typeof value !== 'object' || !value.ID) return undefined;

        const plural = key.endsWith('y') ? `${key.slice(0, -1)}ies` : `${key}s`;

        return ServiceRegistry.get(plural);

    }


    static isValidAssociation(key: string, value: any) {

        if (!value) return false;

        if (key.includes('Draft')) return false;

        if (typeof value !== 'object') return false;

        return true;

    }

}