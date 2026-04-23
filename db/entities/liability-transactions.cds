namespace apps.dflc.expensemanager.entities;

using {
    Currency,
    cuid,
    managed,
} from '@sap/cds/common';


using {apps.dflc.expensemanager.entities as entities} from './index';
using { apps.dflc.expensemanager.types as types } from '../types/debt-types';

entity LiabilityTransactions : cuid, managed {

    Liability : Association to entities.Liabilities @mandatory;

    Type : types.LiabilityTransactionType @mandatory;

    Description : String(250);

    MovementDate : Date @mandatory;

    Installment : Integer;

    TotalInstallments : Integer;

    @Semantics.amount.currencyCode: 'Currency'
    Amount : Decimal(15,2) @mandatory;

    Currency : Currency @mandatory;

    @Semantics.amount.currencyCode: 'Currency'
    BalanceAfter : Decimal(15,2);

    IsAutomatic : Boolean default false;

    ExternalReference : String(80);
}