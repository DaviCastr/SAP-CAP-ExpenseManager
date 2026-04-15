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

    //Ações utilizadas no fiori/ui5
    action   SimulatePerMonthYear(Person: UUID, mes: Integer, ano: Integer)                                                                                            returns entities.SimulationReturn;
    action   AddExpense(Person: UUID, descricao: String, valor: Decimal, moeda: String, data: Date, parcelas: Integer, gastofixo: Boolean, Category: UUID, Card: UUID) returns entities.BooleanReturn;
    action   ExportBackup()                                                                                                                                            returns String;
    action   SendInvoice();
    action   SendForecastInvoiceDetailed(Person: UUID, mes: Integer, ano: Integer);

    function RecoverCategoriesTotalExpense(Person: UUID, Month: Integer, Year: Integer)                                                                                returns entities.BooleanReturn;
    function RecoverCategories(Person: UUID, Card: UUID, Invoice: UUID, Month: Integer, Year: Integer)                                                                 returns entities.CategoriesReturn;
    function RecoverTransactionsPerCategory(Person: UUID, Category: UUID, Total: Boolean, Month: Integer, Year: Integer)                                               returns entities.TransactionsReturn;
    function RecoverCompleteInvoice(Person: UUID, Month: Integer, Year: Integer)                                                                                       returns entities.CompleteInvoiceReturn;

}

annotate GestorDeGastos with @requires: [
    'authenticated-user',
    'any'
];
