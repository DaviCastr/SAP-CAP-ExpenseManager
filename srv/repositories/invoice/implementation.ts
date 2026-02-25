import { Transaction } from "@models/apps/dflc/gestordegastos/entities";
import { InvoiceRepository } from "./protocols";
import cds, { entity, Request } from "@sap/cds";
import { BaseRepositoryImplementation } from "../base/implementation";

export class InvoiceRepositoryImplementation extends BaseRepositoryImplementation implements InvoiceRepository {


    public async updateTotalAmountByTransactionId(Id: Transaction["ID"], Request?: Request): Promise<void> {

        const oInvoiceEntity = this.getEntity(Request);

        const oInvoice = await cds.run(
            SELECT.one`ID`
                .from(oInvoiceEntity)
                .where`Transactions.ID = ${Id}`);

        const oTotalAmount = await cds.run(
            SELECT.one`coalesce(sum(Transactions.Amount),0) as TotalAmount`
                .from(oInvoiceEntity)
                .where({ ID: oInvoice.ID })
        );

        await cds.update(oInvoiceEntity, Id).with({ TotalAmount: oTotalAmount.TotalAmount });

    }


    protected getEntity(Request?: Request): entity {

        const { Invoices } = cds.entities;

        return Request?.target ? Request.target as entity: Invoices;

    }


    protected personPath(): string {

        return 'Card.Person';
        
    }

}