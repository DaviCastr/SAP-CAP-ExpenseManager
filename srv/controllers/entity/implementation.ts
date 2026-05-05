import { Entity } from "@models/apps/dflc/expensemanager/entities";
import { BaseControllerImplementation } from "../base/implementation";
import { EntityController } from "./protocols";
import { EntityService } from "@/services/entity";

export class EntityControllerImplementation extends BaseControllerImplementation<Entity> implements EntityController {

    protected Service: EntityService;
    
    constructor(Service: EntityService){

        super();
        this.Service = Service;

    }

}