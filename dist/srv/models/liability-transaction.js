"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityTransactionModel = void 0;
const base_1 = require("./base");
const currency_1 = require("./currency");
class LiabilityTransactionModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new LiabilityTransactionModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(entities) {
        return entities?.map((item) => {
            const currency = currency_1.CurrencyModel.singleModel({
                ...item?.Currency,
                code: item?.Currency?.code || item?.Currency_code
            });
            return LiabilityTransactionModel.with({
                Id: item.ID,
                LiabilityId: item.Liability_ID ||
                    item?.Liability?.ID,
                Type: item.Type,
                Description: item.Description,
                MovementDate: item.MovementDate,
                Installment: item.Installment,
                TotalInstallments: item.TotalInstallments,
                Amount: this.retrieveDecimal(item.Amount),
                BalanceAfter: this.retrieveDecimal(item.BalanceAfter),
                Currency: currency,
                IsAutomatic: item.IsAutomatic,
                ExternalReference: item.ExternalReference,
                CreatedAt: item.createdAt,
                CreatedBy: item.createdBy,
                ModifiedAt: item.modifiedAt,
                ModifiedBy: item.modifiedBy
            });
        });
    }
    // ========================================================
    // GETTERS
    // ========================================================
    get Id() { return this.props.Id; }
    get LiabilityId() { return this.props.LiabilityId; }
    get Type() { return this.props.Type; }
    get Amount() { return this.props.Amount; }
    get BalanceAfter() { return this.props.BalanceAfter; }
    get MovementDate() { return this.props.MovementDate; }
    get Currency() { return this.props.Currency; }
    // ========================================================
    // RAW OBJECT
    // ========================================================
    toObject() {
        return this.props;
    }
    // ========================================================
    // ENTITY OBJECT
    // ========================================================
    toEntityObject() {
        return this.cleanEntity({
            ID: this.props.Id,
            Liability: this.props.LiabilityId
                ? { ID: this.props.LiabilityId }
                : undefined,
            Type: this.props.Type,
            Description: this.props.Description,
            MovementDate: this.props.MovementDate,
            Installment: this.props.Installment,
            TotalInstallments: this.props.TotalInstallments,
            Amount: this.props.Amount?.toNumber(),
            BalanceAfter: this.props.BalanceAfter?.toNumber(),
            Currency: this.props.Currency?.toEntityObject(),
            IsAutomatic: this.props.IsAutomatic,
            ExternalReference: this.props.ExternalReference,
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });
    }
}
exports.LiabilityTransactionModel = LiabilityTransactionModel;
//# sourceMappingURL=liability-transaction.js.map