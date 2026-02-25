import { ApplicationService, entity } from "@sap/cds";

export interface ShareRoute {

    main(Service: ApplicationService): void;
    
}