import cds from '@sap/cds';

import { CategoryRoute } from "./protocols";
import { CategoryController } from "@/controllers/category";
import { ApplicationService, entity, Request } from "@sap/cds";
import { Category } from '@models/apps/dflc/gestordegastos/entities';
import { BaseController, BaseControllerResponse } from '@/controllers/base';
import { BaseRouteImplementation } from '../base/implementation';
import { ServiceLocator } from '@/infrastructure/ServiceLocator';

export class CategoryRouteImplementation extends BaseRouteImplementation<Category> implements CategoryRoute {

    protected Controller: CategoryController;

    constructor(Controller: CategoryController) {

        super();

        this.Controller = Controller;

    }

    public main(Service: ApplicationService): void {

        const { Categories } = Service.entities;

        this.mainBase(Service, Categories);

    }

    
}