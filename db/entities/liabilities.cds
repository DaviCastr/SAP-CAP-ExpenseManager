namespace apps.dflc.expensemanager.entities;

using {
    Currency,
    cuid,
    managed,
} from '@sap/cds/common';

using {apps.dflc.expensemanager.entities as entities} from './index';
using {apps.dflc.expensemanager.types as types} from '../types/debt-types';

entity Liabilities : cuid, managed {

    Person                        : Association to entities.Persons @mandatory;

    Name                          : String(120)                     @mandatory;
    Creditor                      : String(120);
    Description                   : String(500);

    Type                          : types.LiabilityType default #GENERAL;
    Status                        : types.LiabilityStatus default #OPEN;

    @Semantics.amount.currencyCode: 'Currency'
    OriginalAmount                : Decimal(15, 2)                  @mandatory;

    @Semantics.amount.currencyCode: 'Currency'
    CurrentBalance                : Decimal(15, 2);

    @Semantics.amount.currencyCode: 'Currency'
    PaidAmount                    : Decimal(15, 2);

    Currency                      : Currency                        @mandatory;

    InterestMode                  : types.InterestMode default #MANUAL;

    InterestRate                  : Decimal(9, 4);

    Installments                  : Integer default 1;

    @Semantics.amount.currencyCode: 'Currency'
    InstallmentAmount             : Decimal(15, 2);

    StartDate                     : Date                            @mandatory;
    FirstDueDate                  : Date;
    EndDate                       : Date;
    LastPaymentDate               : Date;

    ExternalReference             : String(80);

    @Semantics.amount.currencyCode: 'Currency'
    virtual RemainingAmount       : Decimal(15, 2);

    virtual ProgressPercent       : Decimal(9, 2);

    virtual PaidInstallments      : Integer;

    virtual RemainingInstallments : Integer;

    virtual NextDueDate           : Date;

    virtual IsOverdue             : Boolean;

    virtual HealthScore           : Integer;

    Transactions                  : Composition of many entities.LiabilityTransactions
                                        on Transactions.Liability = $self;
}
