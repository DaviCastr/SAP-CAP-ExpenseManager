import cds, { entity } from "@sap/cds";

import { BaseRepositoryImplementation } from "../base/implementation";
import { LiabilityTransactionRepository } from "./protocols";

import { LiabilityTransactionModel } from "@/models/liability-transaction";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

import {
    Liability,
    LiabilityTransaction,
    LiabilityTransactions
} from "@models/apps/dflc/gestordegastos/entities";

export class LiabilityTransactionRepositoryImplementation
    extends BaseRepositoryImplementation
    implements LiabilityTransactionRepository {

    public async findById(
        Id: LiabilityTransaction["ID"],
        ignoreDraft?: boolean
    ): Promise<LiabilityTransactionModel | null> {

        let Entity = this.getEntity(ignoreDraft);

        let sql = SELECT.from(Entity).where({ ID: Id });

        let rows = await cds.run(sql);

        if ((Entity as any)?.isDraft) {

            Entity = this.getEntity(true);

            sql = SELECT.from(Entity).where({ ID: Id });

            const activeRows = await cds.run(sql) || [];

            rows = [...(rows || []), ...activeRows];

        }

        const models =
            LiabilityTransactionModel.mapModel(rows);

        return models?.[0] || null;

    }

 
    public async findByIds(
        Ids: LiabilityTransaction["ID"][]
    ): Promise<LiabilityTransactionModel[] | null> {

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

            rows = [...(rows || []), ...activeRows];

        }

        return LiabilityTransactionModel.mapModel(rows);

    }


    public async findByLiabilityId(
        LiabilityId: Liability["ID"]
    ): Promise<LiabilityTransactionModel[] | null> {

        return this.findByLiabilityIds([LiabilityId]);

    }


    public async findByLiabilityIds(
        LiabilityIds: Liability["ID"][]
    ): Promise<LiabilityTransactionModel[] | null> {

        let Entity = this.getEntity();

        let sql = SELECT.from(Entity).where({
            Liability_ID: { in: LiabilityIds }
        });

        let rows = await cds.run(sql);

        if ((Entity as any)?.isDraft) {

            Entity = this.getEntity(true);

            sql = SELECT.from(Entity).where({
                Liability_ID: { in: LiabilityIds }
            });

            const activeRows = await cds.run(sql) || [];

            rows = [...(rows || []), ...activeRows];

        }

        return LiabilityTransactionModel.mapModel(rows);

    }


    public async findPaymentsByLiabilityId(
        LiabilityId: Liability["ID"]
    ): Promise<LiabilityTransactionModel[] | null> {

        let Entity = this.getEntity();

        let sql = SELECT.from(Entity).where({
            Liability_ID: LiabilityId,
            Type: "PAYMENT"
        });

        let rows = await cds.run(sql);

        if ((Entity as any)?.isDraft) {

            Entity = this.getEntity(true);

            sql = SELECT.from(Entity).where({
                Liability_ID: LiabilityId,
                Type: "PAYMENT"
            });

            const activeRows = await cds.run(sql) || [];

            rows = [...(rows || []), ...activeRows];

        }

        return LiabilityTransactionModel.mapModel(rows);

    }


    public async sumPaidAmount(
        LiabilityId: Liability["ID"]
    ): Promise<number> {

        const rows =
            await this.findPaymentsByLiabilityId(
                LiabilityId
            ) || [];

        return rows.reduce((sum, item) => {

            return sum +
                Number(item.Amount?.toNumber() || 0);

        }, 0);

    }


    public async createEntry(
        data: LiabilityTransaction | LiabilityTransactions
    ): Promise<LiabilityTransactionModel[] | null> {

        const payload =
            Array.isArray(data) ? data : [data];

        await INSERT.into(
            this.getEntity(true)
        ).entries(payload);

        return this.findByIds(
            payload.map(x => x.ID)
        );

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