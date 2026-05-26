"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityAnalyticsModel = void 0;
const base_1 = require("./base");
class LiabilityAnalyticsModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(props) {
        return new LiabilityAnalyticsModel(props);
    }
    static singleModel(item) {
        return LiabilityAnalyticsModel.with({
            ByType: item.ByType?.map(row => ({
                Type: row.Type,
                TotalAmount: this.retrieveDecimal(row.TotalAmount),
                Percent: this.retrieveDecimal(row.Percent)
            })) || [],
            ByStatus: item.ByStatus?.map(row => ({
                Status: row.Status,
                TotalAmount: this.retrieveDecimal(row.TotalAmount),
                Contracts: row.Contracts
            })) || [],
            MonthlyTrend: item.MonthlyTrend?.map(row => ({
                Year: row.Year,
                Month: row.Month,
                Amount: this.retrieveDecimal(row.Amount)
            })) || []
        });
    }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            ByType: this.props.ByType?.map(item => ({
                Type: item.Type,
                TotalAmount: item.TotalAmount?.toNumber(),
                Percent: item.Percent?.toNumber()
            })),
            ByStatus: this.props.ByStatus?.map(item => ({
                Status: item.Status,
                TotalAmount: item.TotalAmount?.toNumber(),
                Contracts: item.Contracts
            })),
            MonthlyTrend: this.props.MonthlyTrend?.map(item => ({
                Year: item.Year,
                Month: item.Month,
                Amount: item.Amount?.toNumber()
            }))
        });
    }
}
exports.LiabilityAnalyticsModel = LiabilityAnalyticsModel;
//# sourceMappingURL=liability-analytics.js.map