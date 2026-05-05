import {
    ApplicationService,
    Request
} from "@sap/cds";

import {
    BaseControllerResponse
} from "@/controllers/base";

import {
    LiabilityTransaction
} from "@models/apps/dflc/gestordegastos/entities";

import {
    BaseRouteImplementation
} from "../base/implementation";

import {
    LiabilityTransactionRoute
} from "./protocols";
import { LiabilityTransactionController } from "@/controllers/liability-transaction/protocols";

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

        Service.on(
            "ReverseTransaction",
            this.reverseTransaction.bind(this)
        );

        Service.on(
            "RecalculateLiability",
            this.recalculateLiability.bind(this)
        );

    }


    private async reverseTransaction(
        Request: Request
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Controller
                .reverseTransaction();

        if (result.status !== 200) {

            return this.returnRejectMessage(
                Request,
                result
            );

        }

        return result;

    }


    private async recalculateLiability(
        Request: Request
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Controller
                .recalculateLiability();

        if (result.status !== 200) {

            return this.returnRejectMessage(
                Request,
                result
            );

        }

        return result;

    }

}