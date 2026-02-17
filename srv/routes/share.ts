import { oShareRouteFactory } from '@/factories/routes/share';
import cds from '@sap/cds';

class Share extends cds.ApplicationService {

    init(): Promise<void> {

        oShareRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Share;