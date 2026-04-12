// entity Categories : cuid, managed {
//     Name         : String(20)             @mandatory;
//     Image        : LargeBinary;
//     ImageType    : String;
//     Person       : Association to Persons @mandatory;
//     Transactions : Association to many Transactions on Transactions.Category = $self;
// }

import { TransactionModel } from '@/models/transaction';
import { Categories, Category } from '@models/apps/dflc/gestordegastos/entities';
import { Readable } from 'stream';

export type CategoryProperties = {
    Id: string;
    Name: string;
    Image?: Readable;
    ImageType: string;
    Transactions?: TransactionModel[];
    CreatedAt: string;
    CreatedBy: string;
    ModifiedAt: string;
    ModifiedBy: string;
}

export class CategoryModel {

    constructor(private properties: CategoryProperties) { }

    public static with(properties: CategoryProperties): CategoryModel {
        return new CategoryModel(properties);
    }

    public static singleModel(properties: Category): CategoryModel {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(Categories: Categories): CategoryModel[] {

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

    public get Id() {

        return this.properties.Id;

    }

    public get Name() {

        return this.properties.Name;

    }

    public get Image() {

        return this.properties.Image;

    }

    public get ImageType() {

        return this.properties.ImageType;

    }

    public get Transactions() {

        return this.properties.Transactions;

    }

    public get CreatedAt() {

        return this.properties.CreatedAt;

    }

    public get CreatedBy() {

        return this.properties.CreatedBy;

    }

    public get ModifiedAt() {

        return this.properties.ModifiedAt;

    }

    public get ModifiedBy() {

        return this.properties.ModifiedBy;

    }

    public toObject(): CategoryProperties {

        return this.properties;

    }

    public toEntityObject(): Category {

        return {
            ID: this.properties.Id,
            Name: this.properties.Name,
            Image: this.properties.Image,
            ImageType: this.properties.ImageType,
            Transactions: this.properties.Transactions?.map((Transaction)=> Transaction.toEntityObject()),
            createdAt: this.properties.CreatedAt,
            createdBy: this.properties.CreatedBy,
            modifiedAt: this.properties.ModifiedAt,
            modifiedBy: this.properties.ModifiedBy
        };

    }

}