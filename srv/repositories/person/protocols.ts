import { PersonModel } from "@/models/person";
import { Card, Person, Persons } from "@models/apps/dflc/expensemanager/entities";
import { BaseRepository } from "../base";

export interface PersonRepository extends BaseRepository {
    findById(Id: Person['ID'], ignoreDraft?: boolean): Promise<PersonModel | null>;
    findByCardId(CardId: Card['ID']): Promise<PersonModel | null>;
    findByUser(createdBy: Person['createdBy']): Promise<PersonModel[] | null>;
    findAll(genericFilters?: {}): Promise<PersonModel[] | null>;
    createEntry(data: Person | Persons): Promise<PersonModel[] | null>;
}