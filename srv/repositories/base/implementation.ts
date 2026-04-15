import cds, { entity } from "@sap/cds";
import { BaseRepository } from "./protocols";
import { Readable } from "stream";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

export abstract class BaseRepositoryImplementation implements BaseRepository {


    public abstract findById(Id: any): Promise<any | null>;


    public abstract findByIds(Ids: any[]): Promise<any[] | null>;

    public async findImageByIds(Ids: any[]): Promise<{ID: string, Image: Readable, ImageType: string }[] | null> {

        let oEntity = this.getEntity();

        let oSql = SELECT.columns('ID', 'Image', 'ImageType').from(oEntity).where({ ID: { in: Ids } });

        let oEntities = await cds.transaction(ServiceLocator.getRequest()).run(oSql);

        if ((oEntity as any)?.isDraft) {

            oEntity = this.getEntity(true);

            oSql = SELECT.from(oEntity).where({ ID: { in: Ids } });

            const additionalEntities = await cds.transaction(ServiceLocator.getRequest()).run(oSql) || [];
            oEntities = [...(oEntities || []), ...additionalEntities];

        }

        return oEntities;

    }


    public async findPersonIdById(Id: string): Promise<string | null> {

        const Entity = this.getEntity();

        let oPath = this.personPath();

        if (oPath != '') {

            oPath += '.ID';

        } else {

            oPath = 'ID';

        }

        let oResult = await cds.transaction(ServiceLocator.getRequest()).run(
            SELECT.one(`${oPath} as PersonID`)
                .from(Entity)
                .where({ ID: Id })
        );

        if (oResult?.PersonID) {

            return oResult.PersonID;

        }

        if ((Entity as any).drafts) {

            oResult = await cds.transaction(ServiceLocator.getRequest()).run(
                SELECT.one(`${oPath} as PersonID`)
                    .from((Entity as any).drafts)
                    .where({ ID: Id })
            );

            if (oResult?.PersonID) {

                return oResult.PersonID;

            }

        }

        return null;

    }


    public abstract createEntry(data: any | any[]): Promise<any[] | null>;


    protected abstract getEntity(ignoreDraft?: boolean): entity;


    protected abstract personPath(): string;


}