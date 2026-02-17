import { Request, User } from "@sap/cds";
import { Category } from "@models/GestorDeGastos";
import { BaseControllerResponse } from '@/controllers/base';

export interface CategoryController {
    beforeRead(Request: Request): BaseControllerResponse;
    beforeCreate(Category: Category, LoggedUser: User): Promise<BaseControllerResponse>;
    beforeEdit(Category: Category, LoggedUser: User): Promise<BaseControllerResponse>;
    beforeDelete(Category: Category, LoggedUser: User): Promise<BaseControllerResponse>;
}