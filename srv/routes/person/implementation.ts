import { ApplicationService, entity } from "@sap/cds";
import { PersonRoute } from "./protocols";

export class PersonRouteImplementation implements PersonRoute {
    
    main(Service: ApplicationService): void {
        
        const { Persons } = Service.entities;

    }

}