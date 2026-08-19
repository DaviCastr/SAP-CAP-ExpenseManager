import {
    ApplicationService,
    Request
} from "@sap/cds";

import {
    BaseControllerResponse
} from "@/controllers/base";

import {
    Liability
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