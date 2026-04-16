import { Entities, EntitiesCodes, Entity, Permissions } from '@models/apps/dflc/gestordegastos/entities';
import { BaseModel } from './base';

type EntityProperties = {
    Id: string;
    Entity: EntitiesCodes;
    Permission: Permissions;
    ShareId: string;
    CreatedAt?: string;
    CreatedBy?: string;
    ModifiedAt?: string;
    ModifiedBy?: string;
}

type EntityTypeProperties = Entity;

export class EntityModel extends BaseModel {

    constructor(private props: EntityProperties) { super() }

    public static with(properties: EntityProperties): EntityModel {

        return new EntityModel(properties);

    }

    public static singleModel(properties: Entity): EntityModel {

        return this.mapModel([properties])?.[0] as EntityModel;

    }    

    public static mapModel(Entities: Entities): EntityModel[] | null {

        if (Entities.length === 0) {

            return null;

        }

        return Entities?.map((Entity: Entity) => {

            return EntityModel.with({
                Id: Entity?.ID as string,
                Entity: Entity?.Entity as EntitiesCodes,
                Permission: Entity?.Permission as Permissions,
                ShareId: Entity?.Share_ID as string,
                CreatedAt: Entity?.createdAt as string,
                CreatedBy: Entity?.createdBy as string,
                ModifiedAt: Entity?.modifiedAt as string,
                ModifiedBy: Entity?.modifiedBy as string
            });

        });

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

    public get ShareId() {

        return this.props.ShareId;

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

    public toObject(): EntityProperties {

        return this.props;

    }

    public toEntityObject(): EntityTypeProperties {

        return this.cleanEntity({
            ID: this.props.Id,
            Entity: this.props.Entity,
            Permission: this.props.Permission,
            Share: { ID: this.props.ShareId },
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });

    }

}