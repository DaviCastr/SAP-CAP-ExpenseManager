import {
    ApplicationService
} from "@sap/cds";

import {
    BaseRoute
} from "../base";

export interface LiabilityTransactionRoute
    extends BaseRoute {

    main(
        Service:
            ApplicationService
    ): void;

}