import {
    BaseControllerResponse
} from "../base";

import {
    BaseControllerImplementation
} from "../base/implementation";

import {
    LiabilityController
} from "./protocols";

import {
    LiabilityService
} from "@/services/liability";

import {
    Liability,
    Liabilities
} from "@models/apps/dflc/expensemanager/entities";

export class LiabilityControllerImplementation
    extends BaseControllerImplementation<Liability>
    implements LiabilityController {

    protected Service:
        LiabilityService;

    constructor(
        Service:
            LiabilityService
    ) {

        super();

        this.Service =
            Service;

    }


    public async afterCreate(
        Liabilities: Liabilities
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .afterCreate(Liabilities);

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
        Liabilities: Liabilities
    ): Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .afterUpdate(Liabilities);

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


    public async dashboard():
        Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .dashboard();

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


    public async analytics():
        Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .analytics();

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


    public async paymentSchedule():
        Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .paymentSchedule();

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


    public async futureImpact():
        Promise<BaseControllerResponse> {

        const result =
            await this.Service
                .futureImpact();

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