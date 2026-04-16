import cds, { entity, Request } from '@sap/cds';

import { CategoryProperties, CategoryModel } from "@/models/category";
import { CategoryRepository } from "./protocols";
import { Categories, Category } from '@models/apps/dflc/gestordegastos/entities';
import { BaseRepositoryImplementation } from '../base/implementation';
import { ServiceLocator } from '@/infrastructure/ServiceLocator';

export class CategoryRepositoryImplementation extends BaseRepositoryImplementation implements CategoryRepository {


    public async findById(Id: CategoryProperties["Id"]): Promise<CategoryModel | null> {

        let oCategoryEntity = this.getEntity();

        let oSql = SELECT.from(oCategoryEntity).where({ ID: Id });

        let oCategories = await cds.run(oSql);

        if ((oCategoryEntity as any)?.isDraft) {

            oCategoryEntity = this.getEntity(true);

            oSql = SELECT.from(oCategoryEntity).where({ ID: Id });

            const additionalCategories = await cds.run(oSql) || [];
            oCategories = [...(oCategories || []), ...additionalCategories];

        }

        const oCategoriesModel = this.mapCategoryResult(oCategories);

        if (oCategoriesModel) {

            return oCategoriesModel[0];

        } else {

            return null;

        }

    }


    public async findByIds(Ids: Category['ID'][]): Promise<CategoryModel[] | null> {

        let oCategoryEntity = this.getEntity();

        let oSql = SELECT.from(oCategoryEntity).where({ ID: { in: Ids } });

        let oCategorys = await cds.run(oSql);

        if ((oCategoryEntity as any)?.isDraft) {

            oCategoryEntity = this.getEntity(true);

            oSql = SELECT.from(oCategoryEntity).where({ ID: { in: Ids } });

            const additionalCategoryts = await cds.run(oSql) || [];
            oCategorys = [...(oCategorys || []), ...additionalCategoryts];

        }

        const oCategorysModel = this.mapCategoryResult(oCategorys);

        return oCategorysModel;

    }


    public async findByPersonIds(PersonIds: Category['Person_ID'] | Category['Person_ID'][]): Promise<CategoryModel[] | null> {

        let oCategoryEntity = this.getEntity();

        const personIds = Array.isArray(PersonIds) ? PersonIds : [PersonIds];

        let oSql = SELECT.from(oCategoryEntity).where({ Person_ID: { in: personIds } });

        let oCategorys = await cds.run(oSql);

        if ((oCategoryEntity as any)?.isDraft) {

            oCategoryEntity = this.getEntity(true);

            oSql = SELECT.from(oCategoryEntity).where({ Person_ID: { in: personIds } });

            const additionalCategoryts = await cds.run(oSql) || [];
            oCategorys = [...(oCategorys || []), ...additionalCategoryts];

        }

        const oCategorysModel = this.mapCategoryResult(oCategorys);

        return oCategorysModel;

    }


    public async createEntry(data: Category | Categories): Promise<CategoryModel[] | null> {

        let oCategoryEntity = this.getEntity();

        let oSql = INSERT.into(oCategoryEntity).entries(data);

        await cds.run(oSql);

        return this.mapCategoryResult(Array.isArray(data) ? data : [data]);

    }


    protected getEntity(ignoreDraft?: boolean): entity {

        return ServiceLocator.getEntity('Categories', ignoreDraft);

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