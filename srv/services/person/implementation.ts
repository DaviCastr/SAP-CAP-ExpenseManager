import { AbstractError } from "@/errors";
import { Persons, Person, Cards } from "@models/apps/dflc/gestordegastos/entities";
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

export class PersonServiceImplementation extends BaseServiceImplementation<Person> implements PersonService {

    public Repository: PersonRepository;

    constructor(
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
        Repository: PersonRepository,
        private readonly CardRepository: CardRepository,
        private readonly InvoiceRepository: InvoiceRepository
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

                if ('Image' in Person) {

                    oPersonsData.push({
                        ...Person,
                    });
                    continue;

                }

                const oPersonModel = PersonModel.singleModel(Person);

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
                        ...Person,
                    });
                    continue;

                }

                oExpenses = oExpensesResult?.isRight() ? oExpensesResult.value : {} as any;

                oPersonModel.TotalExpenses = oExpenses?.totalExpenses?.toDecimalPlaces(2);
                oPersonModel.TotalExpensesMonth = oExpenses?.monthExpenses?.toDecimalPlaces(2);
                oPersonModel.AmountToSave = oPersonModel.TotalExpenses?.minus(oPersonModel.ExpenseTarget);
                oPersonModel.TotalExpensesToPay = oExpenses?.monthExpensesToPay?.toDecimalPlaces(2);
                oPersonModel.TotalExpensesClosed = oExpenses?.monthExpensesClosed?.toDecimalPlaces(2);
                oPersonModel.TotalExpensesPayed = oExpenses?.monthExpensesPayed?.toDecimalPlaces(2);

                if (oPersonModel.TotalExpenses.gt(oPersonModel.ExpenseTarget)) {
                    oPersonModel.MonthCriticallity = 1;
                } else {
                    oPersonModel.MonthCriticallity = 3;
                }

                if (oPersonModel.TotalExpensesToPay.gt(oPersonModel.ExpenseTarget)) {
                    oPersonModel.CriticallityToPay = 1;
                } else {
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
                            oMonthExpenses = oMonthExpenses.plus(oInvoice.TotalAmount);
                            if (oCardModel.ClosingDay > oDia) {
                                oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice.TotalAmount)
                                oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount)
                            } else if (oCardModel.DueDay >= oDia) {
                                oMonthExpensesClosed = oMonthExpensesClosed.plus(oInvoice.TotalAmount)
                                oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount)
                            } else {
                                oMonthExpensesPayed = oMonthExpensesPayed.plus(oInvoice.TotalAmount)
                            }
                        } else if (oInvoice.Year == oNextYear && oInvoice.Month == oNextMonth && oCardModel.ClosingDay <= oDia) {
                            oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice.TotalAmount)
                            oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount?.toNumber())
                        } else {
                            oTotalExpenses = oTotalExpenses.plus(oInvoice.TotalAmount)
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


}