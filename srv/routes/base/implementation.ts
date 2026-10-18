import cds, { entity, Request, Service } from "@sap/cds";
import { BaseRoute } from "./protocols";
import { BaseController, BaseControllerResponse } from "@/controllers/base";
import { Entity } from "@models/_";

export abstract class BaseRouteImplementation<Entity> implements BaseRoute {

    protected abstract Controller: BaseController<Entity>;

    protected mainBase(Service: Service, EntityDB: entity) {

        //Before
        Service.before("*", this.beforeAll.bind(this));
        Service.before("READ", EntityDB as entity, this.beforeRead.bind(this));
        Service.before("UPDATE", EntityDB as entity, this.beforeUpdate.bind(this));
        Service.before("PATCH", EntityDB as entity, this.beforeUpdate.bind(this));
        Service.before("EDIT", EntityDB as entity, this.beforeEdit.bind(this));
        Service.before("DELETE", EntityDB as entity, this.beforeDelete.bind(this));

        //After
        Service.after("READ", EntityDB as entity, this.afterRead.bind(this));

        if (EntityDB?.drafts) {

            Service.before("READ", EntityDB?.drafts as entity, this.beforeRead.bind(this));
            Service.before("CREATE", EntityDB?.drafts as entity, this.beforeCreate.bind(this));
            Service.before("PATCH", EntityDB?.drafts as entity, this.beforeUpdate.bind(this));
            Service.before("DELETE", EntityDB?.drafts as entity, this.beforeDelete.bind(this));
            Service.after("READ", EntityDB?.drafts as entity, this.afterRead.bind(this));

        }

        // Service.on("READ", EntityDB, async (req, next) => {

        //     let active = await next(); // ativos

        //     if(!Array.isArray(active)){
        //         active = [active];
        //     }

        //     const draftsOnly = await cds.run(
        //         SELECT.from(Categories.drafts!) 
        //             .where({ HasActiveEntity: false })
        //     );

        //     return [...active, ...draftsOnly];

        // });


    }

    public returnRejectMessage(Request: Request, Result: BaseControllerResponse): any {

        const oMessages = cds.i18n.messages;

        let oLocalizedMessage = oMessages.at(
            Result.data as string,
            Request.locale
        )

        if (!oLocalizedMessage) {

            oLocalizedMessage = Result.data as string;

        }

        return Request?.reject(Result.status, oLocalizedMessage as string);

    }


    public returnErrorMessage(Request: Request, Result: BaseControllerResponse): Error {

        const oMessages = cds.i18n.messages;

        let oLocalizedMessage = oMessages.at(
            Result.data as string,
            Request.locale
        )

        if (!oLocalizedMessage) {

            oLocalizedMessage = Result.data as string;

        }

        return Request?.error(Result.status, oLocalizedMessage as string);

    }


    protected async beforeAll(Request: Request): Promise<void> {

        (cds.context as any)._request = Request;

        (cds.context as any)._meta = {
            event: Request.event,
            hasTarget: !!Request.target,
            isDraft: Request.data?.IsActiveEntity === false
        };

    }


