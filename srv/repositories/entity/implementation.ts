import cds, { entity, Request } from "@sap/cds";

import { EntityModel } from "@/models/entity";
import { EntityRepository } from "./protocols";
import { Entity } from "@models/GestorDeGastos";
import { Entities } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class EntityRepositoryImplementation extends BaseRepositoryImplementation implements EntityRepository {


    public async findByShareId(ShareId: Entity['Share_ID']): Promise<EntityModel[] | null> {

        let oEntityEntity = this.getEntity();

        let oSql = SELECT.from(oEntityEntity).where({ Share_ID: ShareId });

        let oEntities = await cds.run(oSql);

        if ((oEntityEntity as any)?.isDraft) {

            oEntityEntity = this.getEntity(true);

            oSql = SELECT.from(oEntityEntity).where({ Share_ID: ShareId });

            const additionalEntities = await cds.run(oSql) || [];
            oEntities = [...(oEntities || []), ...additionalEntities];

        }

        const oEntitiesModel = this.mapEntityResult(oEntities);

        return oEntitiesModel;

    }


    protected getEntity(ignoreDraft = false): entity {

        return ServiceLocator.getEntity('Entities', ignoreDraft);

    }


    protected personPath(): string {

        return 'Share.Person';

    }


    private mapEntityResult(Entities: Entities): EntityModel[] | null {

        if (Entities.length === 0) {

            return null;

        }

        return Entities.map((Entity: Entity) => {

            return EntityModel.with({
                Id: Entity.ID as string,
                Entity: Entity.Entity as number,
                Permission: Entity.Permission as number,
                CreatedAt: Entity.createdAt as string,
                CreatedBy: Entity.createdBy as string,
                ModifiedAt: Entity.modifiedAt as string,
                ModifiedBy: Entity.modifiedBy as string
            });

        });

    }

}