import { ApplicationService, Request } from "@sap/cds";
import { BackupRoute } from "./protocols";
import { BaseRouteImplementation } from "../base/implementation";
import { Backup } from "@models/apps/dflc/gestordegastos/entities";
import { BackupController } from "@/controllers/backup/protocols";
import { BaseControllerResponse } from "@/controllers/base";

export class BackupRouteImplementation extends BaseRouteImplementation<Backup> implements BackupRoute {

    protected Controller: BackupController;
    private serviceInstance?: ApplicationService;

    constructor(Controller: BackupController) {

        super();

        this.Controller = Controller;

    }


    main(Service: ApplicationService): void {

        const { Backups } = Service.entities;

        this.mainBase(Service, Backups);

        Service.on('ProcessBackupDelete', this.processBackupDelete.bind(this));

        Service.on('ExportBackup', this.exportBackup.bind(this));

        this.serviceInstance = Service;

    }


    protected async beforeUpdate(Request: Request): Promise<void> {

        const oBackup: Backup = {
            ...Request?.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult = await this.Controller.beforeUpdate(oBackup, Request.user);

        if (oResult.status != 204) {

            this.serviceInstance?.emit('ProcessBackupDelete', { ...oBackup, oldRequest: Request });
            return this.returnRejectMessage(Request, oResult);

        }

        this.serviceInstance?.emit('ProcessBackupDelete', { ...oBackup, oldRequest: Request });

    }


    protected async beforeEdit(Request: Request): Promise<void> {

        const oBackup: Backup = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        const oResult = await this.Controller.beforeEdit(oBackup, Request.user);

        if (oResult.status != 204) {

            this.serviceInstance?.emit('ProcessBackupDelete', { ...oBackup, oldRequest: Request });
            return this.returnRejectMessage(Request, oResult);

        }

        this.serviceInstance?.emit('ProcessBackupDelete', { ...oBackup, oldRequest: Request });

    }


    private async processBackupDelete(Request: Request): Promise<void> {

        const oBackup: Backup = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };

        await this.beforeAll(Request.data?.oldRequest);

        setTimeout(async () => {

            await this.Controller.processBackupDelete(oBackup);

        }, 1000);

    }


    private async exportBackup(Request: Request): Promise<BaseControllerResponse> {

         const oResult = await this.Controller.exportBackup(Request.user);

        if (oResult.status != 201) {

            return this.returnRejectMessage(Request, oResult);

        }

        return oResult;

    }


}