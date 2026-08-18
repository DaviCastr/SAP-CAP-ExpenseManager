namespace apps.dflc.expensemanager.entities;

using {apps.dflc.expensemanager.entities as entities} from './liabilities';
using {
    Currency,
    cuid,
    managed,
} from '@sap/cds/common';

entity Persons : cuid, managed {
    Name                        : String(100)  @mandatory;

    @Core.MediaType               : ImageType
    Image                       : LargeBinary  @UI: {IsImage: true}  @stream;

    @Core.IsMediaType             : true
    ImageType                   : String;

    @Semantics.amount.currencyCode: 'Currency'
    Income                      : Decimal      @mandatory;
    Currency                    : Currency     @mandatory;
    Email                       : String(100)  @mandatory;
    Phone                       : String(20);
    Shares                      : Composition of many Shares
                                      on Shares.Person = $self;

    @Semantics.amount.currencyCode: 'Currency'
    ExpenseTarget               : Decimal      @mandatory;

    @Semantics.amount.currencyCode: 'Currency'
    virtual AmountToSave        : Decimal;

    @Semantics.amount.currencyCode: 'Currency'
    virtual TotalExpenses       : Decimal;

    @Semantics.amount.currencyCode: 'Currency'
    virtual TotalExpensesMonth  : Decimal;

    @Semantics.amount.currencyCode: 'Currency'
    virtual TotalExpensesPayed  : Decimal;

    @Semantics.amount.currencyCode: 'Currency'
    virtual TotalExpensesToPay  : Decimal;

    @Semantics.amount.currencyCode: 'Currency'
    virtual TotalExpensesClosed : Decimal;

    virtual MonthCriticallity   : Integer;

    virtual CriticallityToPay   : Integer;

    Categories                  : Composition of many Categories
                                      on Categories.Person = $self;

    Cards                       : Composition of many Cards
                                      on Cards.Person = $self;

    Liabilities                 : Composition of many entities.Liabilities
                                      on Liabilities.Person = $self;
}

entity Categories : cuid, managed {
    Name         : String(20)             @mandatory;

    @Core.MediaType: ImageType
    Image        : LargeBinary            @UI: {IsImage: true}  @stream;

    @Core.IsMediaType: true
    ImageType    : String;

    Person       : Association to Persons @mandatory; // @assert.target

    Transactions : Association to many Transactions
                       on Transactions.Category = $self;
}

entity Shares : cuid, managed {
    User     : String(255)            @mandatory;
    Person   : Association to Persons @mandatory;
    Entities : Composition of many Entities
                   on Entities.Share = $self;
}

entity Entities : cuid, managed {
    Share      : Association to Shares @mandatory;
    Entity     : EntitiesCodes         @assert.range: true;
    Permission : Permissions           @assert.range: true;
}

entity Cards : cuid, managed {

    Name                            : String(50)             @mandatory;

    @Core.MediaType               : ImageType
    @UI                           : {IsImage: true}
    Image                           : LargeBinary            @stream;

    @Core.IsMediaType             : true
    ImageType                       : String;

    @Semantics.amount.currencyCode: 'Moeda'
    Limit                           : Decimal                @mandatory;
    Currency                        : Currency               @mandatory;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual AvailableLimit          : Decimal;
    DueDay                          : Integer                @mandatory; // Dia do vencimento
    ClosingDay                      : Integer                @mandatory; // Dia do fechamento da fatura

    @Semantics.amount.currencyCode: 'Moeda'
    virtual InvoiceAmountForPayment : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual InvoiceAmountToPay      : Decimal;

    Invoices                        : Composition of many Invoices
                                          on Invoices.Card = $self;

    Person                          : Association to Persons @mandatory; // @assert.target
}

entity Invoices : cuid, managed {
    @orderby                      : {
        Ano: 'desc',
        Mes: 'desc'
    }
    Year         : Integer;
    Month        : Integer;
    Description  : String(255);

    @Semantics.amount.currencyCode: 'Moeda'
    TotalAmount  : Decimal;
    Currency     : Currency;
    InvoiceSent  : Boolean;
    Card         : Association to Cards @mandatory; //@assert.target
    Transactions : Composition of many Transactions
                       on Transactions.Invoice = $self
}


