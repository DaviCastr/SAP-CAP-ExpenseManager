import {
    BaseController,
    BaseControllerResponse
} from "../base";

import {
    Liability,
    Liabilities
} from "@models/apps/dflc/expensemanager/entities";

export interface LiabilityController
    extends BaseController<Liability> {

    afterCreate(
        Liabilities: Liabilities
    ): Promise<BaseControllerResponse>;

    afterUpdate(
        Liabilities: Liabilities
    ): Promise<BaseControllerResponse>;

    dashboard():
        Promise<BaseControllerResponse>;

    analytics():
        Promise<BaseControllerResponse>;

    paymentSchedule():
        Promise<BaseControllerResponse>;

    futureImpact():
        Promise<BaseControllerResponse>;

}