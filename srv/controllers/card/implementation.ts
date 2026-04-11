import { BaseControllerImplementation } from "../base/implementation";
import { CardController } from "./protocols";
import { CardService } from "@/services/card";
import { Card } from "@models/apps/dflc/gestordegastos/entities";

export class CardControllerImplementation extends BaseControllerImplementation<Card> implements CardController {

    protected Service: CardService;

    constructor(Service: CardService) {

        super();
        this.Service = Service;

    }

}