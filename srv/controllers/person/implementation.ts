import { BaseControllerImplementation } from "../base/implementation";
import { PersonController } from "./protocols";
import { PersonService } from "@/services/person";
import { Person } from "@models/apps/dflc/gestordegastos/entities";

export class PersonControllerImplementation extends BaseControllerImplementation<Person> implements PersonController {

    protected Service: PersonService;

    constructor(Service: PersonService) {

        super();
        this.Service = Service;

    }

}