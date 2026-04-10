import cds, { entity, Request } from '@sap/cds';

import { CategoryProperties, CategoryModel } from "@/models/category";
import { CategoryRepository } from "./protocols";
import { Categories, Category } from '@models/apps/dflc/gestordegastos/entities';
import { BaseRepositoryImplementation } from '../base/implementation';
import { ServiceLocator } from '@/infrastructure/ServiceLocator';

export class CategoryRepositoryImplementation extends BaseRepositoryImplementation implements CategoryRepository {


    public async findById(Id: CategoryProperties["Id"]): Promise<CategoryModel | null> {

        const oCategoriesEntity = this.getEntity();

        const oSql = SELECT.from(oCategoriesEntity).where({ ID: Id });

        const oCategories = await cds.run(oSql);

        const oCategoriesModel = this.mapCategoryResult(oCategories);

        if (oCategoriesModel) {

            return oCategoriesModel[0];

        } else {

            return null;

        }

    }

    
    protected getEntity(): entity {

        return ServiceLocator.getEntity('Categories');

    }


    protected personPath(): string {

        return 'Person';
        
    }


    private mapCategoryResult(Categories: Categories): CategoryModel[] | null {

        if (Categories.length === 0) {

            return null;

        }

        return Categories.map((Category: Category) => {

            return CategoryModel.with({
                Id: Category.ID as string,
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