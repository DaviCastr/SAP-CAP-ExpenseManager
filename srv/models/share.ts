import { Person, Share, Shares } from "@models/apps/dflc/expensemanager/entities";
import { EntityModel } from "./entity";
import { BaseModel } from "./base";
import { PersonModel } from "./person";

type ShareProperties = {
    Id: string;
    User: string;
    Person: PersonModel;
    Entities: EntityModel[];
    CreatedAt: string;
    CreatedBy: string;
    ModifiedAt: string;
    ModifiedBy: string;
}

export class ShareModel extends BaseModel {

    constructor(private props: ShareProperties) { super() }

    public static with(properties: ShareProperties): ShareModel {
        return new ShareModel(properties);
    }

    public static singleModel(properties: Share): ShareModel | undefined {

        return this.mapModel([properties])?.[0];

    }

    public static mapModel(Shares: Shares): ShareModel[] | null {

        return Shares?.map((Share: Share) => {

            const oPersonModel = PersonModel.singleModel({
                ...Share?.Person,
                ID: Share?.Person?.ID || Share?.Person_ID as string
            });

            return ShareModel.with({
                Id: Share.ID as string,
                User: Share.User as string,
                Person: oPersonModel as PersonModel,
                Entities: EntityModel.mapModel(Share?.Entities as []) as EntityModel[],
                CreatedAt: Share.createdAt as string,
                CreatedBy: Share.createdBy as string,
                ModifiedAt: Share.modifiedAt as string,
                ModifiedBy: Share.modifiedBy as string
            });

        });

    }

    public get Id() {

        return this.props.Id;

    }

    public get User() {

        return this.props.User;

    }

    public get Person() {

        return this.props.Person;

    }

    public get Entities() {

        return this.props.Entities;

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

    public toObject(): ShareProperties {

        return this.props;

    }

    public toEntityObject(): Share {

        return this.cleanEntity({
            ID: this.props.Id,
            User: this.props.User,
            Person: this.Person.toEntityObject(),
            Entities: this.props.Entities?.map((Entity)=>Entity.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });

    }

}