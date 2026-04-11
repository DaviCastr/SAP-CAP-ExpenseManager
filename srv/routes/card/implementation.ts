import { ApplicationService } from "@sap/cds";
import { CardRoute } from "./protocols";
import { Card } from "@models/apps/dflc/gestordegastos/entities";
import { CardController } from "@/controllers/card";
import { BaseRouteImplementation } from "../base/implementation";

export class CardRouteImplementation extends BaseRouteImplementation<Card> implements CardRoute {

    protected Controller: CardController;

    constructor(Controller: CardController) {

        super();
        this.Controller = Controller;

    }


    main(Service: ApplicationService): void {

        const { Cards } = Service.entities;

        this.mainBase(Service, Cards);

    }

}