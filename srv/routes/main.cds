using {app.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/service/GestorDeGastos'
@requires: 'authenticated-user'
service GestorDeGastos {

    @cds.redirection.target

    @odata.draft.enabled: true
    @odata.draft.bypass
    entity Persons      as projection on entities.Persons;

    @odata.draft.bypass
    entity Categories   as projection on entities.Categories;

    @odata.draft.bypass
    entity Cards        as projection on entities.Cards;

    @readonly
    entity Invoices     as projection on entities.Invoices;

    @readonly
    entity Transactions as projection on entities.Transactions;

    @odata.draft.enabled: false
    entity Backups      as projection on entities.Backups;

    //Ações utilizadas no fiori/ui5
    action   SimulatePerMonthYear(Person: UUID, mes: Integer, ano: Integer)                                                                                                             returns entities.SimulationReturn;
    action   AddExpense(Person: UUID, descricao: String, valor: Decimal, moeda: String, data: Date, parcelas: Integer, gastofixo: Boolean, Category: UUID, Card: UUID) returns entities.BooleanReturn;
    action   ExportBackup(ID: UUID)                                                                                                                                              returns String;
    action   SendInvoice();
    action   SendForecastInvoiceDetailed(Person: UUID, mes: Integer, ano: Integer);

    function RecoverCategoriesTotalExpense(Person: UUID, Month: Integer, Year: Integer)                                                                                             returns entities.BooleanReturn;
    function RecoverCategories(Person: UUID, Card: UUID, Invoice: UUID, Month: Integer, Year: Integer)                                                                                returns entities.CategoriesReturn;
    function RecoverTransactionsPerCategory(Person: UUID, Category: UUID, Total: Boolean, Month: Integer, Year: Integer)                                                               returns entities.TransactionsReturn;
    function RecoverCompleteInvoice(Person: UUID, Month: Integer, Year: Integer)                                                                                                     returns entities.CompleteInvoiceReturn;

}

annotate GestorDeGastos with @requires: [
    'authenticated-user',
    'any'
];
