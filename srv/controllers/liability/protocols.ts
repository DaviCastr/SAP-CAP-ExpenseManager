import {
    BaseController,
    BaseControllerResponse
} from "../base";

import {
    Liability
} from "@models/apps/dflc/gestordegastos/entities";

export interface LiabilityController
    extends BaseController<Liability> {

    createLiability():
        Promise<BaseControllerResponse>;

    dashboard():
        Promise<BaseControllerResponse>;

    analytics():
        Promise<BaseControllerResponse>;

    paymentSchedule():
        Promise<BaseControllerResponse>;

    renegotiate():
        Promise<BaseControllerResponse>;

    futureImpact():
        Promise<BaseControllerResponse>;

    payLiability():
        Promise<BaseControllerResponse>;

    closeLiability():
        Promise<BaseControllerResponse>;

}