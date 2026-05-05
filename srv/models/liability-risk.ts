import Decimal from "decimal.js";

export type LiabilityRiskReturn = {
    RiskLevel: string;
    MainFactor: string;
    IncomeCommitment: Decimal;
}