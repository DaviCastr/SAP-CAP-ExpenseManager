"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareServiceImplementation = void 0;
const either_1 = require("@sweet-monads/either");
const implementation_1 = require("../base/implementation");
const permission_denied_1 = require("@/errors/permission-denied");
const duplicity_1 = require("@/errors/duplicity");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class ShareServiceImplementation extends implementation_1.BaseServiceImplementation {
    TransactionRepository;
    Repository;
    constructor(PersonRepository, ShareRepository, EntityRepository, TransactionRepository) {
        super(PersonRepository, ShareRepository, EntityRepository);
        this.TransactionRepository = TransactionRepository;
        this.Repository = ShareRepository;
    }
    async beforeCreate(Entity, User) {
        const result = await this.processBeforeCreate(Entity, User);
        if (result.isLeft()) {
            return result;
        }
        return this.checkDuplicityByUser(Entity);
    }
    async beforeEdit(Entity, User) {
        const result = await this.processBeforeCreate(Entity, User);
        if (result.isLeft()) {
            return result;
        }
        return this.checkDuplicityByUser(Entity);
    }
    async beforeUpdate(Entity, User) {
        const result = await this.processBeforeUpdate(Entity, User);
        if (result.isLeft()) {
            return result;
        }
        return this.checkDuplicityByUser(Entity);
    }
    async checkPermission(Share, User, Permission) {
        const cache = ServiceLocator_1.ServiceLocator.getPermissionCache();
        const userId = User?.id;
        let personId = cache.personMap.get(Share.ID);
        if (!personId) {
            if (!Share?.Person_ID && !Share?.Person?.ID) {
                personId =
                    await this.Repository.findPersonIdById(Share?.ID);
            }
            else {
                personId = Share?.Person_ID || Share?.Person?.ID;
            }
            if (personId) {
                cache.personMap.set(Share.ID, personId);
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
    personPath() {
        return ['Person'];
    }
    entityCode() {
        return 2;
    }
    parentField() {
        return 'Person.ID';
    }
    async checkDuplicityByUser(Share) {
        const cache = ServiceLocator_1.ServiceLocator.getPermissionCache();
        let personId;
        if (!Share?.Person_ID && !Share?.Person?.ID) {
            personId =
                Share.Person?.ID ||
                    await this.Repository.findPersonIdById(Share.ID);
        }
        else {
            personId = (Share?.Person_ID || Share?.Person?.ID);
        }
        if (!personId) {
            return (0, either_1.right)(true);
        }
        let shares = cache.sharesByPerson.get(personId);
        if (!shares) {
            shares = await this.Repository.findByPersonId(personId);
            if (shares?.length) {
                cache.sharesByPerson.set(personId, shares);
            }
            else {
                shares = [];
                cache.sharesByPerson.set(personId, shares);
            }
        }
        const exists = shares.find((item) => item.User === Share?.User &&
            item.Id !== Share.ID);
        if (exists) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.duplicity', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                'error.duplicity';
            return (0, either_1.left)(new duplicity_1.DuplicityError(oStack, message));
        }
        shares.push(this.Repository?.mapShareResult([Share])?.[0] ||
            {
                ...Share,
                Id: Share.ID
            });
        return (0, either_1.right)(true);
    }
}
exports.ShareServiceImplementation = ShareServiceImplementation;
//# sourceMappingURL=implementation.js.map