"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityServiceImplementation = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const either_1 = require("@sweet-monads/either");
const implementation_1 = require("../base/implementation");
const errors_1 = require("@/errors");
const permission_denied_1 = require("@/errors/permission-denied");
const ServiceLocator_1 = require("@/infrastructure/ServiceLocator");
const ServiceRegistry_1 = require("@/infrastructure/ServiceRegistry");
const liability_create_1 = require("@/models/liability-create");
const liability_dashboard_1 = require("@/models/liability-dashboard");
const liability_pay_1 = require("@/models/liability-pay");
const liability_close_1 = require("@/models/liability-close");
const liability_analytics_1 = require("@/models/liability-analytics");
const liability_payment_schedule_1 = require("@/models/liability-payment-schedule");
const liability_renegotiation_1 = require("@/models/liability-renegotiation");
const liability_future_impact_1 = require("@/models/liability-future-impact");
const liability_premium_score_1 = require("@/models/liability-premium-score");
const entities_codes_1 = require("@/constants/entities-codes");
class LiabilityServiceImplementation extends implementation_1.BaseServiceImplementation {
    LiabilityTransactionRepository;
    Repository;
    constructor(Repository, PersonRepository, ShareRepository, EntityRepository, LiabilityTransactionRepository) {
        super(PersonRepository, ShareRepository, EntityRepository);
        this.LiabilityTransactionRepository = LiabilityTransactionRepository;
        this.Repository =
            Repository;
    }
    // ==================================================
    // CONFIG
    // ==================================================
    entityCode() {
        return entities_codes_1.EntitiesCodes.Liabilities;
    }
    personPath() {
        return ["Person"];
    }
    parentField() {
        return "Person_ID";
    }
    getTransactionService() {
        return ServiceRegistry_1.ServiceRegistry.get("LiabilityTransactions");
    }
    // ==================================================
    // HELPERS
    // ==================================================
    forbidden() {
        const stack = new Error().stack;
        const message = this.getMessage("error.modificationPermissionDenied", ServiceLocator_1.ServiceLocator.getRequest(), this.entityCode()) ||
            "error.modificationPermissionDenied";
        return (0, either_1.left)(new permission_denied_1.PermissionDenied(message, 403, stack));
    }
    async authorizeRows(rows, user) {
        const auth = await this.afterRead(rows, user);
        if (auth.isLeft()) {
            return auth;
        }
        return (0, either_1.right)(auth.value || []);
    }
    async authorizeSingle(row, user) {
        const auth = await this.afterRead([row], user);
        if (auth.isLeft()) {
            return auth;
        }
        if (!auth.value?.length) {
            return this.forbidden();
        }
        return (0, either_1.right)(auth.value[0]);
    }
    // ==================================================
    // ACTIONS
    // ==================================================
    async createLiability() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            if (!request.data.PersonId) {
                return (0, either_1.left)(new errors_1.AbstractError("PersonId is required", 400, ""));
            }
            const data = {
                Person_ID: request.data.PersonId,
                Name: request.data.Name,
                OriginalAmount: request.data.OriginalAmount,
                CurrentBalance: request.data.OriginalAmount,
                PaidAmount: 0,
                Currency_code: request.data.Currency,
                Status: "OPEN"
            };
            const auth = await this.beforeCreate(data, request.user);
            if (auth.isLeft()) {
                return auth;
            }
            const created = await this.Repository
                .createEntry(data);
            const row = created?.[0];
            const model = liability_create_1.LiabilityCreateModel.singleModel({
                ID: row?.Id,
                Name: row?.Name,
                CurrentBalance: row?.CurrentBalance
                    ?.toNumber(),
                Status: row?.Status
            });
            return (0, either_1.right)(model.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
    async dashboard() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const rows = await this.Repository
                .findByPersonId(request.data.PersonId) || [];
            const auth = await this.authorizeRows(rows?.map(item => item.toEntityObject()), request.user);
            if (auth.isLeft()) {
                return auth;
            }
            const safeRows = auth.value;
            let total = new decimal_js_1.default(0);
            let open = new decimal_js_1.default(0);
            let paid = new decimal_js_1.default(0);
            for (const row of safeRows) {
                total =
                    total.plus(row.OriginalAmount || 0);
                open =
                    open.plus(row.CurrentBalance || 0);
                paid =
                    paid.plus(row.PaidAmount || 0);
            }
            const model = liability_dashboard_1.LiabilityDashboardModel.with({
                KPIs: {
                    TotalDebt: total,
                    OpenDebt: open,
                    PaidDebt: paid,
                    OverdueDebt: new decimal_js_1.default(0),
                    MonthlyCommitment: new decimal_js_1.default(0)
                },
                HealthScore: 80,
                Currency: safeRows?.[0]
                    ?.Currency,
                NextPayments: [],
                Recommendations: [],
                TopDebts: []
            });
            return (0, either_1.right)(model.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
    async payLiability() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const debt = await this.Repository
                .findById(request.data
                .LiabilityId);
            if (!debt) {
                return (0, either_1.left)(new errors_1.AbstractError("Liability not found", 404, ""));
            }
            const auth = await this.beforeUpdate(debt, request.user);
            if (auth.isLeft()) {
                return auth;
            }
            const payment = new decimal_js_1.default(request.data.Amount || 0);
            let balance = (debt.CurrentBalance ||
                new decimal_js_1.default(0)).minus(payment);
            if (balance.lessThan(0)) {
                balance =
                    new decimal_js_1.default(0);
            }
            const paid = (debt.PaidAmount ||
                new decimal_js_1.default(0)).plus(payment);
            await this.Repository
                .updateAmounts(debt.Id, {
                CurrentBalance: balance,
                PaidAmount: paid,
                Status: balance.equals(0)
                    ? "PAID"
                    : "OPEN"
            });
            const trxService = this.getTransactionService();
            if (trxService) {
                const trxAuth = await trxService
                    .beforeCreate({
                    Liability_ID: debt.Id
                }, request.user);
                if (trxAuth.isLeft()) {
                    return trxAuth;
                }
            }
            await this
                .LiabilityTransactionRepository
                .createEntry({
                Liability_ID: debt.Id,
                Type: "PAYMENT",
                Amount: payment.toNumber(),
                Description: request.data.Notes
            });
            const model = liability_pay_1.LiabilityPayModel.with({
                LiabilityId: debt.Id,
                PaymentDate: new Date()
                    .toISOString()
                    .slice(0, 10),
                Amount: payment,
                Currency: debt.Currency,
                Notes: request.data.Notes
            });
            return (0, either_1.right)(model.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
    async closeLiability() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const debt = await this.Repository
                .findById(request.data
                .LiabilityId);
            if (!debt) {
                return (0, either_1.left)(new errors_1.AbstractError("Liability not found", 404, ""));
            }
            const auth = await this.beforeUpdate(debt, request.user);
            if (auth.isLeft()) {
                return auth;
            }
            await this.Repository
                .closeLiability(debt.Id);
            const model = liability_close_1.LiabilityCloseModel.singleModel({
                LiabilityId: debt.Id,
                Name: debt.Name,
                TotalPaidAmount: debt.OriginalAmount
                    ?.toNumber(),
                PaidAmount: debt.PaidAmount
                    ?.toNumber(),
                ClosedAt: new Date()
                    .toISOString(),
                Currency: debt.Currency
                    ?.toEntityObject(),
                Status: "PAID"
            });
            return (0, either_1.right)(model.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
    async analytics() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const rows = await this.Repository
                .findByPersonId(request.data.PersonId) || [];
            const auth = await this.authorizeRows(rows?.map(item => item?.toEntityObject()), request.user);
            if (auth.isLeft()) {
                return auth;
            }
            const safeRows = auth.value;
            const model = liability_analytics_1.LiabilityAnalyticsModel.with({
                ByType: [],
                ByStatus: [],
                MonthlyTrend: []
            });
            return (0, either_1.right)(model.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
    async paymentSchedule() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const debt = await this.Repository
                .findById(request.data
                .LiabilityId);
            if (!debt) {
                return (0, either_1.left)(new errors_1.AbstractError("Liability not found", 404, ""));
            }
            const auth = await this.authorizeSingle(debt?.toEntityObject(), request.user);
            if (auth.isLeft()) {
                return auth;
            }
            const safeDebt = auth.value;
            const model = liability_payment_schedule_1.LiabilityPaymentScheduleModel.with({
                LiabilityId: safeDebt.ID,
                Name: safeDebt.Name,
                TotalInstallments: safeDebt.Installments || 0,
                PaidInstallments: safeDebt.PaidInstallments || 0,
                RemainingInstallments: safeDebt.RemainingInstallments || 0,
                Items: []
            });
            return (0, either_1.right)(model.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
    async renegotiate() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const debt = await this.Repository
                .findById(request.data
                .LiabilityId);
            if (!debt) {
                return (0, either_1.left)(new errors_1.AbstractError("Liability not found", 404, ""));
            }
            const auth = await this.beforeUpdate(debt, request.user);
            if (auth.isLeft()) {
                return auth;
            }
            const previous = debt.CurrentBalance ||
                new decimal_js_1.default(0);
            const current = new decimal_js_1.default(request.data
                .NewBalance || 0);
            const installments = Number(request.data
                .NewInstallments || 1);
            const installmentValue = current.div(installments);
            await this.Repository
                .renegotiate(debt.Id, {
                CurrentBalance: current?.toNumber(),
                Installments: installments,
                RemainingInstallments: installments,
                InstallmentAmount: installmentValue?.toNumber(),
                InterestRate: request.data
                    .NewInterestRate,
                Status: current.equals(0)
                    ? "PAID"
                    : "OPEN"
            });
            const model = liability_renegotiation_1.LiabilityRenegotiationModel.with({
                LiabilityId: debt.Id,
                Name: debt.Name,
                PreviousBalance: previous,
                NewBalance: current,
                DiscountAmount: previous.minus(current),
                PreviousInstallments: debt.Installments,
                NewInstallments: installments,
                PreviousInstallmentAmount: debt.InstallmentAmount,
                NewInstallmentAmount: installmentValue,
                PreviousInterestRate: debt.InterestRate,
                NewInterestRate: new decimal_js_1.default(request.data
                    .NewInterestRate || 0),
                RenegotiatedAt: new Date()
                    .toISOString(),
                Currency: debt.Currency,
                Notes: request.data.Notes
            });
            return (0, either_1.right)(model.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
    async futureImpact() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const rows = await this.Repository
                .findOpenByPersonId(request.data.PersonId) || [];
            const auth = await this.authorizeRows(rows?.map(item => item?.toEntityObject()), request.user);
            if (auth.isLeft()) {
                return auth;
            }
            const model = liability_future_impact_1.LiabilityFutureImpactModel.singleModel({
                Next3Months: 0,
                Next6Months: 0,
                Next12Months: 0,
                MonthlyCommitment: []
            });
            return (0, either_1.right)(model.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
    async premiumScore() {
        try {
            const request = ServiceLocator_1.ServiceLocator.getRequest();
            const personId = request.data.PersonId;
            const auth = await this.authorizeRows([{ Person_ID: personId }], request.user);
            if (auth.isLeft()) {
                return auth;
            }
            if (!auth.value?.length) {
                return this.forbidden();
            }
            const rows = await this.Repository
                .findOpenByPersonId(personId) || [];
            let totalDebt = new decimal_js_1.default(0);
            for (const item of rows) {
                totalDebt =
                    totalDebt.plus(item.CurrentBalance || 0);
            }
            const person = await this.PersonRepository
                .findById(personId);
            const income = new decimal_js_1.default(person?.Income || 0);
            let ratio = new decimal_js_1.default(0);
            if (income.greaterThan(0)) {
                ratio =
                    totalDebt.div(income);
            }
            let score = 100;
            if (ratio.greaterThan(1))
                score -= 40;
            else if (ratio.greaterThan(0.6))
                score -= 25;
            else if (ratio.greaterThan(0.3))
                score -= 10;
            if (rows.length > 5) {
                score -= 15;
            }
            let level = "EXCELLENT";
            if (score < 80)
                level = "GOOD";
            if (score < 60)
                level = "WARNING";
            if (score < 40)
                level = "CRITICAL";
            const model = liability_premium_score_1.LiabilityPremiumScoreModel.with({
                Score: score,
                Level: level,
                DebtRatio: ratio,
                Message: "Calculated successfully"
            });
            return (0, either_1.right)(model.toEntityObject());
        }
        catch (error) {
            const err = error;
            return (0, either_1.left)(new errors_1.AbstractError(err.message, 400, err.stack || ""));
        }
    }
}
exports.LiabilityServiceImplementation = LiabilityServiceImplementation;
//# sourceMappingURL=implementation.js.map