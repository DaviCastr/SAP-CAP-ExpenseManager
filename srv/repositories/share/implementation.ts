import cds, { entity, Request } from "@sap/cds";

import { ShareModel } from "@/models/share";
import { ShareRepository } from "./protocols";
import { Share } from "@models/GestorDeGastos";
import { oShareRouteFactory } from "@/factories/routes/share";
import { Shares } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class ShareRepositoryImplementation extends BaseRepositoryImplementation implements ShareRepository {


    public async findByPersonId(PersonId: Share['Person_ID']): Promise<ShareModel[] | null> {

        let oShareEntity = this.getEntity();

        let oSql = SELECT.from(oShareEntity).where({ Person_ID: PersonId });

        let oShares = await cds.run(oSql);

        if (!oShares?.length || (oShareEntity as any)?.isDraft) {

            oShareEntity = this.getEntity(true);

            oSql = SELECT.from(oShareEntity).where({ Person_ID: PersonId });

            const additionalShares = await cds.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalShares];

        }

        const oSharesModel = this.mapShareResult(oShares); 

        return oSharesModel;

    }


    public async findByUser(User: Share["User"]): Promise<ShareModel[] | null> {

        let oShareEntity = this.getEntity();
 
        let oSql = SELECT.from(oShareEntity).where({ User: User });

        let oShares = await cds.run(oSql);

        if (!oShares?.length || (oShareEntity as any)?.isDraft) {

            oShareEntity = this.getEntity(true);

            oSql = SELECT.from(oShareEntity).where({ User: User });

            const additionalShares = await cds.run(oSql) || [];
            oShares = [...(oShares || []), ...additionalShares];

        } 

        const oSharesModel = this.mapShareResult(oShares);

        return oSharesModel;

    }


    protected getEntity(ignoreDraft = false): entity {

        return ServiceLocator.getEntity('Shares', ignoreDraft);

    }


    protected personPath(): string {

        return 'Person';

    }


    private mapShareResult(Shares: Shares): ShareModel[] | null {

        if (Shares.length === 0) {

            return null;

        }

        return Shares.map((Share: Share) => {

            return ShareModel.with({
                Id: Share.ID as string,
                User: Share.User as string,
                PersonId: Share.Person_ID as string,
                CreatedAt: Share.createdAt as string,
                CreatedBy: Share.createdBy as string,
                ModifiedAt: Share.modifiedAt as string,
                ModifiedBy: Share.modifiedBy as string
            });

        });

    }

}