import { ApplicationService, Request } from "@sap/cds";
import { PersonRoute } from "./protocols";
import { BaseRouteImplementation } from "../base/implementation";
import { Person } from "@models/apps/dflc/gestordegastos/entities";
import { BaseControllerResponse } from "@/controllers/base";
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

        Service.on('AddCardExpense', this.addCardExpense.bind(this));
        Service.on('SendInvoices', this.sendInvoices.bind(this));
        Service.on('CardExpensesByCategories', this.cardExpensesByCategories.bind(this));
        Service.on('SimulateExpenses', this.simulateExpenses.bind(this));
        Service.on('SimulateFinancialFuture', this.simulateFinancialFuture.bind(this));

    }


    private async addCardExpense(Request: Request): Promise<BaseControllerResponse> {

         const oResult = await this.Controller.addCardExpense();

        if (oResult.status != 201) {

            return this.returnRejectMessage(Request, oResult);

        }

        return oResult;

    }


    private async sendInvoices(Request: Request): Promise<BaseControllerResponse> {

         const oResult = await this.Controller.sendInvoices();

        if (oResult.status != 201) {

            return this.returnRejectMessage(Request, oResult);

        }

        return oResult;

    }


    private async cardExpensesByCategories(Request: Request): Promise<BaseControllerResponse> {

         const oResult = await this.Controller.cardExpensesByCategories();

        if (oResult.status != 200) {

            return this.returnRejectMessage(Request, oResult);

        }

        return oResult;

    }


    private async simulateExpenses(Request: Request): Promise<BaseControllerResponse> {

         const oResult = await this.Controller.simulateExpenses();

        if (oResult.status != 201) {

            return this.returnRejectMessage(Request, oResult);

        }

        return oResult;

    }


    private async simulateFinancialFuture(Request: Request): Promise<BaseControllerResponse> {

         const oResult = await this.Controller.simulateFinancialFuture();

        if (oResult.status != 201) {

            return this.returnRejectMessage(Request, oResult);

        }

        return oResult;

    }

}