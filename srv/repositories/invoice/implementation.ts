import { Invoice, Invoices, Transaction } from "@models/apps/dflc/expensemanager/entities";
import { InvoiceRepository } from "./protocols";
import cds, { entity } from "@sap/cds";
import { BaseRepositoryImplementation } from "../base/implementation";
import { InvoiceModel } from "@/models/invoice";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

export class InvoiceRepositoryImplementation extends BaseRepositoryImplementation implements InvoiceRepository {

    public async findById(Id: Invoice["ID"]): Promise<InvoiceModel | null> {

        let oSql = this.getReportBaseSql();

        oSql.where({ ID: Id });

        let oInvoices: Invoices = await cds.run(oSql);

        if ((this.getEntity() as any)?.isDraft) {

            oSql = this.getReportBaseSql(true);

            oSql.where({ ID: Id });

            const additionalInvoices: Invoices = await cds.run(oSql) || [];

            oInvoices = [...(oInvoices || []), ...additionalInvoices];

        }

        const oInvoicesModel = await this.mapInvoiceResult(oInvoices);

        if (Array.isArray(oInvoicesModel)) {

            return oInvoicesModel[0];

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

        let oInvoices: Invoices = await cds.run(oSql);

        if ((this.getEntity() as any)?.isDraft) {

            oSql = this.getReportBaseSql(true);

            oSql.where({ ...additionalFilters, Card_ID: CardId });

            const additionalInvoices: Invoices = await cds.run(oSql) || [];

            oInvoices = [...(oInvoices || []), ...additionalInvoices];

        }

        const oinvoicesModel = await this.mapInvoiceResult(oInvoices);

        return oinvoicesModel;

    }


    public async findByCardIDs(CardIds: Invoice["Card_ID"][], additionalFilters?: {}, Limit?: number): Promise<InvoiceModel[] | null> {

        let oSql = this.getReportBaseSql();

        oSql.where({ ...additionalFilters, Card_ID: { 'in': CardIds } });

        let oInvoices: Invoices = await cds.run(oSql);

        if ((this.getEntity() as any)?.isDraft) {

            oSql = this.getReportBaseSql(true);

            oSql.where({ ...additionalFilters, Card_ID: { 'in': CardIds } });

            const additionalInvoices: Invoices = await cds.run(oSql) || [];

            oInvoices = [...(oInvoices || []), ...additionalInvoices];

        }

        const oinvoicesModel = await this.mapInvoiceResult(oInvoices);

        return oinvoicesModel;

    }


    public async retrieveTotalAmountByCardIDs(CardIds: Invoice["Card_ID"][], additionalFilters?: {}): Promise<InvoiceModel | null> {

        let oInvoiceEntity = this.getEntity();

        let oSql = SELECT.one`coalesce (sum (TotalAmount),0) as TotalAmount, Currency_code`.from(oInvoiceEntity);

        oSql.where({ ...additionalFilters, Card_ID: { 'in': CardIds } });
        oSql.groupBy("Currency_code");

        let oInvoice: Invoice = await cds.run(oSql);

        const oInvoiceModel = this.mapInvoiceResult([oInvoice]);

        return oInvoiceModel?.[0] as InvoiceModel;

    }


    public async retrieveTotalAmountByIDs(Ids: Invoice["ID"][], additionalFilters?: {}): Promise<InvoiceModel | null> {

        let oInvoiceEntity = this.getEntity();

        let oSql = SELECT.one`coalesce (sum (TotalAmount),0) as TotalAmount, Currency_code`.from(oInvoiceEntity);

        oSql.where({ ...additionalFilters, ID: { 'in': Ids } });
        oSql.groupBy("Currency_code");

        let oInvoice: Invoice = await cds.run(oSql);

        const oInvoiceModel = this.mapInvoiceResult([oInvoice]);

        return oInvoiceModel?.[0] as InvoiceModel;

    }


    public async createEntry(data: Invoice | Invoices): Promise<InvoiceModel[] | null> {

        let oInvoiceEntity = this.getEntity();

        let oSql = INSERT.into(oInvoiceEntity).entries(data);

        await cds.run(oSql);

        return this.mapInvoiceResult(Array.isArray(data) ? data : [data]);

    }


    public async updateTotalAmountByTransactionId(TransactionId: Transaction["ID"], ID: Transaction['Invoice_ID']): Promise<void> {

        if(ID){

            return await this.updateTotalAmountById(ID);

        }

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


    public async update(Id: Invoice["ID"], fields: {}): Promise<void> {

        let oInvoiceEntity = this.getEntity();

        if (fields) {

            await cds.update(oInvoiceEntity, Id).with(fields);

        }

    }


    private getReportBaseSql(ignoreDraft?: boolean): cds.ql.SELECT<unknown, unknown> {

        const oInvoiceEntity = this.getEntity(ignoreDraft || false);

        return SELECT.from(oInvoiceEntity);

    }


    private mapInvoiceResult(Invoices: Invoices): InvoiceModel[] | null {

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