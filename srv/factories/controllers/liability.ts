import {
    LiabilityControllerImplementation
} from "@/controllers/liability/implementation";

import {
    oLiabilityServiceFactory
} from "../services/liability";
import { LiabilityController } from "@/controllers/liability/protocols";

export const
oLiabilityControllerFactory:
LiabilityController =

new LiabilityControllerImplementation(
    oLiabilityServiceFactory
);