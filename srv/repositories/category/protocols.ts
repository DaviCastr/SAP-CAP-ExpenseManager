import { CategoryModel, CategoryProperties } from "@/models/category"
import { BaseRepository } from "../base";
import { Request } from "@sap/cds";


export interface CategoryRepository extends BaseRepository {
    findById(Id: CategoryProperties['Id']): Promise<CategoryModel | null>;
}