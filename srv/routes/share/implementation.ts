import { ApplicationService, entity } from "@sap/cds";
import { ShareRoute } from "./protocols";

export class ShareRouteImplementation implements ShareRoute {

    main(Service: ApplicationService): void {
        
        const { Shares } = Service.entities; 


    }

}