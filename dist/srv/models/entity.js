"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityModel = void 0;
const base_1 = require("./base");
class EntityModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new EntityModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(Entities) {
        if (Entities.length === 0) {
            return null;
        }
        return Entities?.map((Entity) => {
            return EntityModel.with({
                Id: Entity?.ID,
                Entity: Entity?.Entity,
                Permission: Entity?.Permission,
                ShareId: Entity?.Share_ID || Entity?.Share?.ID,
                CreatedAt: Entity?.createdAt,
                CreatedBy: Entity?.createdBy,
                ModifiedAt: Entity?.modifiedAt,
                ModifiedBy: Entity?.modifiedBy
            });
        });
    }
    get Id() {
        return this.props.Id;
    }
    get Entity() {
        return this.props.Entity;
    }
    get Permission() {
        return this.props.Permission;
    }
    get ShareId() {
        return this.props.ShareId;
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
exports.EntityModel = EntityModel;
//# sourceMappingURL=entity.js.map