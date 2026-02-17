import cds from '@sap/cds';

import { CategoryRoute } from "./protocols";
import { CategoryController } from "@/controllers/category";
import { ApplicationService, entity, Request } from "@sap/cds";
import { Category } from '@models/GestorDeGastos';
import { BaseControllerResponse } from '@/controllers/base';

export class CategoryRouteImplementation implements CategoryRoute {

    public Categories: entity | undefined;

    constructor(private readonly controller: CategoryController) { }

    public main(Service: ApplicationService): void {

        const { Categories } = Service.entities;

        this.Categories = Categories;

        Service.before("READ", Categories as entity, this.beforeRead.bind(this));

        Service.before("EDIT", Categories as entity, this.beforeEdit.bind(this));

        Service.before("CREATE", Categories.drafts as entity, this.beforeCreate.bind(this));

        Service.before("DELETE", Categories.drafts as entity, this.beforeDelete.bind(this));

        Service.before("DELETE", Categories as entity, this.beforeDelete.bind(this));

    }

    public getEntity(): entity {

        return this.Categories as entity;

    }


    private async beforeRead(Request: Request): Promise<void> {

        const oResult = this.controller.beforeRead(Request);

        if (oResult.status != 200) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    private async beforeCreate(Request: Request): Promise<void> {

        const oCategory: Category = Request.data;

        const oResult = await this.controller.beforeCreate(oCategory, Request.user);

        if (oResult.status != 201) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    private async beforeEdit(Request: Request): Promise<void> {

        const oCategory: Category = Request.data;

        if (!oCategory?.ID) {

            oCategory.ID = Request.params[0].ID;

        }

        const oResult = await this.controller.beforeEdit(oCategory, Request.user);

        if (oResult.status != 204) {

            return this.returnRejectMessage(Request, oResult);

        }

    }


    private async beforeDelete(Request: Request): Promise<void> {

        const oCategory: Category = Request.data;

        if (!oCategory?.ID) {

            oCategory.ID = Request.params[0].ID;

        }

        const oResult = await this.controller.beforeDelete(oCategory, Request.user);

        if (oResult.status != 204) {

            return this.returnRejectMessage(Request, oResult);

        }

    }

    private returnRejectMessage(Request: Request, Result: BaseControllerResponse): never {

        const oMessages = cds.i18n.messages;

        let oLocalizedMessage = oMessages.at(
            Result.data as string,
            Request.locale
        )

        if (!oLocalizedMessage) {

            oLocalizedMessage = Result.data as string;

        }

        return Request.reject(Result.status, oLocalizedMessage as string);

    }

}