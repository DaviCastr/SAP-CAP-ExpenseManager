import { PermissionDenied } from "@/errors/permission-denied";
import cds, { Request, User } from "@sap/cds";
import { Either, left, right } from "@sweet-monads/either";
import { BaseService } from "./protocols";
import { ShareModel } from "@/models/share";
import { ShareRepository } from "@/repositories/share";
import { EntityRepository } from "@/repositories/entity";
import { PersonRepository } from "@/repositories/person";
import { AbstractError } from "@/errors";
import { BaseRepository } from "@/repositories/base";
import { EntityModel } from "@/models/entity";

export abstract class BaseServiceImplementation<Entity> implements BaseService<Entity> {

    protected abstract Repository: BaseRepository;

    constructor(
        private readonly PersonRepository: PersonRepository,
        private readonly ShareRepository: ShareRepository,
        private readonly EntityRepository: EntityRepository) { }

    public beforeRead(Request: any): Either<AbstractError, boolean> {

        try {

            const oUserId = Request.user?.id;

            if (!oUserId || !Request.query?.SELECT)
                return right(true);

            const oPersonPath = this.personPath();
            const oEntityCode = this.entityCode();

            // const where = Request.query.SELECT.where ?? [];

            // if (where.length > 0)
            //     where.push('and');

            // where.push({
            //     xpr: [
            //         '(',

            //         { ref: [...oPersonPath, 'createdBy'] },
            //         '=',
            //         { val: oUserId },

            //         'or',

            //         {
            //             xpr: [
            //                 '(',
            //                 { ref: [...oPersonPath, 'Shares', 'User'] },
            //                 '=',
            //                 { val: oUserId },
            //                 // 'and',
            //                 // {
            //                 //     xpr: [
            //                 //         { ref: ['Person', 'Shares', 'User'] },
            //                 //         '=',
            //                 //         { val.user.id },
            //                 //         // 'or',
            //                 //         // { ref: ['Person', 'Shares', 'User'] },
            //                 //         // '=',
            //                 //         // { val: 2 },
            //                 //         // 'or',
            //                 //         // { ref: ['Person', 'Shares', 'Permission'] },
            //                 //         // '=',
            //                 //         // { val: 3 },
            //                 //         // 'or',
            //                 //         // { ref: ['Person', 'Shares', 'Permission'] },
            //                 //         // '=',
            //                 //         // { val: 4 }
            //                 //     ]
            //                 // },
            //                 ')'
            //             ]
            //         },

            //         ')'
            //     ]
            // });

            // Request.query.SELECT.where = where;

            // Request.query.where([
            //     '(',
            //     { ref: [...oPersonPath, 'createdBy'] },
            //     '=',
            //     { val: oUserId },

            //     'or',

            //     '(',
            //     { ref: [...oPersonPath, 'Shares', 'User'] },
            //     '=',
            //     { val: oUserId },
            //     'and',
            //     { ref: [...oPersonPath, 'Shares', 'Entities', 'Entity'] },
            //     '=',
            //     { val: oEntityCode },
            //     ')',

            //     ')'
            // ]);


            Request.query.where([
                '(',
                { ref: [...oPersonPath, 'createdBy'] }, '=', { val: oUserId },
                'or',
                this.buildPermissionExists(oUserId, oEntityCode as number),
                ')'
            ]);

            return right(true);

        } catch (oError) {

            const errorInstance: Error = oError as Error;

            return left(new AbstractError(errorInstance.message, 400, errorInstance.stack as string));

        }

    }


    public beforeCreate(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        return this.checkPermission(Entity, User, this.getPermissionForCreate());

    }


    public beforeUpdate(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        return this.checkPermission(Entity, User, this.getPermissionForUpdate());

    }


    public beforeEdit(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        return this.checkPermission(Entity, User, this.getPermissionForUpdate());

    }


    public async beforeDelete(Entity: Entity, User: User): Promise<Either<AbstractError, boolean>> {

        return this.checkPermission(Entity, User, this.getPermissionForDelete());

    }


    protected abstract personPath(): string[];

    protected abstract entityCode(): number;


    protected getPermissionForCreate() { return 2; }


    protected getPermissionForUpdate() { return 3; }


    protected getPermissionForDelete() { return 4; }


    protected async checkPermission(Entity: any, User: User, Permission: number): Promise<Either<AbstractError, boolean>> {

        try {

            const oPersonID: string | null = await this.Repository.findPersonIdById(Entity.ID as string);

            if (!oPersonID)
                return right(true);

            return this.checkPermissionByPersonId(User, oPersonID, Permission);

        } catch (oError) {

            const errorInstance: Error = oError as Error;

            return left(new AbstractError(errorInstance.message, 400, errorInstance.stack as string));

        }

    }

    public async checkPermissionByPersonId(LoggedUser: User, PersonId: string, Permision: number): Promise<Either<PermissionDenied, boolean>> {

        const oPerson = await this.PersonRepository.findById(PersonId);

        if (LoggedUser && oPerson) {

            if (LoggedUser?.id !== oPerson.CreatedBy) {

                let oShares = await this.ShareRepository.findByPersonId(PersonId);

                if (oShares) {

                    let oPermissionByShare: Boolean = false;

                    oShares = oShares.filter((oShare: ShareModel) => oShare.User == LoggedUser?.id);

                    if (oShares.length > 0) {

                        for (const oShare of oShares) {

                            const oEntities = await this.EntityRepository.findByShareId(oShare.Id);

                            if (oEntities) {

                                if (Permision > 1) {

                                    oPermissionByShare = oEntities.filter((oEntity: EntityModel) => oEntity.Entity == this.entityCode() && oEntity.Permission >= Permision).length > 0;

                                } else {

                                    oPermissionByShare = oEntities.filter((oEntity: EntityModel) => oEntity.Entity == this.entityCode()).length > 0;

                                }

                            }

                        }

                    }

                    if (!oPermissionByShare) {

                        const oStack = new Error().stack as string;

                        return left(new PermissionDenied('error.modificationPermissionDenied', 403, oStack));

                    }

                } else {

                    const oStack = new Error().stack as string;

                    return left(new PermissionDenied('error.modificationPermissionDenied', 403, oStack));

                }

            }

        } else if (!oPerson) {

            const oStack = new Error().stack as string;

            return left(new PermissionDenied('error.invalidPersonId', 403, oStack));

        }

        return right(true);

    }


    private buildPermissionExists(oUserId: string, oEntityCode: number) {

        return {
            xpr: [
                'exists',
                {
                    SELECT: {
                        from: { ref: ['apps.dflc.gestordegastos.entities.Shares'], as: 'S' },
                        columns: [{ val: 1 }],
                        where: [
                            { ref: ['S', 'User'] }, '=', { val: oUserId },
                            'and',
                            { ref: ['S', 'Person_ID'] }, '=', { ref: ['Person', 'ID'] },
                            'and',
                            {
                                xpr: [
                                    'exists',
                                    {
                                        SELECT: {
                                            from: { ref: ['apps.dflc.gestordegastos.entities.Entities'], as: 'E' },
                                            columns: [{ val: 1 }],
                                            where: [
                                                { ref: ['E', 'Share_ID'] }, '=', { ref: ['S', 'ID'] },
                                                'and',
                                                { ref: ['E', 'Entity'] }, '=', { val: oEntityCode },
                                                'and',
                                                { ref: ['E', 'Permission'] }, 'is not', { val: null }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        };

    }

}