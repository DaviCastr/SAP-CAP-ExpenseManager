import { BaseService } from "../base";
import { AbstractError } from "@/errors";
import { Either } from "@sweet-monads/either";

import {
    Liability,
    Liabilities
} from "@models/apps/dflc/expensemanager/entities";

import {
    LiabilityDashboardReturnProperties
} from "@/models/liability-dashboard";

import {
    LiabilityAnalyticsReturnProperties
} from "@/models/liability-analytics";

import {
    LiabilityPaymentScheduleReturnProperties
} from "@/models/liability-payment-schedule";

import {
    LiabilityFutureImpactReturnProperties
} from "@/models/liability-future-impact";

export interface LiabilityService
    extends BaseService<Liability> {

    afterCreate(
        Liabilities: Liabilities
    ): Promise<
        Either<
            AbstractError,
            boolean
        >
    >;

    afterUpdate(
        Liabilities: Liabilities
    ): Promise<
        Either<
            AbstractError,
            boolean
        >
    >;

    recalculateLiability(
        liabilityId: string
    ): Promise<
        Either<
            AbstractError,
            boolean
        >
    >;

    dashboard():
        Promise<
            Either<
                AbstractError,
                LiabilityDashboardReturnProperties
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

    futureImpact():
        Promise<
            Either<
                AbstractError,
                LiabilityFutureImpactReturnProperties
            >
        >;

}