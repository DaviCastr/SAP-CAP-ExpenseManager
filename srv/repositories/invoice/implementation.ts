import { Invoice, Invoices, Transaction } from "@models/apps/dflc/gestordegastos/entities";
import { InvoiceRepository } from "./protocols";
import cds, { entity } from "@sap/cds";
import { BaseRepositoryImplementation } from "../base/implementation";
import { InvoiceModel } from "@/models/invoice";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

export class InvoiceRepositoryImplementation extends BaseRepositoryImplementation implements InvoiceRepository {

    public async findById(Id: Invoice["ID"]): Promise<InvoiceModel | null> {

        let oSql = this.getReportBaseSql();

        oSql.where({ ID: Id });

        let oTransactions: Invoices = await cds.run(oSql);

        if ((this.getEntity() as any)?.isDraft) {

            oSql = this.getReportBaseSql(true);

            oSql.where({ ID: Id });

            const additionalTransactions: Invoices = await cds.run(oSql) || [];

            oTransactions = [...(oTransactions || []), ...additionalTransactions];

        }

        const oTransactionsModel = await this.mapInvoiceResult(oTransactions);

        if (Array.isArray(oTransactionsModel)) {

            return oTransactionsModel[0];

        }

        return null;

    }


    public async findByIds(Ids: Invoice['ID'][]): Promise<InvoiceModel[] | null> {

        let oInvoiceEntity = this.getEntity();

        let oSql = SELECT.from(oInvoiceEntity).where({ ID: { in: Ids } });

        let oInvoices = await cds.run(oSql);

        if ((oInvoiceEntity as any)?.isDraft) {

            oInvoiceEntity = this.getEntity(true);

            oSql = SELECT.from(oInvoiceEntity).where({ ID: { in: Ids } });

            const additionalInvoicets = await cds.run(oSql) || [];
            oInvoices = [...(oInvoices || []), ...additionalInvoicets];

        }

        const oInvoicesModel = this.mapInvoiceResult(oInvoices);

        return oInvoicesModel;

    }


    public async findByCardID(CardId: Invoice["Card_ID"], additionalFilters: {}, Limit?: number): Promise<InvoiceModel[] | null> {

        let oSql = this.getReportBaseSql();

        oSql.where({ ...additionalFilters, Card_ID: CardId });

        let oTransactions: Invoices = await cds.run(oSql);

        if ((this.getEntity() as any)?.isDraft) {

            oSql = this.getReportBaseSql(true);

            oSql.where({ ...additionalFilters, Card_ID: CardId });

            const additionalTransactions: Invoices = await cds.run(oSql) || [];

            oTransactions = [...(oTransactions || []), ...additionalTransactions];

        }

        const oTransactionsModel = await this.mapInvoiceResult(oTransactions);

        return oTransactionsModel;

    }


    public async findByCardIDs(CardIds: Invoice["Card_ID"][], additionalFilters?: {}, Limit?: number): Promise<InvoiceModel[] | null> {

        let oSql = this.getReportBaseSql();

        oSql.where({ ...additionalFilters, Card_ID: { 'in': CardIds } });

        let oTransactions: Invoices = await cds.run(oSql);

        if ((this.getEntity() as any)?.isDraft) {

            oSql = this.getReportBaseSql(true);

            oSql.where({ ...additionalFilters, Card_ID: { 'in': CardIds } });

            const additionalTransactions: Invoices = await cds.run(oSql) || [];

            oTransactions = [...(oTransactions || []), ...additionalTransactions];

        }

        const oTransactionsModel = await this.mapInvoiceResult(oTransactions);

        return oTransactionsModel;

    }


    public async createEntry(data: Invoice | Invoices): Promise<InvoiceModel[] | null> {

        let oInvoiceEntity = this.getEntity();

        let oSql = INSERT.into(oInvoiceEntity).entries(data);

        await cds.run(oSql);

        return this.mapInvoiceResult(Array.isArray(data) ? data : [data]);

    }


    public async updateTotalAmountByTransactionId(TransactionId: Transaction["ID"]): Promise<void> {

        let oInvoiceEntity = this.getEntity();

        let oInvoice = await cds.run(
            SELECT.one`ID`
                .from(oInvoiceEntity)
                .where`Transactions.ID = ${TransactionId}`);

        if (!oInvoice && (oInvoiceEntity as any)?.isDraft) {

            oInvoiceEntity = this.getEntity(true);

            oInvoice = await cds.run(
                SELECT.one`ID`
                    .from(oInvoiceEntity)
                    .where`Transactions.ID = ${TransactionId}`);


        }

        if (oInvoice.ID) {

            const oTotalAmount = await cds.run(
                SELECT.one`coalesce(sum(Transactions.Amount),0) as TotalAmount`
                    .from(oInvoiceEntity)
                    .where({ ID: oInvoice.ID })
            );

            await cds.update(oInvoiceEntity, oInvoice.ID).with({ TotalAmount: oTotalAmount.TotalAmount });

        }

    }


    public async updateTotalAmountById(Id: Invoice["ID"]): Promise<void> {

        let oInvoiceEntity = this.getEntity();

        const oTotalAmount = await cds.run(
            SELECT.one`coalesce(sum(Transactions.Amount),0) as TotalAmount`
                .from(oInvoiceEntity)
                .where({ ID: Id })
        );

        await cds.update(oInvoiceEntity, Id).with({ TotalAmount: oTotalAmount.TotalAmount });

    }


    private getReportBaseSql(ignoreDraft?: boolean): cds.ql.SELECT<unknown, unknown> {

        const oTransactionEntity = this.getEntity(ignoreDraft || false);

        return SELECT.from(oTransactionEntity);

    }


    private async mapInvoiceResult(Invoices: Invoices): Promise<InvoiceModel[] | null> {

        if (Invoices.length === 0) {

            return null;

        }

        return InvoiceModel.mapModel(Invoices);

    }


    protected getEntity(ignoreDraft?: boolean): entity {

        return ServiceLocator.getEntity('Invoices', ignoreDraft);

    }


    protected personPath(): string {

        return 'Card.Person';

    }

}