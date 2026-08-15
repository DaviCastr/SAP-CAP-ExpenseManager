import { Entities, EntitiesCodes, Entity, Permissions } from '@models/apps/dflc/expensemanager/entities';
import { BaseModel } from './base';
import { ShareModel } from './share';

type EntityProperties = {
    Id: string;
    Entity: EntitiesCodes;
    Permission: Permissions;
    Share: ShareModel;
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

    public static singleModel(properties: Entity): EntityModel | undefined {

        return this.mapModel([properties])?.[0];

    }    

    public static mapModel(Entities: Entities): EntityModel[] | null {

        return Entities?.map((Entity: Entity) => {

            const oShareModel = ShareModel.singleModel({
                ...Entity?.Share,
                ID: Entity?.Share?.ID || Entity?.Share_ID as string
            });

            return EntityModel.with({
                Id: Entity?.ID as string,
                Entity: Entity?.Entity as EntitiesCodes,
                Permission: Entity?.Permission as Permissions,
                Share: oShareModel as ShareModel,
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

    public get Share() {

        return this.props.Share;

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
            Share: this.Share.toEntityObject(),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });

    }

}