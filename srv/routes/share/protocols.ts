import { ApplicationService, entity } from "@sap/cds";
import { BaseRoute } from "../base";

export interface ShareRoute extends BaseRoute {

    main(Service: ApplicationService): void;
    
}