    protected async beforeRead(Request: Request): Promise<void> {

        const oResult = this.Controller.beforeRead(Request);

        if (oResult.status != 200) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    protected async beforeCreate(Request: Request): Promise<void> {

        const oEntity: Entity = Request.data;

        const oResult = await this.Controller.beforeCreate(oEntity, Request.user);

        if (oResult.status != 201) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    protected async beforeUpdate(Request: Request): Promise<void> {

        const oEntity: Entity = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult = await this.Controller.beforeUpdate(oEntity, Request.user);

        if (oResult.status != 204) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    protected async beforeEdit(Request: Request): Promise<void> {

        const oEntity: Entity = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult = await this.Controller.beforeEdit(oEntity, Request.user);

        if (oResult.status != 204) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    protected async beforeDelete(Request: Request): Promise<void> {

        const oEntity: Entity = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult = await this.Controller.beforeDelete(oEntity, Request.user);

        if (oResult.status != 204) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    protected async afterRead(Entities: Entity[] | Entity, Request: Request): Promise<void> {

        const isSingleEntity = !Array.isArray(Entities);
        const oEntities = isSingleEntity ? [Entities] : Entities;
        const entitiesData = oEntities.map(item => this.clone(item));
        const oResult = await this.Controller.afterRead(oEntities, Request.user);

        if (oResult.status >= 400) {
            return this.returnRejectMessage(Request, oResult);
        }

        // O afterRead filtra os $expand por permissão direto nos objetos lidos.
        // Essa versão filtrada é a fonte dos relacionamentos ao remontar o
        // resultado (a cópia bruta acima é anterior ao filtro).
        const filteredData = oEntities.map(item => this.clone(item));

        oEntities.length = 0;
        oEntities.push(...entitiesData);

        const oResultData = oResult.data;

        if (oEntities != oResultData) {

            let processedData = Array.isArray(oResultData) ? oResultData : [oResultData];

            processedData = processedData.map((processedItem, index) => {

                // Casa pelo ID (e rascunho/ativo), não pela posição: linhas
                // removidas pelo filtro deslocariam os índices.
                let originalIndex = processedItem ? (oEntities as any[]).findIndex((item: any) =>
                    item?.ID !== undefined && item.ID === processedItem.ID &&
                    (item.IsActiveEntity === undefined || processedItem.IsActiveEntity === undefined ||
                        item.IsActiveEntity === processedItem.IsActiveEntity)) : -1;

                // Sem ID para casar: usa a posição só se nenhuma linha foi removida.
                if (originalIndex < 0 && processedData.length === oEntities.length) {
                    originalIndex = index;
                }

                // Cópia bruta só com os itens de $expand que o filtro manteve
                // (os objetos filtrados vêm convertidos pelos models e perdem
                // campos técnicos, como os do draft, então não servem direto).
                const originalItem = originalIndex >= 0
                    ? this.pruneByFiltered(oEntities[originalIndex], filteredData[originalIndex])
                    : undefined;

                if (!originalItem || !processedItem) {
                    return processedItem;
                }

                const draftFields = { ...this.getDraftFields(originalItem) };

                Object.keys(draftFields).forEach(field => {
                    if (processedItem[field] === undefined) {
                        processedItem[field] = draftFields[field];
                    }
                });

                const merged = {
                    ...originalItem,
                    ...processedItem
                };

                this.addDraftsToArraysAndObjects(merged, originalItem);

                return merged;
            });

            oEntities.length = 0;
            oEntities.push(...processedData);

            if (Array.isArray((Request as any).results)) {
                
                (Request as any).results = oEntities;

            } else {

                (Request as any).results = oEntities[0];

            }

        }

    }


    /**
     * Remove da cópia bruta os itens de $expand que o afterRead descartou por
     * falta de permissão (casando pelo ID), mantendo os demais intactos.
     */
    private pruneByFiltered(raw: any, filtered: any): any {

        if (!raw || typeof raw !== 'object' || !filtered || typeof filtered !== 'object') {
            return raw;
        }

        const pruned = { ...raw };

        Object.keys(raw).forEach(field => {

            const rawValue = raw[field];

            if (!(field in filtered) || field.startsWith('Draft')) return;

            const filteredValue = filtered[field];

            if (Array.isArray(rawValue)) {

                if (!Array.isArray(filteredValue)) {
                    pruned[field] = [];
                    return;
                }

                pruned[field] = rawValue
                    .map(item => {
                        const match = filteredValue.find((kept: any) => kept?.ID !== undefined && kept.ID === item?.ID);
                        return match ? this.pruneByFiltered(item, match) : undefined;
                    })
                    .filter(item => item !== undefined);

            } else if (rawValue && typeof rawValue === 'object' && rawValue.ID !== undefined) {

                pruned[field] = filteredValue ? this.pruneByFiltered(rawValue, filteredValue) : null;

            }

        });

        return pruned;

    }


    private clone<T>(value: T): T {
        if (Array.isArray(value)) {
            return value.map(v => this.clone(v)) as T;
        }

        if (value && typeof value === "object") {
            return Object.fromEntries(
                Object.entries(value).map(([k, v]) => [k, this.clone(v)])
            ) as T;
        }

        return value;
    }


    private getDraftFields(entity: any): Record<string, any> {
        if (!entity) {
            return {};
        }

        const fields: Record<string, any> = {};

        const fixedFields = [
            'HasActiveEntity',
            'HasDraftEntity',
            'IsActiveEntity'
        ];

        fixedFields.forEach(field => {
            if (entity[field] !== undefined) {
                fields[field] = entity[field];
            }
        });

        Object.keys(entity)
            .filter(field => field.startsWith('Draft') || field.startsWith('$'))
            .forEach(field => {
                fields[field] = entity[field];
            });

        return fields;
    }

    private addDraftsToArraysAndObjects(obj: any, originalObj: any): void {
        if (!obj) return;

        Object.keys(obj).forEach(key => {
            if (Array.isArray(obj[key])) {

                if (key.startsWith('Draft')) {
                    return;
                }

                obj[key] = obj[key].map((item: any, index: number) => {

                    if (item && typeof item === 'object') {

                        const originalItem = originalObj[key][index] || originalObj[key][0];

                        let draftFields = this.getDraftFields(originalItem);

                        const enriched = { ...originalItem, ...item };

                        Object.keys(draftFields).forEach(field => {
                            if (enriched[field] === undefined) {
                                enriched[field] = draftFields[field];
                            }
                        });

                        this.addDraftsToArraysAndObjects(enriched, originalItem);

                        return enriched;
                    }
                    return item;
                });
            }
        });
    }


}