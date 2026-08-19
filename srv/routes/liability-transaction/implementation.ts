import { ApplicationService, entity, Request } from "@sap/cds";
import { BaseControllerResponse } from "@/controllers/base";
import { LiabilityTransaction, LiabilityTransactions } from "@models/apps/dflc/expensemanager/entities";
import { LiabilityTransactionRoute } from "./protocols";
import { LiabilityTransactionController } from "@/controllers/liability-transaction/protocols";
import { BaseRouteImplementation } from "../base/implementation";

export class LiabilityTransactionRouteImplementation
    extends BaseRouteImplementation<LiabilityTransaction>
    implements LiabilityTransactionRoute {

    protected Controller:
        LiabilityTransactionController;

    constructor(
        Controller:
            LiabilityTransactionController
    ) {

        super();
        this.Controller =
            Controller;

    }


    public main(
        Service:
            ApplicationService
    ): void {

        const {
            LiabilityTransactions
        } = Service.entities;

        this.mainBase(
            Service,
            LiabilityTransactions
        );

        //On
        Service.on(
            "DELETE",
            LiabilityTransactions as entity,
            this.onDelete.bind(this)
        );

        //After
        Service.after(
            "CREATE",
            LiabilityTransactions as entity,
            this.afterCreate.bind(this)
        );
        Service.after(
            "UPDATE",
            LiabilityTransactions as entity,
            this.afterUpdate.bind(this)
        );
        Service.after(
            "DELETE",
            LiabilityTransactions as entity,
            this.afterDelete.bind(this)
        );

        if (LiabilityTransactions.drafts) {

            Service.on(
                "DELETE",
                LiabilityTransactions.drafts as entity,
                this.onDelete.bind(this)
            );
            Service.after(
                "CREATE",
                LiabilityTransactions.drafts as entity,
                this.afterCreate.bind(this)
            );
            Service.after(
                "UPDATE",
                LiabilityTransactions.drafts as entity,
                this.afterUpdate.bind(this)
            );
            Service.after(
                "DELETE",
                LiabilityTransactions.drafts as entity,
                this.afterDelete.bind(this)
            );

        }

    }


    private async onDelete(
        Request: Request,
        Next: Function
    ): Promise<void> {

        const oTransaction: LiabilityTransaction = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult =
            await this.Controller
                .onDelete(oTransaction);

        if (oResult.status != 204) {

            return this.returnRejectMessage(
                Request,
                oResult
            );

        }

        await Next();

        const oResultAfter =
            await this.Controller
                .onDelete(oTransaction);

        if (oResultAfter.status != 204) {

            return this.returnRejectMessage(
                Request,
                oResultAfter
            );

        }

    }


    private async afterCreate(
        LiabilityTransactions: LiabilityTransactions | LiabilityTransaction,
        Request: Request
    ): Promise<void> {

        const oTransactions = Array.isArray(LiabilityTransactions)
            ? LiabilityTransactions
            : [LiabilityTransactions];

        const oResult =
            await this.Controller
                .afterCreate(oTransactions);

        if (oResult.status != 201) {
            return this.returnRejectMessage(
                Request,
                oResult
            );
        }

    }


    private async afterUpdate(
        LiabilityTransactions: LiabilityTransactions | LiabilityTransaction,
        Request: Request
    ): Promise<void> {

        const oTransactions = Array.isArray(LiabilityTransactions)
            ? LiabilityTransactions
            : [LiabilityTransactions];

        const oResult =
            await this.Controller
                .afterUpdate(oTransactions);

        if (oResult.status != 204) {
            return this.returnRejectMessage(
                Request,
                oResult
            );
        }

    }


    private async afterDelete(
        LiabilityTransactions: LiabilityTransactions | LiabilityTransaction,
        Request: Request
    ): Promise<void> {

        const oTransactions = Array.isArray(Request.data)
            ? Request.data
            : [Request.data];

        const oResult =
            await this.Controller
                .onDelete(oTransactions[0]);

        if (oResult.status != 204) {
            return this.returnRejectMessage(
                Request,
                oResult
            );
        }

    }

}
