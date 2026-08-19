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
    LiabilityTransaction,
    LiabilityTransactions
} from "@models/apps/dflc/expensemanager/entities";

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


    public async onDelete(
        LiabilityTransaction:
            LiabilityTransaction
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .onDelete(LiabilityTransaction);

        if (result.isLeft()) {
            return this.error(
                result.value.code,
                result.value.message
            );
        }

        return this.success(
            204,
            result.value
        );

    }


    public async afterCreate(
        LiabilityTransactions:
            LiabilityTransactions
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .afterCreate(LiabilityTransactions);

        if (result.isLeft()) {
            return this.error(
                result.value.code,
                result.value.message
            );
        }

        return this.success(
            201,
            result.value
        );

    }


    public async afterUpdate(
        LiabilityTransactions:
            LiabilityTransactions
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .afterUpdate(LiabilityTransactions);

        if (result.isLeft()) {
            return this.error(
                result.value.code,
                result.value.message
            );
        }

        return this.success(
            204,
            result.value
        );

    }

}