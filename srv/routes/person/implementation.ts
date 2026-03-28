import { ApplicationService, entity } from "@sap/cds";
import { PersonRoute } from "./protocols";
import { BaseRouteImplementation } from "../base/implementation";
import { Person } from "@models/apps/dflc/gestordegastos/entities";
import { BaseController } from "@/controllers/base";

export class PersonRouteImplementation extends BaseRouteImplementation<Person> implements PersonRoute {

    protected Controller: BaseController<Person>;


    constructor() {

        super();

        this.Controller = null as any;

    }


    main(Service: ApplicationService): void {

        const { Persons } = Service.entities;

        this.mainBase(Service, Persons);

        this.Controller = null as any;

    }

}