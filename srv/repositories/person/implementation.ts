import cds, { entity, Request } from "@sap/cds";
import Decimal from "decimal.js";

import { PersonModel } from "@/models/person";
import { Person, Persons } from "@models/apps/dflc/gestordegastos/entities";
import { PersonRepository } from "./protocols";
import { CurrencyModel } from "@/models/currency";
import { BaseRepositoryImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";


export class PersonRepositoryImplementation extends BaseRepositoryImplementation implements PersonRepository {


    public async findById(Id: Person["ID"]): Promise<PersonModel | null> {

        const oPersonEntity = this.getEntity();

        const oSql = SELECT.from(oPersonEntity).where({ ID: Id });

        const oPersons = await cds.run(oSql);

        const oPersonsModel = this.mapPersonResult(oPersons);

        if (oPersonsModel) {

            return oPersonsModel[0];

        } else {

            return null;

        }

    }


    protected getEntity(): entity {

        return ServiceLocator.getEntity('Persons');

    }


    protected personPath(): string {

        return '';

    }


    private mapPersonResult(Persons: Persons): PersonModel[] | null {

        if (Persons.length === 0) {

            return null;

        }

        return Persons.map((Person: Person) => {

            const oCurrencyModel = CurrencyModel.with({
                Code: Person.Currency?.code as string,
                Name: Person.Currency?.name as string,
                Description: Person.Currency?.descr as string,
                Symbol: Person.Currency?.symbol as string,
                MinorUnit: Person.Currency?.minorUnit as number
            });

            return PersonModel.with({
                Id: Person.ID as string,
                Name: Person.Name as string,
                ImageType: Person.ImageType as string,
                Income: Person.Income as unknown as Decimal,
                Currency: oCurrencyModel,
                Email: Person.Email as string,
                Phone: Person.Phone as string,
                ExpenseTarget: Person.ExpenseTarget as unknown as Decimal,
                AmountToSave: Person.AmountToSave as unknown as Decimal,
                TotalExpenses: Person.TotalExpenses as unknown as Decimal,
                TotalExpensesMonth: Person.TotalExpensesMonth as unknown as Decimal,
                TotalExpensesPayed: Person.TotalExpensesPayed as unknown as Decimal,
                TotalExpensesToPay: Person.TotalExpensesToPay as unknown as Decimal,
                TotalExpensesClosed: Person.TotalExpensesClosed as unknown as Decimal,
                MonthCriticallity: Person.MonthCriticallity as number,
                CriticallityToPay: Person.CriticallityToPay as number,
                CreatedAt: Person.createdAt as string,
                CreatedBy: Person.createdBy as string,
                ModifiedAt: Person.modifiedAt as string,
                ModifiedBy: Person.modifiedBy as string
            });

        });

    }

}