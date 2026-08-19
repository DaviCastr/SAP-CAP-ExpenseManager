import {
    BaseController,
    BaseControllerResponse
} from "../base";

import {
    Liability
} from "@models/apps/dflc/expensemanager/entities";

export interface LiabilityController
    extends BaseController<Liability> {

    dashboard():
        Promise<BaseControllerResponse>;

    analytics():
        Promise<BaseControllerResponse>;

    paymentSchedule():
        Promise<BaseControllerResponse>;

    futureImpact():
        Promise<BaseControllerResponse>;

}