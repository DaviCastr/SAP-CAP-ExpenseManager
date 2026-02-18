import { ApplicationService, entity } from "@sap/cds";
import { TransactionRoute } from "./protocols";

export class TransactionRouteImplementation implements TransactionRoute {

    public Transactions: entity | undefined;

    // constructor(private readonly controller: TransactionController) { }

    main(Service: ApplicationService): void {
        
        const { Transactions } = Service.entities; 

        this.Transactions = Transactions;

    }

    getEntity(): entity {

        return this.Transactions as entity;

    }

    // private afterRead(Request: Request): Promise<void> {



    // }

}