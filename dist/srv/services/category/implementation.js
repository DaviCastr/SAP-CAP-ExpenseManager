"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryServiceImplementation = void 0;
const either_1 = require("@sweet-monads/either");
const implementation_1 = require("../base/implementation");
const permission_denied_1 = require("@/errors/permission-denied");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class CategoryServiceImplementation extends implementation_1.BaseServiceImplementation {
    TransactionRepository;
    Repository;
    constructor(PersonRepository, ShareRepository, EntityRepository, Repository, TransactionRepository) {
        super(PersonRepository, ShareRepository, EntityRepository);
        this.TransactionRepository = TransactionRepository;
        this.Repository = Repository;
    }
    async beforeDelete(Category, LoggedUser) {
        const oPermission = await this.checkPermission(Category, LoggedUser, this.getPermissionForDelete());
        if (oPermission.isRight()) {
            return this.checkDeleteByTransactionExistence(Category);
        }
        else {
            return oPermission;
        }
    }
    async checkPermission(Category, User, Permission) {
        const cache = ServiceLocator_1.ServiceLocator.getPermissionCache();
        const userId = User?.id;
        let personId = cache.personMap.get(Category.ID);
        if (!personId) {
            if (!Category?.Person_ID && !Category?.Person?.ID) {
                personId =
                    await this.Repository.findPersonIdById(Category?.ID);
            }
            else {
                personId = Category?.Person_ID || Category?.Person?.ID;
            }
            if (personId) {
                cache.personMap.set(Category.ID, personId);
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
        return 4;
    }
    parentField() {
        return 'Person.ID';
    }
    async checkDeleteByTransactionExistence(Category) {
        const oTransactions = await this.TransactionRepository.findByCategoryID(Category.ID, 1);
        if (Array.isArray(oTransactions)) {
            if (oTransactions.length > 0) {
                const stack = new Error().stack;
                return (0, either_1.left)(new permission_denied_1.PermissionDenied('error.exclusionOfCategoryInUsePermissionDenied', 403, stack));
            }
        }
        return (0, either_1.right)(true);
    }
}
exports.CategoryServiceImplementation = CategoryServiceImplementation;
//# sourceMappingURL=implementation.js.map