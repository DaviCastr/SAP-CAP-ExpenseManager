import { oInvoiceRouteFactory } from '@/factories/routes/invoice';
import { oTransactionRouteFactory } from '@/factories/routes/transaction';
import cds from '@sap/cds';

class Invoice extends cds.ApplicationService {

    init(): Promise<void> {

        oTransactionRouteFactory.main(this);

        oInvoiceRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Invoice;