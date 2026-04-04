import { oEntityRouteFactory } from '@/factories/routes/entity';
import cds from '@sap/cds';

class Entity extends cds.ApplicationService {

    init(): Promise<void> {

        oEntityRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Entity;