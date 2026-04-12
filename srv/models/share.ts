// entity Shares : cuid, managed {
//     Share : Association to Shares @mandatory;
//     Email  : String(100)            @mandatory;
// }

import { Share, Shares } from "@models/apps/dflc/gestordegastos/entities";
import { EntityModel } from "./entity";

type ShareProperties = {
    Id: string;
    User: string;
    PersonId: string;
    Entities: EntityModel[];
    CreatedAt: string;
    CreatedBy: string;
    ModifiedAt: string;
    ModifiedBy: string;
}

export class ShareModel {

    constructor(private props: ShareProperties) { }

    public static with(properties: ShareProperties): ShareModel {
        return new ShareModel(properties);
    }

    public static singleModel(properties: Share): ShareModel | null {

        return this.mapModel([properties])?.[0] as ShareModel;

    }

    public static mapModel(Shares: Shares): ShareModel[] {

        return Shares.map((Share: Share) => {

            return ShareModel.with({
                Id: Share.ID as string,
                User: Share.User as string,
                PersonId: Share.Person_ID as string,
                Entities: EntityModel.mapModel(Share?.Entities || []) as EntityModel[],
                CreatedAt: Share.createdAt as string,
                CreatedBy: Share.createdBy as string,
                ModifiedAt: Share.modifiedAt as string,
                ModifiedBy: Share.modifiedBy as string
            });

        }) || [] as ShareModel[];

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

        return {
            ID: this.props.Id,
            User: this.props.User,
            Person_ID: this.props.PersonId,
            Entities: this.props.Entities?.map((Entity)=>Entity.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        };

    }

}