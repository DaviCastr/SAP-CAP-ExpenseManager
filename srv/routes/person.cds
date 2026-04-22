using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Person'
@requires: 'authenticated-user'

service PersonService {

    @odata.draft.enabled
    entity Persons as projection on entities.Persons;

    action   AddCardExpense(CardId: UUID, CategoryId: UUID, Description: String, Value: Decimal, Currency: String, TransactionDate: Date, Installments: Integer, FixedExpense: Boolean) returns entities.ActionResult;
    action   SendInvoices(Year: Integer, Month: Integer)                                                                                                                                returns entities.ActionResult;
    action   SimulateExpenses(PersonId: UUID, Year: Integer, Month: Integer)                                                                                                            returns entities.ActionResult;
    action   SimulateFinancialFuture(PersonId: UUID, Year: Integer, Month: Integer)                                                                                                     returns entities.ActionResult;

    function CardExpensesByCategories(PersonId: UUID, CardId: UUID, InvoiceId: UUID, Month: Integer, Year: Integer, TotalOnwards: Boolean)                                              returns entities.CategoriesReturn;
    function RetrieveTransactionsByCategory(PersonId: UUID, CategoryId: UUID, Total: Boolean, Month: Integer, Year: Integer)                                                            returns entities.TransactionsReturn;
    function RetrieveCompleteInvoice(PersonId: UUID, Year: Integer, Month: Integer)                                                                                                      returns entities.CompleteInvoiceReturn;

}

annotate PersonService with @requires: [
    'authenticated-user',
    'any'
];
