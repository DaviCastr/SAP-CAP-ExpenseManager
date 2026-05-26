"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityServiceImplementation = void 0;
const either_1 = require("@sweet-monads/either");
const implementation_1 = require("../base/implementation");
const duplicity_1 = require("@/errors/duplicity");
const permission_denied_1 = require("@/errors/permission-denied");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class EntityServiceImplementation extends implementation_1.BaseServiceImplementation {
    Repository;
    constructor(PersonRepository, ShareRepository, Repository) {
        super(PersonRepository, ShareRepository, Repository);
        this.Repository = Repository;
    }
    async beforeCreate(Entity, User) {
        const result = await this.processBeforeCreate(Entity, User);
        if (result.isLeft()) {
            return result;
        }
        return this.checkDuplicityByEntity(Entity);
    }
    async beforeUpdate(Entity, User) {
        const result = await this.processBeforeUpdate(Entity, User);
        if (result.isLeft()) {
            return result;
        }
        return this.checkDuplicityByEntity(Entity);
    }
    async beforeEdit(Entity, User) {
        const result = await this.processBeforeUpdate(Entity, User);
        if (result.isLeft()) {
            return result;
        }
        return this.checkDuplicityByEntity(Entity);
    }
    async checkPermission(Entity, User, Permission) {
        const cache = ServiceLocator_1.ServiceLocator.getPermissionCache();
        const userId = User?.id;
        let personId = cache.personMap.get(Entity.ID);
        if (!personId) {
            if (!Entity?.Share_ID && !Entity?.Share?.ID) {
                personId =
                    await this.Repository.findPersonIdById(Entity?.ID);
            }
            else {
                let personIdByShare = cache.personMap.get(Entity?.Share_ID || Entity?.Share?.ID);
                personId =
                    personIdByShare ||
                        await this.ShareRepository.findPersonIdById((Entity?.Share_ID || Entity?.Share?.ID));
            }
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
    personPath() {
        return ['Share', 'Person'];
    }
    entityCode() {
        return 3;
    }
    parentField() {
        return 'Share.ID';
    }
    async checkDuplicityByEntity(Entity) {
        const cache = ServiceLocator_1.ServiceLocator.getPermissionCache();
        let shareId;
        if (!Entity?.Share_ID && !Entity?.Share?.ID) {
            const oShare = await this.ShareRepository.findById(Entity.ID);
            shareId = oShare?.Id;
        }
        else {
            shareId = Entity.Share_ID || Entity?.Share?.ID;
        }
        if (!shareId) {
            return (0, either_1.right)(true);
        }
        let entities = cache.entitiesByShare.get(shareId);
        if (!entities) {
            entities = await this.Repository.findByShareId(shareId);
            if (entities?.length) {
                cache.entitiesByShare.set(shareId, entities);
            }
            else {
                entities = [];
                cache.entitiesByShare.set(shareId, entities);
            }
        }
        const exists = entities.find((item) => item.Entity == Entity?.Entity &&
            item.Id != Entity?.ID);
        if (exists) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.duplicity', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                'error.duplicity';
            return (0, either_1.left)(new duplicity_1.DuplicityError(oStack, message));
        }
        entities.push(this.Repository?.mapEntityResult([Entity])?.[0] ||
            {
                ...Entity,
                Id: Entity.ID
            });
        return (0, either_1.right)(true);
    }
}
exports.EntityServiceImplementation = EntityServiceImplementation;
//# sourceMappingURL=implementation.js.map