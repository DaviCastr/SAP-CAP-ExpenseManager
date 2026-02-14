// entity Shares : cuid, managed {
//     Person : Association to Persons @mandatory;
//     Email  : String(100)            @mandatory;
// }

type ShareProperties = {
    ID: string;
    PersonID: string;
    Email: string;
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class PersonModel {

    constructor(private props: ShareProperties) { }

    public get id() {

        return this.props.id;

    }

    public get firstName() {

        return this.props.firstName;

    }

    public get lastName() {

        return this.props.lastName;

    }

    public get email() {

        return this.props.email;

    }

    public setDefaultEmailDomain() {

        if (!this.props.email?.includes("@")) {

            this.props.email = `${this.props.email}@gmail.com`;

        }

    }

}