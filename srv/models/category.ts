// entity Categories : cuid, managed {
//     Name         : String(20)             @mandatory;
//     Image        : LargeBinary;
//     ImageType    : String;
//     Person       : Association to Persons @mandatory;
//     Transactions : Association to many Transactions on Transactions.Category = $self;
// }

import { TransactionModel } from '@/models/transaction';
import { Readable } from 'stream';

export type CategoryProperties = {
    Id: string;
    PersonId: string;
    Name: string;
    Image?: Readable;
    ImageType: string;
    Transactions?: TransactionModel[];
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class CategoryModel {

    constructor(private properties: CategoryProperties) { }

    public static with(properties: CategoryProperties): CategoryModel {
        return new CategoryModel(properties);
    }

    public get Id() {

        return this.properties.Id;

    }

    public get PersonId() {

        return this.properties.PersonId;

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

}