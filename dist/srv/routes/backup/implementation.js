"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupRouteImplementation = void 0;
const implementation_1 = require("../base/implementation");
class BackupRouteImplementation extends implementation_1.BaseRouteImplementation {
    Controller;
    serviceInstance;
    constructor(Controller) {
        super();
        this.Controller = Controller;
    }
    main(Service) {
        const { Backups } = Service.entities;
        this.mainBase(Service, Backups);
        Service.on('ProcessBackupDelete', this.processBackupDelete.bind(this));
        Service.on('ExportBackup', this.exportBackup.bind(this));
        this.serviceInstance = Service;
    }
    async beforeUpdate(Request) {
        const oBackup = {
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
    async beforeEdit(Request) {
        const oBackup = {
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
    async processBackupDelete(Request) {
        const oBackup = {
            ...Request.data,
            ID: Request.data?.ID ?? Request.params[0]?.ID
        };
        await this.beforeAll(Request.data?.oldRequest);
        setTimeout(async () => {
            await this.Controller.processBackupDelete(oBackup);
        }, 1000);
    }
    async exportBackup(Request) {
        const oResult = await this.Controller.exportBackup();
        if (oResult.status != 201) {
            return this.returnRejectMessage(Request, oResult);
        }
        return oResult;
    }
}
exports.BackupRouteImplementation = BackupRouteImplementation;
//# sourceMappingURL=implementation.js.map