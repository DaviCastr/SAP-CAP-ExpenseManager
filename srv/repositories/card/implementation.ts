import cds, { entity } from "@sap/cds";

import { CardModel } from "@/models/card";
import { CardRepository } from "./protocols";
import { Card } from "@models/apps/dflc/gestordegastos/entities";
import { Cards } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


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

        const oCardsModel = this.mapCardResult(oCards);

        return oCardsModel?.[0] as CardModel;

    }


    public async findByIds(Ids: Card['ID'][], additionalFilters?: {}): Promise<CardModel[] | null> {

        let oCardEntity = this.getEntity();

        let oSql = SELECT.from(oCardEntity).where({ ID: { in: Ids }, ...additionalFilters });

        let oCards = await cds.run(oSql);

        if ((oCardEntity as any)?.isDraft) {

            oCardEntity = this.getEntity(true);

            oSql = SELECT.from(oCardEntity).where({ ID: { in: Ids }, ...additionalFilters  });

            const additionalCardts = await cds.run(oSql) || [];
            oCards = [...(oCards || []), ...additionalCardts];

        }

        const oCardsModel = this.mapCardResult(oCards);

        return oCardsModel;

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


    public async findByPersonIds(PersonIds: Card['Person_ID'][], additionalFilters?: {}): Promise<CardModel[] | null> {

        let oCardEntity = this.getEntity();

        let oSql = SELECT.from(oCardEntity).where({ Person_ID: { 'in': PersonIds }, ...additionalFilters });

        let oCards = await cds.run(oSql);

        if ((oCardEntity as any)?.isDraft) {

            oCardEntity = this.getEntity(true);

            oSql = SELECT.from(oCardEntity).where({ Person_ID: { 'in': PersonIds }, ...additionalFilters });

            const additionalCards = await cds.run(oSql) || [];
            oCards = [...(oCards || []), ...additionalCards];

        }

        const oCardsModel = this.mapCardResult(oCards);

        return oCardsModel;

    }


    public async findByInvoiceIds(InvoiceIds: Card['ID'] | Card['ID'][]): Promise<CardModel[] | null> {

        let oCardEntity = this.getEntity();

        let invoiceIds = Array.isArray(InvoiceIds) ? InvoiceIds : [InvoiceIds];

        let oSql = SELECT.from(oCardEntity).where`Invoices.ID in ${invoiceIds}`;

        let oCards = await cds.run(oSql);

        if ((oCardEntity as any)?.isDraft) {

            oCardEntity = this.getEntity(true);

            oSql = SELECT.from(oCardEntity).where`Invoices.ID in ${invoiceIds}`;

            const additionalCardts = await cds.run(oSql) || [];
            oCards = [...(oCards || []), ...additionalCardts];

        }

        const oCardsModel = this.mapCardResult(oCards);

        return oCardsModel;

    }


    public async createEntry(data: Card | Cards): Promise<CardModel[] | null> {

        let oCardEntity = this.getEntity();

        let oSql = INSERT.into(oCardEntity).entries(data);

        await cds.run(oSql);

        return this.mapCardResult(Array.isArray(data) ? data : [data]);

    }


    public mapCardResult(Cards: Cards): CardModel[] | null {

        if (Cards.length === 0) {

            return null;

        }

        return CardModel.mapModel(Cards);

    }


    protected getEntity(ignoreDraft = false): entity {

        return ServiceLocator.getEntity('Cards', ignoreDraft);

    }


    protected personPath(): string {

        return 'Person';

    }


}