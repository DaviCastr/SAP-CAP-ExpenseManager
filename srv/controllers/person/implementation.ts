import { BaseControllerResponse } from "../base";
import { BaseControllerImplementation } from "../base/implementation";
import { PersonController } from "./protocols";
import { PersonService } from "@/services/person";
import { Person } from "@models/apps/dflc/expensemanager/entities";

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


    public async sendInvoices(): Promise<BaseControllerResponse> {

        const result = await this.Service.sendInvoices();

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(201, result.value);

    }


    public async cardExpensesByCategories(): Promise<BaseControllerResponse> {

        const result = await this.Service.cardExpensesByCategories();

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(200, result.value);

    }


    public async simulateExpenses(): Promise<BaseControllerResponse> {

        const result = await this.Service.simulateExpenses();

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(201, result.value);

    }


    public async simulateFinancialFuture(): Promise<BaseControllerResponse> {

        const result = await this.Service.simulateFinancialFuture();

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(201, result.value);

    }


    public async retrieveTransactionsByCategory(): Promise<BaseControllerResponse> {

        const result = await this.Service.retrieveTransactionsByCategory();

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(200, result.value);

    }


    public async retrieveCompleteInvoice(): Promise<BaseControllerResponse> {

        const result = await this.Service.retrieveCompleteInvoice();

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(200, result.value);

    }

}