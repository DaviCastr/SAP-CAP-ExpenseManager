import { User } from "@sap/cds";
import Decimal from "decimal.js";

import {
    Either,
    left,
    right
} from "@sweet-monads/either";

import {
    BaseServiceImplementation
} from "../base/implementation";

import {
    LiabilityTransactionService
} from "./protocols";

import {
    LiabilityTransaction
} from "@models/apps/dflc/expensemanager/entities";

import {
    AbstractError
} from "@/errors";

import {
    PermissionDenied
} from "@/errors/permission-denied";

import {
    LiabilityTransactionRepository
} from "@/repositories/liability-transaction";

import {
    LiabilityRepository
} from "@/repositories/liability";

import {
    PersonRepository
} from "@/repositories/person";

import {
    ShareRepository
} from "@/repositories/share";

import {
    EntityRepository
} from "@/repositories/entity";

import {
    EntitiesCodes
} from "@/constants/entities-codes";

import {
    ServiceLocator
} from "@/infrastructure/ServiceLocator";

import {
    ServiceRegistry
} from "@/infrastructure/ServiceRegistry";

export class LiabilityTransactionServiceImplementation
    extends BaseServiceImplementation<LiabilityTransaction>
    implements LiabilityTransactionService {

    public Repository:
        LiabilityTransactionRepository;

    constructor(
        PersonRepository: PersonRepository,
        ShareRepository: ShareRepository,
        EntityRepository: EntityRepository,

        Repository:
            LiabilityTransactionRepository,

        private readonly LiabilityRepository:
            LiabilityRepository

    ) {

        super(
            PersonRepository,
            ShareRepository,
            EntityRepository
        );

        this.Repository = Repository;

    }


    public entityCode(): number {

        return EntitiesCodes.LiabilityTransactions;

    }


    protected personPath(): string[] {

        return ["Liability", "Person"];

    }


    protected parentField():
        string | null {

        return "Liability.Person_ID";

    }


    public async beforeCreate(
        entity: LiabilityTransaction,
        user: User
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const result =
            await this.processBeforeCreate(
                entity,
                user
            );

        if (result.isLeft()) {
            return result;
        }

        return this.validateTransaction(
            entity
        );

    }


    public async beforeUpdate(
        entity: LiabilityTransaction,
        user: User
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const result =
            await this.processBeforeUpdate(
                entity,
                user
            );

        if (result.isLeft()) {
            return result;
        }

        return this.validateTransaction(
            entity
        );

    }


    public async beforeEdit(
        entity: LiabilityTransaction,
        user: User
    ): Promise<
        Either<AbstractError, boolean>
    > {

        return this.beforeUpdate(
            entity,
            user
        );

    }


    private async validateTransaction(
        entity: LiabilityTransaction
    ): Promise<
        Either<AbstractError, boolean>
    > {

        if (!entity?.Liability_ID) {

            return left(
                new PermissionDenied(
                    "error.invalidLiability",
                    400,
                    new Error().stack || ""
                )
            );

        }

        if (
            entity.Amount === undefined ||
            entity.Amount === null
        ) {

            return left(
                new PermissionDenied(
                    "error.invalidAmount",
                    400,
                    new Error().stack || ""
                )
            );

        }

        if (
            Number(entity.Amount) === 0
        ) {

            return left(
                new PermissionDenied(
                    "error.invalidAmount",
                    400,
                    new Error().stack || ""
                )
            );

        }

        const liability =
            await this.LiabilityRepository
                .findById(
                    entity.Liability_ID,
                    true
                );

        if (!liability) {

            return left(
                new PermissionDenied(
                    "error.invalidLiability",
                    404,
                    new Error().stack || ""
                )
            );

        }

        return right(true);

    }


    private async authorizeLiabilityRead(
        liabilityId: string
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const request =
            ServiceLocator.getRequest();

        const liabilityService =
            ServiceRegistry.get(
                "Liabilities"
            ) as any;

        if (!liabilityService) {
            return right(true);
        }

        const auth =
            await liabilityService.afterRead(
                [{ ID: liabilityId }],
                request.user
            );

        if (auth.isLeft()) {
            return auth;
        }

        if (!auth.value?.length) {

            return left(
                new PermissionDenied(
                    "error.modificationPermissionDenied",
                    403,
                    new Error().stack || ""
                )
            );

        }

        return right(true);

    }


    private async authorizeLiabilityUpdate(
        liabilityId: string
    ): Promise<
        Either<AbstractError, boolean>
    > {

        const request =
            ServiceLocator.getRequest();

        const liabilityService =
            ServiceRegistry.get(
                "Liabilities"
            ) as any;

        if (!liabilityService) {
            return right(true);
        }

        return liabilityService.beforeUpdate(
            { ID: liabilityId },
            request.user
        );

    }


    private async recalculateLiabilityInternal(
        liabilityId: string
    ): Promise<void> {

        const rows =
            await this.Repository
                .findByLiabilityId(
                    liabilityId
                ) || [];

        let paid =
            new Decimal(0);

        for (const row of rows) {

            const amount =
                new Decimal(
                    row.Amount || 0
                );

            switch (row.Type) {

                case "PAYMENT":
                    paid =
                        paid.plus(amount);
                    break;

                case "PAYMENT_REVERSAL":
                    paid =
                        paid.minus(amount);
                    break;

            }

        }

        const debt =
            await this
                .LiabilityRepository
                .findById(
                    liabilityId,
                    true
                );

        if (!debt) {
            return;
        }

        const original =
            debt.OriginalAmount ||
            new Decimal(0);

        let balance =
            original.minus(paid);

        if (balance.lessThan(0)) {
            balance =
                new Decimal(0);
        }

        await this
            .LiabilityRepository
            .updateAmounts(
                liabilityId,
                {
                    CurrentBalance:
                        balance,

                    PaidAmount:
                        paid,

                    Status:
                        balance.equals(0)
                            ? "PAID"
                            : "OPEN"
                }
            );

    }


    public async reverseTransaction():
        Promise<
            Either<
                AbstractError,
                LiabilityTransaction
            >
        > {

        try {

            const request =
                ServiceLocator.getRequest();

            const id =
                request.data?.ID;

            const tx =
                await this.Repository
                    .findById(id);

            if (!tx) {

                return left(
                    new AbstractError(
                        "Transaction not found",
                        404,
                        ""
                    )
                );

            }

            const liabilityId =
                tx.Liability?.Id as string;

            const authRead =
                await this.authorizeLiabilityRead(
                    liabilityId
                );

            if (authRead.isLeft()) {
                return authRead as any;
            }

            const authUpdate =
                await this.authorizeLiabilityUpdate(
                    liabilityId
                );

            if (authUpdate.isLeft()) {
                return authUpdate as any;
            }

            const existing =
                await this.Repository
                    .findByExternalReference(
                        id
                    );

            if (existing) {

                return left(
                    new AbstractError(
                        "Transaction already reversed",
                        400,
                        ""
                    )
                );

            }

            const reversal =
                await this.Repository
                    .createEntry({

                        Liability_ID:
                            liabilityId,

                        Type:
                            "PAYMENT_REVERSAL",

                        Amount:
                            tx.Amount,

                        MovementDate:
                            new Date()
                                .toISOString()
                                .slice(0, 10),

                        Description:
                            `Reversal of ${id}`,

                        ExternalReference:
                            id,

                        Currency_code:
                            tx.Currency?.Code

                    } as any);

            await this
                .recalculateLiabilityInternal(
                    liabilityId
                );

            return right(
                reversal?.[0]?.toEntityObject() as LiabilityTransaction
            );

        } catch (error) {

            const err =
                error as Error;

            return left(
                new AbstractError(
                    err.message,
                    400,
                    err.stack || ""
                )
            );

        }

    }


    public async recalculateLiability():
        Promise<
            Either<
                AbstractError,
                boolean
            >
        > {

        try {

            const request =
                ServiceLocator.getRequest();

            const liabilityId =
                request.data?.LiabilityId;

            const authRead =
                await this.authorizeLiabilityRead(
                    liabilityId
                );

            if (authRead.isLeft()) {
                return authRead;
            }

            const authUpdate =
                await this.authorizeLiabilityUpdate(
                    liabilityId
                );

            if (authUpdate.isLeft()) {
                return authUpdate;
            }

            await this
                .recalculateLiabilityInternal(
                    liabilityId
                );

            return right(true);

        } catch (error) {

            const err =
                error as Error;

            return left(
                new AbstractError(
                    err.message,
                    400,
                    err.stack || ""
                )
            );

        }

    }

}