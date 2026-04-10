import { EntityModel } from "@/models/entity";
import { Entity } from "@models/apps/dflc/gestordegastos/entities";
import { BaseRepository } from "../base";
import { Request } from "@sap/cds";

export interface EntityRepository extends BaseRepository{
    findByShareId(PersonId: Entity['Share_ID']): Promise<EntityModel[] | null>;
}