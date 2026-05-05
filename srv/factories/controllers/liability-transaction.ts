import {
    LiabilityTransactionControllerImplementation
} from "@/controllers/liability-transaction/implementation";

import {
    oLiabilityTransactionServiceFactory
} from "../services/liability-transaction";
import { LiabilityTransactionController } from "@/controllers/liability-transaction/protocols";

export const
oLiabilityTransactionControllerFactory:
LiabilityTransactionController =

new LiabilityTransactionControllerImplementation(
    oLiabilityTransactionServiceFactory
);