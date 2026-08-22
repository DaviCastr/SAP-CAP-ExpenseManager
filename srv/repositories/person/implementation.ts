import cds, { entity } from "@sap/cds";
import { PersonModel } from "@/models/person";
import { Person, Persons } from "@models/apps/dflc/expensemanager/entities";
import { PersonRepository } from "./protocols";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class PersonRepositoryImplementation extends BaseRepositoryImplementation implements PersonRepository {


    public async findById(Id: Person["ID"], ignoreDraft?: boolean): Promise<PersonModel | null> {

        let oPersonEntity = this.getEntity(ignoreDraft);

        let oSql = SELECT.from(oPersonEntity).where({ ID: Id });

        let oPersons = await cds.run(oSql);

        if ((oPersonEntity as any)?.isDraft && !(oPersons || []).length) {

            oPersonEntity = this.getEntity(true);

            oSql = SELECT.from(oPersonEntity).where({ ID: Id });

            oPersons = await cds.run(oSql) || [];

        }

        const oPersonsModel = this.mapPersonResult(oPersons);

        if (oPersonsModel) {

            return oPersonsModel[0];

        } else {

            return null;

        }

    }


    public async findByCardId(CardId: Person["ID"]): Promise<PersonModel | null> {

        let oPersonEntity = this.getEntity();

        let oSql = SELECT.from(oPersonEntity).where`Cards.ID = ${CardId} `;

        let oPersons = await cds.run(oSql);

        if ((oPersonEntity as any)?.isDraft) {

            const exclusionFilter =
                this.excludeFoundFilter(oPersons);

            oPersonEntity = this.getEntity(true);

            const oActiveSql = SELECT.from(oPersonEntity).where`Cards.ID = ${CardId} `;

            if (exclusionFilter) {
                oActiveSql.where(exclusionFilter);
            }

            const additionalPersons =
                await cds.run(oActiveSql) || [];

            oPersons = this.mergeUnique(oPersons, additionalPersons);

        }

        const oPersonsModel = this.mapPersonResult(oPersons);

        if (oPersonsModel) {

            return oPersonsModel[0];

        } else {

            return null;

        }

    }

    public async findByIds(Ids: Person['ID'][]): Promise<PersonModel[] | null> {

        let oPersonEntity = this.getEntity();

        let oSql = SELECT.from(oPersonEntity).where({ ID: { in: Ids } });

        let oPersons = await cds.run(oSql);

        if ((oPersonEntity as any)?.isDraft) {

            const missingIds =
                this.missingIds(Ids, oPersons);

            if (missingIds.length > 0) {

                oPersonEntity = this.getEntity(true);

                const additionalPersons =
                    await cds.run(
                        SELECT.from(oPersonEntity).where({ ID: { in: missingIds } })
                    ) || [];

                oPersons = this.mergeUnique(oPersons, additionalPersons);

            }

        }

        const oPersonsModel = this.mapPersonResult(oPersons);

        return oPersonsModel;

    }


    public async findByUser(createdBy: Person["createdBy"]): Promise<PersonModel[] | null> {

        let oPersonEntity = this.getEntity();

        let oSql = SELECT.from(oPersonEntity).where({ createdBy: createdBy });

        let oPersons = await cds.run(oSql);

        if ((oPersonEntity as any)?.isDraft) {

            const exclusionFilter =
                this.excludeFoundFilter(oPersons);

            oPersonEntity = this.getEntity(true);

            const oActiveSql = SELECT.from(oPersonEntity).where({ createdBy: createdBy });

            if (exclusionFilter) {
                oActiveSql.where(exclusionFilter);
            }

            const additionalPersons =
                await cds.run(oActiveSql) || [];

            oPersons = this.mergeUnique(oPersons, additionalPersons);

        }

        const oPersonsModel = this.mapPersonResult(oPersons);

        return oPersonsModel;

    }


    public async findAll(genericFilters?: {}): Promise<PersonModel[] | null> {

        let oPersonEntity = this.getEntity();

        let oSql = SELECT.from(oPersonEntity);

        if (genericFilters) {
            oSql.where(genericFilters);
        }

        let oPersons = await cds.run(oSql);

        if ((oPersonEntity as any)?.isDraft) {

            const exclusionFilter =
                this.excludeFoundFilter(oPersons);

            oPersonEntity = this.getEntity(true);

            const oActiveSql = SELECT.from(oPersonEntity);

            if (genericFilters) {
                oActiveSql.where(genericFilters);
            }

            if (exclusionFilter) {
                oActiveSql.where(exclusionFilter);
            }

            const additionalPersons =
                await cds.run(oActiveSql) || [];

            oPersons = this.mergeUnique(oPersons, additionalPersons);

        }

        const oPersonsModel = this.mapPersonResult(oPersons);

        return oPersonsModel;

    }


    public async createEntry(data: Person | Persons): Promise<PersonModel[] | null> {

        let oPersonEntity = this.getEntity();

        let oSql = INSERT.into(oPersonEntity).entries(data);

        await cds.run(oSql);

        return this.mapPersonResult(Array.isArray(data) ? data : [data]);

    }


    protected getEntity(ignoreDraft?: boolean): entity {

        return ServiceLocator.getEntity('Persons', ignoreDraft);

    }


    protected personPath(): string {

        return '';

    }


    private mapPersonResult(Persons: Persons): PersonModel[] | null {

        if (Persons.length === 0) {

            return null;

        }

        return PersonModel.mapModel(Persons);

    }

}