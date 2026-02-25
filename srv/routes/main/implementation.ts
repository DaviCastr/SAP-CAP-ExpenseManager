import { ApplicationService, service } from "@sap/cds";
import { BaseRouteImplementation } from "../base/implementation";
import { MainRoute } from "./protocols";
import { oCategoryRouteFactory } from "@/factories/routes/category";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";
import { BaseController } from "@/controllers/base";
import { oTransactionRouteFactory } from "@/factories/routes/transaction";

export class MainRouteImplementation extends BaseRouteImplementation<any> implements MainRoute {

    protected Controller: BaseController<any>;

    constructor() {

        super();

        this.Controller = null as any;

    }


    public main(Service: ApplicationService): void {

        ServiceLocator.setGestorService(Service);
        
        oCategoryRouteFactory.main(Service);

        oTransactionRouteFactory.main(Service);

    }


}