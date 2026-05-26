"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareModel = void 0;
const entity_1 = require("./entity");
const base_1 = require("./base");
class ShareModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new ShareModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(Shares) {
        return Shares?.map((Share) => {
            return ShareModel.with({
                Id: Share.ID,
                User: Share.User,
                PersonId: Share.Person_ID,
                Entities: entity_1.EntityModel.mapModel(Share?.Entities || []),
                CreatedAt: Share.createdAt,
                CreatedBy: Share.createdBy,
                ModifiedAt: Share.modifiedAt,
                ModifiedBy: Share.modifiedBy
            });
        }) || [];
    }
    get Id() {
        return this.props.Id;
    }
    get User() {
        return this.props.User;
    }
    get PersonId() {
        return this.props.PersonId;
    }
    get Entities() {
        return this.props.Entities;
    }
    get CreatedAt() {
        return this.props.CreatedAt;
    }
    get CreatedBy() {
        return this.props.CreatedBy;
    }
    get ModifiedAt() {
        return this.props.ModifiedAt;
    }
    get ModifiedBy() {
        return this.props.ModifiedBy;
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            ID: this.props.Id,
            User: this.props.User,
            Person: { ID: this.props.PersonId },
            Entities: this.props.Entities?.map((Entity) => Entity.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });
    }
}
exports.ShareModel = ShareModel;
//# sourceMappingURL=share.js.map