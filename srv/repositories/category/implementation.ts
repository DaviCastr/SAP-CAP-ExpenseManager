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


    public async createEntry(data: Category | Categories): Promise<CategoryModel[] | null> {

        let oCategoryEntity = this.getEntity();

        let oSql = INSERT.into(oCategoryEntity).entries(data);

        await cds.run(oSql);

        return this.mapCategoryResult(Array.isArray(data) ? data : [data]);

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

        return CategoryModel.mapModel(Categories);

    }

}