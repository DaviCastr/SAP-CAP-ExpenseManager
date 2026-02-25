import { ApplicationService } from "@sap/cds";

export interface MainRoute {

    main(Service: ApplicationService): void;

}