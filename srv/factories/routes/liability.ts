import {
    LiabilityRouteImplementation
} from "@/routes/liability/implementation";

import {
    oLiabilityControllerFactory
} from "../controllers/liability";
import { LiabilityRoute } from "@/routes/liability/protocols";

export const
oLiabilityRouteFactory:
LiabilityRoute =

new LiabilityRouteImplementation(
    oLiabilityControllerFactory
);