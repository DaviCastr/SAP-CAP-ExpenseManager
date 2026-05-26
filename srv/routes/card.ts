import '../configs/module-alias';
import { oCardRouteFactory } from '@/factories/routes/card';
import { oInvoiceRouteFactory } from '@/factories/routes/invoice';
import { oTransactionRouteFactory } from '@/factories/routes/transaction';
import cds from '@sap/cds';

class Card extends cds.ApplicationService {

    init(): Promise<void> {

        oCardRouteFactory.main(this);

        oInvoiceRouteFactory.main(this);

        oTransactionRouteFactory.main(this); 

        return super.init();

    }

}

module.exports = Card;