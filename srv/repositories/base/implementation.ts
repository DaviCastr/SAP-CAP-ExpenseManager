import cds, { entity } from "@sap/cds";
import { BaseRepository } from "./protocols";
import { Readable } from "stream";

export abstract class BaseRepositoryImplementation implements BaseRepository {


    public abstract findById(Id: any): Promise<any | null>;


    public abstract findByIds(Ids: any[]): Promise<any[] | null>;

    public async findImageByIds(Ids: any[]): Promise<{ID: string, Image: Readable, ImageType: string }[] | null> {

        let oEntity = this.getEntity();

        let oSql = SELECT.columns('ID', 'Image', 'ImageType').from(oEntity).where({ ID: { in: Ids } });

        let oEntities = await cds.run(oSql);

        if ((oEntity as any)?.isDraft) {

            const missingIds =
                this.missingIds(Ids, oEntities);

            if (missingIds.length > 0) {

                oEntity = this.getEntity(true);

                const additionalEntities =
                    await cds.run(
                        SELECT.columns('ID', 'Image', 'ImageType')
                            .from(oEntity)
                            .where({ ID: { in: missingIds } })
                    ) || [];

                oEntities = this.mergeUnique(oEntities, additionalEntities);

            }

        }

        return oEntities;

    }


    public async findPersonIdById(Id: string): Promise<string | null> {

        const Entity = this.getEntity();

        let oPath = this.personPath();

        if (oPath != '') {

            oPath += '.ID';

        } else {

            oPath = 'ID';

        }

        let oResult = await cds.run(
            SELECT.one(`${oPath} as PersonID`)
                .from(Entity)
                .where({ ID: Id })
        );

        if (oResult?.PersonID) {

            return oResult.PersonID;

        }

        if ((Entity as any).drafts) {

            oResult = await cds.run(
                SELECT.one(`${oPath} as PersonID`)
                    .from((Entity as any).drafts)
                    .where({ ID: Id })
            );

            if (oResult?.PersonID) {

                return oResult.PersonID;

            }

        }

        return null;

    }


    public abstract createEntry(data: any | any[]): Promise<any[] | null>;


    /**
     * IDs present in the given rows (skips rows without an ID).
     */
    protected collectIds<T extends { ID?: any }>(rows: T[] | undefined | null): any[] {

        return (rows ?? [])
            .map(row => row?.ID)
            .filter(id => id !== undefined && id !== null);

    }


    /**
     * Requested IDs that were not found in the given rows.
     */
    protected missingIds(requestedIds: any[], rows: { ID?: any }[] | undefined | null): any[] {

        const foundIds =
            new Set(
                this.collectIds(rows).map(id => String(id))
            );

        return (requestedIds ?? []).filter(id => !foundIds.has(String(id)));

    }


    /**
     * Filter that excludes the IDs of the given rows, so the second leg of a
     * draft+active union only selects what the first leg did not return yet.
     * Returns `null` when there is nothing to exclude.
     */
    protected excludeFoundFilter<T extends { ID?: any }>(rows: T[] | undefined | null): Record<string, unknown> | null {

        const ids = this.collectIds(rows);

        return ids.length > 0
            ? { ID: { 'not in': ids } }
            : null;

    }


    /**
     * Merges the draft leg with the active leg of a union keeping the first
     * row seen for each ID (the draft row wins because it comes first).
     * Safety net against duplicates when a caller forgets the exclusion.
     */
    protected mergeUnique<T extends { ID?: any }>(primaryRows: T[] | undefined | null, additionalRows: T[] | undefined | null): T[] {

        const merged =
            [...(primaryRows ?? [])];

        const seen =
            new Set(merged.map(row => String(row.ID)));

        for (const row of additionalRows ?? []) {

            if (!row || seen.has(String(row.ID))) {
                continue;
            }

            merged.push(row);

            seen.add(String(row.ID));

        }

        return merged;

    }


    protected abstract getEntity(ignoreDraft?: boolean): entity;


    protected abstract personPath(): string;


}