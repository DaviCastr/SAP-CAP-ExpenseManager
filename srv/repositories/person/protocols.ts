import { PersonModel } from "@/models/person";
import { Card, Person } from "@models/apps/dflc/gestordegastos/entities";
import { Request } from "@sap/cds";
import { BaseRepository } from "../base";

export interface PersonRepository extends BaseRepository {
    findById(Id: Person['ID']): Promise<PersonModel | null>;
    findByCardId(CardId: Card['ID']): Promise<PersonModel | null>;
}