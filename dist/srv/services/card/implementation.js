"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardServiceImplementation = void 0;
const errors_1 = require("@/errors");
const either_1 = require("@sweet-monads/either");
const card_1 = require("@/models/card");
const decimal_js_1 = __importDefault(require("decimal.js"));
const implementation_1 = require("../base/implementation");
const permission_denied_1 = require("@/errors/permission-denied");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
class CardServiceImplementation extends implementation_1.BaseServiceImplementation {
    InvoiceRepository;
    Repository;
    constructor(PersonRepository, ShareRepository, EntityRepository, Repository, InvoiceRepository) {
        super(PersonRepository, ShareRepository, EntityRepository);
        this.InvoiceRepository = InvoiceRepository;
        this.Repository = Repository;
    }
    async beforeCreate(Card, User) {
        const result = await this.processBeforeCreate(Card, User);
        if (result.isLeft())
            return result;
        return this.checkCard(Card);
    }
    async beforeUpdate(Card, User) {
        const result = await this.processBeforeUpdate(Card, User);
        if (result.isLeft())
            return result;
        return this.checkCard(Card);
    }
    async beforeEdit(Card, User) {
        const result = await this.processBeforeUpdate(Card, User);
        if (result.isLeft())
            return result;
        return this.checkCard(Card);
    }
    async afterRead(Cards, User) {
        try {
            const result = await this.processAfterRead(Cards, User);
            let oCardsFiltered = [];
            if (result.isRight())
                oCardsFiltered = result.value;
            else
                oCardsFiltered = [];
            const oCardsData = [];
            let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
            oDate = oDate.replaceAll(",", " ");
            const [day, month, year] = oDate.split(" ")[0].split("/");
            let oDia = Number(day);
            let oMonth = Number(month);
            let oYear = Number(year);
            const cardIds = oCardsFiltered.map(c => c.ID);
            const invoicesByCard = await this.InvoiceRepository.findByCardIDs(cardIds, { Year: { '>=': oYear } }) || [];
            const mapInvoices = new Map();
            for (const inv of invoicesByCard) {
                if (!mapInvoices.has(inv?.CardId)) {
                    mapInvoices.set(inv?.CardId, []);
                }
                mapInvoices.get(inv.CardId).push(inv);
            }
            for (let Card of oCardsFiltered) {
                const oCardModel = card_1.CardModel.singleModel(Card);
                if (!('ClosingDay' in Card) || !('DueDay' in Card)) {
                    oCardsData.push({
                        ...oCardModel?.toEntityObject(),
                    });
                    continue;
                }
                let oInvoiceMonth = oMonth;
                let oInvoiceYear = oYear;
                if (oCardModel.ClosingDay > oCardModel.DueDay) {
                    if (oInvoiceMonth == 12) {
                        oInvoiceMonth = 1;
                        oInvoiceYear += 1;
                    }
                    else {
                        oInvoiceMonth += 1;
                    }
                }
                try {
                    if (oCardModel.ClosingDay > 28) {
                        if (!this.validateDate(`${oYear}-${oMonth}-${oCardModel.ClosingDay}`)) {
                            oCardModel.ClosingDay = this.lastDayOfTheMonth(oInvoiceYear, oInvoiceMonth - 1);
                        }
                    }
                }
                catch (erro) {
                }
                let oNextMonth = oInvoiceMonth;
                let oNextYear = oInvoiceYear;
                if (oInvoiceMonth < 12) {
                    oNextMonth += 1;
                }
                else {
                    oNextMonth = 1;
                    oNextYear += 1;
                }
                let oTotalExpenses = new decimal_js_1.default(0);
                let oMonthExpenses = new decimal_js_1.default(0);
                ;
                let oMonthExpensesToPay = new decimal_js_1.default(0);
                let oMonthExpensesClosed = new decimal_js_1.default(0);
                const oInvoices = mapInvoices.get(oCardModel.Id) || [];
                oInvoices?.forEach(oInvoice => {
                    if (oInvoice.Year == oInvoiceYear && oInvoice.Month >= oInvoiceMonth || oInvoice.Year > oInvoiceYear) {
                        if (oInvoice.Month == oInvoiceMonth && oInvoice.Year == oInvoiceYear) {
                            oMonthExpenses = oMonthExpenses.plus(oInvoice?.TotalAmount || 0);
                            if (oCardModel.ClosingDay > oDia) {
                                oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice?.TotalAmount || 0);
                                oTotalExpenses = oTotalExpenses.plus(oInvoice?.TotalAmount || 0);
                            }
                            else if (oCardModel.DueDay >= oDia) {
                                oMonthExpensesClosed = oMonthExpensesClosed.plus(oInvoice?.TotalAmount || 0);
                                oTotalExpenses = oTotalExpenses.plus(oInvoice?.TotalAmount || 0);
                            }
                        }
                        else if (oInvoice.Year == oNextYear && oInvoice.Month == oNextMonth && oCardModel.ClosingDay <= oDia) {
                            oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice?.TotalAmount || 0);
                            oTotalExpenses = oTotalExpenses.plus(oInvoice?.TotalAmount || 0);
                        }
                        else {
                            oTotalExpenses = oTotalExpenses.plus(oInvoice?.TotalAmount || 0);
                        }
                    }
                });
                oCardModel.AvailableLimit = oCardModel.Limit?.minus(oTotalExpenses).toDecimalPlaces(2);
                oCardModel.InvoiceAmountToPay = oMonthExpensesToPay?.toDecimalPlaces(2);
                if (oCardModel.ClosingDay > oDia) {
                    oCardModel.InvoiceAmountForPayment = oCardModel.InvoiceAmountToPay;
                }
                else if (oCardModel.DueDay < oDia) {
                    oCardModel.InvoiceAmountForPayment = oCardModel.InvoiceAmountToPay;
                }
                else {
                    oCardModel.InvoiceAmountForPayment = oMonthExpensesClosed;
                }
                const oCardData = oCardModel.toEntityObject();
                oCardsData.push({
                    ...oCardData
                });
            }
            ;
            return (0, either_1.right)(oCardsData);
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    async checkPermission(Card, User, Permission) {
        const cache = ServiceLocator_1.ServiceLocator.getPermissionCache();
        const userId = User?.id;
        let personId = cache.personMap.get(Card.ID);
        if (!personId) {
            if (!Card?.Person_ID && !Card?.Person?.ID) {
                personId =
                    await this.Repository.findPersonIdById(Card?.ID);
            }
            else {
                personId = Card?.Person_ID || Card?.Person?.ID;
            }
            if (personId) {
                cache.personMap.set(Card.ID, personId);
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
        return 5;
    }
    parentField() {
        return 'Person.ID';
    }
    validateDate(date) {
        const dateCheck = new Date(date);
        return !isNaN(dateCheck.getTime());
    }
    lastDayOfTheMonth(year, month) {
        const date = new Date(year, month, 0);
        return date.getDate();
    }
    async checkCard(Card) {
        if (Card) {
            let oPerson = Card?.Person_ID ? await this.PersonRepository.findById(Card?.Person_ID)
                : await this.PersonRepository.findByCardId(Card?.ID);
            if (oPerson && Card.Currency?.code) {
                if (oPerson.Currency?.Code != Card.Currency?.code) {
                    const oStack = new Error().stack;
                    const message = this.getMessage('error.currencyNotEqualPersonCurrency', ServiceLocator_1.ServiceLocator.getRequest());
                    return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
                }
            }
        }
        if (Card?.Limit) {
            if (Card.Limit < 0) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.invalidLimit', ServiceLocator_1.ServiceLocator.getRequest());
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        if (Card?.ClosingDay && Card?.DueDay) {
            if (Card?.DueDay - Card?.ClosingDay < 2) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.incorectDueDayClosinDay', ServiceLocator_1.ServiceLocator.getRequest());
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        return (0, either_1.right)(true);
    }
}
exports.CardServiceImplementation = CardServiceImplementation;
//# sourceMappingURL=implementation.js.map