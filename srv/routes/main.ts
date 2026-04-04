import { oMainRouteFactory } from '@/factories/routes/main';
import cds, { Request, Service } from '@sap/cds';

class GestaoGastos extends cds.ApplicationService {


    init(): Promise<void> {

        oMainRouteFactory.main(this)

        return super.init();

    }
    

}

module.exports = GestaoGastos