import cds from '@sap/cds';

import { CategoryRoute } from "./protocols";
import { CategoryController } from "@/controllers/category";
import { ApplicationService, entity, Request } from "@sap/cds";
import { Category } from '@models/GestorDeGastos';
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

        Service.before("READ", Categories as entity, this.beforeRead.bind(this));
        Service.before("UPDATE", Categories as entity, this.beforeUpdate.bind(this));
        Service.before("EDIT", Categories as entity, this.beforeEdit.bind(this));
        Service.before("DELETE", Categories as entity, this.beforeDelete.bind(this));

        //Draft
        Service.before("READ", Categories.drafts as entity, this.beforeRead.bind(this));
        Service.before("CREATE", Categories.drafts as entity, this.beforeCreate.bind(this));
        Service.before("DELETE", Categories.drafts as entity, this.beforeDelete.bind(this));

        // Service.on("READ", Categories, async (req, next) => {

        //     let active = await next(); // ativos

        //     if(!Array.isArray(active)){
        //         active = [active];
        //     }

        //     const draftsOnly = await cds.run(
        //         SELECT.from(Categories.drafts!) 
        //             .where({ HasActiveEntity: false })
        //     );

        //     return [...active, ...draftsOnly];

        // });


    }

    
}