import { ApplicationService, entity, Request } from "@sap/cds";
import { TransactionRoute } from "./protocols";
import { oTransactionControllerFactory } from "@/factories/controllers/transaction";
import { Transaction, Transactions } from "@models/apps/dflc/gestordegastos/entities";
import { TransactionController } from "@/controllers/transaction";
import { BaseRouteImplementation } from "../base/implementation";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

export class TransactionRouteImplementation extends BaseRouteImplementation<Transaction> implements TransactionRoute {

    protected Controller: TransactionController;

    constructor(Controller: TransactionController) {

        super();
        this.Controller = Controller;

    }


    main(Service: ApplicationService): void {

        const { Transactions } = Service.entities;

        this.mainBase(Service, Transactions);

        //On
        Service.on("DELETE", Transactions as entity, this.onDelete.bind(this));

        //After
        Service.after("CREATE", Transactions as entity, this.afterCreate.bind(this));
        Service.after("UPDATE", Transactions as entity, this.afterUpdate.bind(this));

    }


    private async afterCreate(Transactions: Transactions | Transaction, Request: Request): Promise<void> {

        const oTransactions = Array.isArray(Transactions)
            ? Transactions
            : [Transactions];

        const oResult = await this.Controller.afterCreate(oTransactions);

        if (oResult.status != 201) {
            return this.returnRejectMessage(Request, oResult);
        }

    }


    private async afterUpdate(Transactions: Transactions | Transaction, Request: Request): Promise<void> {

        const oTransactions = Array.isArray(Transactions)
            ? Transactions
            : [Transactions];

        const oResult = await this.Controller.afterUpdate(oTransactions);

        if (oResult.status != 204) {
            return this.returnRejectMessage(Request, oResult);
        }

    }


    private async onDelete(Request: Request, Next: Function): Promise<void> {

        const oTransaction: Transaction = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult = await this.Controller.onDelete(oTransaction);

        if (oResult.status != 204) {

            return this.returnRejectMessage(Request, oResult);

        }

        await Next();

    }


}