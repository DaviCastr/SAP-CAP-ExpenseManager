import '../configs/module-alias';
import { oInvoiceRouteFactory } from '@/factories/routes/invoice';
import { oTransactionRouteFactory } from '@/factories/routes/transaction';
import cds from '@sap/cds';

class Invoice extends cds.ApplicationService {

    init(): Promise<void> {

        oInvoiceRouteFactory.main(this);

        oTransactionRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Invoice;