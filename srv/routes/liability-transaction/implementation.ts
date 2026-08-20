import { ApplicationService, entity, Request } from "@sap/cds";
import cds from "@sap/cds";
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

        // A DELETE issued through the draft tree (URL prefix
        // `.../Persons(ID,IsActiveEntity=false)/Liabilities(ID)`) is dispatched
        // with the ACTIVE entity as request target, so the default delete would
        // remove the row from the active table instead of the draft. Whenever a
        // draft sibling row exists the draft row is deleted manually and the
        // default handler is skipped, keeping the deletion inside the draft (a
        // discarded draft then restores the row; activation removes it from the
        // active table together with the rest of the draft tree).
        const oEntity =
            Request.target as entity;

        const oTransactionId =
            Request.data?.ID ??
            (Request.params as any)?.[0]?.ID;

        const oDraftsEntity =
            (oEntity?.drafts as entity) || null;

        let oDraftExists = false;

        if (
            oDraftsEntity &&
            oTransactionId
        ) {

            const oDraftRows =
                await cds.run(
                    SELECT.from(oDraftsEntity)
                        .where({
                            ID: oTransactionId
                        })
                );

            oDraftExists =
                (oDraftRows?.length ?? 0) > 0;

        }

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

        if (oDraftExists) {

            await cds.run(
                DELETE.from(oDraftsEntity as entity)
                    .where({
                        ID: oTransactionId
                    })
            );

        } else {

            await Next();

        }

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
