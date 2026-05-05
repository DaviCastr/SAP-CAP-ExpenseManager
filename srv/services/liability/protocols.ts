import { BaseService } from "../base";
import { AbstractError } from "@/errors";
import { Either } from "@sweet-monads/either";

import {
    Liability
} from "@models/apps/dflc/expensemanager/entities";

import {
    LiabilityDashboardReturnProperties
} from "@/models/liability-dashboard";

import {
    LiabilityPayReturnProperties
} from "@/models/liability-pay";

import {
    LiabilityCloseReturnProperties
} from "@/models/liability-close";

import {
    LiabilityAnalyticsReturnProperties
} from "@/models/liability-analytics";

import {
    LiabilityPaymentScheduleReturnProperties
} from "@/models/liability-payment-schedule";

import {
    LiabilityRenegotiationReturnProperties
} from "@/models/liability-renegotiation";

import {
    LiabilityCreateReturnProperties
} from "@/models/liability-create";

import {
    LiabilityFutureImpactReturnProperties
} from "@/models/liability-future-impact";

export interface LiabilityService
    extends BaseService<Liability> {

    createLiability():
        Promise<
            Either<
                AbstractError,
                LiabilityCreateReturnProperties
            >
        >;

    dashboard():
        Promise<
            Either<
                AbstractError,
                LiabilityDashboardReturnProperties
            >
        >;

    payLiability():
        Promise<
            Either<
                AbstractError,
                LiabilityPayReturnProperties
            >
        >;

    closeLiability():
        Promise<
            Either<
                AbstractError,
                LiabilityCloseReturnProperties
            >
        >;

    analytics():
        Promise<
            Either<
                AbstractError,
                LiabilityAnalyticsReturnProperties
            >
        >;

    paymentSchedule():
        Promise<
            Either<
                AbstractError,
                LiabilityPaymentScheduleReturnProperties
            >
        >;

    renegotiate():
        Promise<
            Either<
                AbstractError,
                LiabilityRenegotiationReturnProperties
            >
        >;

    futureImpact():
        Promise<
            Either<
                AbstractError,
                LiabilityFutureImpactReturnProperties
            >
        >;

}