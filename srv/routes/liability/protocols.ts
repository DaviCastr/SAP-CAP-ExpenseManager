import {
    ApplicationService
} from "@sap/cds";

import {
    BaseRoute
} from "../base";

export interface LiabilityRoute
    extends BaseRoute {

    main(
        Service:
            ApplicationService
    ): void;

}