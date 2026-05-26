"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityPaymentScheduleModel = void 0;
const base_1 = require("./base");
class LiabilityPaymentScheduleModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(props) {
        return new LiabilityPaymentScheduleModel(props);
    }
    static singleModel(item) {
        return LiabilityPaymentScheduleModel.with({
            LiabilityId: item.LiabilityId,
            Name: item.Name,
            TotalInstallments: item.TotalInstallments,
            PaidInstallments: item.PaidInstallments,
            RemainingInstallments: item.RemainingInstallments,
            Items: item.Items?.map(schedule => ({
                Installment: schedule.Installment,
                DueDate: schedule.DueDate,
                Amount: this.retrieveDecimal(schedule.Amount),
                Principal: this.retrieveDecimal(schedule.Principal),
                Interest: this.retrieveDecimal(schedule.Interest),
                BalanceAfter: this.retrieveDecimal(schedule.BalanceAfter),
                Paid: schedule.Paid
            })) || []
        });
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            LiabilityId: this.props.LiabilityId,
            Name: this.props.Name,
            TotalInstallments: this.props.TotalInstallments,
            PaidInstallments: this.props.PaidInstallments,
            RemainingInstallments: this.props.RemainingInstallments,
            Items: this.props.Items?.map(item => ({
                Installment: item.Installment,
                DueDate: item.DueDate,
                Amount: item.Amount?.toNumber(),
                Principal: item.Principal?.toNumber(),
                Interest: item.Interest?.toNumber(),
                BalanceAfter: item.BalanceAfter?.toNumber(),
                Paid: item.Paid
            }))
        });
    }
}
exports.LiabilityPaymentScheduleModel = LiabilityPaymentScheduleModel;
//# sourceMappingURL=liability-payment-schedule.js.map