"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityDashboardModel = void 0;
const base_1 = require("./base");
const currency_1 = require("./currency");
const liability_1 = require("./liability");
class LiabilityDashboardModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new LiabilityDashboardModel(properties);
    }
    static singleModel(properties) {
        return this.mapModel([properties])?.[0];
    }
    static mapModel(items) {
        return items?.map((item) => {
            return LiabilityDashboardModel.with({
                KPIs: {
                    TotalDebt: this.retrieveDecimal(item?.KPIs?.TotalDebt),
                    OpenDebt: this.retrieveDecimal(item?.KPIs?.OpenDebt),
                    PaidDebt: this.retrieveDecimal(item?.KPIs?.PaidDebt),
                    OverdueDebt: this.retrieveDecimal(item?.KPIs?.OverdueDebt),
                    MonthlyCommitment: this.retrieveDecimal(item?.KPIs?.MonthlyCommitment)
                },
                HealthScore: item?.HealthScore,
                Currency: currency_1.CurrencyModel.singleModel({
                    code: item?.Currency?.code
                }),
                NextPayments: item?.NextPayments?.map((payment) => ({
                    ID: payment?.ID,
                    Name: payment?.Name,
                    DueDate: payment?.DueDate,
                    Amount: this.retrieveDecimal(payment?.Amount)
                })) || [],
                Recommendations: item?.Recommendations || [],
                TopDebts: liability_1.LiabilityModel.mapModel(item?.TopDebts || [])
            });
        });
    }
    get KPIs() {
        return this.props.KPIs;
    }
    get HealthScore() {
        return this.props.HealthScore;
    }
    get Currency() {
        return this.props.Currency;
    }
    get NextPayments() {
        return this.props.NextPayments;
    }
    get Recommendations() {
        return this.props.Recommendations;
    }
    get TopDebts() {
        return this.props.TopDebts;
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            KPIs: {
                TotalDebt: this.props.KPIs.TotalDebt?.toNumber(),
                OpenDebt: this.props.KPIs.OpenDebt?.toNumber(),
                PaidDebt: this.props.KPIs.PaidDebt?.toNumber(),
                OverdueDebt: this.props.KPIs.OverdueDebt?.toNumber(),
                MonthlyCommitment: this.props.KPIs.MonthlyCommitment?.toNumber()
            },
            HealthScore: this.props.HealthScore,
            Currency: this.props.Currency?.toEntityObject(),
            NextPayments: this.props.NextPayments?.map((payment) => ({
                ID: payment.ID,
                Name: payment.Name,
                DueDate: payment.DueDate,
                Amount: payment.Amount?.toNumber()
            })),
            Recommendations: this.props.Recommendations,
            TopDebts: this.props.TopDebts?.map((debt) => debt.toEntityObject())
        });
    }
}
exports.LiabilityDashboardModel = LiabilityDashboardModel;
//# sourceMappingURL=liability-dashboard.js.map