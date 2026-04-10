import cds, { entity } from "@sap/cds";

import { CardModel } from "@/models/card";
import { CardRepository } from "./protocols";
import { Card } from "@models/apps/dflc/gestordegastos/entities";
import { Cards } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";
import { CurrencyModel } from "@/models/currency";
import { Readable } from "stream";
import Decimal from "decimal.js";
import { InvoiceModel } from "@/models/invoice";
import { TransactionModel } from "@/models/transaction";


export class CardRepositoryImplementation extends BaseRepositoryImplementation implements CardRepository {

    public async findById(Id: Card["ID"]): Promise<CardModel | null> {

        let oCardEntity = this.getEntity();

        let oSql = SELECT.from(oCardEntity).where({ ID: Id });

        let oCards = await cds.run(oSql);

        if ((oCardEntity as any)?.isDraft) {

            oCardEntity = this.getEntity(true);

            oSql = SELECT.from(oCardEntity).where({ Id: Id });

            const additionalCards = await cds.run(oSql) || [];
            oCards = [...(oCards || []), ...additionalCards];

        }

        const oCardsModel = this.mapCardResult(oCards)?.[0];

        return oCardsModel?.[0];

    }


    public async findByPersonId(PersonId: Card['Person_ID']): Promise<CardModel[] | null> {

        let oCardEntity = this.getEntity();

        let oSql = SELECT.from(oCardEntity).where({ Person_ID: PersonId });

        let oCards = await cds.run(oSql);

        if ((oCardEntity as any)?.isDraft) {

            oCardEntity = this.getEntity(true);

            oSql = SELECT.from(oCardEntity).where({ Person_ID: PersonId });

            const additionalCards = await cds.run(oSql) || [];
            oCards = [...(oCards || []), ...additionalCards];

        }

        const oCardsModel = this.mapCardResult(oCards);

        return oCardsModel;

    }


    public mapCardResult(Cards: Cards): CardModel[] | null {

        if (Cards.length === 0) {

            return null;

        }

        return Cards.map((Card: Card) => {

            const oCurrencyModel = CurrencyModel.with({
                Code: Card.Currency?.code as string,
                Name: Card.Currency?.name as string,
                Description: Card.Currency?.descr as string,
                Symbol: Card.Currency?.symbol as string,
                MinorUnit: Card.Currency?.minorUnit as number
            });

            return CardModel.with({
                Id: Card.ID as string,
                Name: Card.Name as string,
                Image: Card.Image as Readable,
                ImageType: Card.ImageType as string,
                Limit: new Decimal(Card.Limit ?? 0),
                Currency: oCurrencyModel,
                AvailableLimit: new Decimal(Card.AvailableLimit ?? 0),
                DueDay: Card.DueDay as number,
                ClosingDay: Card.ClosingDay as number,
                InvoiceAmountForPayment: new Decimal(Card.InvoiceAmountForPayment ?? 0),
                OpenInvoiceAmount: new Decimal(Card.OpenInvoiceAmount ?? 0),
                Invoices: Card.Invoices?.map((Invoice) => InvoiceModel.with({
                    Id: Invoice.ID as string,
                    Year: Invoice.Year as number,
                    Month: Invoice.Month as number,
                    Description: Invoice.Description as string,
                    TotalAmount: new Decimal(Invoice.TotalAmount ?? 0),
                    Currency: oCurrencyModel,
                    InvoiceSent: Invoice.InvoiceSent as boolean,
                    Transactions: Invoice.Transactions?.map((Transaction) => TransactionModel.with({
                        Id: Transaction.ID as string,
                        Identifier: Transaction.Identifier as string,
                        Date: Transaction.Date as string,
                        TotalAmount: new Decimal(Transaction.TotalAmount ?? 0),
                        Amount: new Decimal(Transaction.Amount ?? 0),
                        Currency: oCurrencyModel,
                        TotalInstallments: Transaction.TotalInstallments as number,
                        Installment: Transaction.Installment as number,
                        Description: Transaction.Description as string,
                        CreatedAt: Transaction.createdAt as string,
                        CreatedBy: Transaction.createdBy as string,
                        ModifiedAt: Transaction.modifiedAt as string,
                        ModifiedBy: Transaction.modifiedBy as string
                    })) as TransactionModel[],
                    CreatedAt: Invoice.createdAt as string,
                    CreatedBy: Invoice.createdBy as string,
                    ModifiedAt: Invoice.modifiedAt as string,
                    ModifiedBy: Invoice.modifiedBy as string
                })) || [] as InvoiceModel[],
                CreatedAt: Card.createdAt as string,
                CreatedBy: Card.createdBy as string,
                ModifiedAt: Card.modifiedAt as string,
                ModifiedBy: Card.modifiedBy as string
            });

        });

    }


    protected getEntity(ignoreDraft = false): entity {

        return ServiceLocator.getEntity('Cards', ignoreDraft);

    }


    protected personPath(): string {

        return 'Person';

    }


}