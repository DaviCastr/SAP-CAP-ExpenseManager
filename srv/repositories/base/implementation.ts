import cds, { entity, Request } from "@sap/cds";
import { BaseRepository } from "./protocols";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

export abstract class BaseRepositoryImplementation implements BaseRepository {


    public async findPersonIdById(Id: string): Promise<string | null> {

        const Entity = this.getEntity();

        let oPath = this.personPath();

        if (oPath != '') {

            oPath += '.ID';

        }

        let oResult = await cds.run(
            SELECT.one(`${oPath} as PersonID`)
                .from(Entity)
                .where({ ID: Id })
        );

        if (oResult?.PersonID) {

            return oResult.PersonID;

        }

        if ((Entity as any).drafts) {

            oResult = await cds.run(
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

    protected abstract getEntity(): entity;

    protected abstract personPath(): string;


}