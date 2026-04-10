import { Invoices } from "@models/apps/dflc/gestordegastos/entities";
import { BaseControllerResponse } from "../base";
import { BaseControllerImplementation } from "../base/implementation";
import { InvoiceController } from "./protocols";
import { InvoiceService } from "@/services/invoice";
import { Invoice } from "@models/apps/dflc/gestordegastos/entities";

export class InvoiceControllerImplementation extends BaseControllerImplementation<Invoice> implements InvoiceController {

    protected Service: InvoiceService;

    constructor(Service: InvoiceService) {

        super();
        this.Service = Service;

    }

}