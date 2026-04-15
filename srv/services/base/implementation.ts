import { PermissionDenied } from "@/errors/permission-denied";
import cds, { Request, User } from "@sap/cds";
import { Either, left, right } from "@sweet-monads/either";
import { BaseService } from "./protocols";
import { ShareModel } from "@/models/share";
import { ShareRepository } from "@/repositories/share";
import { EntityRepository } from "@/repositories/entity";
import { PersonRepository } from "@/repositories/person";
import { AbstractError } from "@/errors";
import { BaseRepository } from "@/repositories/base";
import { EntityModel } from "@/models/entity";
import { Orchestrator } from "@/infrastructure/Orchestrator";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

export abstract class BaseServiceImplementation<Entity> implements BaseService<Entity> {

    public abstract Repository: BaseRepository;

    constructor(
        protected readonly PersonRepository: PersonRepository,
        protected readonly ShareRepository: ShareRepository,
        protected readonly EntityRepository: EntityRepository) { }

    public beforeRead(Request: any): Either<AbstractError, boolean> {

        try {

            const oUserId = Request.user?.id;

            if (!oUserId || !Request.query?.SELECT)
                return right(true);

            const oPersonPath = this.personPath();
            const oEntityCode = this.entityCode();

            // const where = Request.query.SELECT.where ?? [];

            // if (where.length > 0)
            //     where.push('and');

            // where.push({
            //     xpr: [
            //         '(',

            //         { ref: [...oPersonPath, 'createdBy'] },
            //         '=',
            //         { val: oUserId },

            //         'or',

            //         {
            //             xpr: [
            //                 '(',
            //                 { ref: [...oPersonPath, 'Shares', 'User'] },
            //                 '=',
            //                 { val: oUserId },
            //                 // 'and',
            //                 // {
            //                 //     xpr: [
            //                 //         { ref: ['Person', 'Shares', 'User'] },
            //                 //         '=',
            //                 //         { val.user.id },
            //                 //         // 'or',
            //                 //         // { ref: ['Person', 'Shares', 'User'] },
            //                 //         // '=',
            //                 //         // { val: 2 },
            //                 //         // 'or',
            //                 //         // { ref: ['Person', 'Shares', 'Permission'] },
            //                 //         // '=',
            //                 //         // { val: 3 },
            //                 //         // 'or',
            //                 //         // { ref: ['Person', 'Shares', 'Permission'] },
            //                 //         // '=',
            //                 //         // { val: 4 }
            //                 //     ]
            //                 // },
            //                 ')'
            //             ]
            //         },

            //         ')'
            //     ]
            // });

            // Request.query.SELECT.where = where;

            // Request.query.where([
            //     '(',
            //     { ref: [...oPersonPath, 'createdBy'] },
            //     '=',
            //     { val: oUserId },

            //     'or',

            //     '(',
            //     { ref: [...oPersonPath, 'Shares', 'User'] },
            //     '=',
            //     { val: oUserId },
            //     'and',
            //     { ref: [...oPersonPath, 'Shares', 'Entities', 'Entity'] },
            //     '=',
            //     { val: oEntityCode },
            //     ')',

            //     ')'
            // ]);

            const parentField = this.parentField();

            if (parentField) {
                this.ensureParentField(Request, parentField);
            }

            Request.query.where([
                '(',
                { ref: [...oPersonPath, 'createdBy'] }, '=', { val: oUserId },
                'or',
                { ref: [...oPersonPath, 'ID'] }, 'in', this.buildPermissionExists(oUserId, oEntityCode as number),
                ')'
            ]);

            return right(true);

        } catch (oError) {

            const errorInstance: Error = oError as Error;

            return left(new AbstractError(errorInstance.message, 400, errorInstance.stack as string));

        }

    }


    public beforeCreate(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        return this.processBeforeCreate(Entity, User);

    }


    public beforeUpdate(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        return this.processBeforeUpdate(Entity, User);

    }


    public beforeEdit(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        return this.processBeforeUpdate(Entity, User);

    }


    public async beforeDelete(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        return this.checkPermission(Entity, User, this.getPermissionForDelete());

    }


    public async afterRead(Entities: Entity[], User: User): Promise<Either<AbstractError, Entity[]>> {

        return this.processAfterRead(Entities, User);

    }


    public async processBeforeCreate(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.checkPermission(Entity, User, this.getPermissionForCreate());

        if (result.isLeft()) {
            return result;
        }

        return Orchestrator.processBeforeCreate(Entity, User);

    }


    public async processBeforeUpdate(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.checkPermission(Entity, User, this.getPermissionForUpdate());

        if (result.isLeft()) {
            return result;
        }

        return Orchestrator.processBeforeCreate(Entity, User);

    }


    public async processAfterRead(Entities: Entity[], User: User): Promise<Either<AbstractError, Entity[]>> {

        const filtered: Entity[] = [];

        for (const entity of Entities) {

            const permission = await this.checkPermission(
                entity,
                User,
                this.getPermissionForRead()
            );

            if (permission.isLeft()) continue;

            const processed = await Orchestrator.processAfterRead(entity, User);

            if (processed.isRight()) filtered.push(processed?.value);

        }

        return right(filtered);

    }


    protected abstract personPath(): string[];


    protected abstract entityCode(): number;


    protected abstract parentField(): string | null;


    protected getPermissionForRead() { return 1; }


    protected getPermissionForCreate() { return 2; }


    protected getPermissionForUpdate() { return 3; }


    protected getPermissionForDelete() { return 4; }


