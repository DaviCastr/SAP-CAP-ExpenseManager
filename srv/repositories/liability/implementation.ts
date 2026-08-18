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

        let Entity = this.getEntity(ignoreDraft);

        let sql = SELECT.from(Entity).where({ ID: Id });

        let rows = await cds.run(sql);

        if ((Entity as any)?.isDraft) {

            Entity = this.getEntity(true);

            sql = SELECT.from(Entity).where({ ID: Id });

            const activeRows = await cds.run(sql) || [];

            rows = [...(rows || []), ...activeRows];

        }

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

            rows = [...(rows || []), ...activeRows];

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

            rows = [...(rows || []), ...activeRows];

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


    public async findOverdueByPersonId(
        PersonId: Person["ID"]
    ): Promise<LiabilityModel[] | null> {

        return this.findByStatus(
            PersonId,
            "OVERDUE"
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

            rows = [...(rows || []), ...activeRows];

        }

        return LiabilityModel.mapModel(rows);

    }


    public async createEntry(
        data: Liability | Liabilities
    ): Promise<LiabilityModel[] | null> {

        const payload =
            Array.isArray(data) ? data : [data];

        await INSERT.into(
            this.getEntity(true)
        ).entries(payload);

        return this.findByIds(
            payload.map(x => x.ID)
        );

    }


    public async updateBalance(
        Id: Liability["ID"],
        Balance: number
    ): Promise<boolean> {

        await UPDATE(this.getEntity(true))
            .set({
                CurrentBalance: Balance
            })
            .where({ ID: Id });

        return true;

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


    public async updateAmounts(
        Id: Liability["ID"],
        data: {
            CurrentBalance?: number | Decimal;
            PaidAmount?: number | Decimal;
            Status?: string;
        }
    ): Promise<boolean> {

        await UPDATE(
            this.getEntity(true)
        )
            .set({

                CurrentBalance:
                    data.CurrentBalance instanceof Decimal
                        ? data.CurrentBalance.toNumber()
                        : data.CurrentBalance,

                PaidAmount:
                    data.PaidAmount instanceof Decimal
                        ? data.PaidAmount.toNumber()
                        : data.PaidAmount,

                Status:
                    data.Status

            })
            .where({
                ID: Id
            });

        return true;

    }


    public async closeLiability(
        Id: Liability["ID"]
    ): Promise<boolean> {

        await UPDATE(this.getEntity(true))
            .set({
                Status: "PAID",
                CurrentBalance: 0
            })
            .where({ ID: Id });

        return true;

    }


    public async renegotiate(
        Id: Liability["ID"],
        data: {
            CurrentBalance: number;
            Installments: number;
            RemainingInstallments: number;
            InstallmentAmount: number;
            InterestRate: number;
            Status: string;
        }
    ): Promise<boolean> {

        await UPDATE(
            this.getEntity(true)
        )
            .set({
                CurrentBalance:
                    data.CurrentBalance,

                Installments:
                    data.Installments,

                RemainingInstallments:
                    data.RemainingInstallments,

                InstallmentAmount:
                    data.InstallmentAmount,

                InterestRate:
                    data.InterestRate,

                Status:
                    data.Status
            })
            .where({
                ID: Id
            });

        return true;

    }


    protected getEntity(
        ignoreDraft?: boolean
    ): entity {

        return ServiceLocator.getEntity('Liabilities', ignoreDraft);

    }


    protected personPath(): string {

        return "Person";

    }

}