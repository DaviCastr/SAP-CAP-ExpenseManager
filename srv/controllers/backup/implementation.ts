import { Backup } from "@models/apps/dflc/gestordegastos/entities";
import { BaseControllerImplementation } from "../base/implementation";
import { BackupController } from "./protocols";
import { BackupService } from "@/services/backup";
import { BaseControllerResponse } from "../base";
import { User } from "@sap/cds";

export class BackupControllerImplementation extends BaseControllerImplementation<Backup> implements BackupController {

    protected Service: BackupService;
    
    constructor(Service: BackupService){

        super();
        this.Service = Service;

    }
 
    
    public async processBackupDelete(Backup: Backup): Promise<BaseControllerResponse> {
        
        const result = await this.Service.processBackupDelete(Backup);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(204, result.value);

    }


    public async exportBackup(User: User): Promise<BaseControllerResponse> {
        
        const result = await this.Service.exportBackup(User);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(201, result.value);

    }

}