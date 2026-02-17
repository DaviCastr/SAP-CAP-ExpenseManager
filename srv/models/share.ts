// entity Shares : cuid, managed {
//     Share : Association to Shares @mandatory;
//     Email  : String(100)            @mandatory;
// }

type ShareProperties = {
    Id: string;
    User: string;
    Permission: number;
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

    public get Permission() {

        return this.props.Permission;

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