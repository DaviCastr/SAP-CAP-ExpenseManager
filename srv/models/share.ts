// entity Shares : cuid, managed {
//     Share : Association to Shares @mandatory;
//     Email  : String(100)            @mandatory;
// }

type ShareProperties = {
    Id: string;
    User: string;
    PersonId?: string;
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class ShareModel {

    constructor(private props: ShareProperties) { }

    public static with(properties: ShareProperties): ShareModel {
        return new ShareModel(properties);
    }

    public get Id() {

        return this.props.Id;

    }

    public get User() {

        return this.props.User;

    }

    public get PersonId() {

        return this.props.PersonId;

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