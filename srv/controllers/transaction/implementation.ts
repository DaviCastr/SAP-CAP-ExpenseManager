import { Transactions } from "@models/apps/dflc/expensemanager/entities";
import { BaseControllerResponse } from "../base";
import { BaseControllerImplementation } from "../base/implementation";
import { TransactionController } from "./protocols";
import { TransactionService } from "@/services/transaction";
import { Transaction } from "@models/apps/dflc/expensemanager/entities";

export class TransactionControllerImplementation extends BaseControllerImplementation<Transaction> implements TransactionController {

    protected Service: TransactionService;

    constructor(Service: TransactionService) {

        super();
        this.Service = Service;

    }


    public async onDelete(Transaction: Transaction): Promise<BaseControllerResponse> {

        const oResult = await this.Service.onDelete(Transaction);

        if (oResult.isLeft()) {
            return this.error(oResult.value.code, oResult.value.message);
        }

        return this.success(204, oResult.value);

    }


    public async afterCreate(Transactions: Transactions): Promise<BaseControllerResponse> {

        const oResult = await this.Service.afterCreate(Transactions);

        if (oResult.isLeft()) {
            return this.error(oResult.value.code, oResult.value.message);
        }

        return this.success(201, oResult.value);

    }


    public async afterUpdate(Transactions: Transactions): Promise<BaseControllerResponse> {

        const oResult = await this.Service.afterUpdate(Transactions);

        if (oResult.isLeft()) {
            return this.error(oResult.value.code, oResult.value.message);
        }

        return this.success(204, oResult.value);

    }


}