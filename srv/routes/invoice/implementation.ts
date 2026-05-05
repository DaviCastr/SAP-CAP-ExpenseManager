import { ApplicationService } from "@sap/cds";
import { InvoiceRoute } from "./protocols";
import { Invoice } from "@models/apps/dflc/expensemanager/entities";
import { InvoiceController } from "@/controllers/invoice";
import { BaseRouteImplementation } from "../base/implementation";

export class InvoiceRouteImplementation extends BaseRouteImplementation<Invoice> implements InvoiceRoute {

    protected Controller: InvoiceController;

    constructor(Controller: InvoiceController) {

        super();
        this.Controller = Controller;

    }


    main(Service: ApplicationService): void {

        const { Invoices } = Service.entities;

        this.mainBase(Service, Invoices);

    }

}