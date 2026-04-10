import { ApplicationService, service } from "@sap/cds";
import { BaseRouteImplementation } from "../base/implementation";
import { MainRoute } from "./protocols";
import { oCategoryRouteFactory } from "@/factories/routes/category";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";
import { BaseController } from "@/controllers/base";
import { oTransactionRouteFactory } from "@/factories/routes/transaction";
import { oShareRouteFactory } from "@/factories/routes/share";
import { oEntityRouteFactory } from "@/factories/routes/entity";
import { oInvoiceRouteFactory } from "@/factories/routes/invoice";

export class MainRouteImplementation extends BaseRouteImplementation<any> implements MainRoute {

    protected Controller: BaseController<any>;

    constructor() {

        super();

        this.Controller = null as any;

    }


    public main(Service: ApplicationService): void {

        ServiceLocator.setGestorService(Service);

        oShareRouteFactory.main(Service);

        oEntityRouteFactory.main(Service);
        
        oCategoryRouteFactory.main(Service);

        oInvoiceRouteFactory.main(Service);

        oTransactionRouteFactory.main(Service);

    }


}