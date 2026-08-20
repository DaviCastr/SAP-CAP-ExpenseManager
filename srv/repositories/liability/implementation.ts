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

        const activeRows =
            await cds.run(
                SELECT.from(activeEntity)
                    .where({ ID: Id })
            ) || [];

        const draftRows =
            draftEntity
                ? (
                    await cds.run(
                        SELECT.from(draftEntity)
                            .where({ ID: Id })
                    ) || []
                )
                : [];

        // Prefer the row of the entity set the request works on: reads outside
        // a draft session keep the committed values, while a draft-session read
        // sees the uncommitted draft values. The sibling set is used as a
        // fallback so the same lookup also works during draft activation and
        // for brand-new entities that only exist as drafts.
        const current =
            this.getEntity(ignoreDraft);

        const primary =
            (current as any)?.isDraft
                ? draftRows
                : activeRows;

        const fallback =
            (current as any)?.isDraft
                ? activeRows
                : draftRows;

        const rows =
            this.mergeUnique(
                primary,
                fallback
            );

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

            Entity = this.getEntity(true);

            sql = SELECT.from(Entity).where({
                ID: { in: Ids }
            });

            const activeRows = await cds.run(sql) || [];

            rows = this.mergeUnique(
                rows,
                activeRows
            );

        }

        return LiabilityModel.mapModel(rows);

    }


    public async findByPersonId(
        PersonId: Person["ID"]
    ): Promise<LiabilityModel[] | null> {

        let Entity = this.getEntity();

        let sql = SELECT.from(Entity).where({
            Person_ID: PersonId
        });

        let rows = await cds.run(sql);

        if ((Entity as any)?.isDraft) {

            Entity = this.getEntity(true);

            sql = SELECT.from(Entity).where({
                Person_ID: PersonId
            });

            const activeRows = await cds.run(sql) || [];

            rows = this.mergeUnique(
                rows,
                activeRows
            );

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

            Entity = this.getEntity(true);

            sql = SELECT.from(Entity).where({
                Person_ID: PersonId,
                Status
            });

            const activeRows = await cds.run(sql) || [];

            rows = this.mergeUnique(
                rows,
                activeRows
            );

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


    /**
     * Merges the draft rows with the active rows of the same entity set,
     * keeping one row per ID (the draft row wins because it is first).
     *
     * Draft-enabled compositions are deep-copied into the draft tables when a
     * draft is opened, so every active row has a draft sibling with the same
     * ID. Reading both tables naively would return each row twice and double
     * count the amounts when the debt balance is recalculated.
     *
     * @param {any[]} draftRows rows read from the draft entity set
     * @param {any[]} activeRows rows read from the active entity set
     * @returns {any[]} the deduplicated rows
     */
    private mergeUnique(
        draftRows: any[],
        activeRows: any[]
    ): any[] {

        const seen =
            new Set<string>();

        const merged: any[] = [];

        for (const row of [
            ...(draftRows || []),
            ...(activeRows || [])
        ]) {

            const key =
                row?.ID as string | undefined;

            if (!key || seen.has(key)) {
                continue;
            }

            seen.add(key);

            merged.push(row);

        }

        return merged;

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