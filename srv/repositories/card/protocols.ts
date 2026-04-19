import { CardModel } from "@/models/card";
import { Card, Cards } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepository } from "../base";

export interface CardRepository extends BaseRepository{
    findById(Id: Card['ID']): Promise<CardModel | null>;
    findByPersonId(PersonId: Card['Person_ID']): Promise<CardModel[] | null>;
    findByPersonIds(PersonId: Card['Person_ID'][]): Promise<CardModel[] | null>;
    findByInvoiceIds(InvoiceIds: Card['ID'] | Card['ID'][]): Promise<CardModel[] | null>;
    createEntry(data: Card | Cards): Promise<CardModel[] | null>;
}