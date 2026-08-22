import cds, { entity } from "@sap/cds";

import { BaseRepositoryImplementation } from "../base/implementation";
import { LiabilityTransactionRepository } from "./protocols";

import { LiabilityTransactionModel } from "@/models/liability-transaction";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

import {
    Liability,
    LiabilityTransaction,
    LiabilityTransactions
} from "@models/apps/dflc/expensemanager/entities";

export class LiabilityTransactionRepositoryImplementation
    extends BaseRepositoryImplementation
    implements LiabilityTransactionRepository {

    public async findById(
        Id: LiabilityTransaction["ID"],
        ignoreDraft?: boolean
    ): Promise<LiabilityTransactionModel | null> {

        let Entity = this.getEntity(ignoreDraft);

        let sql =
            SELECT.from(Entity)
                .where({ ID: Id });

        let rows =
            await cds.run(sql);

        if ((Entity as any)?.isDraft && !(rows || []).length) {

            Entity =
                this.getEntity(true);

            sql =
                SELECT.from(Entity)
                    .where({ ID: Id });

            rows =
                await cds.run(sql) || [];

        }

        const models =
            LiabilityTransactionModel.mapModel(rows);

        return models?.[0] || null;

    }


    public async findByIds(
        Ids: LiabilityTransaction["ID"][]
    ): Promise<LiabilityTransactionModel[] | null> {

        let Entity =
            this.getEntity();

        let sql =
            SELECT.from(Entity)
                .where({
                    ID: { in: Ids }
                });

        let rows =
            await cds.run(sql);

        if ((Entity as any)?.isDraft) {

            const missingIds =
                this.missingIds(Ids, rows);

            if (missingIds.length > 0) {

                Entity =
                    this.getEntity(true);

                const activeRows =
                    await cds.run(
                        SELECT.from(Entity)
                            .where({
                                ID: { in: missingIds }
                            })
                    ) || [];

                rows = this.mergeUnique(rows, activeRows);

            }

        }

        return LiabilityTransactionModel.mapModel(rows);

    }


    public async findByLiabilityId(
        LiabilityId: Liability["ID"],
        Entity?: entity,
        additionalFilters?: {}
    ): Promise<LiabilityTransactionModel[] | null> {

        return this.findByLiabilityIds(
            [LiabilityId],
            Entity,
            additionalFilters
        );

    }


    public async findByLiabilityIds(
        LiabilityIds: Liability["ID"][],
        Entity?: entity,
        additionalFilters?: {}
    ): Promise<LiabilityTransactionModel[] | null> {

        let rows;

        if (Entity) {

            rows =
                await cds.run(
                    SELECT.from(Entity)
                        .where({
                            ...additionalFilters,
                            Liability_ID: {
                                in: LiabilityIds
                            }
                        })
                );

        } else {

            let current =
                this.getEntity();

            rows =
                await cds.run(
                    SELECT.from(current)
                        .where({
                            ...additionalFilters,
                            Liability_ID: {
                                in: LiabilityIds
                            }
                        })
                );

            if ((current as any)?.isDraft) {

                const exclusionFilter =
                    this.excludeFoundFilter(rows);

                current =
                    this.getEntity(true);

                const activeSql = SELECT.from(current)
                    .where({
                        ...additionalFilters,
                        Liability_ID: {
                            in: LiabilityIds
                        }
                    });

                if (exclusionFilter) {
                    activeSql.where(exclusionFilter);
                }

                const activeRows =
                    await cds.run(activeSql) || [];

                rows = this.mergeUnique(rows, activeRows);

            }

        }

        return LiabilityTransactionModel.mapModel(rows);

    }


    /**
     * Returns the drafts entity set of the transactions (e.g.
     * `ExpenseManager.LiabilityTransactions.drafts`), or `undefined` when the
     * entity is not draft-enabled. Used by the recalculation to read the
     * transactions of the draft tree explicitly.
     *
     * @returns {entity | undefined} the drafts entity set
     */
    public getDraftsEntity(): entity | undefined {

        return (
            this.getEntity(true) as any
        )?.drafts as entity | undefined;

    }


    public async createEntry(
        data:
            LiabilityTransaction |
            LiabilityTransactions
    ): Promise<
        LiabilityTransactionModel[] | null
    > {

        const payload =
            Array.isArray(data)
                ? data
                : [data];

        for (const item of payload) {
            if (!item?.ID) {
                item.ID = cds.utils.uuid();
            }
        }

        await INSERT
            .into(this.getEntity(true))
            .entries(payload);

        return this.findByIds(
            payload.map(
                item => item.ID
            )
        );

    }


    public async updateEntry(
        Id: LiabilityTransaction["ID"],
        data: Partial<LiabilityTransaction>
    ): Promise<boolean> {

        await UPDATE(
            this.getEntity(true)
        )
            .set(data)
            .where({
                ID: Id
            });

        return true;

    }


    protected getEntity(
        ignoreDraft?: boolean
    ): entity {

        return ServiceLocator.getEntity(
            "LiabilityTransactions",
            ignoreDraft
        );

    }


    protected personPath(): string {

        return "Liability.Person";

    }

}