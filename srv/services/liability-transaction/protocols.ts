import { BaseService } from "../base";
import { Either } from "@sweet-monads/either";
import { AbstractError } from "@/errors";

import {
    LiabilityTransaction
} from "@models/apps/dflc/gestordegastos/entities";

export interface LiabilityTransactionService
    extends BaseService<LiabilityTransaction> {

    reverseTransaction():
        Promise<
            Either<
                AbstractError,
                LiabilityTransaction
            >
        >;

    recalculateLiability():
        Promise<
            Either<
                AbstractError,
                boolean
            >
        >;

}