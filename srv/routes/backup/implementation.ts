import { ApplicationService } from "@sap/cds";
import { BackupRoute } from "./protocols";
import { BaseRouteImplementation } from "../base/implementation";
import { Backup } from "@models/apps/dflc/gestordegastos/entities";
import { BackupController } from "@/controllers/backup/protocols";

export class BackupRouteImplementation extends BaseRouteImplementation<Backup> implements BackupRoute {

    protected Controller: BackupController;


    constructor(Controller: BackupController) {

        super();

        this.Controller = Controller;

    }


    main(Service: ApplicationService): void {

        const { Entities } = Service.entities;

        this.mainBase(Service, Entities);

    }

    
}