"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseServiceImplementation = void 0;
const permission_denied_1 = require("@/errors/permission-denied");
const cds_1 = __importDefault(require("@sap/cds"));
const either_1 = require("@sweet-monads/either");
const errors_1 = require("@/errors");
const Orchestrator_1 = require("@/infrastructure/Orchestrator");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class BaseServiceImplementation {
    PersonRepository;
    ShareRepository;
    EntityRepository;
    constructor(PersonRepository, ShareRepository, EntityRepository) {
        this.PersonRepository = PersonRepository;
        this.ShareRepository = ShareRepository;
        this.EntityRepository = EntityRepository;
    }
    beforeRead(Request) {
        try {
            const oUserId = Request.user?.id;
            if (!oUserId || !Request.query?.SELECT)
                return (0, either_1.right)(true);
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
            if (oEntityCode == 8) {
                return (0, either_1.right)(true);
            }
            Request.query.where([
                '(',
                { ref: [...oPersonPath, 'createdBy'] }, '=', { val: oUserId },
                'or',
                { ref: [...oPersonPath, 'ID'] }, 'in', this.buildPermissionExists(oUserId, oEntityCode),
                ')'
            ]);
            return (0, either_1.right)(true);
        }
        catch (oError) {
            const errorInstance = oError;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 400, errorInstance.stack));
        }
    }
    beforeCreate(Entity, User) {
        return this.processBeforeCreate(Entity, User);
    }
    beforeUpdate(Entity, User) {
        return this.processBeforeUpdate(Entity, User);
    }
    beforeEdit(Entity, User) {
        return this.processBeforeUpdate(Entity, User);
    }
    async beforeDelete(Entity, User) {
        return this.checkPermission(Entity, User, this.getPermissionForDelete());
    }
    async afterRead(Entities, User) {
        if (this.entityCode() == 8) {
            return (0, either_1.right)(Entities);
        }
        return this.processAfterRead(Entities, User);
    }
    async processBeforeCreate(Entity, User) {
        const result = await this.checkPermission(Entity, User, this.getPermissionForCreate());
        if (result.isLeft()) {
            return result;
        }
        return Orchestrator_1.Orchestrator.processBeforeCreate(Entity, User);
    }
    async processBeforeUpdate(Entity, User) {
        const result = await this.checkPermission(Entity, User, this.getPermissionForUpdate());
        if (result.isLeft()) {
            return result;
        }
        return Orchestrator_1.Orchestrator.processBeforeUpdate(Entity, User);
    }
    async processAfterRead(Entities, User) {
        const filtered = [];
        for (const entity of Entities) {
            const permission = await this.checkPermission(entity, User, this.getPermissionForRead());
            if (permission.isLeft())
                continue;
            const processed = await Orchestrator_1.Orchestrator.processAfterRead(entity, User);
            if (processed.isRight())
                filtered.push(processed?.value);
        }
        return (0, either_1.right)(filtered);
    }
    getPermissionForRead() { return 1; }
    getPermissionForCreate() { return 2; }
    getPermissionForUpdate() { return 3; }
    getPermissionForDelete() { return 4; }
    async checkPermission(Entity, User, Permission) {
        const cache = ServiceLocator_1.ServiceLocator.getPermissionCache();
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
            const oStack = new Error().stack;
            const message = this.getMessage('error.invalidPersonId', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                'error.invalidPersonId';
            return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
        }
        const key = ServiceLocator_1.ServiceLocator.buildPermissionKey(userId, personId, this.entityCode(), Permission);
        if (cache.permissionChecked.has(key)) {
            return (0, either_1.right)(true);
        }
        const result = await this.checkPermissionByPersonId(User, personId, Permission);
        if (result.isRight()) {
            cache.permissionChecked.add(key);
        }
        return result;
    }
    async checkPermissionByPersonId(LoggedUser, PersonId, Permision) {
        const oPerson = await this.PersonRepository.findById(PersonId);
        if (LoggedUser && oPerson) {
            if (LoggedUser?.id !== oPerson.CreatedBy) {
                let oShares = await this.ShareRepository.findByPersonId(PersonId);
                if (oShares) {
                    let oPermissionByShare = false;
                    oShares = oShares.filter((oShare) => oShare.User == LoggedUser?.id);
                    if (oShares.length > 0) {
                        for (const oShare of oShares) {
                            const oEntities = await this.EntityRepository.findByShareId(oShare.Id);
                            if (oEntities) {
                                if (Permision > 1) {
                                    oPermissionByShare = oEntities.filter((oEntity) => oEntity.Entity == this.entityCode() && oEntity.Permission >= Permision).length > 0;
                                }
                                else {
                                    oPermissionByShare = oEntities.filter((oEntity) => oEntity.Entity == this.entityCode()).length > 0;
                                }
                            }
                        }
                    }
                    if (!oPermissionByShare) {
                        const oStack = new Error().stack;
                        const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                            'error.modificationPermissionDenied';
                        return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
                    }
                }
                else {
                    const oStack = new Error().stack;
                    const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                        'error.modificationPermissionDenied';
                    return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
                }
            }
        }
        else if (!oPerson) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.invalidPersonId', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                'error.invalidPersonId';
            return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
        }
        return (0, either_1.right)(true);
    }
    getEntityLabel(entityCode, request) {
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
            return cds_1.default.i18n.messages.at('unknown.entity', request.locale);
        }
        return cds_1.default.i18n.messages.at(`entity.name.${entityName}`, request.locale);
    }
    getMessage(key, request, entityCode, args) {
        let finalArgs = args || {};
        if (entityCode) {
            finalArgs = {
                ...finalArgs,
                entity: this.getEntityLabel(entityCode, request)
            };
        }
        return cds_1.default.i18n.messages.at(key, request.locale || 'pt', finalArgs);
    }
    buildPermissionExists(oUserId, oEntityCode) {
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
    ensureParentField(Request, parentField) {
        const SELECT = Request.query?.SELECT;
        if (!SELECT)
            return;
        const columns = SELECT.columns;
        if (!columns)
            return;
        const hasWildcard = columns.some(col => col === '*');
        if (hasWildcard)
            return;
        const exists = columns.some(col => col.ref?.join('.') === parentField ||
            col.ref?.join('.')?.replace('_', '.') === parentField);
        if (!exists) {
            columns.push({ ref: parentField.split('.') });
        }
    }
    readableToBuffer(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', chunk => chunks.push(chunk));
            readableStream.on('end', (ok) => resolve(Buffer.concat(chunks)));
            readableStream.on('error', error => reject(error));
        });
    }
    ;
    generateUUID() {
        return cds_1.default.utils.uuid();
    }
    cleanEntity(obj) {
        if (Array.isArray(obj)) {
            if (obj.length == 0)
                return;
            return obj.map((item) => this.cleanEntity(item));
        }
        if (obj && typeof obj === 'object') {
            return Object.fromEntries(Object.entries(obj)
                .filter(([_, v]) => v !== undefined && v !== null && JSON.stringify(v) != '{}' && v?.length !== 0)
                .map(([k, v]) => [k, this.cleanEntity(v)]));
        }
        return obj;
    }
    addLeftZeros(number) {
        return number >= 1 && number <= 9 ? String(number).padStart(2, '0') : String(number);
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.BaseServiceImplementation = BaseServiceImplementation;
//# sourceMappingURL=implementation.js.map