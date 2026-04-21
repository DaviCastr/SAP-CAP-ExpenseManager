import { AbstractError } from "@/errors";
import { Persons, Person, Cards, Invoice, Transaction } from "@models/apps/dflc/gestordegastos/entities";
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
import { CardExpensesByCategoryModel, CardExpensesByCategoryReturnProperties, CategoryExpenses } from "@/models/card-expenses-by-category";
import { CategoryServiceImplementation } from "../category/implementation";
import { PassThrough } from "stream";
import cds from "@sap/cds";
import Decimal from "decimal.js";
import axios from "axios";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import { error } from "console";


export class PersonServiceImplementation extends BaseServiceImplementation<Person> implements PersonService {

    public Repository: PersonRepository;

    constructor(
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
        Repository: PersonRepository,
        private readonly CategoryRepository: CategoryRepository,
        private readonly CardRepository: CardRepository,
        private readonly InvoiceRepository: InvoiceRepository,
        private readonly TransactionRepository: TransactionRepository
    ) {

        super(Repository, ShareRepository, EntityRepository);

        this.Repository = Repository;

    }


    public async beforeCreate(Person: Person, User: User): Promise<Either<AbstractError, boolean>> {

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

            const mapCards = new Map<string, any[]>();

            for (const card of cardsByPerson) {
                if (!mapCards.has(card?.PersonId)) {
                    mapCards.set(card?.PersonId, []);
                }
                mapCards.get(card.PersonId)!.push(card.toEntityObject());
            }

            for (let Person of oPersonsFiltered) {


                const oPersonModel = PersonModel.singleModel(Person);

                if ('Image' in Person ||
                    (
                        !('TotalExpenses' in Person) &&
                        !('TotalExpensesMonth' in Person) &&
                        !('AmountToSave' in Person) &&
                        !('TotalExpensesToPay' in Person) &&
                        !('TotalExpensesClosed' in Person) &&
                        !('TotalExpensesPayed' in Person)
                    )
                ) {

                    oPersonsData.push({
                        ...oPersonModel.toEntityObject(),
                    });
                    continue;

                }

                const oCards = mapCards.get(oPersonModel?.Id) as Cards;
                const oExpensesResult = await this.recoverExpenses(oCards);
                let oExpenses: {
                    totalExpenses: Decimal,
                    monthExpenses: Decimal,
                    monthExpensesToPay: Decimal,
                    monthExpensesClosed: Decimal,
                    monthExpensesPayed: Decimal
                }

                if (oExpensesResult?.isLeft()) {

                    oPersonsData.push({
                        ...oPersonModel.toEntityObject(),
                    });
                    continue;

                }

                oExpenses = oExpensesResult?.isRight() ? oExpensesResult.value : {} as any;

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


    // public async sendInvoices(): Promise<Either<AbstractError, boolean>> {

    //     try {

    //         const request = ServiceLocator.getRequest();

    //         if (!process.env.SMTPAddres) {

    //             const errorInstance = new Error(this.getMessage('error.emailConfigNotFound', request)) as Error;

    //             return left(
    //                 new AbstractError(
    //                     errorInstance.message,
    //                     403,
    //                     errorInstance.stack as string
    //                 )
    //             );

    //         }

    //         let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    //         oDate = oDate.replaceAll(",", " ");
    //         let [oDay, oMonth, oYear]: any[] = oDate.split(" ")[0].split("/");

    //         oDay = Number(oDay);
    //         oMonth = Number(oMonth);
    //         oYear = Number(oYear);

    //         const oPersons = await this.Repository.findAll({ Email: { '!=': null } }) || [];

    //         if (!oPersons.length) {

    //             const errorInstance = new Error(this.getMessage('error.emailNotFound', request)) as Error;

    //             return left(
    //                 new AbstractError(
    //                     errorInstance.message,
    //                     403,
    //                     errorInstance.stack as string
    //                 )
    //             );

    //         }

    //         const oCards = await this.CardRepository.findByPersonIds(oPersons?.map((item) => item?.Id), {
    //             DueDay: { '>=': oDay }
    //         }) || [];

    //         if (!oCards.length) {

    //             const errorInstance = new Error(this.getMessage('error.cardsNotFound', request)) as Error;

    //             return left(
    //                 new AbstractError(
    //                     errorInstance.message,
    //                     403,
    //                     errorInstance.stack as string
    //                 )
    //             );

    //         }

    //         let oInvoices = await this.InvoiceRepository.findByCardIDs(oCards.map((item) => item.Id), {
    //             Year: oYear,
    //             Month: oMonth,
    //             InvoiceSent: { '!=': true }
    //         }) || [];

    //         if (!oInvoices.length) {

    //             const errorInstance = new Error(this.getMessage('error.invoicesNotFound', request)) as Error;

    //             return left(
    //                 new AbstractError(
    //                     errorInstance.message,
    //                     403,
    //                     errorInstance.stack as string
    //                 )
    //             );

    //         }

    //         for (let oPerson of oPersons) {

    //             let oCardsOfPerson = oCards.filter(CardId => CardId.PersonId == oPerson.Id);

    //             for (let oCard of oCardsOfPerson) {

    //                 let oInvoicesByCard = oInvoices.filter(fatura => fatura.CardId == oCard.Id);

    //                 for (let oInvoice of oInvoicesByCard) {

    //                     if ((oCard.DueDay - oDay) <= 5) {

    //                         let oTransactions = await this.TransactionRepository.findByInvoiceIds([oInvoice.Id]) || [];

    //                         if (oTransactions.length > 0) {

    //                             if (oPerson.ImageType) {

    //                                 let oImageResults = await this.Repository.findImageByIds([oPerson.Id]) || [];
    //                                 let oImagePerson = oImageResults?.[0];

    //                                 if (oImagePerson?.Image) {

    //                                     oPerson.Image = oImagePerson.Image;

    //                                 }

    //                             }

    //                             if (oCard?.ImageType) {

    //                                 let oImageResults = await this.CardRepository.findImageByIds([oCard.Id]) || [];

    //                                 let oImageCard = oImageResults?.[0];

    //                                 if (oImageCard?.Image) {

    //                                     oCard.Image = oImageCard.Image;

    //                                 }

    //                             }


    //                             let result = await this.sendEmail(oPerson, oCard, oInvoice, oTransactions, true);

    //                             return result;

    //                         }

    //                     }

    //                 }

    //             }

    //         }

    //         return right(true);

    //     } catch (error) {

    //         const errorInstance = error as Error;
    //         return left(
    //             new AbstractError(
    //                 errorInstance.message,
    //                 403,
    //                 errorInstance.stack as string
    //             )
    //         );

    //     }

    // }


    public async sendInvoices(): Promise<Either<AbstractError, boolean>> {

        try {

            const request = ServiceLocator.getRequest();

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
                return right(true);
            }

            const cards = await this.CardRepository.findByPersonIds(
                persons.map(p => p.Id),
                { DueDay: { '>=': today.day } }
            ) || [];

            if (!cards.length) {
                return right(true);
            }

            const invoices = await this.InvoiceRepository.findByCardIDs(
                cards.map(c => c.Id),
                {
                    Year: today.year,
                    Month: today.month,
                    InvoiceSent: { '!=': true }
                }
            ) || [];

            if (!invoices.length) {
                return right(true);
            }

            const transactions = await this.TransactionRepository.findByInvoiceIds(
                invoices.map(i => i.Id)
            ) || [];

            await this.loadPersonsImages(persons);
            await this.loadCardsImages(cards);
            await this.initializeEmailInfrastructure();

            const cardsByPerson = new Map<string, CardModel[]>();

            for (const card of cards) {

                if (!cardsByPerson.has(card.PersonId)) {
                    cardsByPerson.set(card.PersonId, []);
                }

                cardsByPerson.get(card.PersonId)!.push(card);
            }

            const invoicesByCard = new Map<string, InvoiceModel[]>();

            for (const invoice of invoices) {

                if (!invoicesByCard.has(invoice.CardId)) {
                    invoicesByCard.set(invoice.CardId, []);
                }

                invoicesByCard.get(invoice.CardId)!.push(invoice);
            }

            const transactionsByInvoice = new Map<string, TransactionModel[]>();

            for (const trx of transactions) {

                if (!transactionsByInvoice.has(trx.InvoiceId)) {
                    transactionsByInvoice.set(trx.InvoiceId, []);
                }

                transactionsByInvoice.get(trx.InvoiceId)!.push(trx);
            }

            const cache = ServiceLocator.getEmailSendingCache();

            for (const person of persons) {

                const personCards = cardsByPerson.get(person.Id) || [];

                if (!personCards.length) continue;

                const invoicesToSend: InvoiceModel[] = [];
                const attachments: any[] = [];

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
                            InvoiceId: invoice.Id
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

                const template = Year || Month ? cache._predictionTemplateCache : cache._mailTemplateCache;

                const html = template({
                    Name: person.Name,
                    Year: today.year,
                    Month: this.addLeftZeros(today.month),
                    TotalAmount: totalAmount.toNumber(),
                    Currency: currency,
                    InvoiceCount: invoicesToSend.length,
                    Cards: invoicesToSend.map(inv => {

                        const card =
                            personCards.find(c => c.Id === inv.CardId);

                        return {
                            CardName: card?.Name,
                            DueDate:
                                `${this.addLeftZeros(card?.DueDay || 0)}/` +
                                `${this.addLeftZeros(inv.Month)}/${inv.Year}`,
                            Amount: inv.TotalAmount.toNumber(),
                            Currency: inv.Currency?.Code
                        };

                    })
                });

                await cache._smtpInstance.sendMail({
                    from: `"Gestor de Gastos" <${process.env.SMTPAddres}>`,
                    to: person.Email,
                    subject:
                        Year || Month
                            ? `Previsão/Detalhamento de duas faturas de ${this.addLeftZeros(today.month)}/${today.year}`
                            : `Suas faturas de ${this.addLeftZeros(today.month)}/${today.year}`,
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


    private validateAddCardExpenseInput(input: any, request: any): void {

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


    private async sendEmail(
        Person: PersonModel,
        Card: CardModel,
        Invoice: InvoiceModel,
        Transactions: TransactionModel[],
        updateInvoice: boolean
    ): Promise<Either<AbstractError, boolean>> {

        try {

            let oPathHtmlFile: string;

            if (updateInvoice) {
                oPathHtmlFile = path.join(__dirname, '../email/template.html');
            } else {
                oPathHtmlFile = path.join(__dirname, '../email/templatePrediction.html');
            }

            const oHtmlTemplate = fs.readFileSync(oPathHtmlFile, "utf-8");

            const oLogoPath = path.join(__dirname, '../email/logo.png');
            const oLogo = fs.readFileSync(oLogoPath);

            const oTemplateHTML = handlebars.compile(oHtmlTemplate);
            const oHtmlContent = oTemplateHTML({
                Name: Person?.Name,
                CardName: Card?.Name,
                Year: Invoice?.Year,
                Month: Invoice?.Month,
                Amount: Invoice.TotalAmount?.toNumber() || 0,
                Currency: Invoice?.Currency?.Code,
                DueDate: `${this.addLeftZeros(Card?.DueDay)}/${this.addLeftZeros(Invoice?.Month)}/${Invoice?.Year}`,
            });

            ServiceLocator.setRequestData({ InvoiceId: Invoice?.Id });

            let oCardExpensesByCategoriesResult = await this.cardExpensesByCategories();

            if (oCardExpensesByCategoriesResult?.isLeft()) return oCardExpensesByCategoriesResult as any;

            const result = oCardExpensesByCategoriesResult.value;
            const oCardExpensesByCategories = CardExpensesByCategoryModel.singleModel(result as CardExpensesByCategoryReturnProperties);

            let oPDFResult = await this.generatePDF(oLogo, Person, Invoice, Card, Transactions, oCardExpensesByCategories);

            if (oPDFResult.isLeft()) return oPDFResult as any;

            let oPDFBuffer = oPDFResult.value as Buffer;

            let oFiles: any[] = []

            if (oLogo) {
                oFiles.push({ content: oLogo, filename: `logo.png`, cid: 'Logo' })
            }

            if (oPDFBuffer) {
                oFiles.push({ content: oPDFBuffer, filename: `${Card?.Name}.pdf`, cid: '' })
            }

            if (Person?.Image) {
                const oImage = await this.readableToBuffer(Person?.Image);
                oFiles.push({ content: oImage, filename: `${Person?.Name}.${Person?.ImageType}`, cid: 'PersonImage' })
            }

            let oSubject: string;

            if (updateInvoice) {
                oSubject = `Fatura do Cartão ${Card?.Name} - ${this.addLeftZeros(Invoice?.Month)}/${Invoice?.Year}`;
            } else {
                oSubject = `Previsão/Detalhamento da fatura do Cartão ${Card.Name} - ${this.addLeftZeros(Invoice.Month)}/${Invoice.Year}`
            }

            const oEmailOptions = {
                from: `"Gestor de Gastos" <${process.env.SMTPAddres}>`,
                to: Person?.Email,
                subject: oSubject,
                html: oHtmlContent,
                attachments: oFiles
            };

            const resultEmailSending = await this.processSendEmail(oEmailOptions, Invoice.Id, updateInvoice);

            if (resultEmailSending.isLeft()) return resultEmailSending as any;

            return right(true);

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


    private async processSendEmail(
        content: {},
        InvoiceId: string,
        updateInvoice: boolean): Promise<Either<AbstractError, boolean>> {

        try {

            const context = cds.context;

            if (!(context as any)?.EmailInstance) {
                (context as any).EmailInstance = this.createEmailInstance();
                await (context as any).EmailInstance.verify();
                console.log('Conexão com o servidor SMTP bem-sucedida.');
            }

            const result = await new Promise((resolve, reject) => {
                (context as any).EmailInstance.sendMail(content).then(async (ok) => {
                    console.log('Email enviado com sucesso:');

                    if (updateInvoice) {
                        await this.InvoiceRepository.update(InvoiceId, { InvoiceSent: true });
                    }

                    await this.sleep(5000);

                    resolve(true)
                }).catch(function (erro) {
                    console.log('Erro ao enviar email:' + erro);
                    reject(erro)
                });
            });

            if (result != true) {
                throw result;
            }

            return right(true);

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


    private createEmailInstance() {

        return nodemailer.createTransport({
            host: process.env.SMTPHost,
            port: 587, // TLS
            secure: false, // Use false para TLS
            auth: {
                user: process.env.SMTPAddres,
                pass: process.env.SMTPKey
            }
        });

    }


    private async generatePDF(
        Logo: Buffer,
        Person: PersonModel,
        Invoice: InvoiceModel,
        Card: CardModel,
        Transactions: TransactionModel[],
        CardExpensesByCategory: CardExpensesByCategoryModel
    ): Promise<Either<AbstractError, Buffer>> {

        try {

            const result = await new Promise(async (resolve, reject) => {

                const doc = new PDFDocument({
                    size: "A4",
                    margin: 40,
                });

                const oPrimaryColor = "#085caf";
                const oTextColor = "#333333";

                const oBufferArray: any[] = [];
                const oBufferStream = new PassThrough();

                oBufferStream.on('data', (chunk) => oBufferArray.push(chunk));
                oBufferStream.on('end', () => resolve(Buffer?.concat(oBufferArray) as any));
                oBufferStream.on('error', (err) => reject(`Erro no stream: ${err}`));

                doc.pipe(oBufferStream);

                const designHeader = (initialPage = false) => {
                    if (!initialPage) doc.addPage();

                    // Cabeçalho estilizado com Image à esquerda
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
                        .text("Gestor de Gastos", 40, 30, { align: "center" });

                    doc.moveDown(2);
                };

                const designFooter = () => {

                    let verticalPosition = doc.page.height - 70;

                    doc
                        .rect(0, verticalPosition, doc.page.width, 80)
                        .fill(oPrimaryColor)

                };

                const designInvoiceSummary = async () => {
                    const oMonthDescription = this.getMessage(`month.${Invoice?.Month}`, ServiceLocator.getRequest());

                    if (Card?.Image) {
                        const diameter = 120;
                        const x = (doc.page.width - diameter) / 2;
                        const y = 100;
                        const oImage = await this.readableToBuffer(Card?.Image);
                        doc
                            .save()
                            .circle(x + diameter / 2, y + diameter / 2, diameter / 2)
                            .clip()
                            .image(oImage as Buffer, x, y, { width: diameter, height: diameter })
                            .restore();
                    }

                    doc.moveDown(3);
                    doc
                        .fillColor(oTextColor)
                        .fontSize(22)
                        .text(`${Person?.Name}, a sua fatura do cartão ${Card?.Name}`, { align: "center" });

                    doc.moveDown(2);
                    doc
                        .rect(40, doc.y, doc.page.width - 80, 100)
                        .strokeColor(oPrimaryColor)
                        .lineWidth(2)
                        .stroke();

                    doc
                        .fillColor(oTextColor)
                        .fontSize(20)
                        .text("Total da sua fatura:", 60, doc.y + 10, { align: "left" });

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
                        .text(`Ano: ${Invoice?.Year}`, { align: "left" })
                        .text(`Data de Vencimento: ${this.addLeftZeros(Card?.DueDay)}/${this.addLeftZeros(Invoice?.Month)}/${Invoice?.Year}`, { align: "left" });

                    doc
                        .moveDown(2)
                        .fillColor("black")
                        .fontSize(20)
                        .text("Fatura gerada automaticamente", 45, doc.y, { align: "center" });;

                };

                const designCategoriesSummary = async () => {

                    doc
                        .fillColor(oPrimaryColor)
                        .fontSize(20)
                        .text("Gastos por categoria", doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });

                    // Define as posições fixas das colunas
                    const positions = {
                        image: 60,
                        name: 90,
                        totalCategory: 280,
                        percent: 440,
                    };

                    doc.moveDown(2);

                    // Cabeçalho da tabela
                    let verticalPosition = doc.y;

                    doc
                        .fontSize(16)
                        .text("", positions.image, verticalPosition, { width: 100 })
                        .text("Nome", positions.name, verticalPosition, { width: 200 })
                        .text("Total da Categoria", positions.totalCategory, verticalPosition, { width: 150 })
                        .text("Porcentagem", positions.percent, verticalPosition, { width: 100 });

                    verticalPosition += 25; // Espaço após o cabeçalho

                    // Adiciona uma linha horizontal abaixo do cabeçalho
                    doc
                        .moveTo(60, verticalPosition - 6)
                        .lineTo(560, verticalPosition - 6)
                        .strokeColor(oPrimaryColor)
                        .lineWidth(1)
                        .stroke();

                    // Renderiza as transações em formato de tabela
                    let index = 0;
                    for (const category of CardExpensesByCategory.Categories) {

                        doc.moveDown(2);

                        verticalPosition += 15

                        if (category?.ImagePath) {

                            const diameter = 26;
                            const x = positions.image;
                            const y = verticalPosition - 10;
                            const oImageBuffer = await this.getCategoryImageCached(category?.ID);

                            doc
                                .save()
                                .circle(x + diameter / 2, y + diameter / 2, diameter / 2)
                                .clip()
                                .image(oImageBuffer as Buffer, x, y, { width: diameter, height: diameter })
                                .restore();

                        }

                        doc
                            .fillColor(oTextColor)
                            .fontSize(12)
                            .text(category.Name, positions.name, verticalPosition, { width: 200 })
                            .text(`${category.TotalAmount?.toNumber()} ${CardExpensesByCategory?.Currency?.Code}`, positions.totalCategory, verticalPosition, { width: 130, align: "right" })
                            .text(`${Number(category.Percent?.toNumber()).toFixed(2)}%`, positions.percent, verticalPosition, { width: 95, align: "right" });

                        // Adiciona uma linha horizontal abaixo de cada transação
                        verticalPosition += 25;
                        doc
                            .moveTo(60, verticalPosition - 5)
                            .lineTo(560, verticalPosition - 5)
                            .strokeColor("#CCCCCC")
                            .lineWidth(0.5)
                            .stroke();

                        if ((index + 1) % 15 === 0) { // Adiciona nova página se necessário
                            designFooter();
                            designHeader();
                            verticalPosition = doc.y + 20; // Reinicia a posição vertical na nova página
                        }

                        index++;

                    };

                };

                const designTransactions = () => {
                    // Centraliza o título
                    doc
                        .fillColor(oPrimaryColor)
                        .fontSize(20)
                        .text("Gastos da Fatura", doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });

                    doc.moveDown(1);

                    // Centraliza o título
                    doc
                        .fillColor(oPrimaryColor)
                        .fontSize(18)
                        .text(`Quantidade de gastos totais: ${Transactions.length}`, doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });

                    doc.moveDown(1);

                    // Ordena as transações pela data
                    Transactions.sort((a, b) => (new Date(a.Date) as any) - (new Date(b.Date) as any));

                    // Define as posições fixas das colunas
                    const positions = {
                        data: 60,
                        description: 140,
                        category: 340,
                        parcela: 440,
                        valor: 460,
                    };

                    // Cabeçalho da tabela
                    let verticalPosition = doc.y;

                    doc
                        .fontSize(16)
                        .text("Data", positions.data, verticalPosition, { width: 100 })
                        .text("Descrição", positions.description, verticalPosition, { width: 200 })
                        .text("Categoria", positions.category, verticalPosition, { width: 100 })
                        .text("Parcela", positions.parcela, verticalPosition, { width: 100 })
                        .text("Valor", positions.valor, verticalPosition, { width: 100, align: "right" });

                    verticalPosition += 20; // Espaço após o cabeçalho

                    // Adiciona uma linha horizontal abaixo do cabeçalho
                    doc
                        .moveTo(60, verticalPosition - 6)
                        .lineTo(560, verticalPosition - 6)
                        .strokeColor(oPrimaryColor)
                        .lineWidth(1)
                        .stroke();

                    // Renderiza as transações em formato de tabela
                    Transactions.forEach((transaction, index) => {
                        doc.moveDown(2);
                        const oExpenseDate = new Date(`${transaction?.Date}T00:00:00`);
                        const oYearTransacao = oExpenseDate.getFullYear();
                        const oMonthTransacao = String(oExpenseDate.getMonth() + 1).padStart(2, "0");
                        const oDayTransacao = String(oExpenseDate.getDate()).padStart(2, "0");

                        let oCategory = CardExpensesByCategory.Categories.filter(category => category.ID == transaction.CategoryId);
                        let oCategoryName: string;
                        if (oCategory.length > 0) {
                            oCategoryName = oCategory[0].Name;
                        } else {
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

                        // Adiciona uma linha horizontal abaixo de cada transação
                        verticalPosition += 15;
                        doc
                            .moveTo(60, verticalPosition - 5)
                            .lineTo(560, verticalPosition - 5)
                            .strokeColor("#CCCCCC")
                            .lineWidth(0.5)
                            .stroke();

                        if ((index + 1) % 30 === 0) { // Adiciona nova página se necessário
                            designFooter();
                            designHeader();
                            verticalPosition = doc.y + 20; // Reinicia a posição vertical na nova página
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


    protected personPath(): string[] {

        return [];

    }


    protected entityCode(): number {

        return 1;

    }


    protected parentField(): string | null {
        return 'ID';
    }


    private async recoverExpenses(Cards: Cards): Promise<Either<AbstractError, {
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

            const cardIds = Cards.map(c => c.ID);

            const invoicesByCard = await this.InvoiceRepository.findByCardIDs(cardIds, { Year: { '>=': oYear } }) || [];

            const mapInvoices = new Map<string, any[]>();

            for (const inv of invoicesByCard) {
                if (!mapInvoices.has(inv?.CardId)) {
                    mapInvoices.set(inv?.CardId, []);
                }
                mapInvoices.get(inv.CardId)!.push(inv);
            }

            for (let Card of Cards) {

                if (!('ClosingDay' in Card) || !('DueDay' in Card)) {

                    continue;

                }

                const oCardModel = CardModel.singleModel(Card);

                let oInvoiceMonth = oMonth;
                let oInvoiceYear = oYear;

                if (oCardModel.ClosingDay > oCardModel.DueDay) {

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

                let oNextMonth = oInvoiceMonth;
                let oNextYear = oInvoiceYear;

                if (oInvoiceMonth < 12) {
                    oNextMonth += 1;
                } else {
                    oNextMonth = 1
                    oNextYear += 1
                }

                const oInvoices = mapInvoices.get(oCardModel.Id) || [];

                oInvoices?.forEach(oInvoice => {

                    if (oInvoice.Year == oInvoiceYear && oInvoice.Month >= oInvoiceMonth || oInvoice.Year > oInvoiceYear) {

                        if (oInvoice.Month == oInvoiceMonth && oInvoice.Year == oInvoiceYear) {
                            oMonthExpenses = oMonthExpenses.plus(oInvoice.TotalAmount || 0);
                            if (oCardModel.ClosingDay > oDay) {
                                oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice?.TotalAmount || 0)
                                oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0)
                            } else if (oCardModel.DueDay >= oDay) {
                                oMonthExpensesClosed = oMonthExpensesClosed.plus(oInvoice.TotalAmount || 0)
                                oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0)
                            } else {
                                oMonthExpensesPayed = oMonthExpensesPayed.plus(oInvoice.TotalAmount || 0)
                            }
                        } else if (oInvoice.Year == oNextYear && oInvoice.Month == oNextMonth && oCardModel.ClosingDay <= oDay) {
                            oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice.TotalAmount || 0)
                            oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0)
                        } else {
                            oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0)
                        }
                    }

                });

            };

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

        if (Person.Phone) {

            const regexPhone = /^\d{2}\d{2}9\d{8}$/;

            if (!regexPhone.test(Person.Phone)) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.invalidPhone', ServiceLocator.getRequest());

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

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
            PersonId: data.PersonId,
            CardId: data.CardId,
            InvoiceId: data.InvoiceId,
            TotalOnwards: !!data.TotalOnwards,
            Month: Number(data.Month || today.month),
            Year: Number(data.Year || today.year)
        };
    }

    private validateCardExpensesByCategoriesInput(input: any): Either<AbstractError, true> {

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
        input: any,
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

            const categoryAuth =
                await categoryService.afterRead(
                    [{ Person: { ID: input.PersonId } }],
                    user
                );

            if (categoryAuth.isLeft()) return categoryAuth as any;
        }

        if (input.CardId) {

            const result =
                await cardService.afterRead(
                    [{ ID: input.CardId }],
                    user
                );

            if (result.isLeft()) return result as any;
        }

        if (input.InvoiceId) {

            const result =
                await invoiceService.afterRead(
                    [{ ID: input.InvoiceId }],
                    user
                );

            if (result.isLeft()) return result as any;
        }

        return right(true);

    }


    private async loadContext(input: any): Promise<{
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


    private async loadByPerson(input: any) {

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


    private async loadByCard(input: any) {

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
                .findByPersonIds([card.PersonId]) || [];

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


    private async loadByInvoice(input: any) {

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
                .findByPersonIds([card.PersonId]) || [];

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
                    t => t.CategoryId === category.Id
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
        categoryId: string
    ): Promise<Buffer | null> {

        if (!categoryId) return null;

        const cache = ServiceLocator.getEmailSendingCache();

        const cached =
            cache._categoryImageCache.get(categoryId);

        if (cached) return cached;

        const result =
            await this.CategoryRepository.findImageByIds(
                [categoryId]
            ) || [];

        const image = result?.[0]?.Image;

        if (!image) return null;

        const buffer =
            await this.readableToBuffer(image);

        cache._categoryImageCache.set(
            categoryId,
            buffer as any
        );

        return buffer as any;

    }


}