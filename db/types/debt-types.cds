namespace apps.dflc.expensemanager.types;

type LiabilityType            : String enum {
    GENERAL; // Genérica
    PERSONAL_LOAN; // Empréstimo pessoal
    FAMILY; // Familiar
    BANK; // Banco
    STORE; // Loja / Carnê
    TAX; // Imposto
    LEGAL; // Judicial
    CREDIT_LINE; // Limite / cheque especial
    OTHER; // Outros
}

type LiabilityStatus          : String enum {
    OPEN;
    PAID;
    CANCELLED;
    RENEGOTIATED;
    OVERDUE;
}

type InterestMode             : String enum {
    MANUAL;
    SIMPLE;
    COMPOUND;
}

type LiabilityTransactionType : String enum {
    OPENING;
    PAYMENT;
    INTEREST;
    FEE;
    DISCOUNT;
    AMORTIZATION;
    RENEGOTIATION;
    REVERSAL;
}
