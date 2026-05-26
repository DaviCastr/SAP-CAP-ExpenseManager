"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityModel = void 0;
const base_1 = require("./base");
const currency_1 = require("./currency");
const liability_transaction_1 = require("./liability-transaction");
class LiabilityModel extends base_1.BaseModel {
    props;
    constructor(props) {
        super();
        this.props = props;
    }
    static with(properties) {
        return new LiabilityModel(properties);
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
            return LiabilityModel.with({
                Id: item.ID,
                Name: item.Name,
                Creditor: item.Creditor,
                Description: item.Description,
                Type: item.Type,
                Status: item.Status,
                OriginalAmount: this.retrieveDecimal(item.OriginalAmount),
                CurrentBalance: this.retrieveDecimal(item.CurrentBalance),
                PaidAmount: this.retrieveDecimal(item.PaidAmount),
                Currency: currency,
                InterestMode: item.InterestMode,
                InterestRate: this.retrieveDecimal(item.InterestRate),
                Installments: item.Installments,
                InstallmentAmount: this.retrieveDecimal(item.InstallmentAmount),
                StartDate: item.StartDate,
                FirstDueDate: item.FirstDueDate,
                EndDate: item.EndDate,
                LastPaymentDate: item.LastPaymentDate,
                ExternalReference: item.ExternalReference,
                RemainingAmount: this.retrieveDecimal(item.RemainingAmount),
                ProgressPercent: this.retrieveDecimal(item.ProgressPercent),
                PaidInstallments: item.PaidInstallments,
                RemainingInstallments: item.RemainingInstallments,
                NextDueDate: item.NextDueDate,
                IsOverdue: item.IsOverdue,
                HealthScore: item.HealthScore,
                PersonId: item.Person_ID || item?.Person?.ID,
                Transactions: liability_transaction_1.LiabilityTransactionModel.mapModel(item?.Transactions || []),
                CreatedAt: item.createdAt,
                CreatedBy: item.createdBy,
                ModifiedAt: item.modifiedAt,
                ModifiedBy: item.modifiedBy
            });
        });
    }
    get Id() { return this.props.Id; }
    get Name() { return this.props.Name; }
    get Creditor() { return this.props.Creditor; }
    get Description() { return this.props.Description; }
    get Type() { return this.props.Type; }
    get Status() { return this.props.Status; }
    get OriginalAmount() { return this.props.OriginalAmount; }
    get CurrentBalance() { return this.props.CurrentBalance; }
    get PaidAmount() { return this.props.PaidAmount; }
    get Currency() { return this.props.Currency; }
    get InterestMode() { return this.props.InterestMode; }
    get InterestRate() { return this.props.InterestRate; }
    get Installments() { return this.props.Installments; }
    get InstallmentAmount() { return this.props.InstallmentAmount; }
    get StartDate() { return this.props.StartDate; }
    get FirstDueDate() { return this.props.FirstDueDate; }
    get EndDate() { return this.props.EndDate; }
    get LastPaymentDate() { return this.props.LastPaymentDate; }
    get ExternalReference() { return this.props.ExternalReference; }
    get RemainingAmount() { return this.props.RemainingAmount; }
    get ProgressPercent() { return this.props.ProgressPercent; }
    get PaidInstallments() { return this.props.PaidInstallments; }
    get RemainingInstallments() { return this.props.RemainingInstallments; }
    get NextDueDate() { return this.props.NextDueDate; }
    get IsOverdue() { return this.props.IsOverdue; }
    get HealthScore() { return this.props.HealthScore; }
    get PersonId() { return this.props.PersonId; }
    get Transactions() { return this.props.Transactions || []; }
    get CreatedAt() { return this.props.CreatedAt; }
    get CreatedBy() { return this.props.CreatedBy; }
    get ModifiedAt() { return this.props.ModifiedAt; }
    get ModifiedBy() { return this.props.ModifiedBy; }
    toObject() {
        return this.props;
    }
    toEntityObject() {
        return this.cleanEntity({
            ID: this.props.Id,
            Name: this.props.Name,
            Creditor: this.props.Creditor,
            Description: this.props.Description,
            Type: this.props.Type,
            Status: this.props.Status,
            OriginalAmount: this.props.OriginalAmount?.toNumber(),
            CurrentBalance: this.props.CurrentBalance?.toNumber(),
            PaidAmount: this.props.PaidAmount?.toNumber(),
            Currency: this.props.Currency?.toEntityObject(),
            InterestMode: this.props.InterestMode,
            InterestRate: this.props.InterestRate?.toNumber(),
            Installments: this.props.Installments,
            InstallmentAmount: this.props.InstallmentAmount?.toNumber(),
            StartDate: this.props.StartDate,
            FirstDueDate: this.props.FirstDueDate,
            EndDate: this.props.EndDate,
            LastPaymentDate: this.props.LastPaymentDate,
            ExternalReference: this.props.ExternalReference,
            RemainingAmount: this.props.RemainingAmount?.toNumber(),
            ProgressPercent: this.props.ProgressPercent?.toNumber(),
            PaidInstallments: this.props.PaidInstallments,
            RemainingInstallments: this.props.RemainingInstallments,
            NextDueDate: this.props.NextDueDate,
            IsOverdue: this.props.IsOverdue,
            HealthScore: this.props.HealthScore,
            Person: this.props.PersonId ? { ID: this.props.PersonId } : undefined,
            Transactions: this.props.Transactions?.map(x => x.toEntityObject()),
            createdAt: this.props.CreatedAt,
            createdBy: this.props.CreatedBy,
            modifiedAt: this.props.ModifiedAt,
            modifiedBy: this.props.ModifiedBy
        });
    }
}
exports.LiabilityModel = LiabilityModel;
//# sourceMappingURL=liability.js.map