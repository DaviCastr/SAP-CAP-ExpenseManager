import { Backup } from "@models/apps/dflc/gestordegastos/entities";
import { BaseControllerImplementation } from "../base/implementation";
import { BackupController } from "./protocols";
import { BackupService } from "@/services/backup";

export class BackupControllerImplementation extends BaseControllerImplementation<Backup> implements BackupController {

    protected Service: BackupService;
    
    constructor(Service: BackupService){

        super();
        this.Service = Service;

    }

}