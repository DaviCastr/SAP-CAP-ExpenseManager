import '../configs/module-alias';
import { oMainRouteFactory } from '@/factories/routes/main';
import cds from '@sap/cds';

class GestaoGastos extends cds.ApplicationService {


    init(): Promise<void> {

        oMainRouteFactory.main(this)

        return super.init();

    }
    

}

module.exports = GestaoGastos