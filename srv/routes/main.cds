using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/service/GestorDeGastos'
@requires: 'authenticated-user'

service GestorDeGastos {

    @odata.draft.enabled: true
    entity Persons      as projection on entities.Persons;

    @cds.redirection.target
    entity Shares       as projection on entities.Shares;

    @cds.redirection.target
    entity Entities     as projection on entities.Entities;

    @cds.redirection.target
    entity Categories   as projection on entities.Categories;

    @cds.redirection.target
    entity Cards        as projection on entities.Cards;

    @readonly
    @cds.redirection.target
    entity Invoices     as projection on entities.Invoices;

    @cds.redirection.target
    entity Transactions as projection on entities.Transactions;

    entity Backups      as projection on entities.Backups;

    action   AddCardExpense(CardId: UUID, CategoryId: UUID, Description: String, Value: Decimal, Currency: String, TransactionDate: Date, Installments: Integer, FixedExpense: Boolean) returns entities.ActionResult;
    action   ExportBackup()                                                                                                                                                             returns entities.ActionResult;
    action   SendInvoices()                                                                                                                                                             returns entities.ActionResult;
    action   SimulatePerMonthYear(Person: UUID, mes: Integer, ano: Integer)                                                                                                             returns entities.SimulationReturn;
    action   SendForecastInvoiceDetailed(Person: UUID, mes: Integer, ano: Integer);

    function RecoverCategoriesTotalExpense(Person: UUID, Month: Integer, Year: Integer)                                                                                                 returns entities.BooleanReturn;
    function CardExpensesByCategories(PersonId: UUID, CardId: UUID, InvoiceId: UUID, Month: Integer, Year: Integer, TotalOnwards: Boolean)                                              returns entities.CategoriesReturn;
    function RecoverTransactionsPerCategory(Person: UUID, Category: UUID, Total: Boolean, Month: Integer, Year: Integer)                                                                returns entities.TransactionsReturn;
    function RecoverCompleteInvoice(Person: UUID, Month: Integer, Year: Integer)                                                                                                        returns entities.CompleteInvoiceReturn;

}

annotate GestorDeGastos with @requires: [
    'authenticated-user',
    'any'
];
