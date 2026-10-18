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
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";
import { EntitiesCodes } from "@/constants/entities-codes";

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

            // $expand não dispara os handlers de READ das entidades expandidas,
            // então o filtro de compartilhamento de cada uma vai junto na query.
            this.applyShareWhereToExpands(Request.query.SELECT.columns, Request.target, oUserId);

            // Backups não pertencem a uma pessoa: cada usuário só vê os seus.
            if (oEntityCode == EntitiesCodes.Backups) {
                Request.query.where([{ ref: ['createdBy'] }, '=', { val: oUserId }]);
                return right(true);
            }

            Request.query.where(this.buildShareWhere(oUserId));

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

        if (this.entityCode() == 8) {
            return right(Entities);
        }

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

        // A permissão também vale para a pessoa atual do registro, não só para a
        // informada no payload: senão daria para "mover" um item de outra pessoa
        // para uma pessoa própria e assim editá-lo.
        const oCurrentPersonId = (Entity as any)?.ID
            ? await this.Repository.findPersonIdById((Entity as any).ID)
            : null;

        if (oCurrentPersonId) {

            const oCurrent = await this.checkPermissionByPersonId(User, oCurrentPersonId, this.getPermissionForUpdate());

            if (oCurrent.isLeft()) {
                return oCurrent;
            }

        }

        const result = await this.checkPermission(Entity, User, this.getPermissionForUpdate());

        if (result.isLeft()) {
            return result;
        }

        return Orchestrator.processBeforeUpdate(Entity, User);

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


    public abstract entityCode(): number;


    protected abstract personPath(): string[];


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

                        // Basta um share conceder a permissão (antes só o último
                        // share contava); leitura exige Permission >= 1, igual
                        // ao filtro aplicado na query (beforeRead).
                        for (const oShare of oShares) {

                            const oEntities = await this.EntityRepository.findByShareId(oShare.Id);

                            if (oEntities?.some((oEntity: EntityModel) =>
                                oEntity.Entity == this.entityCode() && Number(oEntity.Permission) >= Permision)) {

                                oPermissionByShare = true;
                                break;

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

        } 
        // else if (!oPerson) {

        //     const oStack = new Error().stack as string;

        //     const message = this.getMessage('error.invalidPersonId', ServiceLocator.getRequest(), this.entityCode()) ||
        //         'error.invalidPersonId';

        //     return left(new PermissionDenied(message, 403, oStack));

        // }

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


    /**
     * Restrição de leitura da entidade: dono da pessoa ou usuário com share
     * que inclua esta entidade (relativa à própria entidade, via personPath).
     */
    public buildShareWhere(oUserId: string): any[] {

        const oPersonPath = this.personPath();

        return [
            '(',
            { ref: [...oPersonPath, 'createdBy'] }, '=', { val: oUserId },
            'or',
            { ref: [...oPersonPath, 'ID'] }, 'in', this.buildPermissionExists(oUserId, this.entityCode()),
            ')'
        ];

    }


    /**
     * Aplica, recursivamente, a restrição de compartilhamento de cada entidade
     * expandida no where do próprio $expand (ex.: Persons?$expand=Liabilities
     * só traz as dívidas se o share incluir Liabilities).
     */
    protected applyShareWhereToExpands(Columns: any[] | undefined, Target: any, oUserId: string): void {

        for (const oColumn of Columns ?? []) {

            if (!oColumn?.expand || !oColumn.ref) continue;

            const oElement = Target?.elements?.[oColumn.ref[oColumn.ref.length - 1]];
            const oChild = oElement?._target ?? cds.model?.definitions?.[oElement?.target];

            if (!oChild) continue;

            const sChildName = String(oChild.name).replace(/\.drafts$/, '').split('.').pop() as string;
            const oChildService = ServiceRegistry.get(sChildName) as BaseServiceImplementation<any> | undefined;

            if (oChildService && oChildService.entityCode() != EntitiesCodes.Backups) {

                const aShareWhere = oChildService.buildShareWhere(oUserId);

                oColumn.where = oColumn.where?.length
                    ? ['(', ...oColumn.where, ')', 'and', ...aShareWhere]
                    : aShareWhere;

            }

            if (Array.isArray(oColumn.expand)) {
                this.applyShareWhereToExpands(oColumn.expand, oChild, oUserId);
            }

        }

    }


    protected buildPermissionExists(oUserId: string, oEntityCode: number) {

        return {
            SELECT: {
                from: { ref: ['apps.dflc.expensemanager.entities.Shares'], as: 'S' },
                columns: [{ ref: ['S', 'Person_ID'] }],
                where: [
                    { ref: ['S', 'User'] }, '=', { val: oUserId },
                    'and',
                    {
                        xpr: [
                            'exists',
                            {
                                SELECT: {
                                    from: { ref: ['apps.dflc.expensemanager.entities.Entities'], as: 'E' },
                                    columns: [{ val: 1 }],
                                    where: [
                                        { ref: ['E', 'Share_ID'] }, '=', { ref: ['S', 'ID'] },
                                        'and',
                                        { ref: ['E', 'Entity'] }, '=', { val: oEntityCode },
                                        'and',
                                        { ref: ['E', 'Permission'] }, '>', { val: 0 },
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


    protected cleanEntity(obj: any): any {

        if (Array.isArray(obj)) {
            if (obj.length == 0) return;
            return obj.map((item) => this.cleanEntity(item));
        }

        if (obj && typeof obj === 'object') {
            return Object.fromEntries(
                Object.entries(obj)
                    .filter(([_, v]) => v !== undefined && v !== null && JSON.stringify(v) != '{}' && (v as any)?.length !== 0)
                    .map(([k, v]) => [k, this.cleanEntity(v)])
            );
        }

        return obj;

    }


    protected addLeftZeros(number: number): string {

        return number >= 1 && number <= 9 ? String(number).padStart(2, '0') : String(number);

    }


    protected async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}