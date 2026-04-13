import { oBackupRouteFactory } from '@/factories/routes/backup';
import cds from '@sap/cds';

class Backup extends cds.ApplicationService {

    init(): Promise<void> {

        oBackupRouteFactory.main(this);

        return super.init();

    }

}

module.exports = Backup;