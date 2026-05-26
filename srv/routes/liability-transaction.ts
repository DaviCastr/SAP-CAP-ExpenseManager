import '../configs/module-alias';
import {
    oLiabilityTransactionRouteFactory
} from "@/factories/routes/liability-transaction";

import cds from "@sap/cds";

class LiabilityTransaction
    extends cds.ApplicationService {

    init(): Promise<void> {

        oLiabilityTransactionRouteFactory.main(this);

        return super.init();

    }

}

module.exports = LiabilityTransaction;