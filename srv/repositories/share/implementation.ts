import cds from "@sap/cds";

import { ShareModel } from "@/models/share";
import { ShareRepository } from "./protocols";
import { Share } from "@models/GestorDeGastos";
import { oShareRouteFactory } from "@/factories/routes/share";
import { Shares } from "@models/apps/dflc/gestordegastos/entities";


export class ShareRepositoryImplementation implements ShareRepository {

    public async findByPersonId(PersonId: Share['Person_ID']): Promise<ShareModel[] | null> {

        const oShareEntity = oShareRouteFactory.getEntity();

        const oSql = SELECT.from(oShareEntity).where({ Person_ID: PersonId });

        const oShares = await cds.run(oSql);

        const oSharesModel = this.mapShareResult(oShares);

        return oSharesModel;

    }

    private mapShareResult(Shares: Shares): ShareModel[] | null {

        if (Shares.length === 0) {

            return null;

        }

        return Shares.map((Share: Share) => {

            return ShareModel.with({
                Id: Share.ID as string,
                User: Share.User as string,
                Permission: Share.Permission as number,
                CreatedAt: Share.createdAt as string,
                CreatedBy: Share.createdBy as string,
                ModifiedAt: Share.modifiedAt as string,
                ModifiedBy: Share.modifiedBy as string
            });

        });

    }

}