"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const transaction_1 = require("@/models/transaction");
const base_1 = require("./base");
class CategoryModel extends base_1.BaseModel {
    properties;
    constructor(properties) {
        super();
        this.properties = properties;
    }
    static with(properties) {
        return new CategoryModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(Categories) {
        return Categories?.map((Category) => {
            return CategoryModel.with({
                Id: Category.ID,
                Name: Category.Name,
                Image: Category?.Image,
                ImageType: Category.ImageType,
                PersonId: Category.Person_ID || Category?.Person?.ID,
                Transactions: transaction_1.TransactionModel.mapModel(Category?.Transactions),
                CreatedAt: Category.createdAt,
                CreatedBy: Category.createdBy,
                ModifiedAt: Category.modifiedAt,
                ModifiedBy: Category.modifiedBy
            });
        });
    }
    get Id() {
        return this.properties.Id;
    }
    get Name() {
        return this.properties.Name;
    }
    get Image() {
        return this.properties.Image;
    }
    get ImageType() {
        return this.properties.ImageType;
    }
    get PersonId() {
        return this.properties.PersonId;
    }
    get Transactions() {
        return this.properties.Transactions;
    }
    get CreatedAt() {
        return this.properties.CreatedAt;
    }
    get CreatedBy() {
        return this.properties.CreatedBy;
    }
    get ModifiedAt() {
        return this.properties.ModifiedAt;
    }
    get ModifiedBy() {
        return this.properties.ModifiedBy;
    }
    set Image(value) {
        this.properties.Image = value;
    }
    toObject() {
        return this.properties;
    }
    toEntityObject() {
        return this.cleanEntity({
            ID: this.properties.Id,
            Name: this.properties.Name,
            Image: this.properties.Image,
            ImageType: this.properties.ImageType,
            Person: { ID: this.properties.PersonId },
            Transactions: this.properties.Transactions?.map((Transaction) => Transaction.toEntityObject()),
            createdAt: this.properties.CreatedAt,
            createdBy: this.properties.CreatedBy,
            modifiedAt: this.properties.ModifiedAt,
            modifiedBy: this.properties.ModifiedBy
        });
    }
}
exports.CategoryModel = CategoryModel;
//# sourceMappingURL=category.js.map