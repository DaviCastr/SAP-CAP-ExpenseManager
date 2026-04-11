import { Invoice, Invoices, Transaction } from "@models/apps/dflc/gestordegastos/entities";
import { InvoiceRepository } from "./protocols";
import cds, { entity, Request } from "@sap/cds";
import { BaseRepositoryImplementation } from "../base/implementation";
import { InvoiceModel } from "@/models/invoice";
import { CurrencyModel } from "@/models/currency";
import Decimal from "decimal.js";
import { TransactionModel } from "@/models/transaction";
import { ServiceLocator } from "@/infrastructure/ServiceLocator";

export class InvoiceRepositoryImplementation extends BaseRepositoryImplementation implements InvoiceRepository {

    public async findByID(Id: Invoice["ID"]): Promise<InvoiceModel | null> {

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


    public async findByCardID(CardId: Invoice["Card_ID"], additionalFilters: {}, Limit?: number): Promise<InvoiceModel[] | null> {

        let oSql = this.getReportBaseSql();

        oSql.where({...additionalFilters, Card_ID: CardId });

        let oTransactions: Invoices = await cds.run(oSql);

        if ((this.getEntity() as any)?.isDraft) {

            oSql = this.getReportBaseSql(true);

            oSql.where({...additionalFilters, Card_ID: CardId });

            const additionalTransactions: Invoices = await cds.run(oSql) || [];

            oTransactions = [...(oTransactions || []), ...additionalTransactions];

        }

        const oTransactionsModel = await this.mapInvoiceResult(oTransactions);

        return oTransactionsModel;

    }


    public async findByCardIDs(CardIds: Invoice["Card_ID"][], additionalFilters: {}, Limit?: number): Promise<InvoiceModel[] | null> {

        let oSql = this.getReportBaseSql();

        oSql.where({...additionalFilters, Card_ID: { 'in' : CardIds } });

        let oTransactions: Invoices = await cds.run(oSql);

        if ((this.getEntity() as any)?.isDraft) {

            oSql = this.getReportBaseSql(true);

            oSql.where({...additionalFilters, Card_ID: { 'in' : CardIds } });

            const additionalTransactions: Invoices = await cds.run(oSql) || [];

            oTransactions = [...(oTransactions || []), ...additionalTransactions];

        }

        const oTransactionsModel = await this.mapInvoiceResult(oTransactions);

        return oTransactionsModel;

    }


    public async updateTotalAmountByTransactionId(Id: Transaction["ID"]): Promise<void> {

        let oInvoiceEntity = this.getEntity();

        let oInvoice = await cds.run(
            SELECT.one`ID`
                .from(oInvoiceEntity)
                .where`Transactions.ID = ${Id}`);

        if (!oInvoice && (oInvoiceEntity as any)?.isDraft) {

            oInvoiceEntity = this.getEntity(true);

            oInvoice = await cds.run(
                SELECT.one`ID`
                    .from(oInvoiceEntity)
                    .where`Transactions.ID = ${Id}`);


        }

        if (oInvoice.ID) {

            const oTotalAmount = await cds.run(
                SELECT.one`coalesce(sum(Transactions.Amount),0) as TotalAmount`
                    .from(oInvoiceEntity)
                    .where({ ID: oInvoice.ID })
            );

            await cds.update(oInvoiceEntity, Id).with({ TotalAmount: oTotalAmount.TotalAmount });

        }

    }


    private getReportBaseSql(ignoreDraft?: boolean): cds.ql.SELECT<unknown, unknown> {

        const oTransactionEntity = this.getEntity(ignoreDraft || false);

        return SELECT.from(oTransactionEntity);

    }


    private async mapInvoiceResult(Invoices: Invoices): Promise<InvoiceModel[] | null> {

        if (Invoices.length === 0) {

            return null;

        }

        const oInvoicesModel: InvoiceModel[] =

            Invoices.map((Invoice) => {

                const oCurrencyModel = CurrencyModel.with({
                    Code: Invoice.Currency?.code || Invoice.Currency_code as string,
                    Name: Invoice.Currency?.name as string,
                    Description: Invoice.Currency?.descr as string,
                    Symbol: Invoice.Currency?.symbol as string,
                    MinorUnit: Invoice.Currency?.minorUnit as number
                });

                return InvoiceModel.with({
                    Id: Invoice.ID as string,
                    Year: Invoice.Year as number,
                    Month: Invoice.Month as number,
                    Description: Invoice.Description as string,
                    TotalAmount: new Decimal(Invoice.TotalAmount ?? 0),
                    Currency: oCurrencyModel,
                    InvoiceSent: Invoice.InvoiceSent as boolean,
                    CardId: Invoice?.Card_ID as string,
                    Transactions: Invoice.Transactions?.map((item) => TransactionModel.with({
                        Id: item.ID as string,
                        Identifier: item.Identifier as string,
                        Date: item.Date as string,
                        TotalAmount: new Decimal(item.TotalAmount ?? 0),
                        Amount: new Decimal(item.Amount ?? 0),
                        Currency: oCurrencyModel,
                        TotalInstallments: item.TotalInstallments as number,
                        Installment: item.Installment as number,
                        Description: item.Description as string,
                        CreatedAt: item.createdAt as string,
                        CreatedBy: item.createdBy as string,
                        ModifiedAt: item.modifiedAt as string,
                        ModifiedBy: item.modifiedBy as string
                    })) || [] as TransactionModel[],
                    CreatedAt: Invoice.createdAt as string,
                    CreatedBy: Invoice.createdBy as string,
                    ModifiedAt: Invoice.modifiedAt as string,
                    ModifiedBy: Invoice.modifiedBy as string
                });

            });

        return oInvoicesModel || [] as InvoiceModel[];


    }


    protected getEntity(ignoreDraft?: boolean): entity {

        return ServiceLocator.getEntity('Invoices', ignoreDraft);

    }


    protected personPath(): string {

        return 'Card.Person';

    }

}