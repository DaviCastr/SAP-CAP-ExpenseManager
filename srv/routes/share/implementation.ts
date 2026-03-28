import { ApplicationService, entity } from "@sap/cds";
import { ShareRoute } from "./protocols";
import { BaseRouteImplementation } from "../base/implementation";
import { Share } from "@models/apps/dflc/gestordegastos/entities";
import { BaseController } from "@/controllers/base";

export class ShareRouteImplementation extends BaseRouteImplementation<Share> implements ShareRoute {

    protected Controller: BaseController<Share>;


    constructor() {

        super();

        this.Controller = null as any;

    }


    main(Service: ApplicationService): void {

        const { Shares } = Service.entities;

        this.mainBase(Service, Shares);

    }

    
}