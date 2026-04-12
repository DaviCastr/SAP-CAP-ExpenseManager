import { CardModel } from "@/models/card";
import { Card } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepository } from "../base";

export interface CardRepository extends BaseRepository{
    findById(Id: Card['ID']): Promise<CardModel | null>;
    findByPersonId(PersonId: Card['Person_ID']): Promise<CardModel[] | null>;
    findByPersonIds(PersonId: Card['Person_ID'][]): Promise<CardModel[] | null>;
}