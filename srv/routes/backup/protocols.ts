import { ApplicationService, entity } from "@sap/cds";
import { BaseRoute } from "../base";

export interface BackupRoute extends BaseRoute {

    main(Service: ApplicationService): void;
    
}