    protected async checkPermission(Entity: any, User: User, Permission: number) {

        const cache = ServiceLocator.getPermissionCache();

        const userId = User?.id;

        let personId = cache.personMap.get(Entity.ID);

        if (!personId) {

            personId =
                Entity.Person_ID ||
                Entity.Person?.ID ||
                await this.Repository.findPersonIdById(Entity.ID);

            if (personId) {
                cache.personMap.set(Entity.ID, personId);
            }

        }

        if (!personId) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.invalidPersonId', ServiceLocator.getRequest(), this.entityCode()) ||
                'error.invalidPersonId';

            return left(new PermissionDenied(message, 403, oStack));

        }

        const key = ServiceLocator.buildPermissionKey(
            userId,
            personId,
            this.entityCode(),
            Permission
        );

        if (cache.permissionChecked.has(key)) {
            return right(true);
        }

        const result = await this.checkPermissionByPersonId(User, personId, Permission);

        if (result.isRight()) {
            cache.permissionChecked.add(key);
        }

        return result;

    }


    public async checkPermissionByPersonId(LoggedUser: User, PersonId: string, Permision: number): Promise<Either<PermissionDenied, boolean>> {

        const oPerson = await this.PersonRepository.findById(PersonId);

        if (LoggedUser && oPerson) {

            if (LoggedUser?.id !== oPerson.CreatedBy) {

                let oShares = await this.ShareRepository.findByPersonId(PersonId);

                if (oShares) {

                    let oPermissionByShare: Boolean = false;

                    oShares = oShares.filter((oShare: ShareModel) => oShare.User == LoggedUser?.id);

                    if (oShares.length > 0) {

                        for (const oShare of oShares) {

                            const oEntities = await this.EntityRepository.findByShareId(oShare.Id);

                            if (oEntities) {

                                if (Permision > 1) {

                                    oPermissionByShare = oEntities.filter((oEntity: EntityModel) => oEntity.Entity == this.entityCode() && oEntity.Permission >= Permision).length > 0;

                                } else {

                                    oPermissionByShare = oEntities.filter((oEntity: EntityModel) => oEntity.Entity == this.entityCode()).length > 0;

                                }

                            }

                        }

                    }

                    if (!oPermissionByShare) {

                        const oStack = new Error().stack as string;

                        const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), this.entityCode()) ||
                            'error.modificationPermissionDenied';

                        return left(new PermissionDenied(message, 403, oStack));

                    }

                } else {

                    const oStack = new Error().stack as string;

                    const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), this.entityCode()) ||
                        'error.modificationPermissionDenied';

                    return left(new PermissionDenied(message, 403, oStack));

                }

            }

        } else if (!oPerson) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.invalidPersonId', ServiceLocator.getRequest(), this.entityCode()) ||
                'error.invalidPersonId';

            return left(new PermissionDenied(message, 403, oStack));

        }

        return right(true);

    }


    private getEntityLabel(entityCode: number, request: any): string {

        const map = {
            1: 'Persons',
            2: 'Shares',
            3: 'Entities',
            4: 'Categories',
            5: 'Cards',
            6: 'Invoices',
            7: 'Transactions',
            8: 'Backups'
        };

        const entityName = map[entityCode];

        if (!entityName) {
            return cds.i18n.messages.at('unknown.entity', request.locale) as string;
        }

        return cds.i18n.messages.at(
            `entity.name.${entityName}`,
            request.locale
        ) as string;

    }


    protected getMessage(
        key: string,
        request: any,
        entityCode?: number,
        args?: Record<string, any>
    ): string {

        let finalArgs = args || {};

        if (entityCode) {
            finalArgs = {
                ...finalArgs,
                entity: this.getEntityLabel(entityCode, request)
            };
        }

        return cds.i18n.messages.at(
            key,
            request.locale || 'pt',
            finalArgs
        ) as string;

    }


    protected buildPermissionExists(oUserId: string, oEntityCode: number) {

        return {
            SELECT: {
                from: { ref: ['apps.dflc.gestordegastos.entities.Shares'], as: 'S' },
                columns: [{ ref: ['S', 'Person_ID'] }],
                where: [
                    { ref: ['S', 'User'] }, '=', { val: oUserId },
                    'and',
                    {
                        xpr: [
                            'exists',
                            {
                                SELECT: {
                                    from: { ref: ['apps.dflc.gestordegastos.entities.Entities'], as: 'E' },
                                    columns: [{ val: 1 }],
                                    where: [
                                        { ref: ['E', 'Share_ID'] }, '=', { ref: ['S', 'ID'] },
                                        'and',
                                        { ref: ['E', 'Entity'] }, '=', { val: oEntityCode },
                                        'and',
                                        { ref: ['E', 'Permission'] }, 'is not', { val: null }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        };

    }


    protected ensureParentField(Request: Request, parentField: string) {

        const SELECT = Request.query?.SELECT;

        if (!SELECT) return;

        const columns = SELECT.columns;

        if (!columns) return;

        const hasWildcard = columns.some(col => col === '*' as any);

        if (hasWildcard) return;

        const exists = columns.some(col =>
            col.ref?.join('.') === parentField ||
            col.ref?.join('.')?.replace('_', '.') === parentField
        );

        if (!exists) {
            columns.push({ ref: parentField.split('.') });
        }

    }


    protected readableToBuffer(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', chunk => chunks.push(chunk as never));
            readableStream.on('end', (ok) => resolve(Buffer.concat(chunks)));
            readableStream.on('error', error => reject(error));
        });
    };

    
    protected generateUUID(): string {
        return cds.utils.uuid();
    }

}