import { CategoryModel, CategoryProperties } from "@/models/category"


export interface CategoryRepository {
    findById(Id: CategoryProperties['Id']): Promise<CategoryModel | null>;
}