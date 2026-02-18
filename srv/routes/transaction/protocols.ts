import { ApplicationService, entity } from "@sap/cds";

export interface TransactionRoute {

    main(Service: ApplicationService): void;
    getEntity(): entity;
    
}