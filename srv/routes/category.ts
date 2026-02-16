import { oCategoryRouteFactory } from '@/factories/routes/category';
import cds, { Request, Service } from '@sap/cds';

class Category extends cds.ApplicationService {

    init(): Promise<void> {

        oCategoryRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Category