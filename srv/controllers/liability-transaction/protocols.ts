import {
    BaseController,
    BaseControllerResponse
} from "../base";

import {
    LiabilityTransaction,
    LiabilityTransactions
} from "@models/apps/dflc/expensemanager/entities";

export interface LiabilityTransactionController
    extends BaseController<LiabilityTransaction> {

    onDelete(
        LiabilityTransaction:
            LiabilityTransaction
    ): Promise<BaseControllerResponse>;

    afterCreate(
        LiabilityTransactions:
            LiabilityTransactions
    ): Promise<BaseControllerResponse>;

    afterUpdate(
        LiabilityTransactions:
            LiabilityTransactions
    ): Promise<BaseControllerResponse>;

}