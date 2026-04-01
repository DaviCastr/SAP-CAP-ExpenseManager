import { Share } from "@models/GestorDeGastos";
import { BaseControllerImplementation } from "../base/implementation";
import { ShareController } from "./protocols";
import { ShareService } from "@/services/share";

export class ShareControllerImplementation extends BaseControllerImplementation<Share> implements ShareController {

    protected Service: ShareService;
    
    constructor(Service: ShareService){

        super();
        this.Service = Service;

    }

}