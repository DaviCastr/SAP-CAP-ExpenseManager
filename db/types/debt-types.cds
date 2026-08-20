namespace apps.dflc.expensemanager.types;

type LiabilityStatus : String enum {
    OPEN;
    PAID;
}

type LiabilityTransactionType : String enum {
    ![IN];
    OUT;
}