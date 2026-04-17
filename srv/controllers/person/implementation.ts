import { BaseControllerResponse } from "../base";
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


    public async addCardExpense(): Promise<BaseControllerResponse> {

        const result = await this.Service.addCardExpense();

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(201, result.value);

    }

}