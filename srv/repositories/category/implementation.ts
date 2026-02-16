import cds, { Service } from '@sap/cds';


import { CategoryProperties, CategoryModel } from "@/models/category";
import { CategoryRepository } from "./protocols";
import { Categories, Category } from '@models/GestorDeGastos';
import { Readable } from 'stream';
import { oCategoryRouteFactory } from '@/factories/routes/category';

export class CategoryRepositoryImplementation implements CategoryRepository {

    public async findById(Id: CategoryProperties["Id"]): Promise<CategoryModel | null> {

        const oCategoriesEntity = oCategoryRouteFactory.getEntity();

        const oSql = SELECT.from(oCategoriesEntity).where({ ID: Id });

        const oCategories = await cds.run(oSql);

        const oCategoriesModel = this.mapCategoryResult(oCategories);

        if (oCategoriesModel){

            return oCategoriesModel[0];

        } else {
            
            return null;

        }

    }

    private mapCategoryResult(Categories: Categories): CategoryModel[] | null {

        if (Categories.length === 0) {

            return null;

        }

        return Categories.map((Category: Category) => {

            return CategoryModel.with({
                Id: Category.ID as string,
                PersonId: Category.Person_ID as string,
                Name: Category.Name as string,
                ImageType: Category.ImageType as string,
                CreatedAt: Category.createdAt as string,
                CreatedBy: Category.createdBy as string,
                ModifiedAt: Category.modifiedAt as string,
                ModifiedBy: Category.modifiedBy as string
            });

        });

    }
    
}