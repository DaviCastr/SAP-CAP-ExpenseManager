import { ApplicationService, entity } from "@sap/cds";
import { PersonRoute } from "./protocols";

export class PersonRouteImplementation implements PersonRoute {
    
    public Persons: entity | undefined;
    
    main(Service: ApplicationService): void {
        
        const { Persons } = Service.entities;

        this.Persons = Persons;

    }

    getEntity(): entity {

        return this.Persons as entity;

    }
}