import cds, { entity, Request } from '@sap/cds';

import { CategoryProperties, CategoryModel } from "@/models/category";
import { CategoryRepository } from "./protocols";
import { Categories, Category } from '@models/apps/dflc/expensemanager/entities';
import { BaseRepositoryImplementation } from '../base/implementation';
import { ServiceLocator } from '@/infrastructure/ServiceLocator';

export class CategoryRepositoryImplementation extends BaseRepositoryImplementation implements CategoryRepository {


    public async findById(Id: CategoryProperties["Id"]): Promise<CategoryModel | null> {

        let oCategoryEntity = this.getEntity();

        let oSql = SELECT.from(oCategoryEntity).where({ ID: Id });

        let oCategories = await cds.run(oSql);

        if ((oCategoryEntity as any)?.isDraft && !(oCategories || []).length) {

            oCategoryEntity = this.getEntity(true);

            oSql = SELECT.from(oCategoryEntity).where({ ID: Id });

            oCategories = await cds.run(oSql) || [];

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

            const missingIds =
                this.missingIds(Ids, oCategorys);

            if (missingIds.length > 0) {

                oCategoryEntity = this.getEntity(true);

                const additionalCategoryts =
                    await cds.run(
                        SELECT.from(oCategoryEntity).where({ ID: { in: missingIds } })
                    ) || [];

                oCategorys = this.mergeUnique(oCategorys, additionalCategoryts);

            }

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

            const exclusionFilter =
                this.excludeFoundFilter(oCategorys);

            oCategoryEntity = this.getEntity(true);

            const oActiveSql = SELECT.from(oCategoryEntity).where({ Person_ID: { in: personIds } });

            if (exclusionFilter) {
                oActiveSql.where(exclusionFilter);
            }

            const additionalCategoryts =
                await cds.run(oActiveSql) || [];

            oCategorys = this.mergeUnique(oCategorys, additionalCategoryts);

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