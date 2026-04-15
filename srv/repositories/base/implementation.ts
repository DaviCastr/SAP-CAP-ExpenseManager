import cds, { entity } from "@sap/cds";
import { BaseRepository } from "./protocols";

export abstract class BaseRepositoryImplementation implements BaseRepository {


    public abstract findById(Id: any): Promise<any | null>;


    public abstract findByIds(Ids: any[]): Promise<any[] | null>;


    public async findPersonIdById(Id: string): Promise<string | null> {

        const Entity = this.getEntity();

        let oPath = this.personPath();

        if (oPath != '') {

            oPath += '.ID';

        }else{

            oPath = 'ID';
            
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


    public abstract createEntry(data: any | any[]): Promise<any[] | null>;


    protected abstract getEntity(): entity;


    protected abstract personPath(): string;


}