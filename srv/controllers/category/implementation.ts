import { User } from "@sap/cds";
import { Category } from "@models/GestorDeGastos";
import { BaseControllerImplementation, BaseControllerResponse } from "../base";
import { CategoryController } from "./protocols";
import { CategoryService } from "@/services/category";

export class CategoryControllerImplementation extends BaseControllerImplementation implements CategoryController {

    constructor(private readonly Service: CategoryService){
        super();
    }

    public async beforeUpdate(Category: Category, LoggedUser: User): Promise<BaseControllerResponse> {
        
        const result = await this.Service.beforeUpdate(Category, LoggedUser);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(204, result.value); 

    }

}