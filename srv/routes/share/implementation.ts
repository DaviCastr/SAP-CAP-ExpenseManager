import { ApplicationService, entity } from "@sap/cds";
import { ShareRoute } from "./protocols";

export class ShareRouteImplementation implements ShareRoute {

    public Shares: entity | undefined;

    main(Service: ApplicationService): void {
        
        const { Shares } = Service.entities; 

        this.Shares = Shares;

    }

    getEntity(): entity {

        return this.Shares as entity;

    }

}