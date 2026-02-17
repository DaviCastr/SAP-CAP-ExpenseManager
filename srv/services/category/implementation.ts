import { Request, User } from '@sap/cds';
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


    public beforeRead(Request: Request): Either<AbstractError, boolean> {

        try {

            if (Request.user && Request.user.id) {

                if (Request.query?.SELECT) {

                    if (!Array.isArray(Request.query.SELECT.where)) {
                        Request.query.SELECT.where = [];
                    }

                    if (Request.query.SELECT.where.length > 0) {
                        Request.query.SELECT.where.push('and');
                    }

                    Request.query.SELECT.where.push({
                        xpr: [
                            '(',
                            { ref: ['Person', 'createdBy'] },
                            '=',
                            { val: Request.user.id },
                            'or',
                            { ref: ['Person', 'Shares', 'User'] },
                            '=',
                            { val: Request.user.id },
                            ')'
                        ]
                    });

                    // Request.query.SELECT.where.push(
                    //     { ref: ['createdBy'] },
                    //     '=',
                    //     {
                    //         //val: req.user.id//attr.logonName
                    //         val: Request.user.id//attr.logonName

                    //     }
                    // );

                    // Request.query.SELECT.where.push(
                    //     'OR',
                    //     { ref: ['Person', 'Shares', 'User'] },
                    //     '=',
                    //     {
                    //         //val: req.user.id//attr.logonName
                    //         val: Request.user.id
                    //     }
                    // );

                }
            }

            return right(true);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new AbstractError(errorInstance.message, 400, errorInstance.stack as string));

        }

    }


    public async beforeCreate(Category: Category, LoggedUser: User): Promise<Either<AbstractError, boolean>> {

        return this.checkPermission(Category, LoggedUser, 2);

    }


    public async beforeEdit(Category: Category, LoggedUser: User): Promise<Either<AbstractError, boolean>> {

        return this.checkPermission(Category, LoggedUser, 2);

    }


    public async beforeDelete(Category: Category, LoggedUser: User): Promise<Either<AbstractError, boolean>> {

        return this.checkPermission(Category, LoggedUser, 2);

    }

    private async checkPermission(Category: Category, LoggedUser: User, Permision: number): Promise<Either<AbstractError, boolean>> {

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

                const oCheckPermission = await this.checkPermissionByPersonId(LoggedUser, oCategory.PersonId as string, Permision);

                if (oCheckPermission.isLeft()) {

                    return left(oCheckPermission.value);

                }

            }

            return right(true);

        } catch (error) {

            const errorInstance: Error = error as Error;

            return left(new AbstractError(errorInstance.message, 400, errorInstance.stack as string));

        }

    }

}