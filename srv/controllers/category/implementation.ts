import { Request, User } from "@sap/cds";
import { Category } from "@models/GestorDeGastos";
import { BaseControllerImplementation, BaseControllerResponse } from "../base";
import { CategoryController } from "./protocols";
import { CategoryService } from "@/services/category";

export class CategoryControllerImplementation extends BaseControllerImplementation implements CategoryController {

    constructor(private readonly Service: CategoryService){
        super();
    }


    public beforeRead(Request: Request): BaseControllerResponse {

         const result = this.Service.beforeRead(Request);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(200, result.value); 
           
    }


    public async beforeCreate(Category: Category, LoggedUser: User): Promise<BaseControllerResponse> {
        
        const result = await this.Service.beforeCreate(Category, LoggedUser);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(201, result.value); 

    }


    public async beforeEdit(Category: Category, LoggedUser: User): Promise<BaseControllerResponse> {
        
        const result = await this.Service.beforeDelete(Category, LoggedUser);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(204, result.value); 

    }


    public async beforeDelete(Category: Category, LoggedUser: User): Promise<BaseControllerResponse> {
        
        const result = await this.Service.beforeDelete(Category, LoggedUser);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(204, result.value); 

    }

}