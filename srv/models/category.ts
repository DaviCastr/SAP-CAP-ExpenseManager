// entity Categories : cuid, managed {
//     Name         : String(20)             @mandatory;
//     Image        : LargeBinary;
//     ImageType    : String;
//     Person       : Association to Persons @mandatory;
//     Transactions : Association to many Transactions on Transactions.Category = $self;
// }

import { TransactionModel } from '@/models/transaction';

type CategoryProperties = {
    Id: string;
    Name: string;
    Image: Buffer;
    ImageType: string;
    Transactions: TransactionModel[];
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class CategoryModel {

    constructor(private props: CategoryProperties) { }

    public get Id() {

        return this.props.Id;

    }

    public get Name() {

        return this.props.Name;

    }

    public get Image() {

        return this.props.Image;

    }

    public get ImageType() {

        return this.props.ImageType;

    }

    public get Transactions() {

        return this.props.Transactions;

    }

    public get CreatedAt() {

        return this.props.CreatedAt;

    }

    public get CreatedBy() {

        return this.props.CreatedBy;

    }

    public get ModifiedAt() {

        return this.props.ModifiedAt;

    }

    public get ModifiedBy() {

        return this.props.ModifiedBy;

    }

}