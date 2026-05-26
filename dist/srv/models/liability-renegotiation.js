"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityRenegotiationModel = void 0;
const base_1 = require("./base");
const currency_1 = require("./currency");
class LiabilityRenegotiationModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(props) {
        return new LiabilityRenegotiationModel(props);
    }
    static singleModel(item) {
        return LiabilityRenegotiationModel.with({
            LiabilityId: item.LiabilityId,
            Name: item.Name,
            PreviousBalance: this.retrieveDecimal(item.PreviousBalance),
            NewBalance: this.retrieveDecimal(item.NewBalance),
            DiscountAmount: this.retrieveDecimal(item.DiscountAmount),
            PreviousInstallments: item.PreviousInstallments,
            NewInstallments: item.NewInstallments,
            PreviousInstallmentAmount: this.retrieveDecimal(item.PreviousInstallmentAmount),
            NewInstallmentAmount: this.retrieveDecimal(item.NewInstallmentAmount),
            PreviousInterestRate: this.retrieveDecimal(item.PreviousInterestRate),
            NewInterestRate: this.retrieveDecimal(item.NewInterestRate),
            RenegotiatedAt: item.RenegotiatedAt,
            Currency: item.Currency
                ? currency_1.CurrencyModel.singleModel(item.Currency)
                : undefined,
            Notes: item.Notes
        });
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            LiabilityId: this.props.LiabilityId,
            Name: this.props.Name,
            PreviousBalance: this.props
                .PreviousBalance
                ?.toNumber(),
            NewBalance: this.props
                .NewBalance
                ?.toNumber(),
            DiscountAmount: this.props
                .DiscountAmount
                ?.toNumber(),
            PreviousInstallments: this.props
                .PreviousInstallments,
            NewInstallments: this.props
                .NewInstallments,
            PreviousInstallmentAmount: this.props
                .PreviousInstallmentAmount
                ?.toNumber(),
            NewInstallmentAmount: this.props
                .NewInstallmentAmount
                ?.toNumber(),
            PreviousInterestRate: this.props
                .PreviousInterestRate
                ?.toNumber(),
            NewInterestRate: this.props
                .NewInterestRate
                ?.toNumber(),
            RenegotiatedAt: this.props
                .RenegotiatedAt,
            Currency: this.props
                .Currency
                ?.toEntityObject(),
            Notes: this.props
                .Notes
        });
    }
}
exports.LiabilityRenegotiationModel = LiabilityRenegotiationModel;
//# sourceMappingURL=liability-renegotiation.js.map