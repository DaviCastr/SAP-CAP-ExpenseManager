import cds, { entity, Request } from "@sap/cds";

import { EntityModel } from "@/models/entity";
import { EntityRepository } from "./protocols";
import { Entity } from "@models/apps/dflc/expensemanager/entities";
import { Entities } from "@models/apps/dflc/expensemanager/entities";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class EntityRepositoryImplementation extends BaseRepositoryImplementation implements EntityRepository {


    public async findById(Id: Entity['ID']): Promise<EntityModel | null> {

        let oEntityEntity = this.getEntity();

        let oSql = SELECT.from(oEntityEntity).where({ ID: Id });

        let oEntities = await cds.run(oSql);

        if ((oEntityEntity as any)?.isDraft && !(oEntities || []).length) {

            oEntityEntity = this.getEntity(true);

            oSql = SELECT.from(oEntityEntity).where({ ID: Id });

            oEntities = await cds.run(oSql) || [];

        }

        const oEntitiesModel = this.mapEntityResult(oEntities);

        return oEntitiesModel?.[0] as EntityModel;

    }


    public async findByShareId(ShareId: Entity['Share_ID']): Promise<EntityModel[] | null> {

        let oEntityEntity = this.getEntity();

        let oSql = SELECT.from(oEntityEntity).where({ Share_ID: ShareId });

        let oEntities = await cds.run(oSql);

        if ((oEntityEntity as any)?.isDraft) {

            const exclusionFilter =
                this.excludeFoundFilter(oEntities);

            oEntityEntity = this.getEntity(true);

            const oActiveSql = SELECT.from(oEntityEntity).where({ Share_ID: ShareId });

            if (exclusionFilter) {
                oActiveSql.where(exclusionFilter);
            }

            const additionalEntities =
                await cds.run(oActiveSql) || [];

            oEntities = this.mergeUnique(oEntities, additionalEntities);

        }

        const oEntitiesModel = this.mapEntityResult(oEntities);

        return oEntitiesModel;

    }


    public async findByShareIds(ShareIds: Entity['Share_ID'][]): Promise<EntityModel[] | null> {

        let oEntityEntity = this.getEntity();

        const shareIds = Array.isArray(ShareIds) ? ShareIds : [ShareIds];

        let oSql = SELECT.from(oEntityEntity).where({ Share_ID: { in: ShareIds } });

        let oEntities = await cds.run(oSql);

        if ((oEntityEntity as any)?.isDraft) {

            const exclusionFilter =
                this.excludeFoundFilter(oEntities);

            oEntityEntity = this.getEntity(true);

            const oActiveSql = SELECT.from(oEntityEntity).where({ Share_ID: { in: ShareIds } });

            if (exclusionFilter) {
                oActiveSql.where(exclusionFilter);
            }

            const additionalEntities =
                await cds.run(oActiveSql) || [];

            oEntities = this.mergeUnique(oEntities, additionalEntities);

        }

        const oEntitiesModel = this.mapEntityResult(oEntities);

        return oEntitiesModel;

    }


    public async findByIds(Ids: Entity['ID'][]): Promise<EntityModel[] | null> {

        let oEntityEntity = this.getEntity();

        let oSql = SELECT.from(oEntityEntity).where({ ID: { in: Ids } });

        let oEntitys = await cds.run(oSql);

        if ((oEntityEntity as any)?.isDraft) {

            const missingIds =
                this.missingIds(Ids, oEntitys);

            if (missingIds.length > 0) {

                oEntityEntity = this.getEntity(true);

                const additionalEntityts =
                    await cds.run(
                        SELECT.from(oEntityEntity).where({ ID: { in: missingIds } })
                    ) || [];

                oEntitys = this.mergeUnique(oEntitys, additionalEntityts);

            }

        }

        const oEntitysModel = this.mapEntityResult(oEntitys);

        return oEntitysModel;

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