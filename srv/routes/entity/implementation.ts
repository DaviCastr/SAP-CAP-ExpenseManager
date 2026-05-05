import { ApplicationService, entity } from "@sap/cds";
import { EntityRoute } from "./protocols";
import { BaseRouteImplementation } from "../base/implementation";
import { Entity } from "@models/apps/dflc/expensemanager/entities";
import { BaseController } from "@/controllers/base";
import { EntityController } from "@/controllers/entity/protocols";

export class EntityRouteImplementation extends BaseRouteImplementation<Entity> implements EntityRoute {

    protected Controller: EntityController;


    constructor(Controller: EntityController) {

        super();

        this.Controller = Controller;

    }


    main(Service: ApplicationService): void {

        const { Entities } = Service.entities;

        this.mainBase(Service, Entities);

    }

    
}