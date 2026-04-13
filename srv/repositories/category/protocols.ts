import { CategoryModel, CategoryProperties } from "@/models/category"
import { BaseRepository } from "../base";
import { Request } from "@sap/cds";
import { Categories, Category } from "@models/apps/dflc/gestordegastos/entities";


export interface CategoryRepository extends BaseRepository {
    findById(Id: CategoryProperties['Id']): Promise<CategoryModel | null>;
    createEntry(data: Category | Categories): Promise<CategoryModel[] | null>;
}