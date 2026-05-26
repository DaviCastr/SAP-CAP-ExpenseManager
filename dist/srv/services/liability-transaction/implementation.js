"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityTransactionServiceImplementation = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const either_1 = require("@sweet-monads/either");
const implementation_1 = require("../base/implementation");
const errors_1 = require("@/errors");
const permission_denied_1 = require("@/errors/permission-denied");
const entities_codes_1 = require("@/constants/entities-codes");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
class LiabilityTransactionServiceImplementation extends implementation_1.BaseServiceImplementation {
    LiabilityRepository;
    Repository;
    constructor(PersonRepository, ShareRepository, EntityRepository, Repository, LiabilityRepository) {
        super(PersonRepository, ShareRepository, EntityRepository);
        this.LiabilityRepository = LiabilityRepository;
        this.Repository = Repository;
    }
    entityCode() {
        return entities_codes_1.EntitiesCodes.LiabilityTransactions;
    }
    personPath() {
        return ["Liability", "Person"];
    }
    parentField() {
        return "Liability.Person_ID";
    }
    async beforeCreate(entity, user) {
        const result = await this.processBeforeCreate(entity, user);
        if (result.isLeft()) {
            return result;
        }
        return this.validateTransaction(entity);
    }
    async beforeUpdate(entity, user) {
        const result = await this.processBeforeUpdate(entity, user);
        if (result.isLeft()) {
            return result;
        }
        return this.validateTransaction(entity);
    }
    async beforeEdit(entity, user) {
        return this.beforeUpdate(entity, user);
    }
    async validateTransaction(entity) {
        if (!entity?.Liability_ID) {
            return (0, either_1.left)(new permission_denied_1.PermissionDenied("error.invalidLiability", 400, new Error().stack || ""));
        }
        if (entity.Amount === undefined ||
            entity.Amount === null) {
            return (0, either_1.left)(new permission_denied_1.PermissionDenied("error.invalidAmount", 400, new Error().stack || ""));
        }
        if (Number(entity.Amount) === 0) {
            return (0, either_1.left)(new permission_denied_1.PermissionDenied("error.invalidAmount", 400, new Error().stack || ""));
        }
        const liability = await this.LiabilityRepository
            .findById(entity.Liability_ID, true);
        if (!liability) {
            return (0, either_1.left)(new permission_denied_1.PermissionDenied("error.invalidLiability", 404, new Error().stack || ""));
        }
        return (0, either_1.right)(true);
    }
    async authorizeLiabilityRead(liabilityId) {
        const request = ServiceLocator_1.ServiceLocator.getRequest();
        const liabilityService = ServiceRegistry_1.ServiceRegistry.get("Liabilities");
        if (!liabilityService) {
            return (0, either_1.right)(true);
        }
        const auth = await liabilityService.afterRead([{ ID: liabilityId }], request.user);
        if (auth.isLeft()) {
            return auth;
        }
        if (!auth.value?.length) {
            return (0, either_1.left)(new permission_denied_1.PermissionDenied("error.modificationPermissionDenied", 403, new Error().stack || ""));
        }
        return (0, either_1.right)(true);
    }
    async authorizeLiabilityUpdate(liabilityId) {
        const request = ServiceLocator_1.ServiceLocator.getRequest();
        const liabilityService = ServiceRegistry_1.ServiceRegistry.get("Liabilities");
        if (!liabilityService) {
            return (0, either_1.right)(true);
        }
        return liabilityService.beforeUpdate({ ID: liabilityId }, request.user);
    }
    async recalculateLiabilityInternal(liabilityId) {
        const rows = await this.Repository
            .findByLiabilityId(liabilityId) || [];
        let paid = new decimal_js_1.default(0);
        for (const row of rows) {
            const amount = new decimal_js_1.default(row.Amount || 0);
            switch (row.Type) {
                case "PAYMENT":
                    paid =
                        paid.plus(amount);
                    break;
                case "PAYMENT_REVERSAL":
                    paid =
                        paid.minus(amount);
                    break;
            }
        }
        const debt = await this
            .LiabilityRepository
            .findById(liabilityId, true);
        if (!debt) {
            return;
        }
        const original = debt.OriginalAmount ||
            new decimal_js_1.default(0);
        let balance = original.minus(paid);
        if (balance.lessThan(0)) {
            balance =
                new decimal_js_1.default(0);
        }
        await this
            .LiabilityRepository
            .updateAmounts(liabilityId, {
            CurrentBalance: balance,
            PaidAmount: paid,
            Status: balance.equals(0)
                ? "PAID"
                : "OPEN"
        });
    }
    async reverseTransaction() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const id = request.data?.ID;
            const tx = await this.Repository
                .findById(id);
            if (!tx) {
                return (0, either_1.left)(new errors_1.AbstractError("Transaction not found", 404, ""));
            }
            const liabilityId = tx.LiabilityId;
            const authRead = await this.authorizeLiabilityRead(liabilityId);
            if (authRead.isLeft()) {
                return authRead;
            }
            const authUpdate = await this.authorizeLiabilityUpdate(liabilityId);
            if (authUpdate.isLeft()) {
                return authUpdate;
            }
            const existing = await this.Repository
                .findByExternalReference(id);
            if (existing) {
                return (0, either_1.left)(new errors_1.AbstractError("Transaction already reversed", 400, ""));
            }
            const reversal = await this.Repository
                .createEntry({
                Liability_ID: liabilityId,
                Type: "PAYMENT_REVERSAL",
                Amount: tx.Amount,
                MovementDate: new Date()
                    .toISOString()
                    .slice(0, 10),
                Description: `Reversal of ${id}`,
                ExternalReference: id,
                Currency_code: tx.Currency?.Code
            });
            await this
                .recalculateLiabilityInternal(liabilityId);
            return (0, either_1.right)(reversal?.[0]?.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
    async recalculateLiability() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const liabilityId = request.data?.LiabilityId;
            const authRead = await this.authorizeLiabilityRead(liabilityId);
            if (authRead.isLeft()) {
                return authRead;
            }
            const authUpdate = await this.authorizeLiabilityUpdate(liabilityId);
            if (authUpdate.isLeft()) {
                return authUpdate;
            }
            await this
                .recalculateLiabilityInternal(liabilityId);
            return (0, either_1.right)(true);
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
}
exports.LiabilityTransactionServiceImplementation = LiabilityTransactionServiceImplementation;
//# sourceMappingURL=implementation.js.map