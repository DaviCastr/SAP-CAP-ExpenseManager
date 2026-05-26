"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonServiceImplementation = void 0;
const errors_1 = require("@/errors");
const either_1 = require("@sweet-monads/either");
const person_1 = require("@/models/person");
const implementation_1 = require("../base/implementation");
const permission_denied_1 = require("@/errors/permission-denied");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
const card_1 = require("@/models/card");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const card_expenses_by_category_1 = require("@/models/card-expenses-by-category");
const simulate_expense_1 = require("@/models/simulate-expense");
const currency_1 = require("@/models/currency");
const transactions_by_category_1 = require("@/models/transactions-by-category");
const complete_invoice_1 = require("@/models/complete-invoice");
const stream_1 = require("stream");
const decimal_js_1 = __importDefault(require("decimal.js"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class PersonServiceImplementation extends implementation_1.BaseServiceImplementation {
    CategoryRepository;
    CardRepository;
    InvoiceRepository;
    TransactionRepository;
    Repository;
    constructor(ShareRepository, EntityRepository, Repository, CategoryRepository, CardRepository, InvoiceRepository, TransactionRepository) {
        super(Repository, ShareRepository, EntityRepository);
        this.CategoryRepository = CategoryRepository;
        this.CardRepository = CardRepository;
        this.InvoiceRepository = InvoiceRepository;
        this.TransactionRepository = TransactionRepository;
        this.Repository = Repository;
    }
    async beforeCreate(Person, User) {
        const result = await this.processBeforeCreate(Person, User);
        if (result.isLeft())
            return result;
        return this.checkPerson(Person);
    }
    async beforeUpdate(Person, User) {
        const result = await this.processBeforeUpdate(Person, User);
        if (result.isLeft())
            return result;
        return this.checkPerson(Person);
    }
    async beforeEdit(Person, User) {
        const result = await this.processBeforeUpdate(Person, User);
        if (result.isLeft())
            return result;
        return this.checkPerson(Person);
    }
    async afterRead(Persons, User) {
        try {
            const result = await this.processAfterRead(Persons, User);
            let oPersonsFiltered = [];
            if (result.isRight())
                oPersonsFiltered = result.value;
            else
                oPersonsFiltered = [];
            const oPersonsData = [];
            const personIds = oPersonsFiltered.map(c => c.ID);
            const cardsByPerson = await this.CardRepository.findByPersonIds(personIds) || [];
            const mapCards = new Map();
            for (const card of cardsByPerson) {
                if (!mapCards.has(card?.PersonId)) {
                    mapCards.set(card?.PersonId, []);
                }
                mapCards.get(card.PersonId).push(card.toEntityObject());
            }
            for (let Person of oPersonsFiltered) {
                const oPersonModel = person_1.PersonModel.singleModel(Person);
                if ('Image' in Person ||
                    (!('TotalExpenses' in Person) &&
                        !('TotalExpensesMonth' in Person) &&
                        !('AmountToSave' in Person) &&
                        !('TotalExpensesToPay' in Person) &&
                        !('TotalExpensesClosed' in Person) &&
                        !('TotalExpensesPayed' in Person))) {
                    oPersonsData.push({
                        ...oPersonModel.toEntityObject(),
                    });
                    continue;
                }
                const oCards = mapCards.get(oPersonModel?.Id);
                const oExpensesResult = await this.recoverExpenses(oCards);
                let oExpenses;
                if (oExpensesResult?.isLeft()) {
                    oPersonsData.push({
                        ...oPersonModel.toEntityObject(),
                    });
                    continue;
                }
                oExpenses = oExpensesResult?.isRight() ? oExpensesResult.value : {};
                if (oPersonModel.TotalExpenses)
                    oPersonModel.TotalExpenses = oExpenses?.totalExpenses?.toDecimalPlaces(2);
                if (oPersonModel.TotalExpensesMonth)
                    oPersonModel.TotalExpensesMonth = oExpenses?.monthExpenses?.toDecimalPlaces(2);
                if (oPersonModel.AmountToSave)
                    oPersonModel.AmountToSave = oPersonModel.TotalExpenses?.minus(oPersonModel.ExpenseTarget || 0);
                if (oPersonModel.TotalExpensesToPay)
                    oPersonModel.TotalExpensesToPay = oExpenses?.monthExpensesToPay?.toDecimalPlaces(2);
                if (oPersonModel.TotalExpensesClosed)
                    oPersonModel.TotalExpensesClosed = oExpenses?.monthExpensesClosed?.toDecimalPlaces(2);
                if (oPersonModel.TotalExpensesPayed)
                    oPersonModel.TotalExpensesPayed = oExpenses?.monthExpensesPayed?.toDecimalPlaces(2);
                if (oPersonModel.TotalExpenses?.gt(oPersonModel?.ExpenseTarget || 0)) {
                    oPersonModel.MonthCriticallity = 1;
                }
                else if (oPersonModel.TotalExpenses && oPersonModel?.ExpenseTarget) {
                    oPersonModel.MonthCriticallity = 3;
                }
                if (oPersonModel.TotalExpensesToPay?.gt(oPersonModel?.ExpenseTarget || 0)) {
                    oPersonModel.CriticallityToPay = 1;
                }
                else if (oPersonModel.TotalExpensesToPay && oPersonModel?.ExpenseTarget) {
                    oPersonModel.CriticallityToPay = 3;
                }
                const oPersonData = oPersonModel.toEntityObject();
                oPersonsData.push({
                    ...oPersonData
                });
            }
            ;
            return (0, either_1.right)(oPersonsData);
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    async addCardExpense() {
        const request = ServiceLocator_1.ServiceLocator.getRequest();
        try {
            const input = this.parseAddCardExpenseInput(request.data);
            this.validateAddCardExpenseInput(input, request);
            const [card, category] = await Promise.all([
                this.CardRepository.findById(input.CardId),
                this.CategoryRepository.findById(input.CategoryId)
            ]);
            this.ensureCardExists(card);
            this.ensureCategoryExists(category);
            await this.validateAddCardExpensePermissions(input.CardId, request.user);
            const normalizedValue = await this.convertCurrencyIfNeeded(input.Currency, card?.Currency?.Code, input.Value);
            const billing = this.calculateBillingCycle(input.TransactionDate, card?.DueDay, card?.ClosingDay, input.FixedExpense);
            const installmentsPlan = this.buildInstallmentPlan(normalizedValue, input.Installments, billing.InvoiceYear, billing.InvoiceMonth, billing.FixedInstallments);
            const invoiceCache = new Map();
            const transactionsToInsert = [];
            const affectedInvoices = new Set();
            const identifier = this.generateUUID();
            for (const item of installmentsPlan) {
                const invoice = await this.resolveInvoiceCached({
                    Card_ID: input.CardId,
                    Card: { ID: input.CardId },
                    Year: item.Year,
                    Month: item.Month,
                    Currency: card?.Currency.toEntityObject(),
                    TotalAmount: item.Amount.toNumber()
                }, invoiceCache);
                affectedInvoices.add(invoice.Id);
                transactionsToInsert.push({
                    Identifier: identifier,
                    Date: input.TransactionDate,
                    TotalAmount: normalizedValue.toNumber(),
                    Amount: item.Amount.toNumber(),
                    Currency: card?.Currency?.toEntityObject(),
                    TotalInstallments: input.Installments,
                    Installment: input.FixedExpense ? 1 : item.Installment,
                    Description: input.Description,
                    Category: { ID: category?.Id },
                    Invoice: { ID: invoice.Id }
                });
            }
            await this.TransactionRepository.createEntry(transactionsToInsert);
            await Promise.all([...affectedInvoices].map(id => this.InvoiceRepository.updateTotalAmountById(id)));
            return (0, either_1.right)(true);
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
        }
    }
    async sendInvoices() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const { Year, Month } = request.data;
            this.validateEmailConfiguration(request);
            const today = this.getBrazilDate();
            if (Year) {
                today.year = Number(Year);
            }
            if (Month) {
                today.month = Number(Month);
            }
            const persons = await this.Repository.findAll({
                Email: { '!=': null }
            }) || [];
            if (!persons.length) {
                return (0, either_1.right)(true);
            }
            const cardsAdditionalFilters = Year || Month
                ? {}
                : { DueDay: { '>=': today.day } };
            const cards = await this.CardRepository.findByPersonIds(persons.map(p => p.Id), cardsAdditionalFilters) || [];
            if (!cards.length) {
                return (0, either_1.right)(true);
            }
            const invoicesAdditionalFilters = Year || Month
                ? {
                    Year: today.year,
                    Month: today.month
                }
                : {
                    Year: today.year,
                    Month: today.month,
                    InvoiceSent: { '!=': true }
                };
            const invoices = await this.InvoiceRepository.findByCardIDs(cards.map(c => c.Id), invoicesAdditionalFilters) || [];
            if (!invoices.length) {
                return (0, either_1.right)(true);
            }
            const transactions = await this.TransactionRepository.findByInvoiceIds(invoices.map(i => i.Id)) || [];
            await this.loadPersonsImages(persons);
            await this.loadCardsImages(cards);
            await this.initializeEmailInfrastructure();
            const cardsByPerson = new Map();
            for (const card of cards) {
                if (!cardsByPerson.has(card.PersonId)) {
                    cardsByPerson.set(card.PersonId, []);
                }
                cardsByPerson.get(card.PersonId).push(card);
            }
            const invoicesByCard = new Map();
            for (const invoice of invoices) {
                if (!invoicesByCard.has(invoice.CardId)) {
                    invoicesByCard.set(invoice.CardId, []);
                }
                invoicesByCard.get(invoice.CardId).push(invoice);
            }
            const transactionsByInvoice = new Map();
            for (const trx of transactions) {
                if (!transactionsByInvoice.has(trx.InvoiceId)) {
                    transactionsByInvoice.set(trx.InvoiceId, []);
                }
                transactionsByInvoice.get(trx.InvoiceId).push(trx);
            }
            const cache = ServiceLocator_1.ServiceLocator.getEmailSendingCache();
            for (const person of persons) {
                const personCards = cardsByPerson.get(person.Id) || [];
                if (!personCards.length)
                    continue;
                const invoicesToSend = [];
                const attachments = [];
                let totalAmount = new decimal_js_1.default(0);
                let currency = '';
                for (const card of personCards) {
                    const cardInvoices = invoicesByCard.get(card.Id) || [];
                    for (const invoice of cardInvoices) {
                        invoicesToSend.push(invoice);
                        totalAmount = totalAmount.plus(invoice.TotalAmount);
                        currency = invoice.Currency?.Code || currency;
                        const invoiceTransactions = transactionsByInvoice.get(invoice.Id) || [];
                        if (!invoiceTransactions.length)
                            continue;
                        ServiceLocator_1.ServiceLocator.setRequestData({
                            InvoiceId: invoice.Id
                        });
                        const analyticsResult = await this.cardExpensesByCategories();
                        if (analyticsResult.isLeft())
                            continue;
                        const analytics = card_expenses_by_category_1.CardExpensesByCategoryModel.singleModel(analyticsResult.value);
                        const pdfResult = await this.generatePDF(cache._logoCache, person, invoice, card, invoiceTransactions, analytics);
                        if (pdfResult.isLeft())
                            continue;
                        attachments.push({
                            filename: `${card.Name} ${this.addLeftZeros(invoice.Month)}-${invoice.Year}.pdf`,
                            content: pdfResult.value
                        });
                    }
                }
                if (!attachments.length)
                    continue;
                attachments.push({
                    filename: 'logo.png',
                    content: cache._logoCache,
                    cid: 'Logo'
                });
                if (person.Image) {
                    const img = await this.readableToBuffer(person.Image);
                    attachments.push({
                        filename: `person.${person.ImageType}`,
                        content: img,
                        cid: 'PersonImage'
                    });
                }
                const template = Year || Month ? cache._predictionTemplateCache : cache._mailTemplateCache;
                const html = template({
                    Name: person.Name,
                    Year: today.year,
                    Month: this.addLeftZeros(today.month),
                    TotalAmount: totalAmount.toNumber(),
                    Currency: currency,
                    InvoiceCount: invoicesToSend.length,
                    Cards: invoicesToSend.map(inv => {
                        const card = personCards.find(c => c.Id === inv.CardId);
                        return {
                            CardName: card?.Name,
                            DueDate: `${this.addLeftZeros(card?.DueDay || 0)}/` +
                                `${this.addLeftZeros(inv.Month)}/${inv.Year}`,
                            Amount: inv.TotalAmount.toNumber(),
                            Currency: inv.Currency?.Code
                        };
                    })
                });
                await cache._smtpInstance.sendMail({
                    from: `"Expense Manager" <${process.env.SMTPAddres}>`,
                    to: person.Email,
                    subject: Year || Month
                        ? `Previsão/Detalhamento de duas invoicesByCard de ${this.addLeftZeros(today.month)}/${today.year}`
                        : `Suas invoicesByCard de ${this.addLeftZeros(today.month)}/${today.year}`,
                    html,
                    attachments
                });
                await Promise.all(invoicesToSend.map(inv => this.InvoiceRepository.update(inv.Id, { InvoiceSent: true })));
            }
            return (0, either_1.right)(true);
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
        }
    }
    async cardExpensesByCategories() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const input = this.parseCardExpensesByCategoryFields(request.data);
            const validation = this.validateCardExpensesByCategoriesInput(input);
            if (validation.isLeft())
                return validation;
            const authorization = await this.cardExpensesByCategoriesCheckAuthorization(input, request.user);
            if (authorization.isLeft())
                return authorization;
            const context = await this.loadContext(input);
            if (!context.categories.length || !context.invoices.length) {
                return (0, either_1.right)(this.emptyResult());
            }
            const summary = await this.buildSummary(context.categories, context.invoices, request.user);
            return (0, either_1.right)(summary);
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
        }
    }
    async simulateExpenses() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const input = this.extractSimulationInput(request);
            const validation = await this.validateSimulationInput(input, request);
            if (validation.isLeft())
                return validation;
            const person = validation.value.person;
            const cards = validation.value.cards;
            if (!cards.length) {
                return (0, either_1.right)(this.buildEmptySimulation(person).toEntityObject());
            }
            const invoices = await this.loadInvoicesForSimulation(cards.map(card => card.Id), input.Year);
            const totals = this.calculateSimulationTotals(invoices, input.Year, input.Month);
            const model = this.buildSimulationResult(person, totals.totalFuture, totals.totalMonth);
            return (0, either_1.right)(model.toEntityObject());
        }
        catch (error) {
            return this.handleSimulationError(error);
        }
    }
    async simulateFinancialFuture() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const { PersonId, Year, Month } = request.data;
            const required = [];
            if (!PersonId)
                required.push("PersonId");
            if (!Year)
                required.push("Year");
            if (!Month)
                required.push("Month");
            if (required.length) {
                return (0, either_1.left)(this.buildFutureError(this.getMessage("error.invalidFields", request, undefined, { fields: required.join(", ") })));
            }
            const targetYear = Number(Year);
            const targetMonth = Number(Month);
            if (targetMonth < 1 || targetMonth > 12) {
                return (0, either_1.left)(this.buildFutureError("Invalid Month"));
            }
            const auth = await this.afterRead([{ ID: PersonId }], request?.user);
            if (auth.isLeft())
                return auth;
            else if (!auth.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
            const person = await this.Repository.findById(PersonId);
            if (!person) {
                return (0, either_1.left)(this.buildFutureError("Person not found"));
            }
            const cards = await this.CardRepository.findByPersonIds([PersonId]) || [];
            if (!cards.length) {
                return (0, either_1.right)(this.buildEmptyFuture(person));
            }
            const cardService = ServiceRegistry_1.ServiceRegistry.get("Cards");
            const authCardCheck = await cardService.afterRead([{ Person: { ID: PersonId } }], request?.user);
            if (authCardCheck.isLeft()) {
                return authCardCheck;
            }
            else if (!authCardCheck.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), cardService.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
            const invoiceService = ServiceRegistry_1.ServiceRegistry.get("Invoices");
            const authInvoiceCheck = await invoiceService.afterRead([{ Card: { ID: cards[0].Id } }], request?.user);
            if (authInvoiceCheck.isLeft()) {
                return authInvoiceCheck;
            }
            else if (!authInvoiceCheck.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), invoiceService.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
            const cardIds = cards.map(card => card.Id);
            const invoices = await this.InvoiceRepository.findByCardIDs(cardIds, {
                Year: { ">=": new Date().getFullYear() - 1 }
            }) || [];
            if (invoices?.length) {
                const transactionService = ServiceRegistry_1.ServiceRegistry.get("Transactions");
                const authTransactionCheck = await transactionService.afterRead([{ Invoice: { ID: invoices[0].Id } }], request?.user);
                if (authTransactionCheck.isLeft()) {
                    return authTransactionCheck;
                }
                else if (!authTransactionCheck.value?.length) {
                    const oStack = new Error().stack;
                    const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), transactionService.entityCode()) ||
                        'error.modificationPermissionDenied';
                    return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
                }
            }
            const transactions = await this.loadTransactionsByCardsFallback(cardIds);
            const timeline = new Map();
            let generatedInvoices = new decimal_js_1.default(0);
            let installmentPending = new decimal_js_1.default(0);
            let recurringExpenses = new decimal_js_1.default(0);
            for (const invoice of invoices) {
                const key = this.futureKey(invoice.Year, invoice.Month);
                if (!this.isBeforeOrEqual(invoice.Year, invoice.Month, targetYear, targetMonth))
                    continue;
                this.futureAddTimeline(timeline, key, invoice.TotalAmount || 0);
                generatedInvoices =
                    generatedInvoices.plus(invoice.TotalAmount || 0);
            }
            const installmentMap = this.detectPendingInstallments(transactions);
            for (const item of installmentMap) {
                const tx = item;
                const remaining = item.remaining;
                let year = item.nextYear;
                let month = item.nextMonth;
                for (let i = 0; i < remaining; i++) {
                    if (!this.isBeforeOrEqual(year, month, targetYear, targetMonth))
                        break;
                    const key = this.futureKey(year, month);
                    this.futureAddTimeline(timeline, key, tx.Amount || 0);
                    installmentPending =
                        installmentPending.plus(tx.Amount || 0);
                    ({ year, month } =
                        this.nextMonth(year, month));
                }
            }
            const recurring = this.detectRecurringExpenses(transactions);
            for (const item of recurring) {
                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;
                while (this.isBeforeOrEqual(year, month, targetYear, targetMonth)) {
                    const key = this.futureKey(year, month);
                    this.futureAddTimeline(timeline, key, item.MaxAmount);
                    recurringExpenses =
                        recurringExpenses.plus(item.MaxAmount);
                    ({ year, month } =
                        this.nextMonth(year, month));
                }
            }
            const targetKey = this.futureKey(targetYear, targetMonth);
            const targetMonthDebt = timeline.get(targetKey) || new decimal_js_1.default(0);
            let totalDebt = new decimal_js_1.default(0);
            for (const val of timeline.values()) {
                totalDebt = totalDebt.plus(val);
            }
            const expenseTarget = person?.ExpenseTarget || new decimal_js_1.default(0);
            const savingGap = expenseTarget.minus(targetMonthDebt);
            const freeCashFlow = savingGap;
            const avgRecurring = recurring.length
                ? recurringExpenses.div(this.monthDiffFromNow(targetYear, targetMonth))
                : new decimal_js_1.default(0);
            const risk = this.calculateRisk(targetMonthDebt, expenseTarget);
            const monthlyTimeline = Array.from(timeline.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([key, value]) => {
                const [y, m] = key.split("-");
                return {
                    Key: key,
                    Year: Number(y),
                    Month: Number(m),
                    Amount: value.toNumber()
                };
            });
            const recommendations = this.buildFutureRecommendations(risk, recurring.length, installmentPending, targetMonthDebt, expenseTarget);
            return (0, either_1.right)({
                KPIs: {
                    TotalDebtUntilTarget: totalDebt.toNumber(),
                    TargetMonthDebt: targetMonthDebt.toNumber(),
                    RecurringMonthlyAverage: avgRecurring.toDecimalPlaces(2).toNumber(),
                    InstallmentPending: installmentPending.toNumber(),
                    FixedExpensesDetected: recurring.length,
                    FreeCashFlow: freeCashFlow.toNumber(),
                    SavingGap: savingGap.toNumber(),
                    RiskLevel: risk
                },
                Charts: {
                    MonthlyTimeline: monthlyTimeline,
                    DebtComposition: [
                        {
                            Type: "GeneratedInvoices",
                            Amount: generatedInvoices.toNumber()
                        },
                        {
                            Type: "Installments",
                            Amount: installmentPending.toNumber()
                        },
                        {
                            Type: "Recurring",
                            Amount: recurringExpenses.toNumber()
                        }
                    ]
                },
                Details: {
                    RecurringExpenses: recurring,
                    PendingInstallments: installmentMap,
                    OpenInvoices: invoices?.map(item => item.toEntityObject())
                },
                Recommendations: recommendations
            });
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
        }
    }
    async retrieveTransactionsByCategory() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const input = this.validateRetrieveTransactionsByCategoryInput(request.data);
            if (input.isLeft())
                return input;
            const { PersonId, CategoryId, Total, Month, Year } = input.value;
            const auth = await this.authorizeRetrieveTransactionsByCategory(request.user, PersonId, CategoryId);
            if (auth.isLeft())
                return auth;
            const person = await this.Repository.findById(PersonId);
            if (!person) {
                return (0, either_1.right)(this.emptyCategoryTransactionsResponse());
            }
            const cards = await this.CardRepository.findByPersonId(PersonId) || [];
            if (!cards.length) {
                return (0, either_1.right)(this.emptyCategoryTransactionsResponse());
            }
            const cardIds = cards.map(card => card.Id);
            const invoices = await this.resolveInvoicesScope(cardIds, Total, Month, Year);
            if (!invoices.length) {
                return (0, either_1.right)(this.emptyCategoryTransactionsResponse());
            }
            const invoiceIds = invoices.map(invoice => invoice.Id);
            const transactions = await this.TransactionRepository.findByInvoiceIds(invoiceIds, {
                Category_ID: CategoryId
            }) || [];
            if (!transactions.length) {
                return (0, either_1.right)(this.emptyCategoryTransactionsResponse());
            }
            const authObjects = await this.authorizeAnalyticsObjects(request.user, cards, invoices, transactions);
            if (authObjects.isLeft())
                return authObjects;
            const category = await this.CategoryRepository.findById(CategoryId);
            if (!category) {
                return (0, either_1.right)(this.emptyCategoryTransactionsResponse());
            }
            const result = this.buildCategoryTransactionResponse(category, cards, invoices, transactions);
            return (0, either_1.right)(result);
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
        }
    }
    async retrieveCompleteInvoice() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const { PersonId, Year, Month } = request.data;
            const required = [];
            if (!PersonId)
                required.push('PersonId');
            if (!Year)
                required.push('Year');
            if (!Month)
                required.push('Month');
            if (required.length) {
                const err = new Error(this.getMessage('error.invalidFields', request, undefined, { fields: required.join(', ') }));
                return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
            }
            const authPerson = await this.afterRead([{ ID: PersonId }], request.user);
            if (authPerson.isLeft())
                return authPerson;
            else if (!authPerson.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
            const rows = await this.CardRepository.retrieveCompleteInvoiceTransactions(PersonId, Number(Year), Number(Month));
            if (!rows.length) {
                return (0, either_1.right)(complete_invoice_1.CompleteInvoiceModel.empty(Number(Year), Number(Month)).toEntityObject());
            }
            const resultAuth = await this.authorizeCompleteInvoiceObjects(rows, request.user);
            if (resultAuth.isLeft())
                return resultAuth;
            const result = complete_invoice_1.CompleteInvoiceModel.fromRepositoryRows(rows, Number(Year), Number(Month), this.getMessage(`month.${Month}`, request));
            return (0, either_1.right)(result.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
        }
    }
    parseAddCardExpenseInput(data) {
        return {
            CardId: data.CardId,
            CategoryId: data.CategoryId,
            Description: data.Description,
            Value: Number(data.Value),
            Currency: data.Currency,
            TransactionDate: data.TransactionDate,
            Installments: Number(data.Installments),
            FixedExpense: Boolean(data.FixedExpense)
        };
    }
    validateAddCardExpenseInput(input, request) {
        const required = [];
        if (!input.CardId)
            required.push('CardId');
        if (!input.CategoryId)
            required.push('CategoryId');
        if (!input.Description)
            required.push('Description');
        if (!input.Value)
            required.push('Value');
        if (!input.Currency)
            required.push('Currency');
        if (!input.TransactionDate)
            required.push('TransactionDate');
        if (!input.Installments)
            required.push('Installments');
        if (required.length) {
            throw new Error(this.getMessage('error.invalidFields', request, undefined, { fields: required.join(', ') }));
        }
        if (!this.validateDate(input.TransactionDate)) {
            throw new Error(this.getMessage('error.invalidDate', request, undefined, { date: input.TransactionDate }));
        }
    }
    ensureCardExists(card) {
        if (!card) {
            throw new Error('error.invalidCard');
        }
    }
    ensureCategoryExists(category) {
        if (!category) {
            throw new Error('error.invalidCategory');
        }
    }
    async validateAddCardExpensePermissions(cardId, user) {
        const invoiceService = ServiceRegistry_1.ServiceRegistry.get('Invoices');
        const transactionService = ServiceRegistry_1.ServiceRegistry.get('Transactions');
        if (!invoiceService || !transactionService) {
            throw new Error('error.unknownError');
        }
        const fakeInvoiceId = this.generateUUID();
        const checkInvoice = await invoiceService.beforeUpdate({
            ID: fakeInvoiceId,
            Card_ID: cardId,
            Card: { ID: cardId }
        }, user);
        if (checkInvoice.isLeft()) {
            throw new Error(checkInvoice.value.message);
        }
        const checkTransaction = await transactionService.beforeCreate({
            ID: this.generateUUID(),
            Invoice_ID: fakeInvoiceId,
            Invoice: { ID: fakeInvoiceId }
        }, user);
        if (checkTransaction.isLeft()) {
            throw new Error(checkTransaction.value.message);
        }
    }
    async convertCurrencyIfNeeded(from, to, value) {
        if (from === to) {
            return new decimal_js_1.default(value).toDecimalPlaces(2);
        }
        const response = await axios_1.default.get(`https://api.fxratesapi.com/latest?base=${from}&amount=${value}`, {
            timeout: 5000
        });
        const converted = response?.data?.rates?.[to];
        if (!converted) {
            throw new Error('error.currencyConversion');
        }
        return new decimal_js_1.default(converted).toDecimalPlaces(2);
    }
    calculateBillingCycle(transactionDate, dueDay, closingDay, fixedExpense) {
        const expenseDate = new Date(`${transactionDate}T00:00:00`);
        const day = expenseDate.getDate();
        let month = expenseDate.getMonth() + 1;
        let year = expenseDate.getFullYear();
        if (closingDay > dueDay) {
            ({ month, year } = this.nextMonth(month, year));
        }
        if (day >= closingDay) {
            ({ month, year } = this.nextMonth(month, year));
        }
        const fixedInstallments = fixedExpense ? (12 - month) + 1 : 1;
        return {
            InvoiceMonth: month,
            InvoiceYear: year,
            FixedInstallments: fixedInstallments
        };
    }
    nextMonth(month, year) {
        if (month === 12) {
            return {
                month: 1,
                year: year + 1
            };
        }
        return {
            month: month + 1,
            year
        };
    }
    buildInstallmentPlan(total, installments, startYear, startMonth, fixedInstallments) {
        const totalDecimal = total;
        const base = totalDecimal
            .div(installments)
            .toDecimalPlaces(2);
        const diff = base
            .mul(installments)
            .minus(totalDecimal)
            .toDecimalPlaces(2);
        const first = base.minus(diff);
        const maxInstallments = Math.max(installments, fixedInstallments);
        const result = [];
        let month = startMonth;
        let year = startYear;
        for (let i = 1; i <= maxInstallments; i++) {
            result.push({
                Installment: i,
                Month: month,
                Year: year,
                Amount: i === 1 ? first : base
            });
            ({ month, year } = this.nextMonth(month, year));
        }
        return result;
    }
    async resolveInvoiceCached(invoice, cache) {
        const key = `${invoice.Card_ID}_${invoice.Year}_${invoice.Month}`;
        const cached = cache.get(key);
        if (cached) {
            return cached;
        }
        const result = await this.retrieveInvoice(invoice);
        if (result.isLeft()) {
            throw new Error(result.value.message);
        }
        cache.set(key, result.value);
        return result.value;
    }
    async checkPermission(Person, User, Permission) {
        const cache = ServiceLocator_1.ServiceLocator.getPermissionCache();
        const userId = User?.id;
        let personId = cache.personMap.get(Person.ID);
        if (!personId) {
            personId = Person?.ID;
            if (personId) {
                cache.personMap.set(Person.ID, personId);
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
    async generatePDF(Logo, Person, Invoice, Card, Transactions, CardExpensesByCategory) {
        try {
            const result = await new Promise(async (resolve, reject) => {
                const doc = new pdfkit_1.default({
                    size: "A4",
                    margin: 40,
                });
                const oPrimaryColor = "#085caf";
                const oTextColor = "#333333";
                const oBufferArray = [];
                const oBufferStream = new stream_1.PassThrough();
                oBufferStream.on('data', (chunk) => oBufferArray.push(chunk));
                oBufferStream.on('end', () => resolve(Buffer?.concat(oBufferArray)));
                oBufferStream.on('error', (err) => reject(`Erro no stream: ${err}`));
                doc.pipe(oBufferStream);
                const designHeader = (initialPage = false) => {
                    if (!initialPage)
                        doc.addPage();
                    doc
                        .rect(0, 0, doc.page.width, 80)
                        .fill(oPrimaryColor);
                    if (Logo) {
                        const diameter = 60;
                        const x = 40;
                        const y = 10;
                        doc
                            .save()
                            .circle(x + diameter / 2, y + diameter / 2, diameter / 2)
                            .clip()
                            .image(Logo, x, y, { width: diameter, height: diameter })
                            .restore();
                    }
                    doc
                        .fillColor("white")
                        .fontSize(30)
                        .text("Expense Manager", 40, 30, { align: "center" });
                    doc.moveDown(2);
                };
                const designFooter = () => {
                    let verticalPosition = doc.page.height - 70;
                    doc
                        .rect(0, verticalPosition, doc.page.width, 80)
                        .fill(oPrimaryColor);
                };
                const designInvoiceSummary = async () => {
                    const oMonthDescription = this.getMessage(`month.${Invoice?.Month}`, ServiceLocator_1.ServiceLocator.getRequest());
                    if (Card?.Image) {
                        const diameter = 120;
                        const x = (doc.page.width - diameter) / 2;
                        const y = 100;
                        const oImage = await this.readableToBuffer(Card?.Image);
                        doc
                            .save()
                            .circle(x + diameter / 2, y + diameter / 2, diameter / 2)
                            .clip()
                            .image(oImage, x, y, { width: diameter, height: diameter })
                            .restore();
                    }
                    doc.moveDown(3);
                    doc
                        .fillColor(oTextColor)
                        .fontSize(22)
                        .text(`${Person?.Name}, a sua invoice do cartão ${Card?.Name}`, { align: "center" });
                    doc.moveDown(2);
                    doc
                        .rect(40, doc.y, doc.page.width - 80, 100)
                        .strokeColor(oPrimaryColor)
                        .lineWidth(2)
                        .stroke();
                    doc
                        .fillColor(oTextColor)
                        .fontSize(20)
                        .text("Total da sua invoice:", 60, doc.y + 10, { align: "left" });
                    doc
                        .fillColor(oPrimaryColor)
                        .fontSize(45)
                        .text(`${Invoice?.TotalAmount?.toNumber()} ${Invoice?.Currency?.Code}`, { align: "center" });
                    doc.moveDown(2);
                    doc
                        .fillColor(oTextColor)
                        .fontSize(20)
                        .text(`Este é o valor que você precisa pagar nesse mês.`, 60, doc.y, { align: "left" });
                    doc
                        .fillColor(oTextColor)
                        .fontSize(16)
                        .text(`Mês: ${oMonthDescription}`, { align: "left" })
                        .text(`Year: ${Invoice?.Year}`, { align: "left" })
                        .text(`Data de Vencimento: ${this.addLeftZeros(Card?.DueDay)}/${this.addLeftZeros(Invoice?.Month)}/${Invoice?.Year}`, { align: "left" });
                    doc
                        .moveDown(2)
                        .fillColor("black")
                        .fontSize(20)
                        .text("Fatura gerada", 45, doc.y, { align: "center" });
                    ;
                };
                const designCategoriesSummary = async () => {
                    doc
                        .fillColor(oPrimaryColor)
                        .fontSize(20)
                        .text("Gastos por categoria", doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });
                    const positions = {
                        image: 60,
                        name: 90,
                        totalCategory: 280,
                        percent: 440,
                    };
                    doc.moveDown(2);
                    let verticalPosition = doc.y;
                    doc
                        .fontSize(16)
                        .text("", positions.image, verticalPosition, { width: 100 })
                        .text("Nome", positions.name, verticalPosition, { width: 200 })
                        .text("Total da Categoria", positions.totalCategory, verticalPosition, { width: 150 })
                        .text("Porcentagem", positions.percent, verticalPosition, { width: 100 });
                    verticalPosition += 25;
                    doc
                        .moveTo(60, verticalPosition - 6)
                        .lineTo(560, verticalPosition - 6)
                        .strokeColor(oPrimaryColor)
                        .lineWidth(1)
                        .stroke();
                    let index = 0;
                    for (const category of CardExpensesByCategory.Categories) {
                        doc.moveDown(2);
                        verticalPosition += 15;
                        if (category?.ImagePath) {
                            const diameter = 26;
                            const x = positions.image;
                            const y = verticalPosition - 10;
                            const oImageBuffer = await this.getCategoryImageCached(category?.ID);
                            doc
                                .save()
                                .circle(x + diameter / 2, y + diameter / 2, diameter / 2)
                                .clip()
                                .image(oImageBuffer, x, y, { width: diameter, height: diameter })
                                .restore();
                        }
                        doc
                            .fillColor(oTextColor)
                            .fontSize(12)
                            .text(category.Name, positions.name, verticalPosition, { width: 200 })
                            .text(`${category.TotalAmount?.toNumber()} ${CardExpensesByCategory?.Currency?.Code}`, positions.totalCategory, verticalPosition, { width: 130, align: "right" })
                            .text(`${Number(category.Percent?.toNumber()).toFixed(2)}%`, positions.percent, verticalPosition, { width: 95, align: "right" });
                        verticalPosition += 25;
                        doc
                            .moveTo(60, verticalPosition - 5)
                            .lineTo(560, verticalPosition - 5)
                            .strokeColor("#CCCCCC")
                            .lineWidth(0.5)
                            .stroke();
                        if ((index + 1) % 15 === 0) {
                            designFooter();
                            designHeader();
                            verticalPosition = doc.y + 20;
                        }
                        index++;
                    }
                    ;
                };
                const designTransactions = () => {
                    doc
                        .fillColor(oPrimaryColor)
                        .fontSize(20)
                        .text("Gastos da invoice", doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });
                    doc.moveDown(1);
                    doc
                        .fillColor(oPrimaryColor)
                        .fontSize(18)
                        .text(`Quantidade de gastos totais: ${Transactions.length}`, doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });
                    doc.moveDown(1);
                    Transactions.sort((a, b) => new Date(a.Date) - new Date(b.Date));
                    const positions = {
                        data: 60,
                        description: 140,
                        category: 340,
                        parcela: 440,
                        valor: 460,
                    };
                    let verticalPosition = doc.y;
                    doc
                        .fontSize(16)
                        .text("Data", positions.data, verticalPosition, { width: 100 })
                        .text("Descrição", positions.description, verticalPosition, { width: 200 })
                        .text("Categoria", positions.category, verticalPosition, { width: 100 })
                        .text("Installment", positions.parcela, verticalPosition, { width: 100 })
                        .text("Amount", positions.valor, verticalPosition, { width: 100, align: "right" });
                    verticalPosition += 20;
                    doc
                        .moveTo(60, verticalPosition - 6)
                        .lineTo(560, verticalPosition - 6)
                        .strokeColor(oPrimaryColor)
                        .lineWidth(1)
                        .stroke();
                    Transactions.forEach((transaction, index) => {
                        doc.moveDown(2);
                        const oExpenseDate = new Date(`${transaction?.Date}T00:00:00`);
                        const oYearTransacao = oExpenseDate.getFullYear();
                        const oMonthTransacao = String(oExpenseDate.getMonth() + 1).padStart(2, "0");
                        const oDayTransacao = String(oExpenseDate.getDate()).padStart(2, "0");
                        let oCategory = CardExpensesByCategory.Categories.filter(category => category.ID == transaction.CategoryId);
                        let oCategoryName;
                        if (oCategory.length > 0) {
                            oCategoryName = oCategory[0].Name;
                        }
                        else {
                            oCategoryName = "Sem categoria";
                        }
                        doc
                            .fillColor(oTextColor)
                            .fontSize(12)
                            .text(`${oDayTransacao}/${oMonthTransacao}/${oYearTransacao}`, positions.data, verticalPosition, { width: 100 })
                            .text(transaction.Description, positions.description, verticalPosition, { width: 200 })
                            .text(oCategoryName, positions.category, verticalPosition, { width: 100 })
                            .text(`${transaction.Installment} de ${transaction.TotalInstallments}`, positions.parcela, verticalPosition, { width: 100 })
                            .text(`${transaction.Amount?.toNumber()} ${transaction?.Currency?.Code}`, positions.valor, verticalPosition, { width: 100, align: "right" });
                        verticalPosition += 15;
                        doc
                            .moveTo(60, verticalPosition - 5)
                            .lineTo(560, verticalPosition - 5)
                            .strokeColor("#CCCCCC")
                            .lineWidth(0.5)
                            .stroke();
                        if ((index + 1) % 30 === 0) {
                            designFooter();
                            designHeader();
                            verticalPosition = doc.y + 20;
                        }
                    });
                };
                designHeader(true);
                await designInvoiceSummary();
                designFooter();
                if (CardExpensesByCategory.Categories.length > 0) {
                    designHeader();
                    await designCategoriesSummary();
                    designFooter();
                }
                designHeader();
                designTransactions();
                designFooter();
                doc.end();
            });
            return (0, either_1.right)(result);
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    personPath() {
        return [];
    }
    entityCode() {
        return 1;
    }
    parentField() {
        return 'ID';
    }
    async recoverExpenses(Cards) {
        try {
            let oTotalExpenses = new decimal_js_1.default(0);
            let oMonthExpenses = new decimal_js_1.default(0);
            let oMonthExpensesToPay = new decimal_js_1.default(0);
            let oMonthExpensesClosed = new decimal_js_1.default(0);
            let oMonthExpensesPayed = new decimal_js_1.default(0);
            let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
            oDate = oDate.replaceAll(",", " ");
            const [day, month, year] = oDate.split(" ")[0].split("/");
            let oDay = Number(day);
            let oMonth = Number(month);
            let oYear = Number(year);
            const cardIds = Cards.map(c => c.ID);
            const invoicesByCard = await this.InvoiceRepository.findByCardIDs(cardIds, { Year: { '>=': oYear } }) || [];
            const mapInvoices = new Map();
            for (const inv of invoicesByCard) {
                if (!mapInvoices.has(inv?.CardId)) {
                    mapInvoices.set(inv?.CardId, []);
                }
                mapInvoices.get(inv.CardId).push(inv);
            }
            for (let Card of Cards) {
                if (!('ClosingDay' in Card) || !('DueDay' in Card)) {
                    continue;
                }
                const oCardModel = card_1.CardModel.singleModel(Card);
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
                const oInvoices = mapInvoices.get(oCardModel.Id) || [];
                oInvoices?.forEach(oInvoice => {
                    if (oInvoice.Year == oInvoiceYear && oInvoice.Month >= oInvoiceMonth || oInvoice.Year > oInvoiceYear) {
                        if (oInvoice.Month == oInvoiceMonth && oInvoice.Year == oInvoiceYear) {
                            oMonthExpenses = oMonthExpenses.plus(oInvoice.TotalAmount || 0);
                            if (oCardModel.ClosingDay > oDay) {
                                oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice?.TotalAmount || 0);
                                oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0);
                            }
                            else if (oCardModel.DueDay >= oDay) {
                                oMonthExpensesClosed = oMonthExpensesClosed.plus(oInvoice.TotalAmount || 0);
                                oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0);
                            }
                            else {
                                oMonthExpensesPayed = oMonthExpensesPayed.plus(oInvoice.TotalAmount || 0);
                            }
                        }
                        else if (oInvoice.Year == oNextYear && oInvoice.Month == oNextMonth && oCardModel.ClosingDay <= oDay) {
                            oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice.TotalAmount || 0);
                            oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0);
                        }
                        else {
                            oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0);
                        }
                    }
                });
            }
            ;
            return (0, either_1.right)({
                totalExpenses: oTotalExpenses,
                monthExpenses: oMonthExpenses,
                monthExpensesToPay: oMonthExpensesToPay,
                monthExpensesClosed: oMonthExpensesClosed,
                monthExpensesPayed: oMonthExpensesPayed
            });
        }
        catch (error) {
            const errorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(errorInstance.message, 403, errorInstance.stack));
        }
    }
    validateDate(date) {
        const dateCheck = new Date(date);
        return !isNaN(dateCheck.getTime());
    }
    lastDayOfTheMonth(year, month) {
        const date = new Date(year, month, 0);
        return date.getDate();
    }
    async checkPerson(Person) {
        if (Person) {
            let oPerson = await this.Repository.findById(Person?.ID, true);
            if (oPerson && Person.Currency?.code) {
                let oCards = await this.CardRepository.findByPersonId(Person?.ID);
                if (oPerson.Currency?.Code != Person.Currency?.code && oCards?.length) {
                    const oStack = new Error().stack;
                    const message = this.getMessage('error.changeCurrencyNotPermited', ServiceLocator_1.ServiceLocator.getRequest());
                    return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
                }
            }
        }
        if (Person.Email) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(Person.Email)) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.invalidEmail', ServiceLocator_1.ServiceLocator.getRequest());
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        if (Person.Phone) {
            const regexPhone = /^\d{2}\d{2}9\d{8}$/;
            if (!regexPhone.test(Person.Phone)) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.invalidPhone', ServiceLocator_1.ServiceLocator.getRequest());
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        if (Person.Income) {
            if (Person.Income < 0) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.invalidIncome', ServiceLocator_1.ServiceLocator.getRequest());
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        if (Person.ExpenseTarget) {
            if (Person.ExpenseTarget < 0) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.invalidExpenseTarget', ServiceLocator_1.ServiceLocator.getRequest());
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        return (0, either_1.right)(true);
    }
    async retrieveInvoice(Invoice) {
        try {
            let oInvoices = await this.InvoiceRepository.findByCardID(Invoice.Card_ID || Invoice.Card?.ID, {
                Year: Invoice?.Year,
                Month: Invoice?.Month
            });
            if (!oInvoices) {
                if (!Invoice.Description && Invoice.Month) {
                    Invoice.Description = this.getMessage(`month.${Invoice.Month}`, ServiceLocator_1.ServiceLocator.getRequest());
                }
                if (!Invoice.ID) {
                    Invoice.ID = this.generateUUID();
                }
                oInvoices = await this.InvoiceRepository.createEntry(Invoice);
            }
            return (0, either_1.right)(oInvoices?.[0]);
        }
        catch (error) {
            const oErrorInstance = error;
            return (0, either_1.left)(new errors_1.AbstractError(oErrorInstance.message, 403, oErrorInstance.stack));
        }
    }
    parseCardExpensesByCategoryFields(data) {
        const today = this.getBrazilDate();
        return {
            PersonId: data.PersonId,
            CardId: data.CardId,
            InvoiceId: data.InvoiceId,
            TotalOnwards: !!data.TotalOnwards,
            Month: Number(data.Month || today.month),
            Year: Number(data.Year || today.year)
        };
    }
    validateCardExpensesByCategoriesInput(input) {
        if (!input.PersonId &&
            !input.CardId &&
            !input.InvoiceId) {
            return this.fail("error.fillAtLeastFieldsObrigatory", {
                fields: "PersonId, CardId, InvoiceId"
            });
        }
        if (input.TotalOnwards &&
            !input.PersonId &&
            !input.CardId) {
            return this.fail("error.fillAtLeastFieldsObrigatory", {
                fields: "PersonId, CardId"
            });
        }
        return (0, either_1.right)(true);
    }
    async cardExpensesByCategoriesCheckAuthorization(input, user) {
        const cardService = ServiceRegistry_1.ServiceRegistry.get("Cards");
        const invoiceService = ServiceRegistry_1.ServiceRegistry.get("Invoices");
        const categoryService = ServiceRegistry_1.ServiceRegistry.get("Categories");
        if (input.PersonId) {
            const result = await this.afterRead([{ ID: input.PersonId }], user);
            if (result.isLeft())
                return result;
            else if (!result.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
            const categoryAuth = await categoryService.afterRead([{ Person: { ID: input.PersonId } }], user);
            if (categoryAuth.isLeft())
                return categoryAuth;
            else if (!result.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        if (input.CardId) {
            const result = await cardService.afterRead([{ ID: input.CardId }], user);
            if (result.isLeft())
                return result;
            else if (!result.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        if (input.InvoiceId) {
            const result = await invoiceService.afterRead([{ ID: input.InvoiceId }], user);
            if (result.isLeft())
                return result;
            else if (!result.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        return (0, either_1.right)(true);
    }
    async loadContext(input) {
        if (input.PersonId) {
            return this.loadByPerson(input);
        }
        if (input.CardId) {
            return this.loadByCard(input);
        }
        return this.loadByInvoice(input);
    }
    async loadByPerson(input) {
        const categories = await this.CategoryRepository
            .findByPersonIds([input.PersonId]) || [];
        const cards = input.CardId && !input.TotalOnwards
            ? [card_1.CardModel.singleModel({ ID: input.CardId })]
            : await this.CardRepository
                .findByPersonIds([input.PersonId]) || [];
        if (!cards.length) {
            return {
                categories: [],
                cards: [],
                invoices: []
            };
        }
        const filters = input.TotalOnwards
            ? { Year: { ">=": input.Year } }
            : {
                Year: input.Year,
                Month: input.Month
            };
        let invoices = await this.InvoiceRepository
            .findByCardIDs(cards.map(card => card.Id), filters) || [];
        if (input.TotalOnwards) {
            invoices = invoices.filter(invoice => invoice.Year > input.Year ||
                (invoice.Year === input.Year &&
                    invoice.Month >= input.Month));
        }
        return {
            categories,
            cards,
            invoices
        };
    }
    async loadByCard(input) {
        const card = await this.CardRepository
            .findById(input.CardId);
        if (!card) {
            return {
                categories: [],
                cards: [],
                invoices: []
            };
        }
        const categories = await this.CategoryRepository
            .findByPersonIds([card.PersonId]) || [];
        const filters = input.TotalOnwards
            ? { Year: { ">=": input.Year } }
            : {
                Year: input.Year,
                Month: input.Month
            };
        let invoices = await this.InvoiceRepository
            .findByCardIDs([card.Id], filters) || [];
        if (input.TotalOnwards) {
            invoices = invoices.filter(invoice => invoice.Year > input.Year ||
                (invoice.Year === input.Year &&
                    invoice.Month >= input.Month));
        }
        return {
            categories,
            cards: [card],
            invoices
        };
    }
    async loadByInvoice(input) {
        const invoice = await this.InvoiceRepository
            .findById(input.InvoiceId);
        if (!invoice) {
            return {
                categories: [],
                cards: [],
                invoices: []
            };
        }
        const cards = await this.CardRepository
            .findByInvoiceIds(input.InvoiceId);
        const card = cards?.[0];
        if (!card) {
            return {
                categories: [],
                cards: [],
                invoices: []
            };
        }
        const categories = await this.CategoryRepository
            .findByPersonIds([card.PersonId]) || [];
        return {
            categories,
            cards: [card],
            invoices: [invoice]
        };
    }
    async buildSummary(categories, invoices, user) {
        const categoryService = ServiceRegistry_1.ServiceRegistry.get("Categories");
        const transactionService = ServiceRegistry_1.ServiceRegistry.get("Transactions");
        const categoryAuth = await categoryService.afterRead([categories[0].toEntityObject()], user);
        if (categoryAuth.isLeft())
            throw new Error(categoryAuth?.value?.message);
        else if (!categoryAuth.value?.length) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), categoryService.entityCode()) ||
                'error.modificationPermissionDenied';
            throw new permission_denied_1.PermissionDenied(message, 403, oStack);
        }
        const transactionAuth = await transactionService.afterRead([{
                Invoice: {
                    ID: invoices[0].Id
                }
            }], user);
        if (transactionAuth.isLeft())
            throw new Error(transactionAuth?.value?.message);
        else if (!transactionAuth.value?.length) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), transactionService.entityCode()) ||
                'error.modificationPermissionDenied';
            throw new permission_denied_1.PermissionDenied(message, 403, oStack);
        }
        const invoiceIds = invoices.map(item => item.Id);
        const totalModel = invoices.length === 1
            ? invoices[0]
            : await this.InvoiceRepository
                .retrieveTotalAmountByIDs(invoiceIds);
        const total = totalModel?.TotalAmount?.toDecimalPlaces(2) ||
            new decimal_js_1.default(0);
        if (total.eq(0)) {
            return this.emptyResult();
        }
        const totalsByCategory = await this.TransactionRepository
            .retrieveTotalsGroupedByCategory(invoices.map(i => i.Id));
        const categoryResults = await Promise.all(categories.map(async (category) => {
            const result = totalsByCategory?.find(t => t.CategoryId === category.Id);
            const amount = result?.TotalAmount?.toDecimalPlaces(2) ||
                new decimal_js_1.default(0);
            if (amount.eq(0))
                return null;
            const item = {
                ID: category.Id,
                Name: category.Name,
                ImagePath: category.ImageType
                    ? this.buildImagePath(category.Id)
                    : undefined,
                TotalAmount: amount,
                Percent: amount
                    .div(total)
                    .mul(100)
                    .toDecimalPlaces(2)
            };
            return item;
        }));
        const model = card_expenses_by_category_1.CardExpensesByCategoryModel.with({
            TotalAmount: total,
            Currency: invoices[0].Currency,
            Categories: categoryResults
                .filter(Boolean)
                .sort((a, b) => b.TotalAmount
                .minus(a.TotalAmount)
                .toNumber())
        });
        return model.toEntityObject();
    }
    emptyResult() {
        return {
            TotalAmount: 0,
            Currency: {},
            Categories: []
        };
    }
    buildImagePath(id) {
        return `Categories(ID='${id}',IsActiveEntity=true)/Image`;
    }
    getBrazilDate() {
        const date = new Date().toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo"
        });
        const [rawDate] = date.replaceAll(",", "").split(" ");
        const [day, month, year] = rawDate.split("/").map(Number);
        return {
            day,
            month,
            year
        };
    }
    fail(key, params) {
        const request = ServiceLocator_1.ServiceLocator.getRequest();
        const message = this.getMessage(key, request, undefined, params);
        const err = new Error(message);
        return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
    }
    validateEmailConfiguration(request) {
        if (!process.env.SMTPAddres ||
            !process.env.SMTPHost ||
            !process.env.SMTPKey) {
            throw new Error(this.getMessage('error.emailConfigNotFound', request));
        }
    }
    /**
     * SMTP + templates cache
    */
    async initializeEmailInfrastructure() {
        const cache = ServiceLocator_1.ServiceLocator.getEmailSendingCache();
        if (!cache._logoCache) {
            cache._logoCache = fs_1.default.readFileSync(path_1.default.join(__dirname, '../email/logo.png'));
        }
        if (!cache._mailTemplateCache) {
            const template = fs_1.default.readFileSync(path_1.default.join(__dirname, '../email/template.html'), 'utf8');
            cache._mailTemplateCache =
                handlebars_1.default.compile(template);
        }
        if (!cache._predictionTemplateCache) {
            const template = fs_1.default.readFileSync(path_1.default.join(__dirname, '../email/templatePrediction.html'), 'utf8');
            cache._predictionTemplateCache =
                handlebars_1.default.compile(template);
        }
        if (!cache._smtpInstance) {
            cache._smtpInstance =
                nodemailer_1.default.createTransport({
                    host: process.env.SMTPHost,
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTPAddres,
                        pass: process.env.SMTPKey
                    }
                });
            await cache._smtpInstance.verify();
        }
    }
    async loadPersonsImages(persons) {
        const ids = persons
            .filter(p => p.ImageType)
            .map(p => p.Id);
        if (!ids.length)
            return;
        const images = await this.Repository.findImageByIds(ids) || [];
        const map = new Map(images.map(i => [i.ID, i.Image]));
        for (const person of persons) {
            const img = map.get(person.Id);
            if (img) {
                person.Image = img;
            }
        }
    }
    /**
     * cards image batch
     */
    async loadCardsImages(cards) {
        const ids = cards
            .filter(c => c.ImageType)
            .map(c => c.Id);
        if (!ids.length)
            return;
        const images = await this.CardRepository.findImageByIds(ids) || [];
        const map = new Map(images.map(i => [i.ID, i.Image]));
        for (const card of cards) {
            const img = map.get(card.Id);
            if (img) {
                card.Image = img;
            }
        }
    }
    async getCategoryImageCached(categoryId) {
        const cache = ServiceLocator_1.ServiceLocator.getEmailSendingCache();
        if (!Array.isArray(categoryId)) {
            if (!categoryId)
                return null;
            const cached = cache._categoryImageCache.get(categoryId);
            if (cached)
                return cached;
        }
        const categoryIds = Array.isArray(categoryId) ? categoryId : [categoryId];
        const result = await this.CategoryRepository.findImageByIds(categoryIds) || [];
        if (result.length == 1) {
            const image = result?.[0]?.Image;
            if (!image)
                return null;
            const buffer = await this.readableToBuffer(image);
            cache._categoryImageCache.set(result?.[0]?.ID, buffer);
            return buffer;
        }
        else {
            for (const categoryImage of result) {
                const buffer = await this.readableToBuffer(categoryImage?.Image);
                cache._categoryImageCache.set(categoryImage?.ID, buffer);
            }
            return null;
        }
    }
    extractSimulationInput(request) {
        return {
            PersonId: request?.data?.PersonId,
            Year: Number(request?.data?.Year),
            Month: Number(request?.data?.Month)
        };
    }
    async validateSimulationInput(input, request) {
        const missing = [];
        if (!input.PersonId)
            missing.push("PersonId");
        if (!input.Year)
            missing.push("Year");
        if (!input.Month)
            missing.push("Month");
        if (missing.length) {
            return (0, either_1.left)(this.buildValidationError(request, missing.join(", ")));
        }
        if (input.Month < 1 || input.Month > 12) {
            return (0, either_1.left)(this.buildValidationError(request, "Month"));
        }
        const person = await this.Repository.findById(input.PersonId);
        if (!person) {
            return (0, either_1.left)(this.buildValidationError(request, "PersonId"));
        }
        const authCheck = await this.afterRead([{ ID: input.PersonId }], request?.user);
        if (authCheck.isLeft()) {
            return authCheck;
        }
        else if (!authCheck.value?.length) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                'error.modificationPermissionDenied';
            return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
        }
        const cardService = ServiceRegistry_1.ServiceRegistry.get("Cards");
        const cards = await this.CardRepository.findByPersonIds([input.PersonId]) || [];
        const authCardCheck = await cardService.afterRead([{ Person: { ID: input.PersonId } }], request?.user);
        if (authCardCheck.isLeft()) {
            return authCardCheck;
        }
        else if (!authCardCheck.value?.length) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), cardService.entityCode()) ||
                'error.modificationPermissionDenied';
            return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
        }
        if (cards?.length) {
            const invoiceService = ServiceRegistry_1.ServiceRegistry.get("Invoices");
            const authInvoiceCheck = await invoiceService.afterRead([{ Card: { ID: cards[0].Id } }], request?.user);
            if (authInvoiceCheck.isLeft()) {
                return authInvoiceCheck;
            }
            else if (!authInvoiceCheck.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), invoiceService.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        return (0, either_1.right)({
            person,
            cards
        });
    }
    async loadInvoicesForSimulation(cardIds, year) {
        if (!cardIds.length)
            return [];
        return await this.InvoiceRepository.findByCardIDs(cardIds, {
            Year: { ">=": year }
        }) || [];
    }
    calculateSimulationTotals(invoices, targetYear, targetMonth) {
        let totalFuture = new decimal_js_1.default(0);
        let totalMonth = new decimal_js_1.default(0);
        for (const invoice of invoices) {
            const isFutureOrCurrent = invoice.Year > targetYear ||
                (invoice.Year === targetYear &&
                    invoice.Month >= targetMonth);
            if (!isFutureOrCurrent)
                continue;
            totalFuture = totalFuture.plus(invoice.TotalAmount || 0);
            const isTargetMonth = invoice.Year === targetYear &&
                invoice.Month === targetMonth;
            if (isTargetMonth) {
                totalMonth = totalMonth.plus(invoice.TotalAmount || 0);
            }
        }
        return {
            totalFuture,
            totalMonth
        };
    }
    buildSimulationResult(person, totalFuture, totalMonth) {
        const target = person?.ExpenseTarget || new decimal_js_1.default(0);
        const currency = person?.Currency?.toEntityObject()
            || { code: "BRL" };
        return simulate_expense_1.SimulateExpenseModel.with({
            TotalAmount: totalFuture,
            TotalMonth: totalMonth,
            AmountSaving: target.minus(totalMonth),
            Currency: currency_1.CurrencyModel.singleModel(currency)
        });
    }
    buildEmptySimulation(person) {
        const currency = person?.Currency?.toEntityObject()
            || { code: "BRL" };
        return simulate_expense_1.SimulateExpenseModel.with({
            TotalAmount: new decimal_js_1.default(0),
            TotalMonth: new decimal_js_1.default(0),
            AmountSaving: person?.ExpenseTarget || new decimal_js_1.default(0),
            Currency: currency_1.CurrencyModel.singleModel(currency)
        });
    }
    buildValidationError(request, fields) {
        const error = new Error(this.getMessage("error.invalidFields", request, undefined, { fields }));
        return new errors_1.AbstractError(error.message, 403, error.stack);
    }
    handleSimulationError(error) {
        const err = error;
        return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
    }
    futureKey(year, month) {
        return `${year}-${String(month).padStart(2, "0")}`;
    }
    futureAddTimeline(map, key, amount) {
        const current = map.get(key) || new decimal_js_1.default(0);
        map.set(key, current.plus(amount || 0));
    }
    isBeforeOrEqual(year, month, targetYear, targetMonth) {
        if (year < targetYear)
            return true;
        if (year === targetYear && month <= targetMonth)
            return true;
        return false;
    }
    monthDiffFromNow(targetYear, targetMonth) {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        return ((targetYear - y) * 12 +
            (targetMonth - m) + 1);
    }
    calculateRisk(targetDebt, targetLimit) {
        if (targetLimit.lte(0))
            return "HIGH";
        const ratio = targetDebt.div(targetLimit).mul(100);
        if (ratio.lte(60))
            return "LOW";
        if (ratio.lte(100))
            return "MEDIUM";
        return "HIGH";
    }
    detectPendingInstallments(transactions) {
        const result = [];
        for (const tx of transactions) {
            if (Number(tx.TotalInstallments) > 1 &&
                Number(tx.Installment) <
                    Number(tx.TotalInstallments)) {
                const remaining = Number(tx.TotalInstallments) -
                    Number(tx.Installment);
                const date = new Date(`${tx.Date}T00:00:00`);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                ({ year, month } =
                    this.nextMonth(year, month));
                result.push({
                    ...tx.toEntityObject(),
                    remaining,
                    nextYear: year,
                    nextMonth: month
                });
            }
        }
        return result;
    }
    detectRecurringExpenses(transactions) {
        const map = new Map();
        for (const tx of transactions) {
            if (Number(tx.TotalInstallments) !== 1 ||
                !tx.Identifier)
                continue;
            if (!map.has(tx.Identifier)) {
                map.set(tx.Identifier, []);
            }
            map.get(tx.Identifier).push(tx);
        }
        const result = [];
        for (const [identifier, items] of map) {
            if (items.length <= 1)
                continue;
            let max = new decimal_js_1.default(0);
            for (const tx of items) {
                if (new decimal_js_1.default(tx.Amount).gt(max)) {
                    max = new decimal_js_1.default(tx.Amount);
                }
            }
            result.push({
                Identifier: identifier,
                Description: items[0]?.Description,
                Count: items.length,
                MaxAmount: max.toNumber()
            });
        }
        return result;
    }
    buildFutureRecommendations(risk, recurringCount, installmentPending, targetDebt, targetLimit) {
        const result = [];
        if (risk === "HIGH") {
            result.push({
                Type: "WARNING",
                Message: "Seu mês alvo está acima da meta financeira."
            });
        }
        if (recurringCount > 5) {
            result.push({
                Type: "INFO",
                Message: `Você possui ${recurringCount} despesas fixas detectadas.`
            });
        }
        if (installmentPending.gt(0)) {
            result.push({
                Type: "INFO",
                Message: "Installmentmentos futuros impactarão Monthes seguintes."
            });
        }
        if (targetDebt.lt(targetLimit)) {
            result.push({
                Type: "SUCCESS",
                Message: "Sua projeção está dentro da meta mensal."
            });
        }
        return result;
    }
    buildEmptyFuture(person) {
        return {
            KPIs: {
                TotalDebtUntilTarget: 0,
                TargetMonthDebt: 0,
                RecurringMonthlyAverage: 0,
                InstallmentPending: 0,
                FixedExpensesDetected: 0,
                FreeCashFlow: person?.ExpenseTarget?.toNumber?.() || 0,
                SavingGap: person?.ExpenseTarget?.toNumber?.() || 0,
                RiskLevel: "LOW"
            },
            Charts: {
                MonthlyTimeline: [],
                DebtComposition: []
            },
            Details: {
                RecurringExpenses: [],
                PendingInstallments: [],
                OpenInvoices: []
            },
            Recommendations: []
        };
    }
    buildFutureError(message) {
        const err = new Error(message);
        return new errors_1.AbstractError(err.message, 403, err.stack);
    }
    async loadTransactionsByCardsFallback(cardIds) {
        const invoices = await this.InvoiceRepository.findByCardIDs(cardIds);
        if (!invoices?.length)
            return [];
        return await this.TransactionRepository
            .findByInvoiceIds(invoices.map((i) => i.Id)) || [];
    }
    validateRetrieveTransactionsByCategoryInput(data) {
        const request = ServiceLocator_1.ServiceLocator.getRequest();
        const required = [];
        if (!data.PersonId)
            required.push('PersonId');
        if (!data.CategoryId)
            required.push('CategoryId');
        if (required.length) {
            const err = new Error(this.getMessage('error.invalidFields', request, undefined, { fields: required.join(', ') }));
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 403, err.stack));
        }
        const now = this.getBrazilDate();
        return (0, either_1.right)({
            PersonId: data.PersonId,
            CategoryId: data.CategoryId,
            Total: !!data.Total,
            Month: Number(data.Month || now.month),
            Year: Number(data.Year || now.year)
        });
    }
    async authorizeRetrieveTransactionsByCategory(user, PersonId, CategoryId) {
        const resultPerson = await this.afterRead([{ ID: PersonId }], user);
        if (resultPerson.isLeft())
            return resultPerson;
        else if (!resultPerson.value?.length) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
                'error.modificationPermissionDenied';
            return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
        }
        const categoryService = ServiceRegistry_1.ServiceRegistry.get('Categories');
        if (categoryService) {
            const resultCategory = await categoryService.afterRead([{ ID: CategoryId }], user);
            if (resultCategory.isLeft())
                return resultCategory;
            else if (!resultCategory.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), categoryService.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        return (0, either_1.right)(true);
    }
    async authorizeAnalyticsObjects(user, cards, invoices, transactions) {
        const cardService = ServiceRegistry_1.ServiceRegistry.get('Cards');
        const invoiceService = ServiceRegistry_1.ServiceRegistry.get('Invoices');
        const transactionService = ServiceRegistry_1.ServiceRegistry.get('Transactions');
        if (cardService) {
            const result = await cardService.afterRead([cards?.[0]?.toEntityObject()], user);
            if (result.isLeft())
                return result;
            else if (!result.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), cardService.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        if (invoiceService) {
            const result = await invoiceService.afterRead([invoices?.[0]?.toEntityObject()], user);
            if (result.isLeft())
                return result;
            else if (!result.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), invoiceService.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        if (transactionService) {
            const result = await transactionService.afterRead([transactions?.[0]?.toEntityObject()], user);
            if (result.isLeft())
                return result;
            else if (!result.value?.length) {
                const oStack = new Error().stack;
                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), transactionService.entityCode()) ||
                    'error.modificationPermissionDenied';
                return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
            }
        }
        return (0, either_1.right)(true);
    }
    async resolveInvoicesScope(cardIds, Total, Month, Year) {
        if (!Total) {
            return await this.InvoiceRepository.findByCardIDs(cardIds, {
                Month,
                Year
            }) || [];
        }
        const invoices = await this.InvoiceRepository.findByCardIDs(cardIds, {
            Year: { '>=': Year }
        }) || [];
        return invoices.filter(invoice => invoice.Year > Year ||
            (invoice.Year === Year && invoice.Month >= Month));
    }
    buildCategoryTransactionResponse(category, cards, invoices, transactions) {
        const invoicesByCard = new Map();
        const transactionsByInvoice = new Map();
        for (const invoice of invoices) {
            if (!invoicesByCard.has(invoice.CardId)) {
                invoicesByCard.set(invoice.CardId, []);
            }
            invoicesByCard.get(invoice.CardId).push(invoice);
        }
        for (const transaction of transactions) {
            if (!transactionsByInvoice.has(transaction.InvoiceId)) {
                transactionsByInvoice.set(transaction.InvoiceId, []);
            }
            transactionsByInvoice.get(transaction.InvoiceId).push(transaction);
        }
        let totalAmount = 0;
        let cardsReturn = cards.map((card) => {
            const cardInvoices = invoicesByCard.get(card.Id) || [];
            let invoicesReturn = cardInvoices.map((invoice) => {
                const invoiceTransactions = transactionsByInvoice.get(invoice.Id) || [];
                if (invoiceTransactions.length) {
                    const invoiceTotal = invoiceTransactions.reduce((sum, item) => sum + Number(item.Amount?.toNumber() || 0), 0);
                    totalAmount += invoiceTotal;
                    return {
                        ID: invoice.Id,
                        Year: invoice.Year,
                        Month: invoice.Month,
                        Description: invoice.Description ||
                            this.getMessage(`month.${invoice.Month}`, ServiceLocator_1.ServiceLocator.getRequest()),
                        TotalAmount: invoiceTotal,
                        Transactions: invoiceTransactions.map(item => item.toEntityObject())
                    };
                }
            }).filter(Boolean);
            if (invoicesReturn.length) {
                return {
                    ID: card.Id,
                    Name: card.Name,
                    ImagePath: card.ImageType
                        ? `Cards(ID='${card.Id}',IsActiveEntity=true)/Image`
                        : undefined,
                    TotalAmount: invoicesReturn.reduce((sum, inv) => sum + inv.TotalAmount, 0),
                    Invoices: invoicesReturn
                };
            }
        }).filter(Boolean);
        const model = transactions_by_category_1.CategoryTransactionsModel.singleModel({
            ID: category.Id,
            Name: category.Name,
            ImagePath: category.ImageType
                ? `Categories(ID='${category.Id}',IsActiveEntity=true)/Image`
                : undefined,
            Currency: { code: cards[0].Currency.Code },
            TotalAmount: totalAmount,
            Cards: cardsReturn
        });
        return model.toEntityObject();
    }
    emptyCategoryTransactionsResponse() {
        return {
            ID: '',
            Name: '',
            Currency: { code: 'BRL' },
            TotalAmount: 0,
            Cards: []
        };
    }
    async authorizeCompleteInvoiceObjects(rows, user) {
        const cardService = ServiceRegistry_1.ServiceRegistry.get('Cards');
        const invoiceService = ServiceRegistry_1.ServiceRegistry.get('Invoices');
        const transactionService = ServiceRegistry_1.ServiceRegistry.get('Transactions');
        const categoryService = ServiceRegistry_1.ServiceRegistry.get('Categories');
        const cards = [
            ...new Map(rows.map(r => [r.CardID, { ID: r.CardID }])).values()
        ];
        const invoices = [
            ...new Map(rows.map(r => [r.InvoiceID, { ID: r.InvoiceID, Card: { ID: r.CardID } }])).values()
        ];
        const transactions = [
            ...new Map(rows.map(r => [r.TransactionID, { ID: r.TransactionID, Invoice: { ID: r.InvoiceID } }])).values()
        ];
        const categories = [
            ...new Map(rows
                .filter(r => r.CategoryID)
                .map(r => [r.CategoryID, { ID: r.CategoryID }])).values()
        ];
        const resultAuthCard = await cardService.afterRead([cards[0]], user);
        if (resultAuthCard.isLeft())
            return resultAuthCard;
        else if (!resultAuthCard.value?.length) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), cardService.entityCode()) ||
                'error.modificationPermissionDenied';
            return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
        }
        const resultAuthInvoice = await invoiceService.afterRead([invoices[0]], user);
        if (resultAuthInvoice.isLeft())
            return resultAuthInvoice;
        else if (!resultAuthInvoice.value?.length) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), invoiceService.entityCode()) ||
                'error.modificationPermissionDenied';
            return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
        }
        const resultAuthTransaction = await transactionService.afterRead([transactions[0]], user);
        if (resultAuthTransaction.isLeft())
            return resultAuthTransaction;
        else if (!resultAuthTransaction.value?.length) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), transactionService.entityCode()) ||
                'error.modificationPermissionDenied';
            return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
        }
        const resultAuthCategory = await categoryService.afterRead([categories[0]], user);
        if (resultAuthCategory.isLeft())
            return resultAuthCategory;
        else if (!resultAuthCategory.value?.length) {
            const oStack = new Error().stack;
            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator_1.ServiceLocator.getRequest(), categoryService.entityCode()) ||
                'error.modificationPermissionDenied';
            return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, oStack));
        }
        return (0, either_1.right)(true);
    }
}
exports.PersonServiceImplementation = PersonServiceImplementation;
//# sourceMappingURL=implementation.js.map