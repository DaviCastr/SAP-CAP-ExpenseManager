import cds from '@sap/cds';

import { CategoryRoute } from "./protocols";
import { CategoryController } from "@/controllers/category";
import { ApplicationService, entity, Request } from "@sap/cds";
import { Category } from '@models/GestorDeGastos';

export class CategoryRouteImplementation implements CategoryRoute {

    public Categories: entity | undefined;

    constructor(private readonly controller: CategoryController) { }

    public main(Service: ApplicationService): void {

        const { Categories } = Service.entities;

        this.Categories = Categories;

        Service.before("EDIT", Categories as entity, this.beforeUpdate.bind(this));

        Service.before("CREATE", Categories.drafts as entity, this.beforeUpdate.bind(this));

    }

    public getEntity(): entity {

        return this.Categories as entity;

    }

    private async beforeUpdate(Request: Request): Promise<void> {

        const oCategory: Category = Request.data;

        if(!oCategory?.ID){

            oCategory.ID = Request.params[0].ID;

        }

        const oResult = await this.controller.beforeUpdate(oCategory, Request.user);

        if (oResult.status != 204) {

            const oMessages = cds.i18n.messages;

            let oLocalizedMessage = oMessages.at(
                oResult.data as string,  // chave
                Request.locale   // idioma
            )

            if (!oLocalizedMessage){

                oLocalizedMessage = oResult.data as string;

            }

            return Request.reject(oResult.status, oLocalizedMessage as string);

        }

    }

}