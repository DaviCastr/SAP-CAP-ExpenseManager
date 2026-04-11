import { ApplicationService, entity } from "@sap/cds";

export interface CardRoute {

    main(Service: ApplicationService): void;
    
}