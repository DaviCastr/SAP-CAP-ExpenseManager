// entity Persons : cuid, managed {
//             Name                : String(100)  @mandatory;
//             Image               : LargeBinary
//             ImageType           : String;
//             Income              : Decimal      @mandatory;
//             Currency            : Currency     @mandatory;
//             Email               : String(100)  @mandatory;
//             Phoene              : String(20);
//             Share               : Composition of many Shares on Share.Person = $self;
//             ExpenseTarget       : Decimal      @mandatory;
//     virtual AmountToSave        : Decimal;
//     virtual TotalExpenses       : Decimal;
//     virtual TotalExpensesMonth  : Decimal;
//     virtual TotalExpensesPayed  : Decimal;
//     virtual TotalExpensesToPay  : Decimal;
//     virtual TotalExpensesClosed : Decimal;
//     virtual MonthCriticallity   : Integer;
//     virtual CriticallityToPay   : Integer;
//             Category            : Composition of many Categories on Category.Person = $self;
//             Card                : Composition of many Cards on Card.Person = $self;
// }

import Decimal from 'decimal.js';

type PersonProperties = {
    Name                : string;
    Image               : Buffer;
    ImageType           : string;
    Income              : Decimal;
    Currency            : string;
    Email               : string;
    Phoene              : string;
    Share               : Composition of many Shares on Share.Person = $self;
    ExpenseTarget       : Decimal      @mandatory;
    AmountToSave        : Decimal;
    TotalExpenses       : Decimal;
    TotalExpensesMonth  : Decimal;
    TotalExpensesPayed  : Decimal;
    TotalExpensesToPay  : Decimal;
    TotalExpensesClosed : Decimal;
    MonthCriticallity   : Integer;
    CriticallityToPay   : Integer;
    Category            : Composition of many Categories on Category.Person = $self;
    Card                : Composition of many Cards on Card.Person = $self;
}