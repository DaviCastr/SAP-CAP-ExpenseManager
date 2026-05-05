import { ApplicationService, entity } from "@sap/cds";
import { ShareRoute } from "./protocols";
import { BaseRouteImplementation } from "../base/implementation";
import { Share } from "@models/apps/dflc/expensemanager/entities";
import { BaseController } from "@/controllers/base";
import { ShareController } from "@/controllers/share/protocols";

export class ShareRouteImplementation extends BaseRouteImplementation<Share> implements ShareRoute {

    protected Controller: ShareController;


    constructor(Controller: ShareController) {

        super();

        this.Controller = Controller;

    }


    main(Service: ApplicationService): void {

        const { Shares } = Service.entities;

        this.mainBase(Service, Shares);

    }

    
}