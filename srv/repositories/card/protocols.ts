import { CardModel } from "@/models/card";
import { Card, Cards } from "@models/apps/dflc/expensemanager/entities";
import { BaseRepository } from "../base";

export interface CardRepository extends BaseRepository{
    findById(Id: Card['ID']): Promise<CardModel | null>;
    findByPersonId(PersonId: Card['Person_ID']): Promise<CardModel[] | null>;
    findByPersonIds(PersonId: Card['Person_ID'][], additionalFilters?: {}): Promise<CardModel[] | null>;
    findByInvoiceIds(InvoiceIds: Card['ID'] | Card['ID'][]): Promise<CardModel[] | null>;
    retrieveCompleteInvoiceTransactions(PersonId: string, Year: number, Month: number): Promise<any[]>
    createEntry(data: Card | Cards): Promise<CardModel[] | null>;
}