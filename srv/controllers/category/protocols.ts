import { User } from "@sap/cds";
import { Category } from "@models/GestorDeGastos";
import { BaseControllerResponse } from '@/controllers/base';

export interface CategoryController {
    beforeUpdate(Category: Category, LoggedUser: User): Promise<BaseControllerResponse>;
}