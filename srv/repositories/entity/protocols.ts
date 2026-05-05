import { EntityModel } from "@/models/entity";
import { Entities, Entity } from "@models/apps/dflc/expensemanager/entities";
import { BaseRepository } from "../base";

export interface EntityRepository extends BaseRepository {
    findById(Id: Entity['ID']): Promise<EntityModel | null>;
    findByShareId(ShareId: Entity['Share_ID']): Promise<EntityModel[] | null>;
    findByShareIds(ShareIds: Entity['Share_ID'][]): Promise<EntityModel[] | null>;
    createEntry(data: Entity | Entities): Promise<EntityModel[] | null>;
}