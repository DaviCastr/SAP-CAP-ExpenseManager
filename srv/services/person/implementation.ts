import { AbstractError } from "@/errors";
import { Persons, Person, Cards, Invoice, Transaction } from "@models/apps/dflc/expensemanager/entities";
import { Either, right, left } from "@sweet-monads/either";
import { PersonService } from "./protocols";
import { PersonModel } from "@/models/person";
import { PersonRepository } from "@/repositories/person";
import { BaseServiceImplementation } from "../base/implementation";
import { ShareRepository } from "@/repositories/share";
import { User } from "@sap/cds";
import { EntityRepository } from '@/repositories/entity';
import { PermissionDenied } from "@/errors/permission-denied";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";
import { InvoiceRepository } from "@/repositories/invoice";
import { CardModel } from "@/models/card";
import { CardRepository } from "@/repositories/card";
import { ServiceRegistry } from "@/infrastructure/ServiceRegistry";
import { InvoiceServiceImplementation } from "../invoice/implementation";
import { TransactionRepository } from "@/repositories/transaction";
import { CategoryRepository } from "@/repositories/category";
import { TransactionServiceImplementation } from "../transaction/implementation";
import { InvoiceModel } from "@/models/invoice";
import { TransactionModel } from "@/models/transaction";
import { CategoryModel } from "@/models/category";
import { CardServiceImplementation } from "../card/implementation";
import { LiabilityRepository } from "@/repositories/liability";
import { LiabilityTransactionRepository } from "@/repositories/liability-transaction";
import { LiabilityModel } from "@/models/liability";
import { LiabilityTransactionModel } from "@/models/liability-transaction";
import {
    LiabilityTransactionSummary,
    summarizeTransactions,
    outstandingBalance,
    paymentPercentage
} from "@/domain/liability-rules";
import { CardExpensesByCategoryModel, CardExpensesByCategoryReturnProperties, CategoryExpenses } from "@/models/card-expenses-by-category";
import { CategoryServiceImplementation } from "../category/implementation";
import { SimulateExpenseModel, SimulateExpenseReturnProperties } from "@/models/simulate-expense";
import { CurrencyModel } from "@/models/currency";
import { FinancialFutureReturn, FinancialRecommendation } from "@/models/financial-future";
import { CategoryTransactionsModel, CategoryTransactionsReturnProperties } from "@/models/transactions-by-category";
import { CompleteInvoiceModel, CompleteInvoiceReturnProperties } from "@/models/complete-invoice";
import { PassThrough } from "stream";
import Decimal from "decimal.js";
import axios from "axios";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import { UUID } from "crypto";

export class PersonServiceImplementation extends BaseServiceImplementation<Person> implements PersonService {

    public Repository: PersonRepository;

    constructor(
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
        Repository: PersonRepository,
        private readonly CategoryRepository: CategoryRepository,
        private readonly CardRepository: CardRepository,
        private readonly InvoiceRepository: InvoiceRepository,
        private readonly TransactionRepository: TransactionRepository,
        private readonly LiabilityRepository: LiabilityRepository,
        private readonly LiabilityTransactionRepository: LiabilityTransactionRepository
    ) {

        super(Repository, ShareRepository, EntityRepository);

        this.Repository = Repository;

    }


    public async beforeCreate(Person: Person, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeCreate(Person, User);

        if (result.isLeft()) return result;

        return this.checkPerson(Person);

    }


    public async beforeUpdate(Person: Person, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeUpdate(Person, User);

        if (result.isLeft()) return result;

        return this.checkPerson(Person);

    }


    public async beforeEdit(Person: Person, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeUpdate(Person, User);

        if (result.isLeft()) return result;

        return this.checkPerson(Person);

    }


    public async afterRead(Persons: Persons, User: User): Promise<Either<AbstractError, Persons>> {

        try {

            const result = await this.processAfterRead(Persons, User);
            let oPersonsFiltered: Persons = [];
            if (result.isRight()) oPersonsFiltered = result.value;
            else oPersonsFiltered = [];

            const oPersonsData: Persons = [];

            const personIds = oPersonsFiltered.map(c => c.ID);

            const cardsByPerson = await this.CardRepository.findByPersonIds(personIds) || [] as CardModel[];

            const liabilitiesByPerson =
                await this.LiabilityRepository.findByPersonId(personIds) || [];

            const mapCards = new Map<string, any[]>();

            for (const card of cardsByPerson) {
                if (!mapCards.has(card?.Person?.Id)) {
                    mapCards.set(card?.Person?.Id, []);
                }
                mapCards.get(card.Person?.Id)!.push(card.toEntityObject());
            }

            const mapLiabilities = new Map<string, LiabilityModel[]>();

            for (const liability of liabilitiesByPerson) {

                const personKey = liability.Person?.Id as string;

                if (!personKey) continue;

                if (!mapLiabilities.has(personKey)) {
                    mapLiabilities.set(personKey, []);
                }

                mapLiabilities.get(personKey)!.push(liability);

            }

            for (let Person of oPersonsFiltered) {


                const oPersonModel = PersonModel.singleModel(Person);

                if (!oPersonModel) continue;

                if ('Image' in Person
                    //  ||
                    // (
                    //     !('TotalExpenses' in Person) &&
                    //     !('TotalExpensesMonth' in Person) &&
                    //     !('AmountToSave' in Person) &&
                    //     !('TotalExpensesToPay' in Person) &&
                    //     !('TotalExpensesClosed' in Person) &&
                    //     !('TotalExpensesPayed' in Person)
                    // )
                ) {

                    oPersonsData.push({
                        ...oPersonModel?.toEntityObject(),
                    });
                    continue;

                }

                const oCards = mapCards.get(oPersonModel?.Id as string) as Cards;
                const oLiabilities = mapLiabilities.get(oPersonModel?.Id as string) || [];
                const oExpensesResult = await this.recoverExpenses(oCards, oLiabilities);
                let oExpenses: {
                    totalExpenses: Decimal,
                    monthExpenses: Decimal,
                    monthExpensesToPay: Decimal,
                    monthExpensesClosed: Decimal,
                    monthExpensesPayed: Decimal
                }

                if (oExpensesResult?.isLeft()) {

                    oPersonsData.push({
                        ...oPersonModel?.toEntityObject(),
                    });
                    continue;

                }

                oExpenses = oExpensesResult?.isRight() ? oExpensesResult.value : {} as any;

                // if (oPersonModel.TotalExpenses)
                oPersonModel.TotalExpenses = oExpenses?.totalExpenses?.toDecimalPlaces(2);

                // if (oPersonModel.TotalExpensesMonth)
                oPersonModel.TotalExpensesMonth = oExpenses?.monthExpenses?.toDecimalPlaces(2);

                if (!oPersonModel.ExpenseTarget) {

                    const oPerson = await this.Repository.findById(oPersonModel?.Id);

                    if (oPerson?.ExpenseTarget) {
                        oPersonModel.ExpenseTarget = oPerson?.ExpenseTarget;
                    }

                }

                // if (oPersonModel.AmountToSave)
                oPersonModel.AmountToSave = oPersonModel.TotalExpenses?.minus(oPersonModel.ExpenseTarget || 0);

                // if (oPersonModel.TotalExpensesToPay)
                oPersonModel.TotalExpensesToPay = oExpenses?.monthExpensesToPay?.toDecimalPlaces(2);

                // if (oPersonModel.TotalExpensesClosed)
                oPersonModel.TotalExpensesClosed = oExpenses?.monthExpensesClosed?.toDecimalPlaces(2);

                // if (oPersonModel.TotalExpensesPayed)
                oPersonModel.TotalExpensesPayed = oExpenses?.monthExpensesPayed?.toDecimalPlaces(2);

                if (oPersonModel.TotalExpenses?.gt(oPersonModel?.ExpenseTarget || 0)) {
                    oPersonModel.MonthCriticallity = 1;
                } else if (oPersonModel.TotalExpenses && oPersonModel?.ExpenseTarget) {
                    oPersonModel.MonthCriticallity = 3;
                }

                if (oPersonModel.TotalExpensesToPay?.gt(oPersonModel?.ExpenseTarget || 0)) {
                    oPersonModel.CriticallityToPay = 1;
                } else if (oPersonModel.TotalExpensesToPay && oPersonModel?.ExpenseTarget) {
                    oPersonModel.CriticallityToPay = 3;
                }

                const oPersonData = oPersonModel.toEntityObject();

                oPersonsData.push({
                    ...oPersonData
                });

            };

            return right(oPersonsData);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

        }

    }


    public async addCardExpense(): Promise<Either<AbstractError, boolean>> {

        const request = ServiceLocator.getRequest();

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

            const normalizedValue = await this.convertCurrencyIfNeeded(
                input.Currency,
                card?.Currency?.Code as string,
                input.Value
            );

            const billing = this.calculateBillingCycle(
                input.TransactionDate,
                card?.DueDay as number,
                card?.ClosingDay as number,
                input.FixedExpense
            );

            const installmentsPlan = this.buildInstallmentPlan(
                normalizedValue,
                input.Installments,
                billing.InvoiceYear,
                billing.InvoiceMonth,
                billing.FixedInstallments
            );

            const invoiceCache = new Map<string, InvoiceModel>();

            const transactionsToInsert: Transaction[] = [];
            const affectedInvoices = new Set<string>();
            const identifier = this.generateUUID();

            for (const item of installmentsPlan) {

                const invoice = await this.resolveInvoiceCached(
                    {
                        Card_ID: input.CardId,
                        Card: { ID: input.CardId },
                        Year: item.Year,
                        Month: item.Month,
                        Currency: card?.Currency.toEntityObject(),
                        TotalAmount: item.Amount.toNumber()
                    },
                    invoiceCache
                );

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

            await Promise.all(
                [...affectedInvoices].map(id =>
                    this.InvoiceRepository.updateTotalAmountById(id)
                )
            );

            return right(true);

        } catch (error) {

            const err = error as Error;

            return left(
                new AbstractError(
                    err.message,
                    403,
                    err.stack as string
                )
            );

        }

    }


