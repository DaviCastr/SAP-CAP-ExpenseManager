import { ApplicationService, entity } from "@sap/cds";
import { BaseRoute } from "../base";

export interface PersonRoute extends BaseRoute {

    main(Service: ApplicationService): void;

}