entity Transactions : cuid, managed {
    Identifier        : UUID;
    Date              : Date;

    @Semantics.amount.currencyCode: 'Moeda'
    TotalAmount       : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    Amount            : Decimal;
    Currency          : Currency;
    TotalInstallments : Integer;
    Installment       : Integer;
    Description       : String(255);
    Invoice           : Association to Invoices @mandatory; //@assert.target
    Category          : Association to Categories;
}

entity Backups : cuid, managed {
    @Core.MediaType: BackupType
    Backup     : LargeBinary @stream;

    @Core.IsMediaType: true
    BackupType : String;
}

//Anotações
// annotate Persons with {
//     modifiedAt @odata.etag
// }


// annotate Cards with {
//     modifiedAt @odata.etag
// }


// annotate Invoices with {
//     modifiedAt @odata.etag
// }

// annotate Transactions with {
//     modifiedAt @odata.etag
// }

// annotate Backups with {
//     modifiedAt @odata.etag
// }

type Permissions   : Integer enum {
    Viewer = 1;
    Creator = 2;
    Modifier = 3;
    Deleter = 4;
}

type EntitiesCodes : Integer enum {
    Persons = 1;
    Shares = 2;
    Entities = 3;
    Categories = 4;
    Cards = 5;
    Invoices = 6;
    Transactions = 7;
    Backups = 8;
    Liabilities = 9;
    LiabilityTransactions = 10;
    Financings = 11;
    FinancingInstallments = 12;
}

type SimulationReturn {
    TotalDeGastos    : Decimal;
    TotalDoMes       : Decimal;
    ValorAEconomizar : Decimal;
    Moeda            : Currency
}

type BooleanReturn {
    sucesso : Boolean
}

type recoverCategories {
    Person  : UUID;
    Card    : UUID;
    Invoice : UUID;
    Month   : Integer;
    Year    : Integer;
}

type CategoriesReturn {
    Amount   : Decimal;
    Currency : String(3);
    Category : many recoverCategories;
}

type CategoryType {
    ID          : UUID;
    Name        : String(20);
    Image       : LargeBinary;
    TotalAmount : Decimal;
}

type TransactionsReturn {
    ID       : UUID;
    Currency : String;
    Cards    : many CardsType;
}


type CardsType {
    ID       : UUID;
    Name     : String;
    Image    : LargeBinary;
    Invoices : many InvoicesType;
}

type InvoicesType {
    ID           : UUID;
    Year         : Integer;
    Month        : Integer;
    Description  : String(255);
    TotalAmount  : Decimal;
    Transactions : many Transactionsype;
}

type Transactionsype {
    ID                : UUID;
    Date              : Date;
    TotalAmount       : Decimal;
    Amount            : Decimal;
    TotalInstallments : Integer;
    Installment       : Integer;
    Description       : String(255);
}

type CompleteInvoiceReturn {
    Year         : Integer;
    Month        : Integer;
    Description  : String;
    TotalAmount  : Decimal;
    CurrencyCode : String;
    Currency     : {
        code : String(3)
    };
    KPIs         : {
        TotalTransactions : Integer;
        TotalCards        : Integer;
        TotalCategories   : Integer;
    };
    Transactions : many TrasactionsCompleteInvoice;
}

type TrasactionsCompleteInvoice {
    ID                : UUID;
    Identifier        : UUID;
    Date              : Date;
    Amount            : Decimal;
    TotalAmount       : Decimal;
    CurrencyCode      : String;
    Installment       : Integer;
    TotalInstallments : Integer;
    Description       : String(255);
    Card              : {
        ID        : UUID;
        Name      : String(50);
        ImagePath : String;
    };
    Category          : {
        ID        : UUID;
        Name      : String(50);
        ImagePath : String;
    };
    Invoice           : {
        ID : UUID;
    };
}

type ActionResult {
    success : Boolean;
    data    : LargeString;
}
