namespace apps.dflc.expensemanager.entities;

using {
    Currency,
    cuid,
    managed,
} from '@sap/cds/common';

using {apps.dflc.expensemanager.entities as entities} from './index';
using {apps.dflc.expensemanager.types as types} from '../types/debt-types';

entity LiabilityTransactions : cuid, managed {

    Liability   : Association to entities.Liabilities @mandatory;

    Date        : Date @mandatory;

    Description : String(250);

    Currency    : Currency @mandatory;

    @Semantics.amount.currencyCode: 'Currency'
    Amount      : Decimal(15, 2) @mandatory;

    Type        : types.LiabilityTransactionType @mandatory;
}