import {
    LiabilityTransactionRouteImplementation
} from "@/routes/liability-transaction/implementation";

import {
    oLiabilityTransactionControllerFactory
} from "../controllers/liability-transaction";
import { LiabilityTransactionRoute } from "@/routes/liability-transaction/protocols";

export const
oLiabilityTransactionRouteFactory:
LiabilityTransactionRoute =

new LiabilityTransactionRouteImplementation(
    oLiabilityTransactionControllerFactory
);