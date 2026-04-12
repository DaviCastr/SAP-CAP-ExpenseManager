import { ApplicationService, entity } from "@sap/cds";
import { PersonRoute } from "./protocols";
import { BaseRouteImplementation } from "../base/implementation";
import { Person } from "@models/apps/dflc/gestordegastos/entities";
import { BaseController } from "@/controllers/base";
import { PersonController } from "@/controllers/person";

export class PersonRouteImplementation extends BaseRouteImplementation<Person> implements PersonRoute {

    protected Controller: PersonController;


    constructor(Controller: PersonController) {

        super();

        this.Controller = Controller;

    }

 
    main(Service: ApplicationService): void {

        const { Persons } = Service.entities;

        this.mainBase(Service, Persons);

    }

}