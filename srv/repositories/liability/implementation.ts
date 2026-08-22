import cds, { entity } from "@sap/cds";

import { BaseRepositoryImplementation } from "../base/implementation";
import { LiabilityRepository } from "./protocols";

import { LiabilityModel } from "@/models/liability";

import {
    Liability,
    Liabilities,
    Person
} from "@models/apps/dflc/expensemanager/entities";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";
import Decimal from "decimal.js";

export class LiabilityRepositoryImplementation
    extends BaseRepositoryImplementation
    implements LiabilityRepository {

    public async findById(
        Id: Liability["ID"],
        ignoreDraft?: boolean
    ): Promise<LiabilityModel | null> {

        // Read both the active and the draft sibling sets up front. The draft
        // plugin activates a draft by deep-inserting the whole tree into the
        // active tables, so the transaction handlers run with a request that
        // targets the ACTIVE entity set. A debt created in the same draft only
        // exists as a draft row at that point (activation inserts parents
        // first), so a strict active-only lookup would reject the transaction
        // with a spurious 404 "invalid debt".
        const activeEntity =
            this.getEntity(true);

        const draftEntity =
            (activeEntity as any)?.drafts as entity | undefined;

        // Prefer the row of the entity set the request works on: reads outside
        // a draft session keep the committed values, while a draft-session read
        // sees the uncommitted draft values. The sibling set is only queried
        // when the preferred set does not have the row (e.g. during draft
        // activation or for brand-new entities that only exist as drafts), so
        // a row is never selected twice.
        const current =
            this.getEntity(ignoreDraft);

        const preferDraft =
            (current as any)?.isDraft;

        const readRow = async (
            Entity: entity | undefined | null
        ): Promise<any[]> =>

            Entity
                ? (await cds.run(
                    SELECT.from(Entity)
                        .where({ ID: Id })
                )) || []
                : [];

        const primaryRows =
            await readRow(preferDraft ? draftEntity : activeEntity);

        const rows =
            primaryRows.length > 0
                ? primaryRows
                : await readRow(preferDraft ? activeEntity : draftEntity);

        const model = LiabilityModel.mapModel(rows);

        return model?.[0] || null;

    }


    public async findByIds(
        Ids: Liability["ID"][]
    ): Promise<LiabilityModel[] | null> {

        let Entity = this.getEntity();

        let sql = SELECT.from(Entity).where({
            ID: { in: Ids }
        });

        let rows = await cds.run(sql);

        if ((Entity as any)?.isDraft) {

            const missingIds =
                this.missingIds(Ids, rows);

            if (missingIds.length > 0) {

                Entity = this.getEntity(true);

                const activeRows =
                    await cds.run(
                        SELECT.from(Entity).where({
                            ID: { in: missingIds }
                        })
                    ) || [];

                rows = this.mergeUnique(rows, activeRows);

            }

        }

        return LiabilityModel.mapModel(rows);

    }


    public async findByPersonId(
        PersonId: Person["ID"] | Person["ID"][]
    ): Promise<LiabilityModel[] | null> {

        let Entity = this.getEntity();

        const personIds = Array.isArray(PersonId) ? PersonId : [PersonId];

        let sql = SELECT.from(Entity).where({
            Person_ID: { 'in': personIds }
        });

        let rows = await cds.run(sql);

        if ((Entity as any)?.isDraft) {

            const exclusionFilter =
                this.excludeFoundFilter(rows);

            Entity = this.getEntity(true);

            const activeSql = SELECT.from(Entity).where({
                Person_ID: { 'in': personIds }
            });

            if (exclusionFilter) {
                activeSql.where(exclusionFilter);
            }

            const activeRows =
                await cds.run(activeSql) || [];

            rows = this.mergeUnique(rows, activeRows);

        }

        return LiabilityModel.mapModel(rows);

    }


    public async findOpenByPersonId(
        PersonId: Person["ID"]
    ): Promise<LiabilityModel[] | null> {

        return this.findByStatus(
            PersonId,
            "OPEN"
        );

    }


    public async findByStatus(
        PersonId: Person["ID"],
        Status: string
    ): Promise<LiabilityModel[] | null> {

        let Entity = this.getEntity();

        let sql = SELECT.from(Entity).where({
            Person_ID: PersonId,
            Status
        });

        let rows = await cds.run(sql);

        if ((Entity as any)?.isDraft) {

            const exclusionFilter =
                this.excludeFoundFilter(rows);

            Entity = this.getEntity(true);

            const activeSql = SELECT.from(Entity).where({
                Person_ID: PersonId,
                Status
            });

            if (exclusionFilter) {
                activeSql.where(exclusionFilter);
            }

            const activeRows =
                await cds.run(activeSql) || [];

            rows = this.mergeUnique(rows, activeRows);

        }

        return LiabilityModel.mapModel(rows);

    }


    public async createEntry(
        data: Liability | Liabilities
    ): Promise<LiabilityModel[] | null> {

        const payload =
            Array.isArray(data) ? data : [data];

        for (const item of payload) {
            if (!item?.ID) {
                item.ID = cds.utils.uuid();
            }
        }

        await INSERT.into(
            this.getEntity(true)
        ).entries(payload);

        return this.findByIds(
            payload.map(x => x.ID)
        );

    }


    public async updateEntry(
        Id: Liability["ID"],
        data: Partial<Liability>
    ): Promise<boolean> {

        await UPDATE(
            this.getEntity(true)
        )
            .set(data)
            .where({ ID: Id });

        return true;

    }


    public async updateComputedValues(
        Id: Liability["ID"],
        data: {
            OutstandingBalance?: number | Decimal;
            PaymentPercentage?: number | Decimal;
            Status?: string;
        },
        Entity?: entity
    ): Promise<boolean> {

        const values = {

            OutstandingBalance:
                data.OutstandingBalance instanceof Decimal
                    ? data.OutstandingBalance.toNumber()
                    : data.OutstandingBalance,

            PaymentPercentage:
                data.PaymentPercentage instanceof Decimal
                    ? data.PaymentPercentage.toNumber()
                    : data.PaymentPercentage,

            Status:
                data.Status

        };

        // Update the row of the entity set the current request is working on:
        // - during a draft session the request targets the drafts entity, so
        //   the DRAFT row is updated and the active row keeps its value until
        //   activation (a discarded draft never corrupts the active balance);
        // - during activation the request still targets the drafts entity and
        //   the draft row is updated, which draftActivate then copies to the
        //   active row together with the transactions;
        // - in non-draft flows the active row is updated directly.
        // Callers may pass an explicit `Entity` (e.g. the drafts entity of a
        // liability that only exists as a draft) to override that resolution.
        const target =
            Entity ?? this.getEntity();

        await UPDATE(target)
            .set(values)
            .where({
                ID: Id
            });

        return true;

    }


    /**
     * Tells whether the given liability has a row in the drafts table. A draft
     * row exists for the whole lifecycle of a draft session (from `draftEdit`
     * until `draftActivate`/discard), which is the reliable signal that the
     * recalculation must read from and write to the draft tree.
     *
     * @param {Liability["ID"]} Id the liability ID
     * @returns {Promise<boolean>} `true` when a draft row exists
     */
    public async hasDraftRow(
        Id: Liability["ID"]
    ): Promise<boolean> {

        const activeEntity =
            this.getEntity(true);

        const draftsEntity =
            (activeEntity as any)?.drafts as entity | undefined;

        if (!draftsEntity) {
            return false;
        }

        const rows =
            await cds.run(
                SELECT.from(draftsEntity)
                    .where({ ID: Id })
            );

        return (rows?.length ?? 0) > 0;

    }


    protected getEntity(
        ignoreDraft?: boolean
    ): entity {

        return ServiceLocator.getEntity('Liabilities', ignoreDraft);

    }


    /**
     * Returns the drafts entity set of the liabilities (e.g.
     * `ExpenseManager.Liabilities.drafts`), or `undefined` when the entity is
     * not draft-enabled. Used by the recalculation to write the computed values
     * of the draft tree explicitly.
     *
     * @returns {entity | undefined} the drafts entity set
     */
    public getDraftsEntity(): entity | undefined {

        return (
            this.getEntity(true) as any
        )?.drafts as entity | undefined;

    }


    protected personPath(): string {

        return "Person";

    }

}