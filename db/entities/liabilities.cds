namespace apps.dflc.expensemanager.entities;

using {
    Currency,
    cuid,
    managed,
} from '@sap/cds/common';

using {apps.dflc.expensemanager.entities as entities} from './index';
using {apps.dflc.expensemanager.types as types} from '../types/debt-types';

entity Liabilities : cuid, managed {

    Person                : Association to entities.Persons @mandatory;

    Name                  : String(120)                     @mandatory;
    Description           : String(500);

    Currency              : Currency                        @mandatory;

    @Semantics.amount.currencyCode: 'Currency'
    TotalAmount           : Decimal(15, 2)                  @mandatory;

    @Semantics.amount.currencyCode: 'Currency'
    OutstandingBalance    : Decimal(15, 2);
    PaymentPercentage     : Decimal(9, 2);

    Status                : types.LiabilityStatus default #OPEN;

    DueDay                : Integer;

    LiabilityTransactions : Composition of many entities.LiabilityTransactions
                                    on LiabilityTransactions.Liability = $self;
}