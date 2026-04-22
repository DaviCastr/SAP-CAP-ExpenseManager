import { AbstractError } from "@/errors";
import { Cards, Card } from "@models/apps/dflc/gestordegastos/entities";
import { Either, right, left } from "@sweet-monads/either";
import { CardService } from "./protocols";
import { CardModel } from "@/models/card";
import Decimal from "decimal.js";
import { CardRepository } from "@/repositories/card";
import { BaseServiceImplementation } from "../base/implementation";
import { PersonRepository } from "@/repositories/person";
import { ShareRepository } from "@/repositories/share";
import { User } from "@sap/cds";
import { EntityRepository } from '@/repositories/entity';
import { PermissionDenied } from "@/errors/permission-denied";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";
import { InvoiceRepository } from "@/repositories/invoice";

export class CardServiceImplementation extends BaseServiceImplementation<Card> implements CardService {

    public Repository: CardRepository;

    constructor(
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,
        Repository: CardRepository,
        private readonly InvoiceRepository: InvoiceRepository
    ) {

        super(PersonRepository, ShareRepository, EntityRepository);

        this.Repository = Repository;

    }


    public async beforeCreate(Card: Card, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeCreate(Card, User);

        if (result.isLeft()) return result;

        return this.checkCard(Card);

    }


    public async beforeUpdate(Card: Card, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeUpdate(Card, User);

        if (result.isLeft()) return result;

        return this.checkCard(Card);

    }


    public async beforeEdit(Card: Card, User: User): Promise<Either<AbstractError, boolean>> {

        const result = await this.processBeforeUpdate(Card, User);

        if (result.isLeft()) return result;

        return this.checkCard(Card);

    }


    public async afterRead(Cards: Cards, User: User): Promise<Either<AbstractError, Cards>> {

        try {

            const result = await this.processAfterRead(Cards, User);
            let oCardsFiltered: Cards = [];
            if (result.isRight()) oCardsFiltered = result.value;
            else oCardsFiltered = []

            const oCardsData: Cards = [];

            let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
            oDate = oDate.replaceAll(",", " ");
            const [day, month, year] = oDate.split(" ")[0].split("/");

            let oDia = Number(day);
            let oMonth = Number(month);
            let oYear = Number(year);

            const cardIds = oCardsFiltered.map(c => c.ID);

            const invoicesByCard = await this.InvoiceRepository.findByCardIDs(cardIds, { Year: { '>=': oYear } }) || [];

            const mapInvoices = new Map<string, any[]>();

            for (const inv of invoicesByCard) {
                if (!mapInvoices.has(inv?.CardId)) {
                    mapInvoices.set(inv?.CardId, []);
                }
                mapInvoices.get(inv.CardId)!.push(inv);
            }

            for (let Card of oCardsFiltered) {

                const oCardModel = CardModel.singleModel(Card);

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

                let oTotalExpenses = new Decimal(0);
                let oMonthExpenses = new Decimal(0);;
                let oMonthExpensesToPay = new Decimal(0);
                let oMonthExpensesClosed = new Decimal(0);

                const oInvoices = mapInvoices.get(oCardModel.Id) || [];

                oInvoices?.forEach(oInvoice => {

                    if (oInvoice.Year == oInvoiceYear && oInvoice.Month >= oInvoiceMonth || oInvoice.Year > oInvoiceYear) {

                        if (oInvoice.Month == oInvoiceMonth && oInvoice.Year == oInvoiceYear) {
                            oMonthExpenses = oMonthExpenses.plus(oInvoice?.TotalAmount || 0);
                            if (oCardModel.ClosingDay > oDia) {
                                oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice?.TotalAmount || 0)
                                oTotalExpenses = oTotalExpenses.plus(oInvoice?.TotalAmount || 0)
                            } else if (oCardModel.DueDay >= oDia) {
                                oMonthExpensesClosed = oMonthExpensesClosed.plus(oInvoice?.TotalAmount || 0)
                                oTotalExpenses = oTotalExpenses.plus(oInvoice?.TotalAmount || 0)
                            }
                        } else if (oInvoice.Year == oNextYear && oInvoice.Month == oNextMonth && oCardModel.ClosingDay <= oDia) {
                            oMonthExpensesToPay = oMonthExpensesToPay.plus(oInvoice?.TotalAmount || 0)
                            oTotalExpenses = oTotalExpenses.plus(oInvoice?.TotalAmount || 0)
                        } else {
                            oTotalExpenses = oTotalExpenses.plus(oInvoice?.TotalAmount || 0)
                        }
                    }

                });

                oCardModel.AvailableLimit = oCardModel.Limit?.minus(oTotalExpenses).toDecimalPlaces(2);
                oCardModel.InvoiceAmountToPay = oMonthExpensesToPay?.toDecimalPlaces(2);
                if (oCardModel.ClosingDay > oDia) {
                    oCardModel.InvoiceAmountForPayment = oCardModel.InvoiceAmountToPay
                } else if (oCardModel.DueDay < oDia) {
                    oCardModel.InvoiceAmountForPayment = oCardModel.InvoiceAmountToPay
                } else {
                    oCardModel.InvoiceAmountForPayment = oMonthExpensesClosed
                }

                const oCardData = oCardModel.toEntityObject();

                oCardsData.push({
                    ...oCardData
                });

            };

            return right(oCardsData);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new AbstractError(errorInstance.message, 403, errorInstance.stack as string));

        }

    }


    protected async checkPermission(Card: Card, User: User, Permission: number) {

        const cache = ServiceLocator.getPermissionCache();

        const userId = User?.id;

        let personId = cache.personMap.get(Card.ID);

        if (!personId) {

            if (!Card?.Person_ID && !Card?.Person?.ID) {

                personId =
                    await this.Repository.findPersonIdById(Card?.ID as string);

            } else {

                personId = Card?.Person_ID || Card?.Person?.ID;

            }

            if (personId) {
                cache.personMap.set(Card.ID, personId);
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

        return ['Person'];

    }


    public entityCode(): number {

        return 5;

    }


    protected parentField(): string | null {
        return 'Person.ID';
    }


    private validateDate(date: string): boolean {
        const dateCheck = new Date(date);
        return !isNaN(dateCheck.getTime());
    }


    private lastDayOfTheMonth(year: number, month: number) {

        const date = new Date(year, month, 0);

        return date.getDate();

    }


    private async checkCard(Card: Card): Promise<Either<AbstractError, boolean>> {

        if (Card) {

            let oPerson = Card?.Person_ID ? await this.PersonRepository.findById(Card?.Person_ID)
                : await this.PersonRepository.findByCardId(Card?.ID);

            if (oPerson && Card.Currency?.code) {

                if (oPerson.Currency?.Code != Card.Currency?.code) {

                    const oStack = new Error().stack as string;

                    const message = this.getMessage('error.currencyNotEqualPersonCurrency', ServiceLocator.getRequest());

                    return left(new PermissionDenied(message, 403, oStack));

                }
            }
        }

        if (Card?.Limit) {

            if (Card.Limit < 0) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.invalidLimit', ServiceLocator.getRequest());

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        if (Card?.ClosingDay && Card?.DueDay) {

            if (Card?.DueDay - Card?.ClosingDay < 2) {

                const oStack = new Error().stack as string;

                const message = this.getMessage('error.incorectDueDayClosinDay', ServiceLocator.getRequest());

                return left(new PermissionDenied(message, 403, oStack));

            }

        }

        return right(true);

    }


}