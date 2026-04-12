import cds, { entity, Request } from "@sap/cds";
import Decimal from "decimal.js";

import { PersonModel } from "@/models/person";
import { Person, Persons } from "@models/apps/dflc/gestordegastos/entities";
import { PersonRepository } from "./protocols";
import { CurrencyModel } from "@/models/currency";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class PersonRepositoryImplementation extends BaseRepositoryImplementation implements PersonRepository {


    public async findById(Id: Person["ID"], ignoreDraft?: boolean): Promise<PersonModel | null> {

        let oPersonEntity = this.getEntity(ignoreDraft);

        let oSql = SELECT.from(oPersonEntity).where({ ID: Id });

        let oPersons = await cds.run(oSql);

        if ((oPersonEntity as any)?.isDraft) {

            oPersonEntity = this.getEntity(true);

            oSql = SELECT.from(oPersonEntity).where({ ID: Id });

            const additionalPersons = await cds.run(oSql) || [];
            oPersons = [...(oPersons || []), ...additionalPersons];

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

            oPersonEntity = this.getEntity(true);

            oSql = SELECT.from(oPersonEntity).where`Cards.ID = ${CardId} `;

            const additionalPersons = await cds.run(oSql) || [];
            oPersons = [...(oPersons || []), ...additionalPersons];

        }

        const oPersonsModel = this.mapPersonResult(oPersons);

        if (oPersonsModel) {

            return oPersonsModel[0];

        } else {

            return null;

        }

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