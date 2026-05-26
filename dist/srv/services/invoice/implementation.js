"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceServiceImplementation = void 0;
const errors_1 = require("@/errors");
const either_1 = require("@sweet-monads/either");
const invoice_1 = require("@/models/invoice");
const implementation_1 = require("../base/implementation");
const permission_denied_1 = require("@/errors/permission-denied");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class InvoiceServiceImplementation extends implementation_1.BaseServiceImplementation {
    CardRepository;
    Repository;
    constructor(PersonRepository, ShareRepository, EntityRepository, Repository, CardRepository) {
        super(PersonRepository, ShareRepository, EntityRepository);
        this.CardRepository = CardRepository;
        this.Repository = Repository;
    }
    async afterRead(Invoices, User) {
        try {
            const result = await this.processAfterRead(Invoices, User);
            let oInvoicesFiltered = [];
            if (result.isRight())
                oInvoicesFiltered = result.value;
            else
                oInvoicesFiltered = [];
            const oInvoicesData = [];
            for (let Invoice of oInvoicesFiltered) {
                const oInvoiceModel = invoice_1.InvoiceModel.singleModel(Invoice);
                if (!oInvoiceModel.Description && oInvoiceModel.Month) {
                    oInvoiceModel.Description = this.getMessage(`month.${oInvoiceModel.Month}`, ServiceLocator_1.ServiceLocator.getRequest());
                }
                const oInvoiceData = oInvoiceModel.toEntityObject();
                oInvoicesData.push({
                    ...oInvoiceData
                });
            }
            ;
            return (0, either_1.right)(oInvoicesData);
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    async checkPermission(Invoice, User, Permission) {
        const cache = ServiceLocator_1.ServiceLocator.getPermissionCache();
        const userId = User?.id;
        let personId = cache.personMap.get(Invoice.ID);
        if (!personId) {
            if (!Invoice?.Card_ID && !Invoice?.Card?.ID) {
                personId =
                    await this.Repository.findPersonIdById(Invoice?.ID);
            }
            else {
                let personIdByCard = cache.personMap.get(Invoice?.Card_ID || Invoice?.Card?.ID);
                personId =
                    personIdByCard ||
                        await this.CardRepository.findPersonIdById((Invoice?.Card_ID || Invoice?.Card?.ID));
            }
            if (personId) {
                cache.personMap.set(Invoice.ID, personId);
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
        return ['Card', 'Person'];
    }
    entityCode() {
        return 6;
    }
    parentField() {
        return 'Card.ID';
    }
}
exports.InvoiceServiceImplementation = InvoiceServiceImplementation;
//# sourceMappingURL=implementation.js.map