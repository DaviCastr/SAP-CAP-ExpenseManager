// entity Entities : cuid, managed {
//     Entity      : Association to Entitys @mandatory;
//     Entity     : EntitiesCodes         @assert.range: true;
//     Permission : Permissions           @assert.range: true;
// }

type EntityProperties = {
    Id: string;
    Entity: number;
    Permission: number;
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

export class EntityModel {

    constructor(private props: EntityProperties) { }

    public static with(properties: EntityProperties): EntityModel {
        return new EntityModel(properties);
    }

    public get Id() {

        return this.props.Id;

    }

    public get Entity() {

        return this.props.Entity;

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