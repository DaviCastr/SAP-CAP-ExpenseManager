import { Category } from "@models/apps/dflc/expensemanager/entities";
import { BaseControllerImplementation } from "../base/implementation";
import { CategoryController } from "./protocols";
import { CategoryService } from "@/services/category";

export class CategoryControllerImplementation extends BaseControllerImplementation<Category> implements CategoryController {

    protected Service: CategoryService;
    
    constructor(Service: CategoryService){

        super();
        this.Service = Service;

    }

}