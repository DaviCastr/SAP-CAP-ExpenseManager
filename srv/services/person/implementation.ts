import { AbstractError } from "@/errors";
import { Persons, Person, Cards, Invoice, Transaction, Card, Categories } from "@models/apps/dflc/gestordegastos/entities";
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
import { CategoryModel } from "@/models/category";
import { CardServiceImplementation } from "../card/implementation";
import { CardExpensesByCategoryModel, CardExpensesByCategoryProperties, CardExpensesByCategoryReturnProperties, CategoryExpenses } from "@/models/card-expenses-by-category";
import { CategoryServiceImplementation } from "../category/implementation";

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


    public async sendInvoices(): Promise<Either<AbstractError, boolean>> {

        return right(true);

        // if (!process.env.SMTPAddres) {
        //     return
        // }

        // let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        // oDate = oDate.replaceAll(",", " ");
        // let [oDay, oMonth, oYear] = oDate.split(" ")[0].split("/");

        // oDay = Number(oDay);
        // oMonth = Number(oMonth);
        // oYear = Number(oYear);

        // try {

        //     const { Pessoa, Cartao, Fatura, Transacao } = this.entities

        //     const oPessoas = await SELECT.from(Pessoa).columns('ID', 'Nome', 'Email').where({ Email: { '!=': null } });

        //     if (!oPessoas.length > 0) {
        //         return;
        //     }

        //     const oCards = await SELECT.from(Cartao).columns('ID', 'NomeCartao', 'DiaVencimento', 'Pessoa_ID').where({
        //         DiaVencimento: { '>=': oDay }
        //     });

        //     if (!oCards.length > 0) {
        //         return;
        //     }

        //     let oInvoices = await SELECT.from(Fatura).where({
        //         Year: oYear,
        //         Month: oMonth
        //     });

        //     oInvoices = oInvoices.filter(fatura => fatura.AvisoEnviado === false || fatura.AvisoEnviado === null);

        //     if (!oInvoices.length > 0) {
        //         return;
        //     }

        //     for (let oPessoa of oPessoas) {

        //         let oCartoesDaPessoa = oCards.filter(CardId => CardId.Pessoa_ID == oPessoa.ID);

        //         for (let oCard of oCartoesDaPessoa) {

        //             let oFaturasCartao = oInvoices.filter(fatura => fatura.Cartao_ID == oCard.ID);

        //             for (let oInvoice of oFaturasCartao) {

        //                 oCard.DiaVencimento = Number(oCard.DiaVencimento);

        //                 if ((oCard.DiaVencimento - oDay) <= 3) {

        //                     let oTransacoes = await SELECT.from(Transacao).where({ Fatura_ID: oInvoice.ID });

        //                     if (oTransacoes.length > 0) {

        //                         try {

        //                             if (!oPessoa.Imagem) {

        //                                 const tx = cds.tx();

        //                                 let oImagemPessoa = await tx.run(SELECT.one.from(Pessoa).columns('Imagem', 'TipoImagem').where({
        //                                     ID: oPessoa.ID
        //                                 }));

        //                                 if (oImagemPessoa.Imagem) {

        //                                     let oImagemBuffer = await this.ReadableParaBuffer(oImagemPessoa.Imagem);

        //                                     const oExtensao = oImagemPessoa.TipoImagem.split("/")[1];

        //                                     //const oCaminhoImagem = path.join(__dirname, `${oPessoa.Nome}_.${oExtensao}`);

        //                                     // Salva o buffer no disco como um arquivo de imagem
        //                                     //fs.writeFileSync(oCaminhoImagem, oImagemBuffer);

        //                                     oPessoa.Imagem = oImagemBuffer;
        //                                     //oPessoa.CaminhoImagem = oCaminhoImagem;
        //                                     oPessoa.ExtensaoImagem = oExtensao;

        //                                 }

        //                             }

        //                         } catch (error) {
        //                             console.log("erro: " + error);
        //                             return error;
        //                         }

        //                         try {

        //                             const tx = cds.tx();

        //                             let oImagemCartao = await tx.run(SELECT.one.from(Cartao).columns('Imagem', 'TipoImagem').where({
        //                                 ID: oCard.ID
        //                             }));

        //                             if (oImagemCartao.Imagem) {

        //                                 let oImagemBuffer = await this.ReadableParaBuffer(oImagemCartao.Imagem);

        //                                 oCard.Imagem = oImagemBuffer;

        //                             }

        //                         } catch (error) {
        //                             console.log("erro: " + error);
        //                         }

        //                         let erro = await this.enviarEmail(oPessoa, oCard, oInvoice, oTransacoes, true);


        //                         if (erro) {
        //                             return erro;
        //                         }

        //                     }

        //                 }

        //             }

        //         }

        //     }

        // } catch (erro) {
        //     console.log("Erro:" + erro)
        //     return erro;
        // }

    }


    // public async cardExpensesByCategories(): Promise<Either<AbstractError, CardExpensesByCategoryReturnProperties>> {

    //     try {

    //         const request = ServiceLocator.getRequest();
    //         let { PersonId, CardId, InvoiceId, Month, Year, TotalOnwards } = request.data;

    //         const required: string[] = [];

    //         if (!PersonId && !CardId && !InvoiceId) {

    //             required.push('PersonId');
    //             required.push('CardId');
    //             required.push('InvoiceId');

    //             const message = this.getMessage(
    //                 'error.fillAtLeastFieldsObrigatory',
    //                 request,
    //                 undefined,
    //                 { fields: required.join(', ') }
    //             )
    //             const err = new Error(message) as Error;

    //             return left(
    //                 new AbstractError(
    //                     err.message,
    //                     403,
    //                     err.stack as string
    //                 ));

    //         }

    //         if (TotalOnwards && !PersonId) {

    //             required.push('PersonId');

    //             const message = this.getMessage(
    //                 'error.fillAtLeastFieldsObrigatory',
    //                 request,
    //                 undefined,
    //                 { fields: required.join(', ') }
    //             )
    //             const err = new Error(message) as Error;

    //             return left(
    //                 new AbstractError(
    //                     err.message,
    //                     403,
    //                     err.stack as string
    //                 ));

    //         }

    //         if (PersonId) {

    //             const oPersonCheckAuthorization: Person = {
    //                 ID: PersonId
    //             }

    //             const resultCheck = await this.afterRead([oPersonCheckAuthorization], request?.user);

    //             if (resultCheck.isLeft()) {

    //                 return resultCheck as any;

    //             }

    //         }


    //         if (CardId) {

    //             const oCardCheckAuthorization: Person = {
    //                 ID: PersonId
    //             }

    //             const cardService = ServiceRegistry.get('Cards') as CardServiceImplementation;
    //             const resultCheck = await cardService.afterRead([oCardCheckAuthorization], request?.user);

    //             if (resultCheck.isLeft()) {

    //                 return resultCheck as any;

    //             }

    //         }


    //         if (InvoiceId) {

    //             const oInvoiceCheckAuthorization: Person = {
    //                 ID: PersonId
    //             }

    //             const cardService = ServiceRegistry.get('Cards') as CardServiceImplementation;
    //             const resultCheck = await cardService.afterRead([oInvoiceCheckAuthorization], request?.user);

    //             if (resultCheck.isLeft()) {

    //                 return resultCheck as any;

    //             }

    //         }

    //         let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    //         oDate = oDate.replaceAll(",", " ");
    //         let [oDay, oMonth, oYear]: any[] = oDate.split(" ")[0].split("/");

    //         oDay = Number(oDay);
    //         oMonth = Number(oMonth);
    //         oYear = Number(oYear);

    //         if (Month) {
    //             oMonth = Number(Month);
    //             oYear = Number(Year);
    //         }

    //         let oCategories: CategoryModel[] = [];
    //         let oCards: CardModel[] = [];
    //         let oInvoices: InvoiceModel[] = []
    //         let oTotalExpenses: InvoiceModel;

    //         if (PersonId) {

    //             oCategories = await this.CategoryRepository.findByPersonIds([PersonId]) || [];

    //             if (CardId && !TotalOnwards) {
    //                 oCards.push(CardModel.singleModel({ ID: CardId }));
    //             } else {
    //                 oCards = await this.CardRepository.findByPersonIds([PersonId]) || [];
    //             }

    //             if (!oCards?.length) {

    //                 return right({
    //                     TotalAmount: 0,
    //                     Currency: {},
    //                     Categories: []
    //                 });

    //             }

    //             const additionalFiltersInvoices = TotalOnwards ?
    //                 {
    //                     Year: { '>=': oYear }
    //                 } :
    //                 {
    //                     Year: oYear,
    //                     Month: oMonth
    //                 };

    //             oInvoices = await this.InvoiceRepository.findByCardIDs(
    //                 oCards.map(f => f.Id),
    //                 additionalFiltersInvoices
    //             ) || [];

    //             if (TotalOnwards) {

    //                 oInvoices = oInvoices.filter(invoice => invoice.Year > oYear || invoice.Year == oYear && invoice.Month >= oMonth);

    //             }

    //         } else if (CardId) {

    //             let oCard = await this.CardRepository.findById(CardId);

    //             if (oCard) {

    //                 oCategories = await this.CategoryRepository.findByPersonIds([oCard.PersonId]) || [];
    //                 oCards.push(CardModel.singleModel({ ID: CardId }));

    //                 oInvoices = await this.InvoiceRepository.findByCardIDs(
    //                     oCards.map(f => f.Id),
    //                     {
    //                         Year: oYear,
    //                         Month: oMonth,
    //                     }
    //                 ) || [];

    //             } else {

    //                 return right({
    //                     TotalAmount: 0,
    //                     Currency: {},
    //                     Categories: []
    //                 });

    //             }

    //         } else {

    //             let oInvoice = await this.InvoiceRepository.findById(InvoiceId);

    //             if (oInvoice) {

    //                 oInvoices.push(oInvoice);

    //                 let oCards = await this.CardRepository.findByInvoiceIds(InvoiceId);
    //                 let oCard = oCards?.[0];

    //                 if (oCard) {

    //                     oCategories = await this.CategoryRepository.findByPersonIds([oCard.PersonId]) || [];

    //                 }

    //                 if (!oCategories?.length) {

    //                     return right({
    //                         TotalAmount: 0,
    //                         Currency: {},
    //                         Categories: []
    //                     });

    //                 }

    //             } else {

    //                 return right({
    //                     TotalAmount: 0,
    //                     Currency: {},
    //                     Categories: []
    //                 });

    //             }

    //         }

    //         if (!oInvoices?.length) {
    //             return right({
    //                 TotalAmount: 0,
    //                 Currency: {},
    //                 Categories: []
    //             });
    //         }

    //         if (oInvoices?.length == 1) {

    //             oTotalExpenses = oInvoices[0];

    //         } else {

    //             oTotalExpenses = await this.InvoiceRepository.retrieveTotalAmountByIDs(
    //                 oInvoices.map(f => f.Id)) as InvoiceModel;

    //         }

    //         const totalExpenseAmount: Decimal = oTotalExpenses?.TotalAmount?.toDecimalPlaces(2) || new Decimal(0);

    //         if (totalExpenseAmount.eq(0)) {

    //             return right({
    //                 TotalAmount: 0,
    //                 Currency: {},
    //                 Categories: []
    //             });

    //         }

    //         const oCardExpenseByCategory: CardExpensesByCategoryProperties = {
    //             TotalAmount: totalExpenseAmount,
    //             Currency: oInvoices?.[0].Currency,
    //             Categories: []
    //         };

    //         for (let category of oCategories) {

    //             const totalByCategory = await this.TransactionRepository.retrieveTotalAmountByInvoiceIds(
    //                 oInvoices.map(f => f.Id),
    //                 {
    //                     Category_ID: category.Id
    //                 }
    //             );

    //             const totalAmountByCategory = totalByCategory?.TotalAmount || new Decimal(0);

    //             if (!totalAmountByCategory.eq(0)) {

    //                 const newCategory: CategoryExpenses = {
    //                     ID: category?.Id,
    //                     Name: category?.Name,
    //                     TotalAmount: totalAmountByCategory?.toDecimalPlaces(2),
    //                     Percent: totalExpenseAmount.gt(0) ? totalAmountByCategory.div(totalExpenseAmount).mul(100)?.toDecimalPlaces(2) : new Decimal(0)
    //                 }

    //                 if (category.ImageType) {

    //                     newCategory.ImagePath = `Categories(ID='${newCategory?.ID}',IsActiveEntity=true)/Image`

    //                 }

    //                 oCardExpenseByCategory?.Categories?.push(newCategory);

    //             }

    //         }

    //         const oReturn: CardExpensesByCategoryModel = CardExpensesByCategoryModel.with(oCardExpenseByCategory);

    //         return right(oReturn.toEntityObject());

    //     } catch (error) {

    //         const err = error as Error;

    //         return left(
    //             new AbstractError(
    //                 err.message,
    //                 403,
    //                 err.stack as string
    //             )
    //         );

    //     }

    // }


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


    // async enviarEmail(PersonId, CardId, fatura, transacoes, atualizaFatura) {

    //         try {

    //             let oCaminhoHTML;

    //             if (atualizaFatura) {
    //                 oCaminhoHTML = path.join(__dirname, 'template.html');
    //             } else {
    //                 oCaminhoHTML = path.join(__dirname, 'templatePrevisao.html');
    //             }

    //             const oHtmlTemplate = fs.readFileSync(oCaminhoHTML, "utf-8");

    //             const oLogoCaminho = path.join(__dirname, 'logo.png');
    //             const oLogo = fs.readFileSync(oLogoCaminho);

    //             const oTemplateHTML = handlebars.compile(oHtmlTemplate);
    //             const oConteudohtml = oTemplateHTML({
    //                 nome: PersonId.Nome,
    //                 nomecartao: CardId.NomeCartao,
    //                 Year: fatura.Year,
    //                 Month: fatura.Month,
    //                 valor: fatura.ValorTotal,
    //                 moeda: fatura.Moeda_code,
    //                 datavencimento: `${this.adicionarZeroEsquerda(CardId.DiaVencimento)}/${this.adicionarZeroEsquerda(fatura.Month)}/${fatura.Year}`,
    //             });

    //             let oCategoriasDescricao = await this.recuperaCategoriasPrincipal({ data: { fatura: fatura.ID } });

    //             let oPDFBuffer = await this.gerarPDF(oLogo, PersonId, fatura, CardId, transacoes, oCategoriasDescricao);

    //             let oArquivos = []

    //             if (oLogo) {
    //                 oArquivos.push({ conteudo: oLogo, nome: `logo.png`, cid: 'logo' })
    //             }

    //             if (oPDFBuffer) {
    //                 oArquivos.push({ conteudo: oPDFBuffer, nome: `${CardId.NomeCartao}.pdf`, cid: '' })
    //             }

    //             if (PersonId.Imagem) {
    //                 oArquivos.push({ conteudo: PersonId.Imagem, nome: `${PersonId.Nome}_.${PersonId.ExtensaoImagem}`, cid: 'imagemPessoa' })
    //             }

    //             oArquivos = oArquivos.map((arquivo) => (
    //                 {
    //                     filename: arquivo.nome,
    //                     content: arquivo.conteudo,
    //                     cid: arquivo.cid
    //                 }));

    //             let oSubject;

    //             if (atualizaFatura) {
    //                 oSubject = `Fatura do Cartão ${CardId.NomeCartao} - ${this.adicionarZeroEsquerda(fatura.Month)}/${fatura.Year}`;
    //             } else {
    //                 oSubject = `Previsão/Detalhamento da fatura do Cartão ${CardId.NomeCartao} - ${this.adicionarZeroEsquerda(fatura.Month)}/${fatura.Year}`
    //             }

    //             const oOpcoesEmail = {
    //                 from: `"Gestor de Gastos" <${process.env.SMTPAddres}>`,
    //                 to: PersonId.Email,
    //                 subject: oSubject,
    //                 html: oConteudohtml,
    //                 attachments: oArquivos
    //             };

    //             try {

    //                 await this.processaEnviarEmail(oOpcoesEmail, fatura.ID, atualizaFatura);

    //             } catch (error) {
    //                 console.log("Erro" + error)
    //                 return error;
    //             }

    //         } catch (error) {
    //             console.error("Erro ao enviar e-mail:", error);
    //             return error;
    //         }

    //     }

    //     private async processaEnviarEmail(conteudo, fatura, atualizaFatura) {

    //         try {

    //             if (!process.EmailAviso) {
    //                 process.EmailAviso = this.criarInstanciaEmail();
    //                 await process.EmailAviso.verify();
    //                 console.log('Conexão com o servidor SMTP bem-sucedida.');
    //             }

    //             return new Promise((resolve, reject) => {
    //                 process.EmailAviso.sendMail(conteudo).then(async function (ok) {
    //                     console.log('Email enviado com sucesso:');

    //                     if (atualizaFatura) {
    //                         await this.atualizaAvisoEnviadoFatura(fatura);
    //                     }

    //                     await this.sleep(5000);

    //                     resolve(ok)
    //                 }.bind(this)).catch(function (erro) {
    //                     console.log('Erro ao enviar email:' + erro);
    //                     reject(erro)
    //                 }.bind(this));
    //             });

    //         } catch (erro) {

    //             console.log('Erro ao enviar email:' + erro);

    //         }
    //     }


    //    private async gerarPDF(logo, PersonId, fatura, CardId, transacoes, categoriasDescricao) {
    //         return await new Promise((resolve, reject) => {
    //             try {
    //                 const doc = new PDFDocument({
    //                     size: "A4",
    //                     margin: 40,
    //                 });

    //                 const oCorPrimaria = "#085caf";
    //                 const oCorDoTexto = "#333333";

    //                 const oBufferArray = [];
    //                 const oBufferStream = new PassThrough();

    //                 oBufferStream.on('data', (chunk) => oBufferArray.push(chunk));
    //                 oBufferStream.on('end', () => resolve(Buffer.concat(oBufferArray)));
    //                 oBufferStream.on('error', (err) => reject(`Erro no stream: ${err}`));

    //                 doc.pipe(oBufferStream);

    //                 const desenharCabecalho = (paginaInicial = false) => {
    //                     if (!paginaInicial) doc.addPage();

    //                     // Cabeçalho estilizado com imagem à esquerda
    //                     doc
    //                         .rect(0, 0, doc.page.width, 80)
    //                         .fill(oCorPrimaria);

    //                     if (logo) {
    //                         const diamentro = 60;
    //                         const x = 40;
    //                         const y = 10;
    //                         doc
    //                             .save()
    //                             .circle(x + diamentro / 2, y + diamentro / 2, diamentro / 2)
    //                             .clip()
    //                             .image(logo, x, y, { width: diamentro, height: diamentro })
    //                             .restore();
    //                     }

    //                     doc
    //                         .fillColor("white")
    //                         .fontSize(30)
    //                         .text("Gestor de Gastos", 40, 30, { align: "center" });

    //                     doc.moveDown(2);
    //                 };

    //                 const desenharRodape = () => {

    //                     let posicaoVertical = doc.page.height - 70;

    //                     doc
    //                         .rect(0, posicaoVertical, doc.page.width, 80)
    //                         .fill(oCorPrimaria)

    //                 };

    //                 const desenharResumoFatura = () => {
    //                     const Monthes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    //                     const MonthDescricao = Monthes[fatura.Month - 1];

    //                     if (CardId.Imagem) {
    //                         const diamentro = 120;
    //                         const x = (doc.page.width - diamentro) / 2;
    //                         const y = 100;
    //                         doc
    //                             .save()
    //                             .circle(x + diamentro / 2, y + diamentro / 2, diamentro / 2)
    //                             .clip()
    //                             .image(CardId.Imagem, x, y, { width: diamentro, height: diamentro })
    //                             .restore();
    //                     }

    //                     doc.moveDown(3);
    //                     doc
    //                         .fillColor(oCorDoTexto)
    //                         .fontSize(22)
    //                         .text(`${PersonId.Nome}, a sua fatura do cartão ${CardId.NomeCartao}`, { align: "center" });

    //                     doc.moveDown(2);
    //                     doc
    //                         .rect(40, doc.y, doc.page.width - 80, 100)
    //                         .strokeColor(oCorPrimaria)
    //                         .lineWidth(2)
    //                         .stroke();

    //                     doc
    //                         .fillColor(oCorDoTexto)
    //                         .fontSize(20)
    //                         .text("TotalAmount da sua fatura:", 60, doc.y + 10, { align: "left" });

    //                     doc
    //                         .fillColor(oCorPrimaria)
    //                         .fontSize(45)
    //                         .text(`${fatura.ValorTotal} ${fatura.Moeda_code}`, { align: "center" });

    //                     doc.moveDown(2);

    //                     doc
    //                         .fillColor(oCorDoTexto)
    //                         .fontSize(20)
    //                         .text(`Este é o valor que você precisa pagar nesse mês.`, 60, doc.y, { align: "left" });

    //                     doc
    //                         .fillColor(oCorDoTexto)
    //                         .fontSize(16)
    //                         .text(`Mês: ${MonthDescricao}`, { align: "left" })
    //                         .text(`Year: ${fatura.Year}`, { align: "left" })
    //                         .text(`Data de Vencimento: ${this.adicionarZeroEsquerda(CardId.DiaVencimento)}/${this.adicionarZeroEsquerda(fatura.Month)}/${fatura.Year}`, { align: "left" });

    //                     doc
    //                         .moveDown(2)
    //                         .fillColor("black")
    //                         .fontSize(20)
    //                         .text("Fatura gerada automaticamente", 45, doc.y, { align: "center" });;

    //                 };

    //                 const desenharResumoCategorias = () => {

    //                     doc
    //                         .fillColor(oCorPrimaria)
    //                         .fontSize(20)
    //                         .text("Gastos por category", doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });

    //                     // Define as posições fixas das colunas
    //                     const posicoes = {
    //                         imagem: 60,
    //                         nome: 90,
    //                         totalcategoria: 280,
    //                         porcentagem: 440,
    //                     };

    //                     doc.moveDown(2);

    //                     // Cabeçalho da tabela
    //                     let posicaoVertical = doc.y;

    //                     doc
    //                         .fontSize(16)
    //                         .text("", posicoes.imagem, posicaoVertical, { width: 100 })
    //                         .text("Nome", posicoes.nome, posicaoVertical, { width: 200 })
    //                         .text("TotalAmount da Categoria", posicoes.totalcategoria, posicaoVertical, { width: 150 })
    //                         .text("Porcentagem", posicoes.porcentagem, posicaoVertical, { width: 100 });

    //                     posicaoVertical += 25; // Espaço após o cabeçalho

    //                     // Adiciona uma linha horizontal abaixo do cabeçalho
    //                     doc
    //                         .moveTo(60, posicaoVertical - 6)
    //                         .lineTo(560, posicaoVertical - 6)
    //                         .strokeColor(oCorPrimaria)
    //                         .lineWidth(1)
    //                         .stroke();

    //                     // Renderiza as transações em formato de tabela
    //                     categoriasDescricao.Categories.forEach((category, index) => {

    //                         doc.moveDown(2);

    //                         posicaoVertical += 15

    //                         if (category.Imagem) {
    //                             const diamentro = 26;
    //                             const x = posicoes.imagem;
    //                             const y = posicaoVertical - 10;
    //                             doc
    //                                 .save()
    //                                 .circle(x + diamentro / 2, y + diamentro / 2, diamentro / 2)
    //                                 .clip()
    //                                 .image(category.Imagem, x, y, { width: diamentro, height: diamentro })
    //                                 .restore();
    //                         }

    //                         doc
    //                             .fillColor(oCorDoTexto)
    //                             .fontSize(12)
    //                             .text(category.Nome, posicoes.nome, posicaoVertical, { width: 200 })
    //                             .text(`${category.TotalCategoria} ${categoriasDescricao.Currency}`, posicoes.totalcategoria, posicaoVertical, { width: 130, align: "right" })
    //                             .text(`${Number(category.Porcentagem).toFixed(2)}%`, posicoes.porcentagem, posicaoVertical, { width: 95, align: "right" });

    //                         // Adiciona uma linha horizontal abaixo de cada transação
    //                         posicaoVertical += 25;
    //                         doc
    //                             .moveTo(60, posicaoVertical - 5)
    //                             .lineTo(560, posicaoVertical - 5)
    //                             .strokeColor("#CCCCCC")
    //                             .lineWidth(0.5)
    //                             .stroke();

    //                         if ((index + 1) % 15 === 0) { // Adiciona nova página se necessário
    //                             desenharRodape();
    //                             desenharCabecalho();
    //                             posicaoVertical = doc.y + 20; // Reinicia a posição vertical na nova página
    //                         }
    //                     });

    //                 };

    //                 const desenharTransacoes = () => {
    //                     // Centraliza o título
    //                     doc
    //                         .fillColor(oCorPrimaria)
    //                         .fontSize(20)
    //                         .text("Gastos da Fatura", doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });

    //                     doc.moveDown(1);

    //                     // Centraliza o título
    //                     doc
    //                         .fillColor(oCorPrimaria)
    //                         .fontSize(18)
    //                         .text(`Quantidade de gastos totais: ${transacoes.length}`, doc.page.width / 2 - 100, doc.y, { width: 200, align: "center", underline: false });

    //                     doc.moveDown(1);

    //                     // Ordena as transações pela data
    //                     transacoes.sort((a, b) => new Date(a.Data) - new Date(b.Data));

    //                     // Define as posições fixas das colunas
    //                     const posicoes = {
    //                         data: 60,
    //                         descricao: 140,
    //                         category: 340,
    //                         parcela: 440,
    //                         valor: 460,
    //                     };

    //                     // Cabeçalho da tabela
    //                     let posicaoVertical = doc.y;

    //                     doc
    //                         .fontSize(16)
    //                         .text("Data", posicoes.data, posicaoVertical, { width: 100 })
    //                         .text("Descrição", posicoes.descricao, posicaoVertical, { width: 200 })
    //                         .text("Categoria", posicoes.category, posicaoVertical, { width: 100 })
    //                         .text("Parcela", posicoes.parcela, posicaoVertical, { width: 100 })
    //                         .text("Valor", posicoes.valor, posicaoVertical, { width: 100, align: "right" });

    //                     posicaoVertical += 20; // Espaço após o cabeçalho

    //                     // Adiciona uma linha horizontal abaixo do cabeçalho
    //                     doc
    //                         .moveTo(60, posicaoVertical - 6)
    //                         .lineTo(560, posicaoVertical - 6)
    //                         .strokeColor(oCorPrimaria)
    //                         .lineWidth(1)
    //                         .stroke();

    //                     // Renderiza as transações em formato de tabela
    //                     transacoes.forEach((transacao, index) => {
    //                         doc.moveDown(2);
    //                         const oDataGasto = new Date(`${transacao.Data}T00:00:00`);
    //                         const oYearTransacao = oDataGasto.getFullYear();
    //                         const oMonthTransacao = String(oDataGasto.getMonth() + 1).padStart(2, "0");
    //                         const oDayTransacao = String(oDataGasto.getDate()).padStart(2, "0");

    //                         let oCategoria = categoriasDescricao.Categories.filter(category => category.ID == transacao.Category_ID);

    //                         if (oCategoria.length > 0) {
    //                             oCategoria = oCategoria[0].Nome;
    //                         } else {
    //                             oCategoria = "Sem category";
    //                         }

    //                         doc
    //                             .fillColor(oCorDoTexto)
    //                             .fontSize(12)
    //                             .text(`${oDayTransacao}/${oMonthTransacao}/${oYearTransacao}`, posicoes.data, posicaoVertical, { width: 100 })
    //                             .text(transacao.Descricao, posicoes.descricao, posicaoVertical, { width: 200 })
    //                             .text(oCategoria, posicoes.category, posicaoVertical, { width: 100 })
    //                             .text(`${transacao.Parcela} de ${transacao.ParcelasTotais}`, posicoes.parcela, posicaoVertical, { width: 100 })
    //                             .text(`${transacao.Valor} ${transacao.Moeda_code}`, posicoes.valor, posicaoVertical, { width: 100, align: "right" });

    //                         // Adiciona uma linha horizontal abaixo de cada transação
    //                         posicaoVertical += 15;
    //                         doc
    //                             .moveTo(60, posicaoVertical - 5)
    //                             .lineTo(560, posicaoVertical - 5)
    //                             .strokeColor("#CCCCCC")
    //                             .lineWidth(0.5)
    //                             .stroke();

    //                         if ((index + 1) % 30 === 0) { // Adiciona nova página se necessário
    //                             desenharRodape();
    //                             desenharCabecalho();
    //                             posicaoVertical = doc.y + 20; // Reinicia a posição vertical na nova página
    //                         }
    //                     });

    //                 };

    //                 desenharCabecalho(true);
    //                 desenharResumoFatura();
    //                 desenharRodape();

    //                 if (categoriasDescricao.Categories.length > 0) {
    //                     desenharCabecalho();
    //                     desenharResumoCategorias();
    //                     desenharRodape();
    //                 }

    //                 desenharCabecalho();
    //                 desenharTransacoes();
    //                 desenharRodape();

    //                 doc.end();

    //             } catch (erro) {
    //                 console.log(erro);
    //                 reject(`Erro ao gerar PDF: ${erro}`);
    //             }
    //         });
    //     }


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


}