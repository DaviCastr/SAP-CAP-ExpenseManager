import cds, { entity, Request } from "@sap/cds";

import { EntityModel } from "@/models/entity";
import { EntityRepository } from "./protocols";
import { Entity } from "@models/apps/dflc/gestordegastos/entities";
import { Entities } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class EntityRepositoryImplementation extends BaseRepositoryImplementation implements EntityRepository {


    public async findById(Id: Entity['ID']): Promise<EntityModel | null> {

        let oEntityEntity = this.getEntity();

        let oSql = SELECT.from(oEntityEntity).where({ ID: Id });

        let oEntities = await cds.run(oSql);

        if ((oEntityEntity as any)?.isDraft) {

            oEntityEntity = this.getEntity(true);

            oSql = SELECT.from(oEntityEntity).where({ ID: Id });

            const additionalEntities = await cds.run(oSql) || [];
            oEntities = [...(oEntities || []), ...additionalEntities];

        }

        const oEntitiesModel = this.mapEntityResult(oEntities);

        return oEntitiesModel?.[0] as EntityModel;

    }


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


    public async createEntry(data: Entity | Entities): Promise<EntityModel[] | null> {

        let oEntityEntity = this.getEntity();

        let oSql = INSERT.into(oEntityEntity).entries(data);

        await cds.run(oSql);

        return this.mapEntityResult(Array.isArray(data) ? data : [data]);

    }


    public mapEntityResult(Entities: Entities): EntityModel[] | null {

        if (Entities.length === 0) {

            return null;

        }

        return EntityModel.mapModel(Entities);

    }


    protected getEntity(ignoreDraft = false): entity {

        return ServiceLocator.getEntity('Entities', ignoreDraft);

    }


    protected personPath(): string {

        return 'Share.Person';

    }


}