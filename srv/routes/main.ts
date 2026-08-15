import '../configs/module-alias';
import { oMainRouteFactory } from '@/factories/routes/main';
import cds from '@sap/cds';

class ExpenseManager extends cds.ApplicationService {


    init(): Promise<void> {

        oMainRouteFactory.main(this)

        return super.init();

    }
    

}

module.exports = ExpenseManager