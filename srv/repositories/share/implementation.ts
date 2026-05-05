import cds, { entity, Request } from "@sap/cds";

import { ShareModel } from "@/models/share";
import { ShareRepository } from "./protocols";
import { Share } from "@models/apps/dflc/expensemanager/entities";
import { oShareRouteFactory } from "@/factories/routes/share";
import { Shares } from "@models/apps/dflc/expensemanager/entities";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class ShareRepositoryImplementation extends BaseRepositoryImplementation implements ShareRepository {

    public async findById(Id: Share["ID"]): Promise<ShareModel | null> {

        let oShareEntity = this.getEntity();

        let oSql = SELECT.from(oShareEntity).where({ ID: Id });

        let oShares = await cds.run(oSql);

        if ((oShareEntity as any)?.isDraft) {

            oShareEntity = this.getEntity(true);

            oSql = SELECT.from(oShareEntity).where({ Id: Id });

            const additionalShares = await cds.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalShares];

        }

        const oSharesModel = this.mapShareResult(oShares);

        return oSharesModel?.[0] as ShareModel;

    }


    public async findByPersonId(PersonId: Share['Person_ID']): Promise<ShareModel[] | null> {

        let oShareEntity = this.getEntity();

        let oSql = SELECT.from(oShareEntity).where({ Person_ID: PersonId });

        let oShares = await cds.run(oSql);

        if ((oShareEntity as any)?.isDraft) {

            oShareEntity = this.getEntity(true);

            oSql = SELECT.from(oShareEntity).where({ Person_ID: PersonId });

            const additionalShares = await cds.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalShares];

        }

        const oSharesModel = this.mapShareResult(oShares);

        return oSharesModel;

    }


    public async findByPersonIds(PersonIds: Share["Person_ID"][]): Promise<ShareModel[] | null> {
        
        let oShareEntity = this.getEntity();

        const personIds = Array.isArray(PersonIds) ? PersonIds : [PersonIds];

        let oSql = SELECT.from(oShareEntity).where({ Person_ID: { in: personIds } });

        let oShares = await cds.run(oSql);

        if ((oShareEntity as any)?.isDraft) {

            oShareEntity = this.getEntity(true);

            oSql = SELECT.from(oShareEntity).where({ Person_ID: { in: personIds } });

            const additionalShares = await cds.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalShares];

        }

        const oSharesModel = this.mapShareResult(oShares);

        return oSharesModel;

    }


    public async findByIds(Ids: Share['ID'][]): Promise<ShareModel[] | null> {

        let oShareEntity = this.getEntity();

        let oSql = SELECT.from(oShareEntity).where({ ID: { in: Ids } });

        let oShares = await cds.run(oSql);

        if ((oShareEntity as any)?.isDraft) {

            oShareEntity = this.getEntity(true);

            oSql = SELECT.from(oShareEntity).where({ ID: { in: Ids } });

            const additionalSharets = await cds.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalSharets];

        }

        const oSharesModel = this.mapShareResult(oShares);

        return oSharesModel;

    }


    public async findByUser(User: Share["User"]): Promise<ShareModel[] | null> {

        let oShareEntity = this.getEntity();

        let oSql = SELECT.from(oShareEntity).where({ User: User });

        let oShares = await cds.run(oSql);

        if ((oShareEntity as any)?.isDraft) {

            oShareEntity = this.getEntity(true);

            oSql = SELECT.from(oShareEntity).where({ User: User });

            const additionalShares = await cds.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalShares];

        }

        const oSharesModel = this.mapShareResult(oShares);

        return oSharesModel;

    }


    public async createEntry(data: Share | Shares): Promise<ShareModel[] | null> {

        let oShareEntity = this.getEntity();

        let oSql = INSERT.into(oShareEntity).entries(data);

        await cds.run(oSql);

        return this.mapShareResult(Array.isArray(data) ? data : [data]);

    }


    public mapShareResult(Shares: Shares): ShareModel[] | null {

        if (Shares.length === 0) {

            return null;

        }

        return ShareModel.mapModel(Shares);

    }


    protected getEntity(ignoreDraft = false): entity {

        return ServiceLocator.getEntity('Shares', ignoreDraft);

    }


    protected personPath(): string {

        return 'Person';

    }


}