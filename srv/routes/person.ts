import '../configs/module-alias';
import { oCardRouteFactory } from '@/factories/routes/card';
import { oCategoryRouteFactory } from '@/factories/routes/category';
import { oEntityRouteFactory } from '@/factories/routes/entity';
import { oInvoiceRouteFactory } from '@/factories/routes/invoice';
import { oPersonRouteFactory } from '@/factories/routes/person';
import { oShareRouteFactory } from '@/factories/routes/share';
import { oTransactionRouteFactory } from '@/factories/routes/transaction';
import cds from '@sap/cds';

class Person extends cds.ApplicationService {

    init(): Promise<void> {

        oPersonRouteFactory.main(this);

        oCategoryRouteFactory.main(this);

        oShareRouteFactory.main(this);

        oEntityRouteFactory.main(this);

        oCardRouteFactory.main(this);

        oInvoiceRouteFactory.main(this);

        oTransactionRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Person