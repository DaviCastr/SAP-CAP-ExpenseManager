import { ApplicationService, entity } from "@sap/cds";

export interface CategoryRoute {

    main(Service: ApplicationService): void;
    getEntity(): entity;

}