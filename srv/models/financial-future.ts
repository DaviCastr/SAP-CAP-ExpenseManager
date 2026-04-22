export type FinancialMonthPoint = {
    Key: string;            // YYYY-MM
    Year: number;
    Month: number;
    Amount: number;
};

export type FinancialRecommendation = {
    Type: "INFO" | "WARNING" | "SUCCESS";
    Message: string;
};

export type FinancialFutureReturn = {
    KPIs: {
        TotalDebtUntilTarget: number;
        TargetMonthDebt: number;
        RecurringMonthlyAverage: number;
        InstallmentPending: number;
        FixedExpensesDetected: number;
        FreeCashFlow: number;
        SavingGap: number;
        RiskLevel: "LOW" | "MEDIUM" | "HIGH";
    };
    Charts: {
        MonthlyTimeline: FinancialMonthPoint[];
        DebtComposition: { Type: string; Amount: number }[];
    };
    Details: {
        RecurringExpenses: any[];
        PendingInstallments: any[];
        OpenInvoices: any[];
    };
    Recommendations: FinancialRecommendation[];
};