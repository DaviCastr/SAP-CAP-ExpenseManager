import {
    BaseController,
    BaseControllerResponse
} from "../base";

import {
    LiabilityTransaction
} from "@models/apps/dflc/expensemanager/entities";

export interface LiabilityTransactionController
    extends BaseController<LiabilityTransaction> {

    reverseTransaction():
        Promise<BaseControllerResponse>;

    recalculateLiability():
        Promise<BaseControllerResponse>;

}