import { User } from '@sap/cds';
import { AbstractError } from '@/errors';
import { Category } from '@models/GestorDeGastos';
import { Either, left, right } from '@sweet-monads/either';
import { CategoryService } from './protocols';
import { BaseServiceImplementation } from '../base/implementation';
import { CategoryRepository } from '@/repositories/category';
import { CategoryModel } from '@/models/category';

export class CategoryServiceImplementation extends BaseServiceImplementation implements CategoryService {

    constructor(private readonly repository: CategoryRepository) {
        super();
    }

    public async beforeUpdate(Category: Category, LoggedUser: User): Promise<Either<AbstractError, boolean>> {

        try {

            let oCategory: CategoryModel | null;

            if (!Category.Person_ID) {

                oCategory = await this.repository.findById(Category.ID as string);

            } else {

                oCategory = CategoryModel.with({
                    Id: Category.ID as string,
                    PersonId: Category.Person_ID as string,
                    Name: Category.Name as string,
                    ImageType: Category.ImageType as string,
                    CreatedAt: Category.createdAt as string,
                    CreatedBy: Category.createdBy as string,
                    ModifiedAt: Category.modifiedAt as string,
                    ModifiedBy: Category.modifiedBy as string
                });

            }

            if (oCategory) {

                const oCheckPermission = await this.checkModificationPermissionByPerson(LoggedUser, oCategory.PersonId as string);

                if (oCheckPermission.isLeft()) {

                    return left(oCheckPermission.value);

                }

            }

            return right(true);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new AbstractError(errorInstance.message, 400, errorInstance.stack as string))
            // console.error("Erro ao filtrar registros:", erro);
            // req.error(400, "Erro ao processar a consulta:" + erro);
        }

    }
}