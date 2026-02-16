import { oPersonRouteFactory } from '@/factories/routes/person';
import cds from '@sap/cds';

class Person extends cds.ApplicationService {

    init(): Promise<void> {

        oPersonRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Person