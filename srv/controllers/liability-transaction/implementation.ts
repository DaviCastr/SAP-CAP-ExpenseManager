import {
    BaseControllerResponse
} from "../base";

import {
    BaseControllerImplementation
} from "../base/implementation";

import {
    LiabilityTransactionController
} from "./protocols";

import {
    LiabilityTransactionService
} from "@/services/liability-transaction";

import {
    LiabilityTransaction
} from "@models/apps/dflc/gestordegastos/entities";

export class LiabilityTransactionControllerImplementation
    extends BaseControllerImplementation<LiabilityTransaction>
    implements LiabilityTransactionController {

    protected Service:
        LiabilityTransactionService;

    constructor(
        Service:
            LiabilityTransactionService
    ) {

        super();

        this.Service =
            Service;

    }


    public async reverseTransaction():
        Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .reverseTransaction();

        if (result.isLeft()) {

            return this.error(
                result.value.code,
                result.value.message
            );

        }

        return this.success(
            200,
            result.value
        );

    }


    public async recalculateLiability():
        Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .recalculateLiability();

        if (result.isLeft()) {

            return this.error(
                result.value.code,
                result.value.message
            );

        }

        return this.success(
            200,
            result.value
        );

    }

}