import { AbstractError } from "@/errors";
import { Persons, Person, Cards, Invoice, Transaction } from "@models/apps/dflc/gestordegastos/entities";
import { Either, right, left } from "@sweet-monads/either";
import { PersonService } from "./protocols";
import { PersonModel } from "@/models/person";
import Decimal from "decimal.js";
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
import axios from "axios";
import { InvoiceModel } from "@/models/invoice";
import { TransactionModel } from "@/models/transaction";

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


    // public async addCardExpense(): Promise<Either<AbstractError, boolean>> {

    //     const request = ServiceLocator.getRequest();

    //     let { CardId, CategoryId, Description, Value, Currency, TransactionDate, Installments, FixedExpense } = request.data;

    //     const obrigatoryFields: string[] = [];

    //     if (!CardId) obrigatoryFields.push('CardId')
    //     if (!CategoryId) obrigatoryFields.push('CategoryId')
    //     if (!Description) obrigatoryFields.push('Description')
    //     if (!Value) obrigatoryFields.push('Value')
    //     if (!Currency) obrigatoryFields.push('Currency')
    //     if (!TransactionDate) obrigatoryFields.push('TransactionDate')
    //     if (!Installments) obrigatoryFields.push('Installments')

    //     if (obrigatoryFields.length) {

    //         const message = this.getMessage('error.invalidFields', request, undefined, { fields: obrigatoryFields.join(', ') });

    //         const errorInstance: Error = new Error(message) as Error;

    //         return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

    //     }

    //     if (!this.validateDate(TransactionDate)) {

    //         const message = this.getMessage('error.invalidDate', request, undefined, { date: TransactionDate });

    //         const errorInstance: Error = new Error(message) as Error;

    //         return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

    //     }

    //     let oCard = await this.CardRepository.findById(CardId);

    //     if (!oCard) {

    //         const errorInstance: Error = new Error('error.invalidCard') as Error;

    //         return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

    //     }

    //     let oCategory = await this.CategoryRepository.findById(CategoryId);

    //     if (!oCategory) {

    //         const errorInstance: Error = new Error('error.invalidCategory') as Error;

    //         return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

    //     }

    //     //Checa autorização de permissão para editar Invoices e Transactions
    //     const invoiceService = ServiceRegistry.get('Invoices') as InvoiceServiceImplementation;
    //     const transactionService = ServiceRegistry.get('Transactions') as TransactionServiceImplementation;

    //     if (!invoiceService || !transactionService) {

    //         const errorInstance: Error = new Error('error.unknownError') as Error;

    //         return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

    //     }

    //     const oInvoiceToCheck: Invoice = {
    //         ID: this.generateUUID(),
    //         Card_ID: CardId,
    //         Card: { ID: CardId }
    //     }

    //     const resultCheckInvoice = await invoiceService.beforeUpdate(oInvoiceToCheck, request?.user);

    //     if (resultCheckInvoice.isLeft()) return resultCheckInvoice;

    //     const oTransactionCheck: Transaction = {
    //         ID: this.generateUUID(),
    //         Invoice_ID: oInvoiceToCheck.ID,
    //         Invoice: { ID: oInvoiceToCheck.ID }
    //     }

    //     const resultCheckTransaction = await transactionService.beforeCreate(oTransactionCheck, request?.user);

    //     if (resultCheckTransaction.isLeft()) return resultCheckTransaction;

    //     let oActualDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    //     oActualDate = oActualDate.replaceAll(",", " ");
    //     let [oActualDay, oActualMonth, oActualYear]: any[] = oActualDate.split(" ")[0].split("/");

    //     oActualDay = Number(oActualDay);
    //     oActualMonth = Number(oActualMonth);
    //     oActualYear = Number(oActualYear);

    //     const oExpenseDate = new Date(`${TransactionDate}T00:00:00`);
    //     const oExpenseYear = oExpenseDate.getFullYear();       // Retorna 2025
    //     const oExpenseMonth = Number(String(oExpenseDate.getMonth() + 1).padStart(2, "0")); // Retorna 01 (mês é zero-based)
    //     const oExpenseDay = Number(String(oExpenseDate.getDate()).padStart(2, "0"));

    //     let oInvoiceYear = oExpenseYear;
    //     let oInvoiceMonth = oExpenseMonth;

    //     //Realiza cálculo de cotação se necessário
    //     if (Currency != oCard?.Currency?.Code) {

    //         try {
    //             const response = await axios.get(`https://api.fxratesapi.com/latest?base=${Currency}&amount=${Value}`);

    //             Value = response.data?.rates[oCard.Currency?.Code];

    //         } catch (error) {

    //             const errorInstance: Error = error as Error;
    //             return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

    //         }

    //     }

    //     if (oCard.ClosingDay > oCard.DueDay) {

    //         if (oInvoiceMonth == 12) {
    //             oInvoiceMonth = 1;
    //             oInvoiceYear += 1;
    //         } else {
    //             oInvoiceMonth += 1;
    //         }

    //     }

    //     try {

    //         if (oCard.ClosingDay > 28) {

    //             if (!this.validateDate(`${oInvoiceYear}-${oInvoiceMonth}-${oCard.ClosingDay}`)) {
    //                 oCard.ClosingDay = this.lastDayOfTheMonth(oActualYear, oActualMonth - 1);
    //             }

    //         }

    //     } catch (error) {

    //         const errorInstance: Error = error as Error;
    //         return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

    //     }

    //     if (oCard.ClosingDay <= oExpenseDay) {

    //         if (oInvoiceMonth == 12) {
    //             oInvoiceMonth = 1;
    //             oInvoiceYear += 1;
    //         } else {
    //             oInvoiceMonth += 1;
    //         }

    //     }

    //     let oInstallmentFixed = 1;

    //     if (FixedExpense) {

    //         oInstallmentFixed = (12 - oInvoiceMonth) + 1;

    //     }

    //     try {

    //         let oInstallment = 0;
    //         let oValue = new Decimal(Value).div(Installments).toDecimalPlaces(2);;// (Math.round(((Value / Installments) + Number.EPSILON) * 100) / 100);
    //         let oDiference = (oValue.mul(Installments).minus(new Decimal(Value))).toDecimalPlaces(2);;
    //         let oFirstInstallmentValue = oValue.minus(oDiference).toDecimalPlaces(2);
    //         let oExpenseIdentifier = this.generateUUID();
    //         let invoiceData: Invoice = {
    //             Year: oInvoiceYear,
    //             Month: oInvoiceMonth,
    //             TotalAmount: oFirstInstallmentValue.toNumber(),
    //             Currency: oCard.Currency.toEntityObject(),
    //             Card: { ID: oCard.Id }
    //         };

    //         let resultInvoice = await this.retrieveInvoice(invoiceData);

    //         if (resultInvoice.isLeft()) return resultInvoice as any;

    //         let oInvoice = resultInvoice.value;

    //         do {

    //             let oValueInstallment = oFirstInstallmentValue;
    //             oInstallment += 1;

    //             if (oInstallment > 1) {

    //                 oValueInstallment = oValue;

    //                 if (oInvoiceMonth == 12) {
    //                     oInvoiceMonth = 1;
    //                     oInvoiceYear += 1;
    //                 } else {
    //                     oInvoiceMonth += 1;
    //                 }

    //                 invoiceData = {
    //                     Year: oInvoiceYear,
    //                     Month: oInvoiceMonth,
    //                     TotalAmount: oValueInstallment.toNumber(),
    //                     Currency: oCard.Currency.toEntityObject(),
    //                     Card: { ID: oCard.Id }
    //                 };

    //                 resultInvoice = await this.retrieveInvoice(invoiceData);

    //                 if (resultInvoice.isLeft()) return resultInvoice as any;

    //                 oInvoice = resultInvoice.value;

    //             }

    //             let oParcelaTransacao = oInstallment;

    //             if (FixedExpense) {
    //                 oParcelaTransacao = 1
    //             }

    //             let oNewTransaction: Transaction = {
    //                 Identifier: oExpenseIdentifier,
    //                 Date: TransactionDate,
    //                 TotalAmount: Value,
    //                 Amount: oValueInstallment.toNumber(),
    //                 Currency: oCard.Currency.toEntityObject(),
    //                 TotalInstallments: Installments,
    //                 Installment: oParcelaTransacao,
    //                 Description: Description,
    //                 Category: { ID: oCategory?.Id },
    //                 Invoice: { ID: oInvoice.Id }
    //             }

    //             let oTransactions = await this.TransactionRepository.createEntry(oNewTransaction) as TransactionModel[];

    //             let oTransaction = oTransactions[0];

    //             if (!oInvoice.TotalAmount.eq(oValueInstallment)) {
    //                 await this.InvoiceRepository.updateTotalAmountByTransactionId(oTransaction.Id);
    //             }

    //         } while (oInstallment < Installments || oInstallment < oInstallmentFixed);

    //         return right(true)

    //     } catch (error) {

    //         const errorInstance: Error = error as Error;
    //         return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

    //     }

    // }


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

            await this.validateAddExpensePermissions(input.CardId, request.user);

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


    private async validateAddExpensePermissions(
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

            let oDia = Number(day);
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
                            if (oCardModel.ClosingDay > oDia) {
                                oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice?.TotalAmount || 0)
                                oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0)
                            } else if (oCardModel.DueDay >= oDia) {
                                oMonthExpensesClosed = oMonthExpensesClosed.plus(oInvoice.TotalAmount || 0)
                                oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount || 0)
                            } else {
                                oMonthExpensesPayed = oMonthExpensesPayed.plus(oInvoice.TotalAmount || 0)
                            }
                        } else if (oInvoice.Year == oNextYear && oInvoice.Month == oNextMonth && oCardModel.ClosingDay <= oDia) {
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

            let oInvoice = await this.InvoiceRepository.findByCardID(
                Invoice.Card_ID || Invoice.Card?.ID,
                {
                    Year: Invoice?.Year,
                    Month: Invoice?.Month
                }
            ) as unknown as InvoiceModel;

            if (!oInvoice) {

                if (!Invoice.Description && Invoice.Month) {

                    Invoice.Description = this.getMessage(`month.${Invoice.Month}`, ServiceLocator.getRequest());

                }

                if (!Invoice.ID) {
                    Invoice.ID = this.generateUUID();
                }

                const oInvoices = await this.InvoiceRepository.createEntry(Invoice) as InvoiceModel[];

                oInvoice = oInvoices[0];
            }

            return right(oInvoice);

        } catch (error) {

            const oErrorInstance = error as Error;
            return left(new AbstractError(oErrorInstance.message, 403, oErrorInstance.stack as string));

        }

    }


}