import '../configs/module-alias';
import { oEntityRouteFactory } from '@/factories/routes/entity';
import { oShareRouteFactory } from '@/factories/routes/share';
import cds from '@sap/cds';

class Share extends cds.ApplicationService {

    init(): Promise<void> {

        oShareRouteFactory.main(this);

        oEntityRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Share;