import { ApplicationService, entity } from "@sap/cds";
import { BaseRoute } from "../base";

export interface EntityRoute extends BaseRoute {

    main(Service: ApplicationService): void;
    
}