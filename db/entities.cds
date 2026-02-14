namespace app.dflc.gestordegastos.entities;

using {
    Country,
    Currency,
    Language,
    User,
    cuid,
    managed,
    temporal
} from '@sap/cds/common';

entity Persons : cuid, managed {
            Name                : String(100)  @mandatory;

            @Core.MediaType               : ImageType
            Image               : LargeBinary  @UI: {IsImage: true}  @stream;

            @Core.IsMediaType             : true
            ImageType           : String;

            @Semantics.amount.currencyCode: 'Currency'
            Income              : Decimal      @mandatory;
            Currency            : Currency     @mandatory;
            Email               : String(100)  @mandatory;
            Phone               : String(20);
            Share               : Composition of many Shares
                                      on Share.Person = $self;

            @Semantics.amount.currencyCode: 'Currency'
            ExpenseTarget       : Decimal      @mandatory;

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

            Category            : Composition of many Categories
                                      on Category.Person = $self;

            Card                : Composition of many Cards
                                      on Card.Person = $self;
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
    Person : Association to Persons @mandatory;
    Email  : String(100)            @mandatory;
}

entity Cards : cuid, managed {

            Name                    : String(50)             @mandatory;

            @Core.MediaType               : ImageType
            @UI                           : {IsImage: true}
            Image                   : LargeBinary;

            @Core.IsMediaType             : true
            ImageType               : String;

            @Semantics.amount.currencyCode: 'Moeda'
            Limit                   : Decimal                @mandatory;
            Currency                : Currency               @mandatory;

            @Semantics.amount.currencyCode: 'Moeda'
    virtual AvailableLimit          : Decimal;
            DueDay                  : Integer                @mandatory; // Dia do vencimento
            ClosingDay              : Integer                @mandatory; // Dia do fechamento da fatura

            @Semantics.amount.currencyCode: 'Moeda'
    virtual InvoiceAmountForPayment : Decimal;

            @Semantics.amount.currencyCode: 'Moeda'
    virtual OpenInvoiceAmount       : Decimal;

            Invoice                 : Composition of many Invoices
                                          on Invoice.Card = $self;

            Person                  : Association to Persons @mandatory; // @assert.target
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
    Indentifier       : UUID;
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
    Category          : Association to Categories
}

entity Backups : cuid, managed {
    @Core.MediaType: BackupType
    Backup     : LargeBinary @stream;

    @Core.IsMediaType: true
    BackupType : String;
}

//Anotações
annotate Persons with {
    modifiedAt @odata.etag
}


annotate Cards with {
    modifiedAt @odata.etag
}


annotate Invoices with {
    modifiedAt @odata.etag
}

annotate Transactions with {
    modifiedAt @odata.etag
}

annotate Backups with {
    modifiedAt @odata.etag
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
    Year               : Integer;
    Month              : Integer;
    InvoiceDescription : String;
    TotalAmount        : Decimal;
    CurrencyCode       : String;
    Transactions       : many TrasactionsCompleteInvoice;
}

type TrasactionsCompleteInvoice {
    ID                : UUID;
    CardID            : UUID;
    CardName          : String(50);
    Date              : Date;
    Amount            : Decimal;
    TotalAmount       : Decimal;
    CurrencyCode      : String;
    Installment       : Integer;
    TotalInstallments : Integer;
    Description       : String(255);
}
