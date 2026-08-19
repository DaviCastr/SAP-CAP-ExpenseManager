import { BaseService } from "../base";
import { Either } from "@sweet-monads/either";
import { AbstractError } from "@/errors";

import {
    LiabilityTransaction,
    LiabilityTransactions
} from "@models/apps/dflc/expensemanager/entities";

export interface LiabilityTransactionService
    extends BaseService<LiabilityTransaction> {

    afterCreate(
        LiabilityTransactions:
            LiabilityTransactions
    ): Promise<
        Either<
            AbstractError,
            boolean
        >
    >;

    afterUpdate(
        LiabilityTransactions:
            LiabilityTransactions
    ): Promise<
        Either<
            AbstractError,
            boolean
        >
    >;

    onDelete(
        Transaction:
            LiabilityTransaction
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

}