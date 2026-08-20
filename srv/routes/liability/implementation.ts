import {
    ApplicationService,
    entity,
    Request
} from "@sap/cds";

import {
    BaseControllerResponse
} from "@/controllers/base";

import {
    Liability,
    Liabilities
} from "@models/apps/dflc/expensemanager/entities";

import {
    BaseRouteImplementation
} from "../base/implementation";

import {
    LiabilityRoute
} from "./protocols";

import { LiabilityController } from "@/controllers/liability/protocols";

export class LiabilityRouteImplementation
    extends BaseRouteImplementation<Liability>
    implements LiabilityRoute {

    protected Controller:
        LiabilityController;

    constructor(
        Controller:
            LiabilityController
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
            Liabilities
        } = Service.entities;

        this.mainBase(
            Service,
            Liabilities
        );

        // After the debt is created or its editable fields (TotalAmount,
        // DueDay) are changed the derived values are recomputed from the
        // transactions. The hooks run for the active entity set and for the
        // drafts set, so a draft keeps its own computed values until
        // activation.
        Service.after(
            "CREATE",
            Liabilities as entity,
            this.afterCreate.bind(this)
        );
        Service.after(
            "UPDATE",
            Liabilities as entity,
            this.afterUpdate.bind(this)
        );

        if (Liabilities.drafts) {

            Service.after(
                "CREATE",
                Liabilities.drafts as entity,
                this.afterCreate.bind(this)
            );
            Service.after(
                "UPDATE",
                Liabilities.drafts as entity,
                this.afterUpdate.bind(this)
            );

        }

        Service.on(
            "Dashboard",
            this.dashboard.bind(this)
        );

        Service.on(
            "Analytics",
            this.analytics.bind(this)
        );

        Service.on(
            "PaymentSchedule",
            this.paymentSchedule.bind(this)
        );

        Service.on(
            "FutureImpact",
            this.futureImpact.bind(this)
        );

    }


    private async afterCreate(
        Liabilities: Liabilities | Liability,
        Request: Request
    ): Promise<void> {

        const oLiabilities = Array.isArray(Liabilities)
            ? Liabilities
            : [Liabilities];

        const oResult =
            await this.Controller
                .afterCreate(oLiabilities);

        if (oResult.status != 201) {
            return this.returnRejectMessage(
                Request,
                oResult
            );
        }

    }


    private async afterUpdate(
        Liabilities: Liabilities | Liability,
        Request: Request
    ): Promise<void> {

        const oLiabilities = Array.isArray(Liabilities)
            ? Liabilities
            : [Liabilities];

        const oResult =
            await this.Controller
                .afterUpdate(oLiabilities);

        if (oResult.status != 204) {
            return this.returnRejectMessage(
                Request,
                oResult
            );
        }

    }


    private async dashboard(
        Request: Request
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Controller
                .dashboard();

        if (result.status !== 200) {
            return this.returnRejectMessage(
                Request,
                result
            );
        }

        return result;

    }


    private async analytics(
        Request: Request
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Controller
                .analytics();

        if (result.status !== 200) {
            return this.returnRejectMessage(
                Request,
                result
            );
        }

        return result;

    }


    private async paymentSchedule(
        Request: Request
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Controller
                .paymentSchedule();

        if (result.status !== 200) {
            return this.returnRejectMessage(
                Request,
                result
            );
        }

        return result;

    }


    private async futureImpact(
        Request: Request
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Controller
                .futureImpact();

        if (result.status !== 200) {
            return this.returnRejectMessage(
                Request,
                result
            );
        }

        return result;

    }

}