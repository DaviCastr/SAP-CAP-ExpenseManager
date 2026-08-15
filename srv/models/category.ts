import { TransactionModel } from '@/models/transaction';
import { Categories, Category, Transactions } from '@models/apps/dflc/expensemanager/entities';
import { Readable } from 'stream';
import { BaseModel } from './base';
import { PersonModel } from './person';

export type CategoryProperties = {
    Id: string;
    Name: string;
    Image: Readable;
    ImageType: string;
    Person: PersonModel;
    Transactions?: TransactionModel[];
    CreatedAt: string;
    CreatedBy: string;
    ModifiedAt: string;
    ModifiedBy: string;
}

export class CategoryModel extends BaseModel {

    constructor(private properties: CategoryProperties) { super() }

    public static with(properties: CategoryProperties): CategoryModel {
        return new CategoryModel(properties);
    }

    public static singleModel(properties: Category): CategoryModel | undefined {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(Categories: Categories): CategoryModel[] | null {

        return Categories?.map((Category: Category) => {

            const oPersonModel = PersonModel.singleModel({
                ...Category?.Person,
                ID: Category?.Person?.ID || Category?.Person_ID as string
            });

            return CategoryModel.with({
                Id: Category.ID as string,
                Name: Category.Name as string,
                Image: Category?.Image as Readable,
                ImageType: Category.ImageType as string,
                Person: oPersonModel as PersonModel,
                Transactions: TransactionModel.mapModel(Category?.Transactions as Transactions) as TransactionModel[],
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

        return this.properties.Image as Readable;

    }

    public get ImageType() {

        return this.properties.ImageType;

    }

    public get Person() {

        return this.properties.Person;

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

    public set Image(value: Readable) {

        this.properties.Image = value;

    }

    public toObject(): CategoryProperties {

        return this.properties;

    }

    public toEntityObject(): Category {

        return this.cleanEntity({
            ID: this.properties.Id,
            Name: this.properties.Name,
            Image: this.properties.Image,
            ImageType: this.properties.ImageType,
            Person: this.Person.toEntityObject(),
            Transactions: this.properties.Transactions?.map((Transaction)=> Transaction.toEntityObject()),
            createdAt: this.properties.CreatedAt,
            createdBy: this.properties.CreatedBy,
            modifiedAt: this.properties.ModifiedAt,
            modifiedBy: this.properties.ModifiedBy
        });

    }

}