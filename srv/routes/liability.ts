import {
    oLiabilityRouteFactory
} from "@/factories/routes/liability";
import { oLiabilityTransactionRouteFactory } from "@/factories/routes/liability-transaction";

import cds from "@sap/cds";

class Liability 
    extends cds.ApplicationService {

    init(): Promise<void> {

        oLiabilityRouteFactory.main(this);

        oLiabilityTransactionRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Liability;