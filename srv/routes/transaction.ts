import '../configs/module-alias';
import { oTransactionRouteFactory } from '@/factories/routes/transaction';
import cds from '@sap/cds';

class Transaction extends cds.ApplicationService {

    init(): Promise<void> {

        oTransactionRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Transaction;