    public async sendInvoices(): Promise<Either<AbstractError, boolean>> {

        try {

            const request = ServiceLocator.getRequest();

            const { PersonId, Year, Month } = request.data;

            this.validateEmailConfiguration(request);

            const today = this.getBrazilDate();

            if (Year) {
                today.year = Number(Year);
            }

            if (Month) {
                today.month = Number(Month);
            }

            const persons = await this.Repository.findAll(
                PersonId
                    ? {
                        ID: PersonId
                    } :
                    {
                        Email: { '!=': null }
                    }
            ) || [];

            if (!persons.length) {
                return right(true);
            }

            const cardsAdditionalFilters = Year || Month
                ? {}
                : { DueDay: { '>=': today.day } };

            const cards = await this.CardRepository.findByPersonIds(
                persons.map(p => p.Id),
                cardsAdditionalFilters
            ) || [];

            // Dívidas seguem a MESMA regra de seleção dos cartões, filtrada
            // direto no banco: sem mês/ano informado entram apenas as que
            // ainda vencem no período corrente (DueDay >= hoje); com mês/ano,
            // todas. Em ambos os casos somente as EM ABERTO.
            const liabilitiesAdditionalFilters = Year || Month
                ? { Status: 'OPEN' }
                : { Status: 'OPEN', DueDay: { '>=': today.day } };

            const selectedLiabilities =
                await this.LiabilityRepository.findByPersonIds(
                    persons.map(p => p.Id),
                    liabilitiesAdditionalFilters
                ) || [];

            const selectedLiabilityIds =
                selectedLiabilities.map(l => l.Id);

            const liabilityTransactions =
                selectedLiabilityIds.length
                    ? await this.LiabilityTransactionRepository.findByLiabilityIds(
                        selectedLiabilityIds
                    ) || []
                    : [];

            if (!cards.length && !selectedLiabilities.length) {
                return right(true);
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

            const invoices = await this.InvoiceRepository.findByCardIDs(
                cards.map(c => c.Id),
                invoicesAdditionalFilters
            ) || [];

            // Sem faturas ainda é possível enviar: a pessoa pode ter apenas
            // dívidas selecionadas para o período.

            const transactions = await this.TransactionRepository.findByInvoiceIds(
                invoices.map(i => i.Id)
            ) || [];

            await this.loadPersonsImages(persons);
            await this.loadCardsImages(cards);
            await this.initializeEmailInfrastructure();

            const cardsByPerson = new Map<string, CardModel[]>();

            for (const card of cards) {

                if (!cardsByPerson.has(card.Person?.Id)) {
                    cardsByPerson.set(card.Person?.Id, []);
                }

                cardsByPerson.get(card.Person?.Id)!.push(card);
            }

            const invoicesByCard = new Map<string, InvoiceModel[]>();

            for (const invoice of invoices) {

                if (!invoice?.Card) continue;

                if (!invoicesByCard.has(invoice.Card?.Id)) {
                    invoicesByCard.set(invoice.Card?.Id, []);
                }

                invoicesByCard.get(invoice.Card?.Id)!.push(invoice);
            }

            const transactionsByInvoice = new Map<string, TransactionModel[]>();

            for (const trx of transactions) {

                if (!trx.Invoice) continue;

                if (!transactionsByInvoice.has(trx.Invoice?.Id)) {
                    transactionsByInvoice.set(trx.Invoice?.Id, []);
                }

                transactionsByInvoice.get(trx.Invoice?.Id)!.push(trx);
            }

            const liabilitiesByPerson = new Map<string, LiabilityModel[]>();

            for (const liability of selectedLiabilities) {

                const personKey = liability.Person?.Id as string;

                if (!personKey) continue;

                if (!liabilitiesByPerson.has(personKey)) {
                    liabilitiesByPerson.set(personKey, []);
                }

                liabilitiesByPerson.get(personKey)!.push(liability);
            }

            const liabilityTransactionsByLiability =
                new Map<string, LiabilityTransactionModel[]>();

            for (const movement of liabilityTransactions) {

                const liabilityKey = movement.Liability?.Id as string;

                if (!liabilityKey) continue;

                if (!liabilityTransactionsByLiability.has(liabilityKey)) {
                    liabilityTransactionsByLiability.set(liabilityKey, []);
                }

                liabilityTransactionsByLiability
                    .get(liabilityKey)!.push(movement);
            }

            const cache = ServiceLocator.getEmailSendingCache();

            for (const person of persons) {

                const personCards = cardsByPerson.get(person.Id) || [];

                const personLiabilities =
                    liabilitiesByPerson.get(person.Id) || [];

                const invoicesToSend: InvoiceModel[] = [];
                const attachments: any[] = [];
                const catInfoById = new Map<string, string>();
                const debtSummaries: {
                    DebtName: string;
                    Balance: number;
                    BalanceWithSymbol: string;
                    TotalAmount: number;
                    PercentPaid: number;
                    DueDay: string;
                    Movements: {
                        Date: string;
                        Description: string;
                        Type: string;
                        Amount: number;
                    }[];
                }[] = [];

                // Todas as categorias da pessoa: resolve nomes das
                // transações mesmo sem expansão da relação no SQL.
                const personCategories =
                    await this.CategoryRepository.findByPersonIds(
                        [person.Id]
                    ) || [];

                for (const cat of personCategories) {
                    catInfoById.set(cat.Id, cat.Name);
                }

                let totalAmount = new Decimal(0);
                let currency = '';

                for (const card of personCards) {

                    const cardInvoices = invoicesByCard.get(card.Id) || [];

                    for (const invoice of cardInvoices) {

                        invoicesToSend.push(invoice);

                        totalAmount = totalAmount.plus(invoice.TotalAmount);

                        currency = invoice.Currency?.Code || currency;

                        const invoiceTransactions =
                            transactionsByInvoice.get(invoice.Id) || [];

                        if (!invoiceTransactions.length) continue;

                        ServiceLocator.setRequestData({
                            Invoice: invoice
                        });

                        const analyticsResult =
                            await this.cardExpensesByCategories();

                        if (analyticsResult.isLeft()) continue;

                        const analytics =
                            CardExpensesByCategoryModel.singleModel(
                                analyticsResult.value as any
                            );

                        const pdfResult = await this.generatePDF(
                            cache._logoCache!,
                            person,
                            invoice,
                            card,
                            invoiceTransactions,
                            analytics
                        );

                        if (pdfResult.isLeft()) continue;

                        attachments.push({
                            filename: `${card.Name} ${this.addLeftZeros(invoice.Month)}-${invoice.Year}.pdf`,
                            content: pdfResult.value
                        });

                    }

                }

                // PDF de cada dívida selecionada: saldo devedor + últimas
                // movimentações (mesma regra de seleção dos cartões).
                for (const liability of personLiabilities) {

                    const movements =
                        liabilityTransactionsByLiability.get(liability.Id) || [];

                    const summary = summarizeTransactions(movements);
                    const balance =
                        outstandingBalance(liability.TotalAmount, summary);

                    // Nada a detalhar: quitada e sem histórico.
                    if (balance.lessThanOrEqualTo(0) && !movements.length) {
                        continue;
                    }

                    const lastMovements = [...movements]
                        .sort((a, b) =>
                            String(b.Date).localeCompare(String(a.Date)))
                        .slice(0, 10);

                    debtSummaries.push({
                        DebtName: liability.Name,
                        Balance: balance.toNumber(),
                        BalanceWithSymbol:
                            this.pdfMoney(
                                liability.Currency?.Code,
                                balance.toNumber()
                            ),
                        TotalAmount:
                            Number(liability.TotalAmount ?? 0),
                        PercentPaid:
                            paymentPercentage(
                                liability.TotalAmount,
                                summary
                            ).toNumber(),
                        DueDay: this.addLeftZeros(liability.DueDay ?? 0),
                        Movements: lastMovements.map(m => ({
                            Date: String(m.Date ?? ''),
                            Description: m.Description || '',
                            Type: m.Type || '',
                            Amount: Number(m.Amount?.toNumber() ?? 0)
                        }))
                    });

                    const pdfResult = await this.generateLiabilityPDF(
                        cache._logoCache!,
                        person,
                        liability,
                        balance,
                        summary,
                        lastMovements
                    );

                    if (pdfResult.isLeft()) continue;

                    attachments.push({
                        filename:
                            `Divida ${this.sanitizeFileName(liability.Name)}.pdf`,
                        content: pdfResult.value
                    });

                }

                // --- PDF consolidado (visão geral) ---
                const consolidatedTx: any[] = [];

                for (const card of personCards) {

                    const cardInvoices =
                        invoicesByCard.get(card.Id) || [];

                    for (const invoice of cardInvoices) {

                        const txs =
                            transactionsByInvoice.get(invoice.Id) || [];

                        for (const tx of txs) {

                            consolidatedTx.push({
                                Amount: tx.Amount?.toNumber() ?? 0,
                                Description: tx.Description,
                                Date: tx.Date,
                                Installment: tx.Installment,
                                TotalInstallments: tx.TotalInstallments,
                                Currency: {
                                    Code: tx.Currency?.Code || currency
                                },
                                Card: {
                                    ID: card.Id,
                                    Name: card.Name
                                },
                                Category: {
                                    ID: tx.Category?.Id || '',
                                    Name:
                                        tx.Category?.Name ||
                                        catInfoById.get(
                                            tx.Category?.Id || ''
                                        ) ||
                                        ''
                                }
                            });

                        }

                    }

                }

                const consolidatedDebts = debtSummaries.map(d => ({
                    Name: d.DebtName,
                    Balance: d.Balance,
                    TotalAmount: d.TotalAmount,
                    PercentPaid: d.PercentPaid,
                    DueDay: d.DueDay,
                    Currency: currency,
                    Movements: d.Movements
                }));

                const consolidatedResult =
                    await this.generateConsolidatedPDF(
                        cache._logoCache!,
                        person,
                        consolidatedTx,
                        consolidatedDebts,
                        today.year,
                        today.month,
                        this.getMessage(`month.${today.month}`, request),
                        currency
                    );

                if (consolidatedResult.isRight()) {
                    attachments.push({
                        filename: `Visao Geral ${this.sanitizeFileName(person.Name)} ${this.addLeftZeros(today.month)}-${today.year}.pdf`,
                        content: consolidatedResult.value
                    });
                }

                if (!attachments.length) continue;

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

                const oIsPrediction = Boolean(Year || Month);

                const oPeriodLabel =
                    `${this.getMessage(`month.${today.month}`, request)} de ${today.year}`;

                const template = oIsPrediction
                    ? cache._predictionTemplateCache
                    : cache._mailTemplateCache;

                const html = template({
                    FirstName:
                        String(person.Name || '').trim().split(/\s+/)[0],
                    CopyrightYear: this.getBrazilDate().year,
                    PeriodLabel: oPeriodLabel,
                    HasPhoto: Boolean(person.Image),
                    TotalWithSymbol:
                        this.pdfMoney(currency, totalAmount.toNumber()),
                    InvoiceCount: invoicesToSend.length,
                    AttachmentCount:
                        attachments.filter(a => !a.cid).length,
                    Cards: invoicesToSend.map(inv => {

                        const card =
                            personCards.find(c => c.Id === inv.Card?.Id);

                        return {
                            CardName: card?.Name,
                            DueDate:
                                `${this.addLeftZeros(card?.DueDay || 0)}/` +
                                `${this.addLeftZeros(inv.Month)}/${inv.Year}`,
                            MonthLabel:
                                `${this.getMessage(`month.${inv.Month}`, request)} de ${inv.Year}`,
                            AmountWithSymbol:
                                this.pdfMoney(
                                    inv.Currency?.Code,
                                    inv.TotalAmount?.toNumber()
                                )
                        };

                    }),
                    HasDebts: debtSummaries.length > 0,
                    Debts: debtSummaries.map(d => ({
                        DebtName: d.DebtName,
                        BalanceWithSymbol: d.BalanceWithSymbol,
                        PercentPaid: d.PercentPaid,
                        DueDay: d.DueDay
                    }))
                });

                await cache._smtpInstance.sendMail({
                    from: `"Expense Manager" <${process.env.SMTPAddres}>`,
                    to: person.Email,
                    subject:
                        oIsPrediction
                            ? `Detalhamento do período · ${this.addLeftZeros(today.month)}/${today.year}`
                            : `Suas faturas · ${this.addLeftZeros(today.month)}/${today.year}`,
                    html,
                    attachments
                });

                await Promise.all(
                    invoicesToSend.map(inv =>
                        this.InvoiceRepository.update(
                            inv.Id,
                            { InvoiceSent: true }
                        )
                    )
                );

            }

            return right(true);

        } catch (error) {

            const err = error as Error;

            return left(
                new AbstractError(
                    err.message,
                    403,
                    err.stack as string
                )
            );

        }

    }


    public async cardExpensesByCategories(): Promise<
        Either<AbstractError, CardExpensesByCategoryReturnProperties>
    > {

        try {

            const request = ServiceLocator.getRequest();

            const input = this.parseCardExpensesByCategoryFields(request.data);

            const validation = this.validateCardExpensesByCategoriesInput(input);
            if (validation.isLeft()) return validation as any;

            const authorization = await this.cardExpensesByCategoriesCheckAuthorization(input, request.user);
            if (authorization.isLeft()) return authorization as any;

            const context = await this.loadContext(input);

            if (!context.categories.length || !context.invoices.length) {
                return right(this.emptyResult());
            }

            const summary = await this.buildSummary(
                context.categories,
                context.invoices,
                request.user
            );

            return right(summary);

        } catch (error) {

            const err = error as Error;

            return left(
                new AbstractError(
                    err.message,
                    403,
                    err.stack as string
                )
            );
        }
    }


    public async simulateExpenses():
        Promise<Either<AbstractError, SimulateExpenseReturnProperties>> {

        try {

            const request = ServiceLocator.getRequest();

            const input = this.extractSimulationInput(request);

            const validation = await this.validateSimulationInput(input, request);
            if (validation.isLeft()) return validation as any;

            const person = validation.value.person;
            const cards = validation.value.cards;

            if (!cards.length) {
                return right(
                    this.buildEmptySimulation(person).toEntityObject()
                );
            }

            const invoices = await this.loadInvoicesForSimulation(
                cards.map(card => card.Id),
                input.Year
            );

            const totals = this.calculateSimulationTotals(
                invoices,
                input.Year,
                input.Month
            );

            const model = this.buildSimulationResult(
                person,
                totals.totalFuture,
                totals.totalMonth
            );

            return right(model.toEntityObject());

        } catch (error) {

            return this.handleSimulationError(error);

        }

    }


    public async simulateFinancialFuture(): Promise<Either<AbstractError, FinancialFutureReturn>> {

        try {

            const request = ServiceLocator.getRequest();

            const { PersonId, Year, Month } = request.data;

            const required: string[] = [];
            if (!PersonId) required.push("PersonId");
            if (!Year) required.push("Year");
            if (!Month) required.push("Month");

            if (required.length) {
                return left(this.buildFutureError(
                    this.getMessage(
                        "error.invalidFields",
                        request,
                        undefined,
                        { fields: required.join(", ") }
                    )
                ));
            }

            const targetYear = Number(Year);
            const targetMonth = Number(Month);

            if (targetMonth < 1 || targetMonth > 12) {
                return left(this.buildFutureError("Invalid Month"));
            }

            const auth = await this.afterRead(
                [{ ID: PersonId }],
                request?.user
            );

            if (auth.isLeft()) return auth as any;
            else if (!auth.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

            const person = await this.Repository.findById(PersonId);

            if (!person) {
                return left(this.buildFutureError("Person not found"));
            }

            const cards =
                await this.CardRepository.findByPersonIds([PersonId]) || [];

            if (!cards.length) {
                return right(this.buildEmptyFuture(person));
            }

            const cardService = ServiceRegistry.get("Cards") as CardServiceImplementation;

            const authCardCheck = await cardService.afterRead(
                [{ Person: { ID: PersonId } }],
                request?.user
            );

            if (authCardCheck.isLeft()) {
                return authCardCheck as any;
            } else if (!authCardCheck.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), cardService.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

            const invoiceService = ServiceRegistry.get("Invoices") as InvoiceServiceImplementation;

            const authInvoiceCheck = await invoiceService.afterRead(
                [{ Card: { ID: cards[0].Id } }],
                request?.user
            );

            if (authInvoiceCheck.isLeft()) {
                return authInvoiceCheck as any;
            } else if (!authInvoiceCheck.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), invoiceService.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

            const cardIds = cards.map(card => card.Id);

            const invoices =
                await this.InvoiceRepository.findByCardIDs(cardIds, {
                    Year: { ">=": new Date().getFullYear() - 1 }
                }) || [];

            if (invoices?.length) {

                const transactionService = ServiceRegistry.get("Transactions") as TransactionServiceImplementation;

                const authTransactionCheck = await transactionService.afterRead(
                    [{ Invoice: { ID: invoices[0].Id } }],
                    request?.user
                );

                if (authTransactionCheck.isLeft()) {
                    return authTransactionCheck as any;
                } else if (!authTransactionCheck.value?.length) {

                    const oStack = new Error().stack as string;

                    const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), transactionService.entityCode()) ||
                        'error.modificationPermissionDenied';

                    return left(new PermissionDenied(message, 403, oStack));

                }

            }

            const transactions =
                await this.loadTransactionsByCardsFallback(cardIds);

            const timeline = new Map<string, Decimal>();

            let generatedInvoices = new Decimal(0);
            let installmentPending = new Decimal(0);
            let recurringExpenses = new Decimal(0);

            for (const invoice of invoices) {

                const key = this.futureKey(invoice.Year, invoice.Month);

                if (!this.isBeforeOrEqual(
                    invoice.Year,
                    invoice.Month,
                    targetYear,
                    targetMonth
                )) continue;

                this.futureAddTimeline(
                    timeline,
                    key,
                    invoice.TotalAmount || 0
                );

                generatedInvoices =
                    generatedInvoices.plus(invoice.TotalAmount || 0);
            }

            const installmentMap =
                this.detectPendingInstallments(transactions);

            for (const item of installmentMap) {

                const tx = item;
                const remaining = item.remaining;

                let year = item.nextYear;
                let month = item.nextMonth;

                for (let i = 0; i < remaining; i++) {

                    if (!this.isBeforeOrEqual(
                        year, month,
                        targetYear, targetMonth
                    )) break;

                    const key = this.futureKey(year, month);

                    this.futureAddTimeline(
                        timeline,
                        key,
                        tx.Amount || 0
                    );

                    installmentPending =
                        installmentPending.plus(tx.Amount || 0);

                    ({ year, month } =
                        this.nextMonth(year, month));
                }
            }

            const recurring =
                this.detectRecurringExpenses(transactions);

            for (const item of recurring) {

                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;

                while (
                    this.isBeforeOrEqual(
                        year,
                        month,
                        targetYear,
                        targetMonth
                    )
                ) {

                    const key = this.futureKey(year, month);

                    this.futureAddTimeline(
                        timeline,
                        key,
                        item.MaxAmount
                    );

                    recurringExpenses =
                        recurringExpenses.plus(item.MaxAmount);

                    ({ year, month } =
                        this.nextMonth(year, month));
                }
            }

            const targetKey =
                this.futureKey(targetYear, targetMonth);

            const targetMonthDebt =
                timeline.get(targetKey) || new Decimal(0);

            let totalDebt = new Decimal(0);

            for (const val of timeline.values()) {
                totalDebt = totalDebt.plus(val);
            }

            const expenseTarget =
                person?.ExpenseTarget || new Decimal(0);

            const savingGap =
                expenseTarget.minus(targetMonthDebt);

            const freeCashFlow =
                savingGap;

            const avgRecurring =
                recurring.length
                    ? recurringExpenses.div(
                        this.monthDiffFromNow(
                            targetYear,
                            targetMonth
                        )
                    )
                    : new Decimal(0);

            const risk =
                this.calculateRisk(
                    targetMonthDebt,
                    expenseTarget
                );

            const monthlyTimeline =
                Array.from(timeline.entries())
                    .sort((a, b) =>
                        a[0].localeCompare(b[0]))
                    .map(([key, value]) => {

                        const [y, m] = key.split("-");

                        return {
                            Key: key,
                            Year: Number(y),
                            Month: Number(m),
                            Amount: value.toNumber()
                        };
                    });

            const recommendations =
                this.buildFutureRecommendations(
                    risk,
                    recurring.length,
                    installmentPending,
                    targetMonthDebt,
                    expenseTarget
                );

            return right({

                KPIs: {
                    TotalDebtUntilTarget:
                        totalDebt.toNumber(),

                    TargetMonthDebt:
                        targetMonthDebt.toNumber(),

                    RecurringMonthlyAverage:
                        avgRecurring.toDecimalPlaces(2).toNumber(),

                    InstallmentPending:
                        installmentPending.toNumber(),

                    FixedExpensesDetected:
                        recurring.length,

                    FreeCashFlow:
                        freeCashFlow.toNumber(),

                    SavingGap:
                        savingGap.toNumber(),

                    RiskLevel:
                        risk
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

        } catch (error) {

            const err = error as Error;

            return left(
                new AbstractError(
                    err.message,
                    403,
                    err.stack as string
                )
            );
        }
    }


    public async retrieveTransactionsByCategory():
        Promise<Either<AbstractError, CategoryTransactionsReturnProperties>> {

        try {

            const request = ServiceLocator.getRequest();

            const input = this.validateRetrieveTransactionsByCategoryInput(request.data);

            if (input.isLeft()) return input as any;

            const {
                PersonId,
                CategoryId,
                Total,
                Month,
                Year
            } = input.value;

            const auth = await this.authorizeRetrieveTransactionsByCategory(
                request.user,
                PersonId,
                CategoryId
            );

            if (auth.isLeft()) return auth as any;

            const person = await this.Repository.findById(PersonId);

            if (!person) {
                return right(this.emptyCategoryTransactionsResponse());
            }

            const cards = await this.CardRepository.findByPersonId(PersonId) || [];

            if (!cards.length) {
                return right(this.emptyCategoryTransactionsResponse());
            }

            const cardIds = cards.map(card => card.Id);

            const invoices = await this.resolveInvoicesScope(
                cardIds,
                Total,
                Month as number,
                Year as number
            );

            if (!invoices.length) {
                return right(this.emptyCategoryTransactionsResponse());
            }

            const invoiceIds = invoices.map(invoice => invoice.Id);

            const transactions =
                await this.TransactionRepository.findByInvoiceIds(
                    invoiceIds,
                    {
                        Category_ID: CategoryId
                    }
                ) || [];

            if (!transactions.length) {
                return right(this.emptyCategoryTransactionsResponse());
            }

            const authObjects = await this.authorizeAnalyticsObjects(
                request.user,
                cards,
                invoices,
                transactions
            );

            if (authObjects.isLeft()) return authObjects as any;

            const category = await this.CategoryRepository.findById(CategoryId);

            if (!category) {
                return right(this.emptyCategoryTransactionsResponse());
            }

            const result = this.buildCategoryTransactionResponse(
                category,
                cards,
                invoices,
                transactions
            );

            return right(result);

        } catch (error) {

            const err = error as Error;

            return left(
                new AbstractError(
                    err.message,
                    403,
                    err.stack as string
                )
            );

        }

    }


    public async retrieveCompleteInvoice():
        Promise<Either<AbstractError, CompleteInvoiceReturnProperties>> {

        try {

            const request = ServiceLocator.getRequest();

            const { PersonId, Year, Month } = request.data;

            const required: string[] = [];

            if (!PersonId) required.push('PersonId');
            if (!Year) required.push('Year');
            if (!Month) required.push('Month');

            if (required.length) {

                const err = new Error(
                    this.getMessage(
                        'error.invalidFields',
                        request,
                        undefined,
                        { fields: required.join(', ') }
                    )
                );

                return left(
                    new AbstractError(
                        err.message,
                        403,
                        err.stack as string
                    )
                );

            }

            const authPerson = await this.afterRead(
                [{ ID: PersonId }],
                request.user
            );

            if (authPerson.isLeft()) return authPerson as any;
            else if (!authPerson.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

            const [rows, cards, liabilities, person] = await Promise.all([
                this.CardRepository.retrieveCompleteInvoiceTransactions(
                    PersonId,
                    Number(Year),
                    Number(Month)
                ),
                this.CardRepository.findByPersonIds([PersonId]),
                this.LiabilityRepository.findByPersonId(PersonId),
                this.Repository.findById(PersonId)
            ]);

            const oExpensesResult = await this.recoverExpenses(
                (cards || []).map(card => card.toEntityObject()) as Cards,
                liabilities || [],
                Number(Month),
                Number(Year)
            );

            let expensesPayload: Partial<CompleteInvoiceReturnProperties> = {};

            if (oExpensesResult.isRight()) {

                const oExpenses = oExpensesResult.value;
                const oExpenseTarget = person?.ExpenseTarget;

                expensesPayload = {
                    TotalExpenses:
                        oExpenses.totalExpenses?.toDecimalPlaces(2).toNumber(),
                    MonthExpenses:
                        oExpenses.monthExpenses?.toDecimalPlaces(2).toNumber(),
                    MonthExpensesToPay:
                        oExpenses.monthExpensesToPay?.toDecimalPlaces(2).toNumber(),
                    MonthExpensesClosed:
                        oExpenses.monthExpensesClosed?.toDecimalPlaces(2).toNumber(),
                    MonthExpensesPayed:
                        oExpenses.monthExpensesPayed?.toDecimalPlaces(2).toNumber()
                };

                if (oExpenses.totalExpenses?.gt(oExpenseTarget || 0)) {
                    expensesPayload.MonthCriticallity = 1;
                } else if (oExpenses.totalExpenses && oExpenseTarget) {
                    expensesPayload.MonthCriticallity = 3;
                }

                if (oExpenses.monthExpensesToPay?.gt(oExpenseTarget || 0)) {
                    expensesPayload.CriticallityToPay = 1;
                } else if (oExpenses.monthExpensesToPay && oExpenseTarget) {
                    expensesPayload.CriticallityToPay = 3;
                }

            }

            if (!rows.length) {
                return right({
                    ...CompleteInvoiceModel.empty(
                        Number(Year),
                        Number(Month)
                    ).toEntityObject(),
                    ...expensesPayload
                });
            }

            const resultAuth = await this.authorizeCompleteInvoiceObjects(
                rows,
                request.user
            );

            if (resultAuth.isLeft()) return resultAuth as any;

            const result =
                CompleteInvoiceModel.fromRepositoryRows(
                    rows,
                    Number(Year),
                    Number(Month),
                    this.getMessage(
                        `month.${Month}`,
                        request
                    )
                );

            return right({
                ...result.toEntityObject(),
                ...expensesPayload
            });

        } catch (error) {

            const err = error as Error;

            return left(
                new AbstractError(
                    err.message,
                    403,
                    err.stack as string
                )
            );

        }

    }


    private parseAddCardExpenseInput(data: any) {

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


    private validateAddCardExpenseInput(input:
        {
            CardId?: UUID,
            PersonId?: UUID,
            InvoiceId?: UUID,
            CategoryId: UUID,
            Description: string,
            Value: number,
            Currency: string,
            TransactionDate: string,
            Installments: number
        }, request: any): void {

        const required: string[] = [];

        if (!input.CardId) required.push('CardId');
        if (!input.CategoryId) required.push('CategoryId');
        if (!input.Description) required.push('Description');
        if (!input.Value) required.push('Value');
        if (!input.Currency) required.push('Currency');
        if (!input.TransactionDate) required.push('TransactionDate');
        if (!input.Installments) required.push('Installments');

        if (required.length) {

            throw new Error(
                this.getMessage(
                    'error.invalidFields',
                    request,
                    undefined,
                    { fields: required.join(', ') }
                )
            );

        }

        if (!this.validateDate(input.TransactionDate)) {

            throw new Error(
                this.getMessage(
                    'error.invalidDate',
                    request,
                    undefined,
                    { date: input.TransactionDate }
                )
            );

        }

    }


    private ensureCardExists(card: any): void {

        if (!card) {
            throw new Error('error.invalidCard');
        }

    }


    private ensureCategoryExists(category: any): void {

        if (!category) {
            throw new Error('error.invalidCategory');
        }

    }


    private async validateAddCardExpensePermissions(
        cardId: string,
        user: User
    ): Promise<void> {

        const invoiceService =
            ServiceRegistry.get('Invoices') as InvoiceServiceImplementation;

        const transactionService =
            ServiceRegistry.get('Transactions') as TransactionServiceImplementation;

        if (!invoiceService || !transactionService) {
            throw new Error('error.unknownError');
        }

        const fakeInvoiceId = this.generateUUID();

        const checkInvoice = await invoiceService.beforeUpdate(
            {
                ID: fakeInvoiceId,
                Card_ID: cardId,
                Card: { ID: cardId }
            },
            user
        );

        if (checkInvoice.isLeft()) {
            throw new Error(checkInvoice.value.message);
        }

        const checkTransaction = await transactionService.beforeCreate(
            {
                ID: this.generateUUID(),
                Invoice_ID: fakeInvoiceId,
                Invoice: { ID: fakeInvoiceId }
            },
            user
        );

        if (checkTransaction.isLeft()) {
            throw new Error(checkTransaction.value.message);
        }

    }


    private async convertCurrencyIfNeeded(
        from: string,
        to: string,
        value: number
    ): Promise<Decimal> {

        if (from === to) {
            return new Decimal(value).toDecimalPlaces(2);
        }

        const response = await axios.get(
            `https://api.fxratesapi.com/latest?base=${from}&amount=${value}`,
            {
                timeout: 5000
            }
        );

        const converted = response?.data?.rates?.[to];

        if (!converted) {
            throw new Error('error.currencyConversion');
        }

        return new Decimal(converted).toDecimalPlaces(2);

    }


    private calculateBillingCycle(
        transactionDate: string,
        dueDay: number,
        closingDay: number,
        fixedExpense: boolean
    ) {

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

        const fixedInstallments =
            fixedExpense ? (12 - month) + 1 : 1;

        return {
            InvoiceMonth: month,
            InvoiceYear: year,
            FixedInstallments: fixedInstallments
        };

    }


    private nextMonth(month: number, year: number) {

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


    private buildInstallmentPlan(
        total: Decimal,
        installments: number,
        startYear: number,
        startMonth: number,
        fixedInstallments: number
    ) {

        const totalDecimal = total;

        const base = totalDecimal
            .div(installments)
            .toDecimalPlaces(2);

        const diff = base
            .mul(installments)
            .minus(totalDecimal)
            .toDecimalPlaces(2);

        const first = base.minus(diff);

        const maxInstallments = Math.max(
            installments,
            fixedInstallments
        );

        const result: any[] = [];

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


    private async resolveInvoiceCached(
        invoice: Invoice,
        cache: Map<string, InvoiceModel>
    ): Promise<InvoiceModel> {

        const key =
            `${invoice.Card_ID}_${invoice.Year}_${invoice.Month}`;

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


    protected async checkPermission(Person: Person, User: User, Permission: number) {

        const cache = ServiceLocator.getPermissionCache();

        const userId = User?.id;

        let personId = cache.personMap.get(Person.ID);

        if (!personId) {

            personId = Person?.ID;

            if (personId) {
                cache.personMap.set(Person.ID, personId);
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


    private pdfPalette() {

        return {
            primary: "#0b5d52",
            primaryDark: "#073d3a",
            accent: "#14a582",
            tint: "#eafaf4",
            ink: "#102a2b",
            muted: "#687b7c",
            surface: "#f4f7f8",
            line: "#e7eeee",
            lineSoft: "#d5e3e1",
            white: "#ffffff",
            positiveBg: "#e7f7f0",
            positive: "#1f8f6e",
            negativeBg: "#fdeef0",
            negative: "#c23b4b"
        };

    }


    private pdfFormatAmount(Value: number | null | undefined): string {

        return Number(Value ?? 0).toLocaleString(
            "pt-BR",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );

    }


    private currencySymbol(Code: string | null | undefined): string {

        switch (String(Code ?? '').toUpperCase()) {

            case 'BRL': return 'R$';
            case 'USD': return 'US$';
            case 'EUR': return '€';
            default: return String(Code ?? '');

        }

    }


    private pdfMoney(Code: string | null | undefined, Value: number | null | undefined): string {

        const oSymbol = this.currencySymbol(Code);

        return oSymbol
            ? `${oSymbol} ${this.pdfFormatAmount(Value)}`
            : this.pdfFormatAmount(Value);

    }


    private pdfFitText(Text: string | null | undefined, MaxChars: number): string {

        const oClean =
            String(Text ?? '').replace(/\s+/g, ' ').trim();

        if (!oClean) return '-';

        return oClean.length > MaxChars
            ? `${oClean.slice(0, MaxChars - 1)}…`
            : oClean;

    }


    private pdfSectionTitle(
        Doc: InstanceType<typeof PDFDocument>,
        Title: string,
        Hint?: string
    ): void {

        const c = this.pdfPalette();

        const titleY = Doc.y;

        Doc
            .fillColor(c.ink)
            .font('Helvetica-Bold')
            .fontSize(13)
            .text(Title, 44, titleY, { lineBreak: false });

        // Texto com lineBreak:false não avança Doc.y: posições explícitas.
        Doc
            .rect(44, titleY + 19, 26, 2.5)
            .fill(c.accent);

        Doc.y = titleY + 30;

        if (Hint) {

            Doc
                .fillColor(c.muted)
                .font('Helvetica')
                .fontSize(9.5)
                .text(Hint, 44, Doc.y);

            Doc.y += 8;

        }

        Doc.y += 6;

    }


    private async renderBrandedPdf(
        Logo: Buffer,
        Subtitle: string,
        BuildContent: (
            Doc: InstanceType<typeof PDFDocument>,
            Shell: { newPage: () => void }
        ) => Promise<void>
    ): Promise<Either<AbstractError, Buffer>> {

        try {

            const result = await new Promise(async (resolve, reject) => {

                const c = this.pdfPalette();

                const doc = new PDFDocument({
                    size: "A4",
                    margin: 44,
                    bufferPages: true
                });

                const oBufferArray: any[] = [];
                const oBufferStream = new PassThrough();

                oBufferStream.on('data', (chunk) => oBufferArray.push(chunk));
                oBufferStream.on('end', () => resolve(Buffer?.concat(oBufferArray) as any));
                oBufferStream.on('error', (err) => reject(`Erro no stream: ${err}`));

                doc.pipe(oBufferStream);

                const drawBand = () => {

                    doc
                        .rect(0, 0, doc.page.width, 86)
                        .fill(c.primary);

                    doc
                        .rect(0, 86, doc.page.width, 3)
                        .fill(c.accent);

                    if (Logo) {
                        const diameter = 52;
                        const x = 44;
                        const y = 17;
                        doc
                            .save()
                            .circle(x + diameter / 2, y + diameter / 2, diameter / 2)
                            .clip()
                            .image(Logo, x, y, { width: diameter, height: diameter })
                            .restore();
                    }

                    const titleX = Logo ? 110 : 44;

                    doc
                        .fillColor(c.white)
                        .font('Helvetica-Bold')
                        .fontSize(20)
                        .text('Expense Manager', titleX, 22, { lineBreak: false });

                    doc
                        .fillColor('#bfe8d8')
                        .font('Helvetica')
                        .fontSize(9.5)
                        .text(Subtitle, titleX, 48, { lineBreak: false });

                    const today = this.getBrazilDate();

                    doc
                        .fillColor('#bfe8d8')
                        .font('Helvetica')
                        .fontSize(8.5)
                        .text(
                            `Gerado em ${this.addLeftZeros(today.day)}/` +
                            `${this.addLeftZeros(today.month)}/${today.year}`,
                            0, 66,
                            { width: doc.page.width - 44, align: 'right', lineBreak: false }
                        );

                    doc.font('Helvetica');
                    doc.y = 116;

                };

                const shell = {
                    newPage: () => {
                        doc.addPage();
                        drawBand();
                    }
                };

                drawBand();

                await BuildContent(doc, shell);

                const range = doc.bufferedPageRange();

                for (let i = range.start; i < range.start + range.count; i++) {

                    doc.switchToPage(i);

                    // O rodapé fica abaixo da área útil; sem zerar a margem
                    // o pdfkit cria páginas em branco extras ao carimbar.
                    doc.page.margins.bottom = 0;

                    const footerY = doc.page.height - 40;

                    doc
                        .moveTo(44, footerY)
                        .lineTo(doc.page.width - 44, footerY)
                        .lineWidth(0.75)
                        .strokeColor(c.line)
                        .stroke();

                    doc
                        .fillColor(c.muted)
                        .font('Helvetica')
                        .fontSize(8)
                        .text(
                            'Documento gerado automaticamente pelo Expense Manager.',
                            44, footerY + 9,
                            { lineBreak: false }
                        );

                    doc.text(
                        `Página ${i - range.start + 1} de ${range.count}`,
                        44, footerY + 9,
                        { width: doc.page.width - 88, align: 'right', lineBreak: false }
                    );

                }

                doc.end();

            });

            return right(result as Buffer);

        } catch (error) {

            const errorInstance = error as Error;
            return left(
                new AbstractError(
                    errorInstance.message,
                    403,
                    errorInstance.stack as string
                )
            );

        }

    }


    private async generatePDF(
        Logo: Buffer,
        Person: PersonModel,
        Invoice: InvoiceModel,
        Card: CardModel,
        Transactions: TransactionModel[],
        CardExpensesByCategory: CardExpensesByCategoryModel
    ): Promise<Either<AbstractError, Buffer>> {

        const c = this.pdfPalette();
        const oCurrency = Invoice?.Currency?.Code || '';
        const oMonthDescription =
            this.getMessage(`month.${Invoice?.Month}`, ServiceLocator.getRequest());

        const oCategories = [...CardExpensesByCategory.Categories];

        return this.renderBrandedPdf(
            Logo,
            `Fatura · ${Card?.Name} · ${oMonthDescription} de ${Invoice?.Year}`,
            async (doc, shell) => {

                const usableWidth = doc.page.width - 88;

                const drawPill = (Text: string, X: number, Y: number, Bg: string, Fg: string) => {

                    doc.font('Helvetica-Bold').fontSize(8);

                    const width = doc.widthOfString(Text) + 16;

                    doc.roundedRect(X, Y, width, 17, 8.5).fill(Bg);
                    doc.fillColor(Fg).text(Text, X, Y + 5, { width, align: 'center', lineBreak: false });
                    doc.font('Helvetica');

                    return X + width + 6;

                };

                // ---------- Página 1: resumo ----------
                if (Card?.Image) {

                    const oImage = await this.readableToBuffer(Card.Image);
                    const diameter = 84;
                    const x = (doc.page.width - diameter) / 2;
                    const y = doc.y;

                    doc
                        .save()
                        .circle(x + diameter / 2, y + diameter / 2, diameter / 2)
                        .clip()
                        .image(oImage as Buffer, x, y, { width: diameter, height: diameter })
                        .restore();

                    doc.y = y + diameter + 20;

                }

                doc
                    .fillColor(c.muted)
                    .font('Helvetica')
                    .fontSize(10)
                    .text(`${Person?.Name}, este é o detalhamento da sua fatura do cartão`,
                        44, doc.y, { width: usableWidth, align: 'center' });

                doc
                    .fillColor(c.ink)
                    .font('Helvetica-Bold')
                    .fontSize(15)
                    .text(Card?.Name || '', 44, doc.y + 2, { width: usableWidth, align: 'center' });

                doc.y += 22;

                const cardY = doc.y;
                const cardH = 126;

                doc
                    .roundedRect(44, cardY, usableWidth, cardH, 10)
                    .fillAndStroke(c.white, c.line);

                doc
                    .roundedRect(56, cardY + 16, 4, cardH - 32, 2)
                    .fill(c.primary);

                doc
                    .fillColor(c.muted)
                    .font('Helvetica-Bold')
                    .fontSize(8)
                    .text('TOTAL DA FATURA', 72, cardY + 20, { characterSpacing: 1.2, lineBreak: false });

                doc
                    .fillColor(c.primary)
                    .font('Helvetica-Bold')
                    .fontSize(30)
                    .text(this.pdfMoney(oCurrency, Invoice?.TotalAmount?.toNumber()),
                        72, cardY + 36, { lineBreak: false });

                const dueLabel =
                    `Vence em ${this.addLeftZeros(Card?.DueDay)}/` +
                    `${this.addLeftZeros(Invoice?.Month)}/${Invoice?.Year}`;

                doc.font('Helvetica-Bold').fontSize(8);

                let pillX = doc.page.width - 72 - (doc.widthOfString(dueLabel) + 16);

                drawPill(dueLabel, pillX, cardY + 20, c.tint, c.primaryDark);

                pillX -= (doc.widthOfString(`${oMonthDescription} de ${Invoice?.Year}`) + 16) + 8;

                drawPill(`${oMonthDescription} de ${Invoice?.Year}`, pillX, cardY + 20, c.surface, c.muted);

                doc
                    .fillColor(c.muted)
                    .font('Helvetica')
                    .fontSize(9.5)
                    .text('Este é o valor que você precisa pagar neste mês.',
                        72, cardY + cardH - 28, { lineBreak: false });

                doc.y = cardY + cardH + 24;

                // ---------- Categorias ----------
                if (oCategories.length) {

                    shell.newPage();

                    this.pdfSectionTitle(
                        doc,
                        'Gastos por categoria',
                        'Distribuição das despesas da fatura entre as categorias.'
                    );

                    const totalOfCategories =
                        oCategories.reduce((sum, cat) =>
                            sum + (cat.TotalAmount?.toNumber() ?? 0), 0);

                    const nameX = 80;
                    const barX = 252;
                    const barW = 138;
                    const amountRight = 500;
                    const percentRight = 551;

                    const drawTableHead = () => {

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica-Bold')
                            .fontSize(8)
                            .text('CATEGORIA', nameX, doc.y, { characterSpacing: 1, lineBreak: false })
                            .text('TOTAL', amountRight - 90, doc.y,
                                { width: 90, align: 'right', characterSpacing: 1, lineBreak: false })
                            .text('%', percentRight - 50, doc.y,
                                { width: 50, align: 'right', characterSpacing: 1, lineBreak: false });

                        doc.y += 14;

                        doc
                            .moveTo(44, doc.y)
                            .lineTo(doc.page.width - 44, doc.y)
                            .lineWidth(1)
                            .strokeColor(c.lineSoft)
                            .stroke();

                        doc.y += 10;

                    };

                    drawTableHead();

                    for (const [index, category] of oCategories.entries()) {

                        // Quebra apenas se houver próxima linha: evita página
                        // em branco quando a lista fecha exata no limite.
                        if ((index + 1) < oCategories.length &&
                            (index + 1) % 19 === 0) {
                            shell.newPage();
                            doc.y += 6;
                            drawTableHead();
                        }

                        const rowY = doc.y;

                        if (category?.ImagePath) {
                            const diameter = 22;
                            const oImageBuffer =
                                await this.getCategoryImageCached(category?.ID);
                            doc
                                .save()
                                .circle(44 + diameter / 2, rowY + diameter / 2, diameter / 2)
                                .clip()
                                .image(oImageBuffer as Buffer, 44, rowY, { width: diameter, height: diameter })
                                .restore();
                        } else {
                            doc
                                .circle(44 + 11, rowY + 11, 11)
                                .fill(c.tint);
                        }

                        const percentValue =
                            Number(category.Percent?.toNumber() ?? 0);

                        doc
                            .fillColor(c.ink)
                            .font('Helvetica-Bold')
                            .fontSize(10.5)
                            .text(this.pdfFitText(category.Name, 22),
                                nameX, rowY + 3, { width: 165, lineBreak: false });

                        doc
                            .roundedRect(barX, rowY + 7, barW, 5, 2.5)
                            .fill(c.surface);

                        if (percentValue > 0 && totalOfCategories > 0) {
                            const fillW = Math.max(3, Math.min(barW,
                                barW * (percentValue / 100)));
                            doc
                                .roundedRect(barX, rowY + 7, fillW, 5, 2.5)
                                .fill(c.accent);
                        }

                        doc
                            .fillColor(c.ink)
                            .text(
                                this.pdfMoney(
                                    CardExpensesByCategory?.Currency?.Code || oCurrency,
                                    category.TotalAmount?.toNumber()
                                ),
                                amountRight - 170, rowY + 3,
                                { width: 170, align: 'right', lineBreak: false }
                            );

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica')
                            .fontSize(9.5)
                            .text(`${percentValue.toFixed(1)}%`,
                                percentRight - 50, rowY + 4,
                                { width: 50, align: 'right', lineBreak: false });

                        doc.y = rowY + 30;

                        doc
                            .moveTo(44, doc.y - 6)
                            .lineTo(doc.page.width - 44, doc.y - 6)
                            .lineWidth(0.5)
                            .strokeColor(c.line)
                            .stroke();

                    }

                }

                // ---------- Movimentos ----------
                if (Transactions.length) {

                    Transactions.sort((a, b) =>
                        String(a.Date).localeCompare(String(b.Date)));

                    shell.newPage();

                    this.pdfSectionTitle(
                        doc,
                        'Movimentos da fatura',
                        `${Transactions.length} lançamento(s) nesta fatura.`
                    );

                    const dateX = 44;
                    const descX = 122;
                    const catX = 330;
                    const instX = 462;
                    const valueRight = 551;

                    const drawTxHead = () => {

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica-Bold')
                            .fontSize(8)
                            .text('DATA', dateX, doc.y, { characterSpacing: 1, lineBreak: false })
                            .text('DESCRIÇÃO', descX, doc.y, { characterSpacing: 1, lineBreak: false })
                            .text('CATEGORIA', catX, doc.y, { characterSpacing: 1, lineBreak: false })
                            .text('PARCELA', instX, doc.y, { characterSpacing: 1, lineBreak: false })
                            .text('VALOR', valueRight - 100, doc.y,
                                { width: 100, align: 'right', characterSpacing: 1, lineBreak: false });

                        doc.y += 13;

                        doc
                            .moveTo(44, doc.y)
                            .lineTo(doc.page.width - 44, doc.y)
                            .lineWidth(1)
                            .strokeColor(c.lineSoft)
                            .stroke();

                        doc.y += 8;

                    };

                    drawTxHead();

                    const rowH = 23;

                    for (const [index, transaction] of Transactions.entries()) {

                        if ((index + 1) < Transactions.length &&
                            (index + 1) % 24 === 0) {
                            shell.newPage();
                            doc.y += 6;
                            drawTxHead();
                        }

                        const rowY = doc.y;

                        if (index % 2 === 1) {
                            doc
                                .rect(44, rowY - 3, doc.page.width - 88, rowH)
                                .fill(c.surface);
                        }

                        const oExpenseDate =
                            new Date(`${transaction?.Date}T00:00:00`);

                        const oDate =
                            `${this.addLeftZeros(oExpenseDate.getDate())}/` +
                            `${this.addLeftZeros(oExpenseDate.getMonth() + 1)}/` +
                            `${oExpenseDate.getFullYear()}`;

                        const oCategory =
                            oCategories.find(cat =>
                                cat.ID == transaction.Category?.Id);

                        const installment =
                            `${transaction.Installment}/${transaction.TotalInstallments}`;

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica')
                            .fontSize(9)
                            .text(oDate, dateX, rowY, { width: 74, lineBreak: false });

                        doc
                            .fillColor(c.ink)
                            .font('Helvetica-Bold')
                            .fontSize(10)
                            .text(this.pdfFitText(transaction.Description, 27),
                                descX, rowY, { width: 200, lineBreak: false });

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica')
                            .fontSize(9)
                            .text(this.pdfFitText(oCategory?.Name || 'Sem categoria', 17),
                                catX, rowY, { width: 126, lineBreak: false })
                            .text(installment, instX, rowY,
                                { width: 60, lineBreak: false });

                        doc
                            .fillColor(c.ink)
                            .font('Helvetica-Bold')
                            .fontSize(10)
                            .text(
                                this.pdfMoney(
                                    transaction?.Currency?.Code || oCurrency,
                                    transaction.Amount?.toNumber()
                                ),
                                valueRight - 120, rowY,
                                { width: 120, align: 'right', lineBreak: false }
                            );

                        doc.y = rowY + rowH;

                    }

                }

            }
        );

    }


    private async generateLiabilityPDF(
        Logo: Buffer,
        Person: PersonModel,
        Liability: LiabilityModel,
        Balance: Decimal,
        Summary: LiabilityTransactionSummary,
        LastMovements: LiabilityTransactionModel[]
    ): Promise<Either<AbstractError, Buffer>> {

        const c = this.pdfPalette();
        const oCurrency = Liability?.Currency?.Code || '';
        const oPercentage = paymentPercentage(Liability?.TotalAmount, Summary);
        const oIsOpen = Balance.greaterThan(0);

        return this.renderBrandedPdf(
            Logo,
            `Dívida · ${Liability?.Name}`,
            async (doc, shell) => {

                const usableWidth = doc.page.width - 88;

                const drawPill = (Text: string, X: number, Y: number, Bg: string, Fg: string) => {

                    doc.font('Helvetica-Bold').fontSize(8);

                    const width = doc.widthOfString(Text) + 16;

                    doc.roundedRect(X, Y, width, 17, 8.5).fill(Bg);
                    doc.fillColor(Fg).text(Text, X, Y + 5, { width, align: 'center', lineBreak: false });
                    doc.font('Helvetica');

                    return X + width + 6;

                };

                // ---------- Página 1: resumo ----------
                const initialsFromName = (name: string): string => {

                    const parts =
                        String(name || '').trim().split(/\s+/).filter(Boolean);

                    return parts
                        .slice(0, 2)
                        .map(part => part.charAt(0).toUpperCase())
                        .join('') || '?';

                };

                // Avatar oculto por enquanto; implementação preservada
                // para reativação futura (ex.: imagem da dívida).
                const showAvatar = false;

                const diameter = 76;
                const circleX = (doc.page.width - diameter) / 2;
                const circleY = doc.y;

                if (showAvatar) {

                    doc
                        .circle(circleX + diameter / 2,
                            circleY + diameter / 2, diameter / 2)
                        .fillAndStroke(c.tint, c.lineSoft);

                    doc
                        .fillColor(c.primary)
                        .font('Helvetica-Bold')
                        .fontSize(24)
                        .text(initialsFromName(Liability?.Name),
                            circleX, circleY + (diameter - 24) / 2,
                            {
                                width: diameter,
                                align: 'center',
                                lineBreak: false
                            });

                    doc.y = circleY + diameter + 20;

                }

                doc
                    .fillColor(c.muted)
                    .font('Helvetica')
                    .fontSize(10)
                    .text(`${Person?.Name}, este é o detalhamento da sua dívida`,
                        44, doc.y, { width: usableWidth, align: 'center' });

                doc
                    .fillColor(c.ink)
                    .font('Helvetica-Bold')
                    .fontSize(15)
                    .text(Liability?.Name || '', 44, doc.y + 2,
                        { width: usableWidth, align: 'center' });

                doc.y += 22;

                const heroY = doc.y;
                const heroH = 126;

                doc
                    .roundedRect(44, heroY, usableWidth, heroH, 10)
                    .fillAndStroke(c.white, c.line);

                doc
                    .roundedRect(56, heroY + 16, 4, heroH - 32, 2)
                    .fill(oIsOpen ? c.primary : c.positive);

                doc
                    .fillColor(c.muted)
                    .font('Helvetica-Bold')
                    .fontSize(8)
                    .text('SALDO DEVEDOR', 72, heroY + 20, { characterSpacing: 1.2, lineBreak: false });

                doc
                    .fillColor(oIsOpen ? c.primary : c.positive)
                    .font('Helvetica-Bold')
                    .fontSize(30)
                    .text(this.pdfMoney(oCurrency, Balance.toNumber()),
                        72, heroY + 36, { lineBreak: false });

                const statusLabel = oIsOpen ? 'EM ABERTO' : 'QUITADA';
                const statusBg = oIsOpen ? c.tint : c.positiveBg;
                const statusFg = oIsOpen ? c.primaryDark : c.positive;

                doc.font('Helvetica-Bold').fontSize(8);

                drawPill(
                    statusLabel,
                    doc.page.width - 72 - (doc.widthOfString(statusLabel) + 16),
                    heroY + 20, statusBg, statusFg
                );

                doc
                    .fillColor(c.muted)
                    .font('Helvetica')
                    .fontSize(9.5)
                    .text('Este é o valor que ainda falta pagar.',
                        72, heroY + heroH - 28, { lineBreak: false });

                doc.y = heroY + heroH + 18;

                // Progresso do pagamento
                const trackW = usableWidth;
                const progressPct =
                    Math.min(100, Math.max(0, oPercentage.toNumber()));

                doc
                    .roundedRect(44, doc.y, trackW, 6, 3)
                    .fill(c.surface);

                if (progressPct > 0) {
                    doc
                        .roundedRect(44, doc.y, Math.max(6, trackW * progressPct / 100), 6, 3)
                        .fill(oIsOpen ? c.accent : c.positive);
                }

                doc
                    .fillColor(c.muted)
                    .font('Helvetica')
                    .fontSize(9)
                    .text(`${progressPct.toFixed(1)}% pago`,
                        44, doc.y + 12,
                        { width: trackW, align: 'right', lineBreak: false });

                doc.y += 34;

                // Grid de métricas (2 colunas)
                const colGap = 14;
                const colW = (usableWidth - colGap) / 2;
                const miniH = 52;

                const drawMiniCard = (Label: string, Value: string, X: number, Y: number) => {

                    doc
                        .roundedRect(X, Y, colW, miniH, 8)
                        .fillAndStroke(c.white, c.line);

                    doc
                        .fillColor(c.muted)
                        .font('Helvetica-Bold')
                        .fontSize(7.5)
                        .text(Label.toUpperCase(), X + 14, Y + 11, { characterSpacing: 1, lineBreak: false });

                    doc
                        .fillColor(c.ink)
                        .font('Helvetica-Bold')
                        .fontSize(13)
                        .text(Value, X + 14, Y + 25, { lineBreak: false });

                };

                drawMiniCard('Valor total da dívida',
                    this.pdfMoney(oCurrency, Liability?.TotalAmount?.toNumber()),
                    44, doc.y);

                drawMiniCard('Total pago até agora',
                    this.pdfMoney(oCurrency, Summary.TotalIn.toNumber()),
                    44 + colW + colGap, doc.y);

                doc.y += miniH + 12;

                drawMiniCard('Acréscimos aplicados',
                    this.pdfMoney(oCurrency, Summary.TotalOut.toNumber()),
                    44, doc.y);

                drawMiniCard('Vencimento mensal',
                    `Dia ${this.addLeftZeros(Liability?.DueDay ?? 0)}`,
                    44 + colW + colGap, doc.y);

                doc.y += miniH + 12;

                if (Liability?.Description) {

                    const descH = 46;

                    doc
                        .roundedRect(44, doc.y, usableWidth, descH, 8)
                        .fillAndStroke(c.surface, c.line);

                    doc
                        .fillColor(c.muted)
                        .font('Helvetica-Bold')
                        .fontSize(7.5)
                        .text('DESCRIÇÃO', 58, doc.y + 10, { characterSpacing: 1, lineBreak: false });

                    doc
                        .fillColor(c.ink)
                        .font('Helvetica')
                        .fontSize(10)
                        .text(this.pdfFitText(Liability.Description, 90),
                            58, doc.y + 23, { lineBreak: false });

                    doc.y += descH + 4;

                }

                // ---------- Página 2: movimentações ----------
                shell.newPage();

                this.pdfSectionTitle(
                    doc,
                    'Últimas movimentações',
                    LastMovements.length
                        ? `Exibindo as ${LastMovements.length} mais recentes.`
                        : undefined
                );

                const dateX = 44;
                const descX = 134;
                const typeX = 372;
                const valueRight = 551;

                if (!LastMovements.length) {

                    const emptyY = doc.y + 10;

                    doc
                        .roundedRect(44, emptyY, usableWidth, 60, 8)
                        .fillAndStroke(c.tint, c.line);

                    doc
                        .fillColor(c.primaryDark)
                        .font('Helvetica')
                        .fontSize(10.5)
                        .text('Nenhuma movimentação registrada até o momento.',
                            44, emptyY + 24,
                            { width: usableWidth, align: 'center', lineBreak: false });

                    return;

                }

                doc
                    .fillColor(c.muted)
                    .font('Helvetica-Bold')
                    .fontSize(8)
                    .text('DATA', dateX, doc.y, { characterSpacing: 1, lineBreak: false })
                    .text('DESCRIÇÃO', descX, doc.y, { characterSpacing: 1, lineBreak: false })
                    .text('TIPO', typeX, doc.y, { characterSpacing: 1, lineBreak: false })
                    .text('VALOR', valueRight - 100, doc.y,
                        { width: 100, align: 'right', characterSpacing: 1, lineBreak: false });

                doc.y += 13;

                doc
                    .moveTo(44, doc.y)
                    .lineTo(doc.page.width - 44, doc.y)
                    .lineWidth(1)
                    .strokeColor(c.lineSoft)
                    .stroke();

                doc.y += 8;

                const rowH = 24;

                for (const [index, movement] of LastMovements.entries()) {

                    const rowY = doc.y;

                    if (index % 2 === 1) {
                        doc
                            .rect(44, rowY - 3, doc.page.width - 88, rowH)
                            .fill(c.surface);
                    }

                    const oMovementDate =
                        new Date(`${movement?.Date}T00:00:00`);

                    const oDate =
                        `${this.addLeftZeros(oMovementDate.getDate())}/` +
                        `${this.addLeftZeros(oMovementDate.getMonth() + 1)}/` +
                        `${oMovementDate.getFullYear()}`;

                    const isIn = movement.Type === 'IN';

                    const typeText = isIn ? 'Pagamento' : 'Acréscimo';
                    const typeBg = isIn ? c.positiveBg : c.negativeBg;
                    const typeFg = isIn ? c.positive : c.negative;

                    doc
                        .fillColor(c.muted)
                        .font('Helvetica')
                        .fontSize(9)
                        .text(oDate, dateX, rowY, { width: 84, lineBreak: false });

                    doc
                        .fillColor(c.ink)
                        .font('Helvetica-Bold')
                        .fontSize(10)
                        .text(this.pdfFitText(movement.Description, 30),
                            descX, rowY, { width: 230, lineBreak: false });

                    doc.font('Helvetica-Bold').fontSize(8);
                    drawPill(typeText, typeX, rowY - 2, typeBg, typeFg);

                    doc
                        .fillColor(isIn ? c.positive : c.ink)
                        .font('Helvetica-Bold')
                        .fontSize(10)
                        .text(
                            this.pdfMoney(
                                movement?.Currency?.Code || oCurrency,
                                movement.Amount?.toNumber()
                            ),
                            valueRight - 120, rowY,
                            { width: 120, align: 'right', lineBreak: false }
                        );

                    doc.y = rowY + rowH;

                }

            }
        );

    }


    private sanitizeFileName(name: string): string {

        return String(name || 'divida')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[\\/:*?"<>|]/g, '')
            .trim()
            .slice(0, 60) || 'divida';

    }


    protected personPath(): string[] {

        return [];

    }


    public entityCode(): number {

        return 1;

    }


    protected parentField(): string | null {
        return 'ID';
    }


    private async generateConsolidatedPDF(
        Logo: Buffer,
        Person: PersonModel,
        Transactions: any[],
        Liabilities: {
            Name: string;
            Balance: number;
            TotalAmount: number;
            PercentPaid: number;
            DueDay: string;
            Currency: string;
            Movements?: {
                Date: string;
                Description: string;
                Type: string;
                Amount: number;
            }[];
        }[],
        Year: number,
        Month: number,
        MonthDescription: string,
        CurrencyCode: string
    ): Promise<Either<AbstractError, Buffer>> {

        try {

            const c = this.pdfPalette();

            const oCurrency =
                this.currencySymbol(CurrencyCode);

            // --- category summaries ---
            const categoryMap = new Map<string, {
                Id: string;
                Name: string;
                TotalAmount: number;
                Count: number;
            }>();

            let totalAll = 0;

            for (const tx of Transactions) {

                const catId = tx.Category?.ID || '__none__';
                const catName = tx.Category?.Name || 'Sem categoria';

                if (!categoryMap.has(catId)) {
                    categoryMap.set(catId, {
                        Id: tx.Category?.ID || '',
                        Name: catName,
                        TotalAmount: 0,
                        Count: 0
                    });
                }

                const entry = categoryMap.get(catId)!;
                entry.TotalAmount += Number(tx.Amount ?? 0);
                entry.Count += 1;
                totalAll += Number(tx.Amount ?? 0);

            }

            const categorySummary = [...categoryMap.values()]
                .sort((a, b) => b.TotalAmount - a.TotalAmount);

            // --- unique card/category IDs for images ---
            const uniqueCardIds =
                [...new Set(Transactions
                    .map(t => t.Card?.ID)
                    .filter(Boolean))] as string[];

            const uniqueCatIds =
                [...new Set(Transactions
                    .map(t => t.Category?.ID)
                    .filter(Boolean))] as string[];

            // --- load images ---
            const cardImageBuffers = new Map<string, Buffer>();
            const catImageBuffers = new Map<string, Buffer>();

            if (uniqueCardIds.length) {
                const rows =
                    await this.CardRepository.findImageByIds(uniqueCardIds) || [];
                for (const row of rows) {
                    if (row.Image) {
                        cardImageBuffers.set(
                            row.ID,
                            await this.readableToBuffer(row.Image) as Buffer
                        );
                    }
                }
            }

            if (uniqueCatIds.length) {
                const rows =
                    await this.CategoryRepository.findImageByIds(uniqueCatIds) || [];
                for (const row of rows) {
                    if (row.Image) {
                        catImageBuffers.set(
                            row.ID,
                            await this.readableToBuffer(row.Image) as Buffer
                        );
                    }
                }
            }

            return await this.renderBrandedPdf(
                Logo,
                `Visão Geral · ${MonthDescription} ${Year}`,
                async (doc, shell) => {

                    const oMaxY = doc.page.height - doc.page.margins.bottom;

                    // --- resumo por cartão ---
                    const cardTotals = new Map<string, {
                        Name: string;
                        Total: number;
                        Count: number;
                    }>();

                    for (const tx of Transactions) {

                        const cardId = tx.Card?.ID || '__none__';

                        if (!cardTotals.has(cardId)) {
                            cardTotals.set(cardId, {
                                Name: tx.Card?.Name || 'Cartão',
                                Total: 0,
                                Count: 0
                            });
                        }

                        const entry = cardTotals.get(cardId)!;
                        entry.Total += Number(tx.Amount ?? 0);
                        entry.Count += 1;

                    }

                    const cardSummary =
                        [...cardTotals.values()]
                            .sort((a, b) => b.Total - a.Total);

                    // ---------- página 1: resumo ----------
                    doc.y = 138;

                    doc
                        .fillColor(c.ink)
                        .font('Helvetica-Bold')
                        .fontSize(20)
                        .text(`Olá, ${Person.Name?.split(' ')[0]}!`,
                            72, doc.y, { lineBreak: false });

                    doc.y += 27;

                    doc
                        .fillColor(c.muted)
                        .font('Helvetica')
                        .fontSize(10)
                        .text(
                            `Visão completa das suas finanças em ` +
                            `${MonthDescription} de ${Year}.`,
                            72, doc.y, { lineBreak: false }
                        );

                    doc.y += 30;

                    // hero
                    const heroH = 94;
                    const heroY = doc.y;

                    doc.save()
                        .roundedRect(44, heroY, doc.page.width - 88, heroH, 10)
                        .fill(c.tint)
                        .restore();

                    doc
                        .fillColor(c.muted)
                        .font('Helvetica')
                        .fontSize(8.5)
                        .text('TOTAL DE DESPESAS NO MÊS',
                            72, heroY + 16,
                            { characterSpacing: 1.2, lineBreak: false });

                    doc
                        .fillColor(c.primary)
                        .font('Helvetica-Bold')
                        .fontSize(28)
                        .text(this.pdfMoney(CurrencyCode, totalAll),
                            72, heroY + 31, { lineBreak: false });

                    doc
                        .fillColor(c.muted)
                        .font('Helvetica')
                        .fontSize(9.5)
                        .text(
                            `${Transactions.length} transações · ` +
                            `${cardSummary.length} cartões · ` +
                            `${categorySummary.length} categorias`,
                            72, heroY + 68, { lineBreak: false }
                        );

                    doc.y = heroY + heroH + 20;

                    // tabela resumo por cartão
                    this.pdfSectionTitle(doc, 'Resumo por cartão',
                        `${cardSummary.length} cartão(ões) neste mês.`);

                    const sumNameX = 80;
                    const sumCountX = 330;
                    const sumValueRight = 551;

                    const drawSumHead = () => {

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica-Bold')
                            .fontSize(8)
                            .text('CARTÃO', sumNameX, doc.y,
                                { characterSpacing: 1, lineBreak: false })
                            .text('TRANSAÇÕES', sumCountX, doc.y,
                                { characterSpacing: 1, lineBreak: false })
                            .text('VALOR', sumValueRight - 100, doc.y,
                                {
                                    width: 100,
                                    align: 'right',
                                    characterSpacing: 1,
                                    lineBreak: false
                                });

                        doc.y += 14;

                        doc
                            .moveTo(44, doc.y)
                            .lineTo(doc.page.width - 44, doc.y)
                            .lineWidth(1)
                            .strokeColor(c.lineSoft)
                            .stroke();

                        doc.y += 10;

                    };

                    drawSumHead();

                    for (const [index, cs] of cardSummary.entries()) {

                        if ((index + 1) < cardSummary.length &&
                            (index + 1) % 22 === 0) {
                            shell.newPage();
                            doc.y += 6;
                            drawSumHead();
                        }

                        const rowY = doc.y;

                        // círculo com a imagem do cartão
                        const diameter = 22;

                        if (cs.Name && uniqueCardIds.length &&
                            cardImageBuffers.size) {

                            const cardEntry =
                                [...cardTotals.entries()]
                                    .find(([, v]) => v === cs);

                            const imgBuf = cardEntry
                                ? cardImageBuffers.get(cardEntry[0])
                                : undefined;

                            if (imgBuf) {
                                doc
                                    .save()
                                    .circle(44 + diameter / 2,
                                        rowY + diameter / 2, diameter / 2)
                                    .clip()
                                    .image(imgBuf, 44, rowY,
                                        {
                                            width: diameter,
                                            height: diameter
                                        })
                                    .restore();
                            } else {
                                doc
                                    .circle(44 + 11, rowY + 11, 11)
                                    .fill(c.tint);
                            }

                        } else {
                            doc
                                .circle(44 + 11, rowY + 11, 11)
                                .fill(c.tint);
                        }

                        doc
                            .fillColor(c.ink)
                            .font('Helvetica-Bold')
                            .fontSize(10.5)
                            .text(this.pdfFitText(cs.Name, 27),
                                sumNameX, rowY + 3,
                                { width: 240, lineBreak: false });

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica')
                            .fontSize(9)
                            .text(`${cs.Count} transação(ões)`,
                                sumCountX, rowY + 4,
                                { width: 126, lineBreak: false });

                        doc
                            .fillColor(c.ink)
                            .font('Helvetica-Bold')
                            .fontSize(10)
                            .text(this.pdfMoney(CurrencyCode, cs.Total),
                                sumValueRight - 120, rowY + 3,
                                { width: 120, align: 'right', lineBreak: false });

                        doc.y = rowY + 30;

                        doc
                            .moveTo(44, doc.y - 6)
                            .lineTo(doc.page.width - 44, doc.y - 6)
                            .lineWidth(0.5)
                            .strokeColor(c.line)
                            .stroke();

                    }

                    // ---------- categorias ----------
                    shell.newPage();

                    this.pdfSectionTitle(doc, 'Gastos por categoria',
                        'Distribuição das despesas do mês entre as categorias.');

                    const catNameX = 80;
                    const catBarX = 252;
                    const catBarW = 138;
                    const catAmountRight = 500;
                    const catPercentRight = 551;

                    const drawCatHead = () => {

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica-Bold')
                            .fontSize(8)
                            .text('CATEGORIA', catNameX, doc.y,
                                { characterSpacing: 1, lineBreak: false })
                            .text('TOTAL', catAmountRight - 90, doc.y,
                                {
                                    width: 90,
                                    align: 'right',
                                    characterSpacing: 1,
                                    lineBreak: false
                                })
                            .text('%', catPercentRight - 50, doc.y,
                                {
                                    width: 50,
                                    align: 'right',
                                    characterSpacing: 1,
                                    lineBreak: false
                                });

                        doc.y += 14;

                        doc
                            .moveTo(44, doc.y)
                            .lineTo(doc.page.width - 44, doc.y)
                            .lineWidth(1)
                            .strokeColor(c.lineSoft)
                            .stroke();

                        doc.y += 10;

                    };

                    drawCatHead();

                    for (const [index, cat] of categorySummary.entries()) {

                        // Quebra apenas se houver próxima linha: evita
                        // página em branco no limite exato.
                        if ((index + 1) < categorySummary.length &&
                            (index + 1) % 19 === 0) {
                            shell.newPage();
                            doc.y += 6;
                            drawCatHead();
                        }

                        const rowY = doc.y;

                        const percent = totalAll > 0
                            ? (cat.TotalAmount / totalAll) * 100
                            : 0;

                        // círculo com a imagem da categoria
                        const diameter = 22;

                        if (cat.Id && catImageBuffers.has(cat.Id)) {
                            const imgBuf =
                                catImageBuffers.get(cat.Id)!;
                            doc
                                .save()
                                .circle(44 + diameter / 2,
                                    rowY + diameter / 2, diameter / 2)
                                .clip()
                                .image(imgBuf, 44, rowY,
                                    { width: diameter, height: diameter })
                                .restore();
                        } else {
                            doc
                                .circle(44 + 11, rowY + 11, 11)
                                .fill(c.tint);
                        }

                        doc
                            .fillColor(c.ink)
                            .font('Helvetica-Bold')
                            .fontSize(10.5)
                            .text(this.pdfFitText(cat.Name, 22),
                                catNameX, rowY + 3,
                                { width: 165, lineBreak: false });

                        doc.font('Helvetica').fontSize(7.5)
                            .fillColor(c.muted)
                            .text(`${cat.Count} transação(ões)`,
                                catNameX, rowY + 17,
                                { width: 165, lineBreak: false });

                        doc
                            .roundedRect(catBarX, rowY + 7,
                                catBarW, 5, 2.5)
                            .fill(c.surface);

                        if (percent > 0) {
                            const fillW =
                                Math.max(3, Math.min(catBarW,
                                    catBarW * (percent / 100)));
                            doc
                                .roundedRect(catBarX, rowY + 7,
                                    fillW, 5, 2.5)
                                .fill(c.accent);
                        }

                        doc
                            .fillColor(c.ink)
                            .font('Helvetica-Bold')
                            .fontSize(10.5)
                            .text(
                                this.pdfMoney(CurrencyCode, cat.TotalAmount),
                                catAmountRight - 170, rowY + 3,
                                { width: 170, align: 'right', lineBreak: false }
                            );

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica')
                            .fontSize(9.5)
                            .text(`${percent.toFixed(1)}%`,
                                catPercentRight - 50, rowY + 4,
                                { width: 50, align: 'right', lineBreak: false });

                        doc.y = rowY + 32;

                        doc
                            .moveTo(44, doc.y - 6)
                            .lineTo(doc.page.width - 44, doc.y - 6)
                            .lineWidth(0.5)
                            .strokeColor(c.line)
                            .stroke();

                    }

                    // ---------- transações ----------
                    shell.newPage();

                    const sortedTx = [...Transactions]
                        .sort((a: any, b: any) =>
                            String(a.Date ?? '')
                                .localeCompare(String(b.Date ?? '')));

                    this.pdfSectionTitle(doc, 'Movimentos do mês',
                        `${sortedTx.length} lançamento(s) em ` +
                        `${MonthDescription} de ${Year}.`);

                    const txDateX = 44;
                    const txDescX = 102;
                    const txCardX = 276;
                    const txCatX = 356;
                    const txInstX = 460;
                    const txValueRight = 551;

                    const drawTxHead = () => {

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica-Bold')
                            .fontSize(8)
                            .text('DATA', txDateX, doc.y,
                                { characterSpacing: 1, lineBreak: false })
                            .text('DESCRIÇÃO', txDescX, doc.y,
                                { characterSpacing: 1, lineBreak: false })
                            .text('CARTÃO', txCardX, doc.y,
                                { characterSpacing: 1, lineBreak: false })
                            .text('CATEGORIA', txCatX, doc.y,
                                { characterSpacing: 1, lineBreak: false })
                            .text('PARCELA', txInstX, doc.y,
                                { characterSpacing: 1, lineBreak: false })
                            .text('VALOR', txValueRight - 100, doc.y,
                                {
                                    width: 100,
                                    align: 'right',
                                    characterSpacing: 1,
                                    lineBreak: false
                                });

                        doc.y += 13;

                        doc
                            .moveTo(44, doc.y)
                            .lineTo(doc.page.width - 44, doc.y)
                            .lineWidth(1)
                            .strokeColor(c.lineSoft)
                            .stroke();

                        doc.y += 8;

                    };

                    drawTxHead();

                    const txRowH = 23;

                    for (const [index, tx] of sortedTx.entries()) {

                        if ((index + 1) < sortedTx.length &&
                            (index + 1) % 24 === 0) {
                            shell.newPage();
                            doc.y += 6;
                            drawTxHead();
                        }

                        const rowY = doc.y;

                        if (index % 2 === 1) {
                            doc
                                .rect(44, rowY - 3,
                                    doc.page.width - 88, txRowH)
                                .fill(c.surface);
                        }

                        const oExpenseDate =
                            new Date(`${tx.Date}T00:00:00`);

                        const oDate =
                            `${this.addLeftZeros(oExpenseDate.getDate())}/` +
                            `${this.addLeftZeros(oExpenseDate.getMonth() + 1)}/` +
                            `${oExpenseDate.getFullYear()}`;

                        const installment =
                            `${tx.Installment ?? 1}/` +
                            `${tx.TotalInstallments ?? 1}`;

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica')
                            .fontSize(9)
                            .text(oDate, txDateX, rowY,
                                { width: 56, lineBreak: false });

                        doc
                            .fillColor(c.ink)
                            .font('Helvetica-Bold')
                            .fontSize(10)
                            .text(this.pdfFitText(tx.Description || '', 21),
                                txDescX, rowY,
                                { width: 164, lineBreak: false });

                        doc
                            .fillColor(c.muted)
                            .font('Helvetica')
                            .fontSize(9);

                        if (tx.Card?.Name &&
                            cardImageBuffers.has(tx.Card.ID)) {
                            const imgBuf =
                                cardImageBuffers.get(tx.Card.ID)!;
                            doc.save()
                                .circle(txCardX + 5.5, rowY + 4, 5.5)
                                .clip()
                                .image(imgBuf, txCardX, rowY - 1.5,
                                    { width: 11, height: 11 })
                                .restore();
                        }

                        doc.text(this.pdfFitText(tx.Card?.Name || '', 9),
                            txCardX + 13, rowY,
                            { width: 62, lineBreak: false })
                            .text(
                                this.pdfFitText(
                                    tx.Category?.Name || 'Sem categoria', 13),
                                txCatX, rowY,
                                { width: 96, lineBreak: false })
                            .text(installment, txInstX, rowY,
                                { width: 34, lineBreak: false });

                        doc
                            .fillColor(c.ink)
                            .font('Helvetica-Bold')
                            .fontSize(10)
                            .text(
                                this.pdfMoney(
                                    tx.Currency?.Code || CurrencyCode,
                                    Number(tx.Amount ?? 0)
                                ),
                                txValueRight - 120, rowY,
                                { width: 120, align: 'right', lineBreak: false }
                            );

                        doc.y = rowY + txRowH;

                    }

                    const fmtDate2 = (d: any): string => {

                        const oExpenseDate =
                            d ? new Date(`${String(d)}T00:00:00`) : null;

                        return oExpenseDate && !isNaN(oExpenseDate.getTime())
                            ? `${this.addLeftZeros(oExpenseDate.getDate())}/` +
                              `${this.addLeftZeros(oExpenseDate.getMonth() + 1)}`
                            : '--/--';

                    };

                    // ---------- dívidas em aberto ----------
                    if (Liabilities.length) {

                        // Página separada das movimentações.
                        shell.newPage();

                        this.pdfSectionTitle(doc, 'Dívidas em aberto',
                            `${Liabilities.length} dívida(s)`);

                        for (let i = 0; i < Liabilities.length; i++) {

                            const debt = Liabilities[i];

                            const movs = (debt.Movements || [])
                                .slice(0, 3);

                            const baseH = 94;
                            const movsH = movs.length
                                ? 26 + movs.length * 14 : 0;
                            const cardH = baseH + movsH;

                            let ly = doc.y;

                            if (ly + cardH > oMaxY) {
                                shell.newPage();
                                ly = doc.y;
                            }

                            const lw = doc.page.width - 88;

                            doc.save()
                                .roundedRect(44, ly, lw, cardH, 10)
                                .fill(c.surface)
                                .restore();

                            doc.save()
                                .rect(44, ly, 4, cardH)
                                .fill(c.primary)
                                .restore();

                            const isPaid =
                                Number(debt.PercentPaid ?? 0) >= 100;

                            // nome + badge de status
                            doc.font('Helvetica-Bold').fontSize(11)
                                .fillColor(c.ink)
                                .text(this.pdfFitText(debt.Name, 40),
                                    66, ly + 13,
                                    { width: lw - 220, lineBreak: false });

                            doc.font('Helvetica-Bold').fontSize(7.5);
                            const badgeText =
                                isPaid ? 'QUITADA' : 'EM ABERTO';
                            const badgeW =
                                doc.widthOfString(badgeText) + 16;

                            doc.save()
                                .roundedRect(
                                    44 + lw - badgeW - 16, ly + 11,
                                    badgeW, 16, 8)
                                .fill(isPaid ? c.positiveBg : c.negativeBg)
                                .restore();

                            doc
                                .fillColor(isPaid ? c.positive : c.negative)
                                .text(badgeText,
                                    44 + lw - badgeW - 16, ly + 15,
                                    {
                                        width: badgeW,
                                        align: 'center',
                                        lineBreak: false
                                    });

                            // saldo devedor
                            doc.font('Helvetica').fontSize(7.5)
                                .fillColor(c.muted)
                                .text('Saldo devedor',
                                    66, ly + 33, { lineBreak: false });

                            doc.font('Helvetica-Bold').fontSize(16)
                                .fillColor(c.negative)
                                .text(
                                    this.pdfMoney(
                                        CurrencyCode, debt.Balance),
                                    66, ly + 43, { lineBreak: false });

                            // valores à direita
                            const infoX = 44 + lw - 210;

                            doc.font('Helvetica').fontSize(7.5)
                                .fillColor(c.muted)
                                .text('Valor total',
                                    infoX, ly + 33, { lineBreak: false });

                            doc.font('Helvetica-Bold').fontSize(10)
                                .fillColor(c.ink)
                                .text(
                                    this.pdfMoney(
                                        CurrencyCode, debt.TotalAmount),
                                    infoX, ly + 43,
                                    { width: 90, lineBreak: false });

                            doc.font('Helvetica').fontSize(7.5)
                                .fillColor(c.muted)
                                .text('Total pago',
                                    infoX + 100, ly + 33,
                                    { lineBreak: false });

                            doc.font('Helvetica-Bold').fontSize(10)
                                .fillColor(c.positive)
                                .text(
                                    this.pdfMoney(
                                        CurrencyCode,
                                        Math.max(0,
                                            Number(debt.TotalAmount ?? 0) -
                                            Number(debt.Balance ?? 0))
                                    ),
                                    infoX + 100, ly + 43,
                                    { width: 90, lineBreak: false });

                            // barra de progresso
                            const pct =
                                Math.min(100,
                                    Math.max(0,
                                        Number(debt.PercentPaid ?? 0)));

                            const barY = ly + baseH - 18;

                            doc.save()
                                .roundedRect(66, barY, lw - 132, 5, 2.5)
                                .fill(c.line)
                                .restore();

                            if (pct > 0) {
                                doc.save()
                                    .roundedRect(66, barY,
                                        Math.max(5,
                                            (lw - 132) * (pct / 100)),
                                        5, 2.5)
                                    .fill(c.primary)
                                    .restore();
                            }

                            doc.font('Helvetica').fontSize(7.5)
                                .fillColor(c.muted)
                                .text(
                                    `${pct.toFixed(0)}% pago · ` +
                                    `vence dia ${debt.DueDay}`,
                                    66 + (lw - 132) + 10, barY - 1,
                                    { width: 116, lineBreak: false });

                            // últimas movimentações
                            if (movs.length) {

                                const sepY = ly + baseH;

                                doc
                                    .moveTo(66, sepY)
                                    .lineTo(44 + lw - 16, sepY)
                                    .lineWidth(0.5)
                                    .strokeColor(c.line)
                                    .stroke();

                                doc.font('Helvetica-Bold')
                                    .fontSize(6.5)
                                    .fillColor(c.muted)
                                    .text('ÚLTIMAS MOVIMENTAÇÕES',
                                        66, sepY + 6,
                                        { characterSpacing: 1, lineBreak: false });

                                let myY = sepY + 20;

                                for (const mov of movs) {

                                    const isIn = mov.Type === 'IN';

                                    doc.font('Helvetica')
                                        .fontSize(7.5)
                                        .fillColor(c.muted)
                                        .text(fmtDate2(mov.Date),
                                            66, myY,
                                            { width: 38, lineBreak: false });

                                    doc.font('Helvetica')
                                        .fontSize(8.5)
                                        .fillColor(c.ink)
                                        .text(
                                            this.pdfFitText(
                                                mov.Description ||
                                                (isIn
                                                    ? 'Pagamento'
                                                    : 'Acréscimo'), 34),
                                            108, myY - 1,
                                            { width: 210, lineBreak: false });

                                    doc.font('Helvetica')
                                        .fontSize(7.5)
                                        .fillColor(c.muted)
                                        .text(isIn
                                            ? 'Pagamento'
                                            : 'Acréscimo',
                                            330, myY,
                                            { width: 70, lineBreak: false });

                                    doc.font('Helvetica-Bold')
                                        .fontSize(8.5)
                                        .fillColor(
                                            isIn ? c.positive : c.negative)
                                        .text(
                                            `${isIn ? '-' : '+'} ` +
                                            this.pdfMoney(
                                                CurrencyCode, mov.Amount),
                                            44 + lw - 140, myY - 1,
                                            {
                                                width: 124,
                                                align: 'right',
                                                lineBreak: false
                                            });

                                    myY += 14;

                                }

                            }

                            doc.y = ly + cardH + 10;

                        }

                    }

                }
            );

        } catch (error) {

            const err = error as Error;

            return left(
                new AbstractError(
                    err.message,
                    403,
                    err.stack as string
                )
            );

        }

    }


    private async recoverExpenses(
        Cards: Cards,
        Liabilities: LiabilityModel[],
        TargetMonth?: number,
        TargetYear?: number
    ): Promise<Either<AbstractError, {
        totalExpenses: Decimal,
        monthExpenses: Decimal,
        monthExpensesToPay: Decimal,
        monthExpensesClosed: Decimal,
        monthExpensesPayed: Decimal
    }>> {

        try {

            let oTotalExpenses = new Decimal(0);
            let oMonthExpenses = new Decimal(0);
            let oMonthExpensesToPay = new Decimal(0);
            let oMonthExpensesClosed = new Decimal(0);
            let oMonthExpensesPayed = new Decimal(0);

            let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
            oDate = oDate.replaceAll(",", " ");
            const [day, month, year] = oDate.split(" ")[0].split("/");

            let oDay = Number(day);
            let oMonth = Number(month);
            let oYear = Number(year);

            const oSystemMonth = oMonth;
            const oSystemYear = oYear;

            if (TargetYear) {
                oYear = Number(TargetYear);
            }

            if (TargetMonth) {
                oMonth = Number(TargetMonth);
            }

            // O desvio de referência (cartão que fecha após o vencimento)
            // existe apenas para identificar o ciclo corrente no mês vigente;
            // em meses passados/futuros a fatura analisada é a rotulada com o
            // próprio mês/ano consultado.
            const oTargetIsPast =
                (oYear < oSystemYear) ||
                (oYear == oSystemYear && oMonth < oSystemMonth);

            const oTargetIsFuture =
                (oYear > oSystemYear) ||
                (oYear == oSystemYear && oMonth > oSystemMonth);

            const oApplyShift = !oTargetIsPast && !oTargetIsFuture;

            const cardIds = Cards.map(c => c.ID);

            const invoicesByCard = await this.InvoiceRepository.findByCardIDs(cardIds, { Year: { '>=': oYear } }) || [];

            const mapInvoices = new Map<string, any[]>();

            for (const inv of invoicesByCard) {

                if (!inv?.Card) continue;

                if (!mapInvoices.has(inv?.Card?.Id)) {
                    mapInvoices.set(inv?.Card?.Id, []);
                }
                mapInvoices.get(inv.Card?.Id)!.push(inv);
            }

            for (let Card of Cards) {

                if (!('ClosingDay' in Card) || !('DueDay' in Card)) {

                    continue;

                }

                const oCardModel = CardModel.singleModel(Card);

                // Cartões com fechamento após o vencimento têm a fatura de
                // referência deslocada para o mês seguinte; essa fatura é o
                // ciclo CORRENTE (ainda em aberto), então nunca deve ser
                // classificada como paga/fechada pelas comparações de dia.
                const oShiftedReference =
                    oCardModel.ClosingDay > oCardModel.DueDay;

                let oInvoiceMonth = oMonth;
                let oInvoiceYear = oYear;

                if (oApplyShift && oShiftedReference) {

                    if (oInvoiceMonth == 12) {
                        oInvoiceMonth = 1;
                        oInvoiceYear += 1;
                    } else {
                        oInvoiceMonth += 1;
                    }

                }

                try {

                    if (oCardModel.ClosingDay > 28) {

                        if (!this.validateDate(`${oYear}-${oMonth}-${oCardModel.ClosingDay}`)) {
                            oCardModel.ClosingDay = this.lastDayOfTheMonth(oInvoiceYear, oInvoiceMonth - 1);
                        }
                    }

                } catch (erro) {

                }

                const oInvoices = mapInvoices.get(oCardModel.Id) || [];

                oInvoices?.forEach(oInvoice => {

                    if (oInvoice.Year == oInvoiceYear && oInvoice.Month >= oInvoiceMonth || oInvoice.Year > oInvoiceYear) {

                        if (oInvoice.Month == oInvoiceMonth && oInvoice.Year == oInvoiceYear) {

                            const oAmount = oInvoice.TotalAmount || 0;

                            const oInvoiceIsPast =
                                (oInvoice.Year < oSystemYear) ||
                                (oInvoice.Year == oSystemYear && oInvoice.Month < oSystemMonth);

                            const oInvoiceIsFuture =
                                (oInvoice.Year > oSystemYear) ||
                                (oInvoice.Year == oSystemYear && oInvoice.Month > oSystemMonth);

                            oMonthExpenses = oMonthExpenses.plus(oAmount);

                            // Passado: tudo fechado e pago.
                            if (oInvoiceIsPast) {

                                oMonthExpensesClosed = oMonthExpensesClosed.plus(oAmount);
                                oMonthExpensesPayed = oMonthExpensesPayed.plus(oAmount);

                                // Futuro: nada vencido nem fechado ainda.
                            } else if (oInvoiceIsFuture) {

                                oTotalExpenses = oTotalExpenses.plus(oAmount);

                                // Mês corrente: o ciclo corrente dos cartões com
                                // referência deslocada está em aberto; nos demais,
                                // fechou (independente de vencer ou não) -> Closed,
                                // venceu -> Payed e o resto fica só no ToPay.
                            } else if (oShiftedReference) {

                                oTotalExpenses = oTotalExpenses.plus(oAmount);

                            } else {

                                if (oCardModel.ClosingDay <= oDay) {
                                    oMonthExpensesClosed = oMonthExpensesClosed.plus(oAmount);
                                }

                                if (oCardModel.DueDay < oDay) {
                                    oMonthExpensesPayed = oMonthExpensesPayed.plus(oAmount);
                                } else {
                                    oTotalExpenses = oTotalExpenses.plus(oAmount);
                                }

                            }

                        } else {
                            oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0)
                        }
                    }

                });

            };

            const oLiabilityIds = Liabilities
                .map(oLiability => oLiability.Id)
                .filter(Boolean);

            if (oLiabilityIds.length) {

                const oMonthStart =
                    `${oYear}-${this.addLeftZeros(oMonth)}-01`;

                const oLiabilityTransactions =
                    await this.LiabilityTransactionRepository.findByLiabilityIds(
                        oLiabilityIds,
                        undefined,
                        {
                            Type: 'IN',
                            Date: { '>=': oMonthStart }
                        }
                    ) || [];

                for (const oTransaction of oLiabilityTransactions) {

                    const oAmount =
                        oTransaction.Amount || new Decimal(0);

                    oTotalExpenses = oTotalExpenses.plus(oAmount);

                    const [oTrxYear, oTrxMonth] =
                        String(oTransaction.Date)
                            .split('-')
                            .map(Number) as [number, number];

                    if (oTrxYear === oYear && oTrxMonth === oMonth) {

                        oMonthExpenses = oMonthExpenses.plus(oAmount);

                        const oTrxIsPast =
                            (oTrxYear < oSystemYear) ||
                            (oTrxYear === oSystemYear && oTrxMonth < oSystemMonth);

                        const oTrxIsFuture =
                            (oTrxYear > oSystemYear) ||
                            (oTrxYear === oSystemYear && oTrxMonth > oSystemMonth);

                        if (oTrxIsPast) {
                            oMonthExpensesClosed = oMonthExpensesClosed.plus(oAmount);
                            oMonthExpensesPayed = oMonthExpensesPayed.plus(oAmount);
                        } else if (!oTrxIsFuture) {
                            oMonthExpensesPayed = oMonthExpensesPayed.plus(oAmount);
                        }

                    }

                }

            }

            // O valor a pagar do período é o que resta do total do mês
            // depois de descontar o que já venceu/pagou (inclui o fechado
            // e ainda não vencido, além do que está em aberto).
            oMonthExpensesToPay =
                oMonthExpenses.minus(oMonthExpensesPayed);

            return right({
                totalExpenses: oTotalExpenses,
                monthExpenses: oMonthExpenses,
                monthExpensesToPay: oMonthExpensesToPay,
                monthExpensesClosed: oMonthExpensesClosed,
                monthExpensesPayed: oMonthExpensesPayed
            });

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

        }

    }


    private validateDate(date: string): boolean {
        const dateCheck = new Date(date);
        return !isNaN(dateCheck.getTime());
    }


    private lastDayOfTheMonth(year: number, month: number) {

        const date = new Date(year, month, 0);

        return date.getDate();

    }


    private async checkPerson(Person: Person): Promise<Either<AbstractError, boolean>> {

        if (Person) {

            let oPerson = await this.Repository.findById(Person?.ID, true);

            if (oPerson && Person.Currency?.code) {

                let oCards = await this.CardRepository.findByPersonId(Person?.ID);

                if (oPerson.Currency?.Code != Person.Currency?.code && oCards?.length) {

                    const oStack = new Error().stack as string;

                    const message = this.getMessage('error.changeCurrencyNotPermited', ServiceLocator.getRequest());

                    return left(new PermissionDenied(message, 403, oStack));

                }
            }
        }

        if (Person.Email) {

            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!regex.test(Person.Email)) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.invalidEmail', ServiceLocator.getRequest());

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        // if (Person.Phone) {

        //     const regexPhone = /^\d{2}\d{2}9\d{8}$/;

        //     if (!regexPhone.test(Person.Phone)) {

        //         const oStack = new Error().stack as string;

        //         const message = this.getMessage('error.invalidPhone', ServiceLocator.getRequest());

        //         return left(new PermissionDenied(message, 403, oStack));

        //     }

        // }

        if (Person.Income) {

            if (Person.Income < 0) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.invalidIncome', ServiceLocator.getRequest());

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        if (Person.ExpenseTarget) {

            if (Person.ExpenseTarget < 0) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.invalidExpenseTarget', ServiceLocator.getRequest());

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        return right(true);

    }


    private async retrieveInvoice(Invoice: Invoice): Promise<Either<AbstractError, InvoiceModel>> {

        try {

            let oInvoices = await this.InvoiceRepository.findByCardID(
                Invoice.Card_ID || Invoice.Card?.ID,
                {
                    Year: Invoice?.Year,
                    Month: Invoice?.Month
                }
            ) as unknown as InvoiceModel[];

            if (!oInvoices) {

                if (!Invoice.Description && Invoice.Month) {

                    Invoice.Description = this.getMessage(`month.${Invoice.Month}`, ServiceLocator.getRequest());

                }

                if (!Invoice.ID) {
                    Invoice.ID = this.generateUUID();
                }

                oInvoices = await this.InvoiceRepository.createEntry(Invoice) as InvoiceModel[];

            }

            return right(oInvoices?.[0]);

        } catch (error) {

            const oErrorInstance = error as Error;
            return left(new AbstractError(oErrorInstance.message, 403, oErrorInstance.stack as string));

        }

    }


    private parseCardExpensesByCategoryFields(data: any) {

        const today = this.getBrazilDate();

        return {
            PersonId: data.PersonId || data.Person?.Id,
            CardId: data.Card?.Id || data.Invoice?.Card?.Id,
            InvoiceId: data.InvoiceId || data.Invoice?.Id,
            TotalOnwards: !!data.TotalOnwards,
            Month: Number(data.Month || today.month),
            Year: Number(data.Year || today.year)
        };
    }

    private validateCardExpensesByCategoriesInput(input:
        {
            CardId?: UUID,
            PersonId?: UUID,
            InvoiceId?: UUID,
            TotalOnwards: boolean
        }): Either<AbstractError, true> {

        if (
            !input.PersonId &&
            !input.CardId &&
            !input.InvoiceId
        ) {
            return this.fail(
                "error.fillAtLeastFieldsObrigatory",
                {
                    fields: "PersonId, CardId, InvoiceId"
                }
            );
        }

        if (
            input.TotalOnwards &&
            !input.PersonId &&
            !input.CardId
        ) {
            return this.fail(
                "error.fillAtLeastFieldsObrigatory",
                {
                    fields: "PersonId, CardId"
                }
            );
        }

        return right(true);
    }


    private async cardExpensesByCategoriesCheckAuthorization(
        input: { CardId?: UUID, PersonId?: UUID, InvoiceId?: UUID },
        user: any
    ): Promise<Either<AbstractError, true>> {

        const cardService =
            ServiceRegistry.get("Cards") as CardServiceImplementation;

        const invoiceService =
            ServiceRegistry.get("Invoices") as InvoiceServiceImplementation;

        const categoryService =
            ServiceRegistry.get("Categories") as CategoryServiceImplementation;

        if (input.PersonId) {

            const result =
                await this.afterRead(
                    [{ ID: input.PersonId }],
                    user
                );

            if (result.isLeft()) return result as any;
            else if (!result.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

            const categoryAuth =
                await categoryService.afterRead(
                    [{ Person: { ID: input.PersonId } }],
                    user
                );

            if (categoryAuth.isLeft()) return categoryAuth as any;
            else if (!result.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        if (input.CardId) {

            const result =
                await cardService.afterRead(
                    [{ ID: input.CardId }],
                    user
                );

            if (result.isLeft()) return result as any;
            else if (!result.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        if (input.InvoiceId) {

            const result =
                await invoiceService.afterRead(
                    [{ ID: input.InvoiceId }],
                    user
                );

            if (result.isLeft()) return result as any;
            else if (!result.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), this.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }
        }

        return right(true);

    }


    private async loadContext(input:
        {
            Year: number,
            Month: number,
            CardId?: UUID,
            PersonId?: UUID,
            InvoiceId?: UUID,
            TotalOnwards?: boolean
        }): Promise<{
            categories: CategoryModel[],
            cards: CardModel[],
            invoices: InvoiceModel[]
        }> {

        if (input.PersonId) {
            return this.loadByPerson(input);
        }

        if (input.CardId) {
            return this.loadByCard(input);
        }

        return this.loadByInvoice(input);
    }


    private async loadByPerson(input:
        {
            Year: number,
            Month: number,
            CardId?: UUID,
            PersonId?: UUID,
            InvoiceId?: UUID,
            TotalOnwards?: boolean
        }) {

        const categories =
            await this.CategoryRepository
                .findByPersonIds([input.PersonId]) || [];

        const cards =
            input.CardId && !input.TotalOnwards
                ? [CardModel.singleModel({ ID: input.CardId })]
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

        let invoices =
            await this.InvoiceRepository
                .findByCardIDs(
                    cards.map(card => card.Id),
                    filters
                ) || [];

        if (input.TotalOnwards) {

            invoices = invoices.filter(
                invoice =>
                    invoice.Year > input.Year ||
                    (
                        invoice.Year === input.Year &&
                        invoice.Month >= input.Month
                    )
            );
        }

        return {
            categories,
            cards,
            invoices
        };
    }


    private async loadByCard(input: {
        Year: number,
        Month: number,
        CardId?: UUID,
        PersonId?: UUID,
        InvoiceId?: UUID,
        TotalOnwards?: boolean
    }) {

        const card =
            await this.CardRepository
                .findById(input.CardId);

        if (!card) {
            return {
                categories: [],
                cards: [],
                invoices: []
            };
        }

        const categories =
            await this.CategoryRepository
                .findByPersonIds([card.Person?.Id]) || [];

        const filters = input.TotalOnwards
            ? { Year: { ">=": input.Year } }
            : {
                Year: input.Year,
                Month: input.Month
            };

        let invoices =
            await this.InvoiceRepository
                .findByCardIDs(
                    [card.Id],
                    filters
                ) || [];

        if (input.TotalOnwards) {

            invoices = invoices.filter(
                invoice =>
                    invoice.Year > input.Year ||
                    (
                        invoice.Year === input.Year &&
                        invoice.Month >= input.Month
                    )
            );
        }

        return {
            categories,
            cards: [card],
            invoices
        };
    }


    private async loadByInvoice(input:
        {
            CardId?: UUID,
            PersonId?: UUID,
            InvoiceId?: UUID
        }) {

        const invoice =
            await this.InvoiceRepository
                .findById(input.InvoiceId);

        if (!invoice) {
            return {
                categories: [],
                cards: [],
                invoices: []
            };
        }

        const cards =
            await this.CardRepository
                .findByInvoiceIds(input.InvoiceId);

        const card = cards?.[0];

        if (!card) {
            return {
                categories: [],
                cards: [],
                invoices: []
            };
        }

        const categories =
            await this.CategoryRepository
                .findByPersonIds([card.Person?.Id]) || [];

        return {
            categories,
            cards: [card],
            invoices: [invoice]
        };

    }


    private async buildSummary(
        categories: CategoryModel[],
        invoices: InvoiceModel[],
        user: any
    ): Promise<CardExpensesByCategoryReturnProperties> {

        const categoryService =
            ServiceRegistry.get("Categories") as CategoryServiceImplementation;

        const transactionService =
            ServiceRegistry.get("Transactions") as TransactionServiceImplementation;

        const categoryAuth =
            await categoryService.afterRead(
                [categories[0].toEntityObject()],
                user
            );

        if (categoryAuth.isLeft()) throw new Error(categoryAuth?.value?.message);
        else if (!categoryAuth.value?.length) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), categoryService.entityCode()) ||
                'error.modificationPermissionDenied';

            throw new PermissionDenied(message, 403, oStack);

        }

        const transactionAuth =
            await transactionService.afterRead(
                [{
                    Invoice: {
                        ID: invoices[0].Id
                    }
                }],
                user
            );

        if (transactionAuth.isLeft()) throw new Error(transactionAuth?.value?.message);
        else if (!transactionAuth.value?.length) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), transactionService.entityCode()) ||
                'error.modificationPermissionDenied';

            throw new PermissionDenied(message, 403, oStack);

        }

        const invoiceIds =
            invoices.map(item => item.Id);

        const totalModel =
            invoices.length === 1
                ? invoices[0]
                : await this.InvoiceRepository
                    .retrieveTotalAmountByIDs(invoiceIds) as InvoiceModel;

        const total =
            totalModel?.TotalAmount?.toDecimalPlaces(2) ||
            new Decimal(0);

        if (total.eq(0)) {
            return this.emptyResult();
        }

        const totalsByCategory = await this.TransactionRepository
            .retrieveTotalsGroupedByCategory(invoices.map(i => i.Id));

        const categoryResults = await Promise.all(

            categories.map(async category => {

                const result = totalsByCategory?.find(
                    t => t.Category?.Id === category.Id
                );

                const amount =
                    result?.TotalAmount?.toDecimalPlaces(2) ||
                    new Decimal(0);

                if (amount.eq(0)) return null;

                const item: CategoryExpenses = {
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

            })

        );

        const model =
            CardExpensesByCategoryModel.with({
                TotalAmount: total,
                Currency: invoices[0].Currency,
                Categories: categoryResults
                    .filter(Boolean)
                    .sort(
                        (a: any, b: any) =>
                            b.TotalAmount
                                .minus(a.TotalAmount)
                                .toNumber()
                    ) as CategoryExpenses[]
            });

        return model.toEntityObject();

    }


    private emptyResult(): CardExpensesByCategoryReturnProperties {

        return {
            TotalAmount: 0,
            Currency: {},
            Categories: []
        };

    }


    private buildImagePath(id: string): string {

        return `Categories(ID='${id}',IsActiveEntity=true)/Image`;

    }


    private getBrazilDate() {

        const date = new Date().toLocaleString(
            "pt-BR",
            {
                timeZone: "America/Sao_Paulo"
            }
        );

        const [rawDate] =
            date.replaceAll(",", "").split(" ");

        const [day, month, year] =
            rawDate.split("/").map(Number);

        return {
            day,
            month,
            year
        };

    }


    private fail(key: string, params?: any): Either<AbstractError, any> {

        const request =
            ServiceLocator.getRequest();

        const message =
            this.getMessage(
                key,
                request,
                undefined,
                params
            );

        const err =
            new Error(message);

        return left(
            new AbstractError(
                err.message,
                403,
                err.stack as string
            )
        );

    }


    private validateEmailConfiguration(request: any): void {

        if (!process.env.SMTPAddres ||
            !process.env.SMTPHost ||
            !process.env.SMTPKey) {

            throw new Error(
                this.getMessage(
                    'error.emailConfigNotFound',
                    request
                )
            );
        }
    }


    /**
     * SMTP + templates cache
    */
    private async initializeEmailInfrastructure(): Promise<void> {

        const cache = ServiceLocator.getEmailSendingCache();

        if (!cache._logoCache) {

            cache._logoCache = fs.readFileSync(
                path.join(__dirname, '../email/logo.png')
            );
        }

        if (!cache._mailTemplateCache) {

            const template = fs.readFileSync(
                path.join(__dirname, '../email/template.html'),
                'utf8'
            );

            cache._mailTemplateCache =
                handlebars.compile(template);
        }

        if (!cache._predictionTemplateCache) {

            const template = fs.readFileSync(
                path.join(__dirname, '../email/templatePrediction.html'),
                'utf8'
            );

            cache._predictionTemplateCache =
                handlebars.compile(template);
        }

        if (!cache._smtpInstance) {

            cache._smtpInstance =
                nodemailer.createTransport({
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


    private async loadPersonsImages(
        persons: PersonModel[]
    ): Promise<void> {

        const ids =
            persons
                .filter(p => p.ImageType)
                .map(p => p.Id);

        if (!ids.length) return;

        const images =
            await this.Repository.findImageByIds(ids) || [];

        const map = new Map(
            images.map(i => [i.ID, i.Image])
        );

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
    private async loadCardsImages(
        cards: CardModel[]
    ): Promise<void> {

        const ids =
            cards
                .filter(c => c.ImageType)
                .map(c => c.Id);

        if (!ids.length) return;

        const images =
            await this.CardRepository.findImageByIds(ids) || [];

        const map = new Map(
            images.map(i => [i.ID, i.Image])
        );

        for (const card of cards) {

            const img = map.get(card.Id);

            if (img) {
                card.Image = img;
            }
        }
    }


    private async getCategoryImageCached(
        categoryId: string | string[]
    ): Promise<Buffer | null> {

        const cache = ServiceLocator.getEmailSendingCache();

        if (!Array.isArray(categoryId)) {

            if (!categoryId) return null;

            const cached =
                cache._categoryImageCache.get(categoryId);

            if (cached) return cached;

        }

        const categoryIds = Array.isArray(categoryId) ? categoryId : [categoryId];

        const result =
            await this.CategoryRepository.findImageByIds(
                categoryIds
            ) || [];

        if (result.length == 1) {

            const image = result?.[0]?.Image;

            if (!image) return null;

            const buffer =
                await this.readableToBuffer(image);

            cache._categoryImageCache.set(
                result?.[0]?.ID,
                buffer as any
            );

            return buffer as any;

        } else {

            for (const categoryImage of result) {

                const buffer =
                    await this.readableToBuffer(categoryImage?.Image);

                cache._categoryImageCache.set(
                    categoryImage?.ID,
                    buffer as any
                );

            }

            return null;

        }

    }


    private extractSimulationInput(request: any) {

        return {
            PersonId: request?.data?.PersonId,
            Year: Number(request?.data?.Year),
            Month: Number(request?.data?.Month)
        };

    }


    private async validateSimulationInput(
        input: {
            PersonId: string,
            Year: number,
            Month: number
        },
        request: any
    ): Promise<Either<AbstractError, {
        person: PersonModel,
        cards: CardModel[]
    }>> {

        const missing: string[] = [];

        if (!input.PersonId) missing.push("PersonId");
        if (!input.Year) missing.push("Year");
        if (!input.Month) missing.push("Month");

        if (missing.length) {
            return left(
                this.buildValidationError(
                    request,
                    missing.join(", ")
                )
            );
        }

        if (input.Month < 1 || input.Month > 12) {
            return left(
                this.buildValidationError(
                    request,
                    "Month"
                )
            );
        }

        const person = await this.Repository.findById(input.PersonId);

        if (!person) {
            return left(
                this.buildValidationError(
                    request,
                    "Person?.Id"
                )
            );
        }

        const authCheck = await this.afterRead(
            [{ ID: input.PersonId }],
            request?.user
        );

        if (authCheck.isLeft()) {
            return authCheck as any;
        } else if (!authCheck.value?.length) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), this.entityCode()) ||
                'error.modificationPermissionDenied';

            return left(new PermissionDenied(message, 403, oStack));

        }

        const cardService = ServiceRegistry.get("Cards") as CardServiceImplementation;

        const cards =
            await this.CardRepository.findByPersonIds([input.PersonId]) || [];

        const authCardCheck = await cardService.afterRead(
            [{ Person: { ID: input.PersonId } }],
            request?.user
        );

        if (authCardCheck.isLeft()) {
            return authCardCheck as any;
        } else if (!authCardCheck.value?.length) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), cardService.entityCode()) ||
                'error.modificationPermissionDenied';

            return left(new PermissionDenied(message, 403, oStack));

        }

        if (cards?.length) {

            const invoiceService = ServiceRegistry.get("Invoices") as InvoiceServiceImplementation;

            const authInvoiceCheck = await invoiceService.afterRead(
                [{ Card: { ID: cards[0].Id } }],
                request?.user
            );

            if (authInvoiceCheck.isLeft()) {
                return authInvoiceCheck as any;
            } else if (!authInvoiceCheck.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), invoiceService.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        return right({
            person,
            cards
        });

    }


    private async loadInvoicesForSimulation(
        cardIds: string[],
        year: number
    ): Promise<InvoiceModel[]> {

        if (!cardIds.length) return [];

        return await this.InvoiceRepository.findByCardIDs(
            cardIds,
            {
                Year: { ">=": year }
            }
        ) || [];

    }


    private calculateSimulationTotals(
        invoices: InvoiceModel[],
        targetYear: number,
        targetMonth: number
    ): {
        totalFuture: Decimal,
        totalMonth: Decimal
    } {

        let totalFuture = new Decimal(0);
        let totalMonth = new Decimal(0);

        for (const invoice of invoices) {

            const isFutureOrCurrent =
                invoice.Year > targetYear ||
                (
                    invoice.Year === targetYear &&
                    invoice.Month >= targetMonth
                );

            if (!isFutureOrCurrent) continue;

            totalFuture = totalFuture.plus(
                invoice.TotalAmount || 0
            );

            const isTargetMonth =
                invoice.Year === targetYear &&
                invoice.Month === targetMonth;

            if (isTargetMonth) {
                totalMonth = totalMonth.plus(
                    invoice.TotalAmount || 0
                );
            }

        }

        return {
            totalFuture,
            totalMonth
        };

    }


    private buildSimulationResult(
        person: PersonModel,
        totalFuture: Decimal,
        totalMonth: Decimal
    ): SimulateExpenseModel {

        const target = person?.ExpenseTarget || new Decimal(0);

        const currency =
            person?.Currency?.toEntityObject()
            || { code: "BRL" };

        return SimulateExpenseModel.with({

            TotalAmount: totalFuture,

            TotalMonth: totalMonth,

            AmountSaving: target.minus(totalMonth),

            Currency: CurrencyModel.singleModel(currency)

        });

    }


    private buildEmptySimulation(
        person: PersonModel
    ): SimulateExpenseModel {

        const currency =
            person?.Currency?.toEntityObject()
            || { code: "BRL" };

        return SimulateExpenseModel.with({
            TotalAmount: new Decimal(0),
            TotalMonth: new Decimal(0),
            AmountSaving: person?.ExpenseTarget || new Decimal(0),
            Currency: CurrencyModel.singleModel(currency)
        });

    }


    private buildValidationError(
        request: any,
        fields: string
    ): AbstractError {

        const error = new Error(
            this.getMessage(
                "error.invalidFields",
                request,
                undefined,
                { fields }
            )
        );

        return new AbstractError(
            error.message,
            403,
            error.stack as string
        );

    }


    private handleSimulationError(
        error: any
    ): Either<AbstractError, any> {

        const err = error as Error;

        return left(
            new AbstractError(
                err.message,
                403,
                err.stack as string
            )
        );

    }


    private futureKey(year: number, month: number): string {
        return `${year}-${String(month).padStart(2, "0")}`;
    }


    private futureAddTimeline(
        map: Map<string, Decimal>,
        key: string,
        amount: any
    ) {
        const current = map.get(key) || new Decimal(0);
        map.set(key, current.plus(amount || 0));
    }


    private isBeforeOrEqual(
        year: number,
        month: number,
        targetYear: number,
        targetMonth: number
    ): boolean {

        if (year < targetYear) return true;
        if (year === targetYear && month <= targetMonth) return true;
        return false;
    }


    private monthDiffFromNow(
        targetYear: number,
        targetMonth: number
    ): number {

        const now = new Date();

        const y = now.getFullYear();
        const m = now.getMonth() + 1;

        return (
            (targetYear - y) * 12 +
            (targetMonth - m) + 1
        );
    }


    private calculateRisk(
        targetDebt: Decimal,
        targetLimit: Decimal
    ): "LOW" | "MEDIUM" | "HIGH" {

        if (targetLimit.lte(0)) return "HIGH";

        const ratio =
            targetDebt.div(targetLimit).mul(100);

        if (ratio.lte(60)) return "LOW";
        if (ratio.lte(100)) return "MEDIUM";

        return "HIGH";
    }


    private detectPendingInstallments(
        transactions: TransactionModel[]
    ) {

        const result: any[] = [];

        for (const tx of transactions) {

            if (
                Number(tx.TotalInstallments) > 1 &&
                Number(tx.Installment) <
                Number(tx.TotalInstallments)
            ) {

                const remaining =
                    Number(tx.TotalInstallments) -
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


    private detectRecurringExpenses(
        transactions: TransactionModel[]
    ) {

        const map = new Map<string, any[]>();

        for (const tx of transactions) {

            if (
                Number(tx.TotalInstallments) !== 1 ||
                !tx.Identifier
            ) continue;

            if (!map.has(tx.Identifier)) {
                map.set(tx.Identifier, []);
            }

            map.get(tx.Identifier)!.push(tx);
        }

        const result: any[] = [];

        for (const [identifier, items] of map) {

            if (items.length <= 1) continue;

            let max = new Decimal(0);

            for (const tx of items) {
                if (new Decimal(tx.Amount).gt(max)) {
                    max = new Decimal(tx.Amount);
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


    private buildFutureRecommendations(
        risk: string,
        recurringCount: number,
        installmentPending: Decimal,
        targetDebt: Decimal,
        targetLimit: Decimal
    ): FinancialRecommendation[] {

        const result: FinancialRecommendation[] = [];

        if (risk === "HIGH") {
            result.push({
                Type: "WARNING",
                Message:
                    "Seu mês alvo está acima da meta financeira."
            });
        }

        if (recurringCount > 5) {
            result.push({
                Type: "INFO",
                Message:
                    `Você possui ${recurringCount} despesas fixas detectadas.`
            });
        }

        if (installmentPending.gt(0)) {
            result.push({
                Type: "INFO",
                Message:
                    "Installmentmentos futuros impactarão Monthes seguintes."
            });
        }

        if (targetDebt.lt(targetLimit)) {
            result.push({
                Type: "SUCCESS",
                Message:
                    "Sua projeção está dentro da meta mensal."
            });
        }

        return result;
    }


    private buildEmptyFuture(person: any): FinancialFutureReturn {

        return {
            KPIs: {
                TotalDebtUntilTarget: 0,
                TargetMonthDebt: 0,
                RecurringMonthlyAverage: 0,
                InstallmentPending: 0,
                FixedExpensesDetected: 0,
                FreeCashFlow:
                    person?.ExpenseTarget?.toNumber?.() || 0,
                SavingGap:
                    person?.ExpenseTarget?.toNumber?.() || 0,
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


    private buildFutureError(
        message: string
    ): AbstractError {

        const err = new Error(message);

        return new AbstractError(
            err.message,
            403,
            err.stack as string
        );
    }


    private async loadTransactionsByCardsFallback(
        cardIds: string[]
    ): Promise<any[]> {

        const invoices =
            await this.InvoiceRepository.findByCardIDs(cardIds);

        if (!invoices?.length) return [];

        return await this.TransactionRepository
            .findByInvoiceIds(
                invoices.map((i: any) => i.Id)
            ) || [];
    }


    private validateRetrieveTransactionsByCategoryInput(data: any):
        Either<AbstractError, {
            PersonId: string,
            CategoryId: string,
            Total: boolean,
            Month?: number,
            Year?: number
        }> {

        const request = ServiceLocator.getRequest();

        const required: string[] = [];

        if (!data.Person?.Id) required.push('PersonId');
        if (!data.CategoryId) required.push('CategoryId');

        if (required.length) {

            const err = new Error(
                this.getMessage(
                    'error.invalidFields',
                    request,
                    undefined,
                    { fields: required.join(', ') }
                )
            );

            return left(
                new AbstractError(
                    err.message,
                    403,
                    err.stack as string
                )
            );

        }

        const now = this.getBrazilDate();

        return right({
            PersonId: data.PersonId,
            CategoryId: data.CategoryId,
            Total: !!data.Total,
            Month: Number(data.Month || now.month),
            Year: Number(data.Year || now.year)
        });

    }


    private async authorizeRetrieveTransactionsByCategory(
        user: any,
        PersonId: string,
        CategoryId: string
    ): Promise<Either<AbstractError, boolean>> {

        const resultPerson = await this.afterRead(
            [{ ID: PersonId }],
            user
        );

        if (resultPerson.isLeft()) return resultPerson as any;
        else if (!resultPerson.value?.length) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), this.entityCode()) ||
                'error.modificationPermissionDenied';

            return left(new PermissionDenied(message, 403, oStack));

        }

        const categoryService =
            ServiceRegistry.get('Categories') as CategoryServiceImplementation;

        if (categoryService) {

            const resultCategory = await categoryService.afterRead(
                [{ ID: CategoryId }],
                user
            );

            if (resultCategory.isLeft()) return resultCategory as any;
            else if (!resultCategory.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), categoryService.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        return right(true);

    }


    private async authorizeAnalyticsObjects(
        user: any,
        cards: CardModel[],
        invoices: InvoiceModel[],
        transactions: TransactionModel[]
    ): Promise<Either<AbstractError, boolean>> {

        const cardService =
            ServiceRegistry.get('Cards') as CardServiceImplementation;

        const invoiceService =
            ServiceRegistry.get('Invoices') as InvoiceServiceImplementation;

        const transactionService =
            ServiceRegistry.get('Transactions') as TransactionServiceImplementation;

        if (cardService) {
            const result = await cardService.afterRead([cards?.[0]?.toEntityObject()], user);
            if (result.isLeft()) return result as any;
            else if (!result.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), cardService.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }
        }

        if (invoiceService) {

            const result = await invoiceService.afterRead([invoices?.[0]?.toEntityObject()], user);
            if (result.isLeft()) return result as any;
            else if (!result.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), invoiceService.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        if (transactionService) {

            const result = await transactionService.afterRead([transactions?.[0]?.toEntityObject()], user);
            if (result.isLeft()) return result as any;
            else if (!result.value?.length) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), transactionService.entityCode()) ||
                    'error.modificationPermissionDenied';

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        return right(true);

    }


    private async resolveInvoicesScope(
        cardIds: string[],
        Total: boolean,
        Month: number,
        Year: number
    ): Promise<InvoiceModel[]> {

        if (!Total) {

            return await this.InvoiceRepository.findByCardIDs(
                cardIds,
                {
                    Month,
                    Year
                }
            ) || [];

        }

        const invoices =
            await this.InvoiceRepository.findByCardIDs(
                cardIds,
                {
                    Year: { '>=': Year }
                }
            ) || [];

        return invoices.filter(
            invoice =>
                invoice.Year > Year ||
                (invoice.Year === Year && invoice.Month >= Month)
        );

    }


    private buildCategoryTransactionResponse(
        category: CategoryModel,
        cards: CardModel[],
        invoices: InvoiceModel[],
        transactions: TransactionModel[]
    ): CategoryTransactionsReturnProperties {

        const invoicesByCard = new Map<string, InvoiceModel[]>();
        const transactionsByInvoice = new Map<string, TransactionModel[]>();

        for (const invoice of invoices) {

            if (!invoice?.Card) continue;

            if (!invoicesByCard.has(invoice.Card?.Id)) {
                invoicesByCard.set(invoice.Card?.Id, []);
            }

            invoicesByCard.get(invoice.Card?.Id)!.push(invoice);

        }

        for (const transaction of transactions) {

            if (!transaction?.Invoice) continue;

            if (!transactionsByInvoice.has(transaction.Invoice?.Id)) {
                transactionsByInvoice.set(transaction.Invoice?.Id, []);
            }

            transactionsByInvoice.get(transaction.Invoice?.Id)!.push(transaction);

        }

        let totalAmount = 0;

        let cardsReturn = cards.map((card) => {

            const cardInvoices = invoicesByCard.get(card.Id) || [];

            let invoicesReturn = cardInvoices.map((invoice) => {

                const invoiceTransactions =
                    transactionsByInvoice.get(invoice.Id) || [];

                if (invoiceTransactions.length) {

                    const invoiceTotal =
                        invoiceTransactions.reduce(
                            (sum, item) =>
                                sum + Number(item.Amount?.toNumber() || 0),
                            0
                        );

                    totalAmount += invoiceTotal;

                    return {
                        ID: invoice.Id,
                        Year: invoice.Year,
                        Month: invoice.Month,
                        Description:
                            invoice.Description ||
                            this.getMessage(
                                `month.${invoice.Month}`,
                                ServiceLocator.getRequest()
                            ),
                        TotalAmount: invoiceTotal,
                        Transactions: invoiceTransactions.map(
                            item => item.toEntityObject()
                        )
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
                    TotalAmount:
                        invoicesReturn.reduce(
                            (sum, inv) => sum + (inv as any).TotalAmount,
                            0
                        ),
                    Invoices: invoicesReturn
                };

            }

        }).filter(Boolean);

        const model =
            CategoryTransactionsModel.singleModel({
                ID: category.Id,
                Name: category.Name,
                ImagePath: category.ImageType
                    ? `Categories(ID='${category.Id}',IsActiveEntity=true)/Image`
                    : undefined,
                Currency: { code: cards[0].Currency.Code },
                TotalAmount: totalAmount,
                Cards: cardsReturn as any
            });

        return model.toEntityObject();

    }


    private emptyCategoryTransactionsResponse():
        CategoryTransactionsReturnProperties {

        return {
            ID: '',
            Name: '',
            Currency: { code: 'BRL' },
            TotalAmount: 0,
            Cards: []
        };

    }


    private async authorizeCompleteInvoiceObjects(
        rows: any[],
        user: any
    ): Promise<Either<AbstractError, boolean>> {

        const cardService =
            ServiceRegistry.get('Cards') as CardServiceImplementation;

        const invoiceService =
            ServiceRegistry.get('Invoices') as InvoiceServiceImplementation;

        const transactionService =
            ServiceRegistry.get('Transactions') as TransactionServiceImplementation;

        const categoryService =
            ServiceRegistry.get('Categories') as CategoryServiceImplementation;

        const cards = [
            ...new Map(
                rows.map(r => [r.CardID, { ID: r.CardID }])
            ).values()
        ];

        const invoices = [
            ...new Map(
                rows.map(r => [r.InvoiceID, { ID: r.InvoiceID, Card: { ID: r.CardID } }])
            ).values()
        ];

        const transactions = [
            ...new Map(
                rows.map(r => [r.TransactionID, { ID: r.TransactionID, Invoice: { ID: r.InvoiceID } }])
            ).values()
        ];

        const categories = [
            ...new Map(
                rows
                    .filter(r => r.CategoryID)
                    .map(r => [r.CategoryID, { ID: r.CategoryID }])
            ).values()
        ];

        const resultAuthCard = await cardService.afterRead([cards[0]] as any, user);

        if (resultAuthCard.isLeft()) return resultAuthCard as any;
        else if (!resultAuthCard.value?.length) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), cardService.entityCode()) ||
                'error.modificationPermissionDenied';

            return left(new PermissionDenied(message, 403, oStack));

        }

        const resultAuthInvoice = await invoiceService.afterRead([invoices[0]] as any, user);

        if (resultAuthInvoice.isLeft()) return resultAuthInvoice as any;
        else if (!resultAuthInvoice.value?.length) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), invoiceService.entityCode()) ||
                'error.modificationPermissionDenied';

            return left(new PermissionDenied(message, 403, oStack));

        }

        const resultAuthTransaction = await transactionService.afterRead([transactions[0]] as any, user);

        if (resultAuthTransaction.isLeft()) return resultAuthTransaction as any;
        else if (!resultAuthTransaction.value?.length) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), transactionService.entityCode()) ||
                'error.modificationPermissionDenied';

            return left(new PermissionDenied(message, 403, oStack));

        }

        if (!categories.length) return right(true);

        const resultAuthCategory = await categoryService.afterRead([categories[0]] as any, user);

        if (resultAuthCategory.isLeft()) return resultAuthCategory as any;
        else if (!resultAuthCategory.value?.length) {

            const oStack = new Error().stack as string;

            const message = this.getMessage('error.modificationPermissionDenied', ServiceLocator.getRequest(), categoryService.entityCode()) ||
                'error.modificationPermissionDenied';

            return left(new PermissionDenied(message, 403, oStack));

        }

        return right(true);
    }


}