using {apps.dflc.expensemanager.entities as entities} from '../../db/entities';

@path    : '/service/ExpenseManager'

service ExpenseManager {

    @odata.draft.enabled: true
    entity Persons               as projection on entities.Persons;

    @cds.redirection.target
    entity Shares                as projection on entities.Shares;

    @cds.redirection.target
    entity Entities              as projection on entities.Entities;

    @cds.redirection.target
    entity Categories            as projection on entities.Categories;

    @cds.redirection.target
    entity Cards                 as projection on entities.Cards;

    @cds.redirection.target
    entity Invoices              as projection on entities.Invoices;

    @cds.redirection.target
    entity Transactions          as projection on entities.Transactions;

    entity Backups               as projection on entities.Backups;

    @cds.redirection.target
    entity Liabilities           as projection on entities.Liabilities;

    @cds.redirection.target
    entity LiabilityTransactions as projection on entities.LiabilityTransactions;

    action   AddCardExpense(CardId: UUID,
                            CategoryId: UUID,
                            Description: String,
                            Value: Decimal,
                            Currency: String,
                            TransactionDate: Date,
                            Installments: Integer,
                            FixedExpense: Boolean)           returns entities.ActionResult;

    action   ExportBackup()                                  returns entities.ActionResult;

    action   SendInvoices(PersonId: UUID,
                          Year: Integer,
                          Month: Integer)                    returns entities.ActionResult;

    action   SimulateExpenses(PersonId: UUID,
                              Year: Integer,
                              Month: Integer)                returns entities.ActionResult;

    action   SimulateFinancialFuture(PersonId: UUID,
                                     Year: Integer,
                                     Month: Integer)         returns entities.ActionResult;

    function CardExpensesByCategories(PersonId: UUID,
                                      CardId: UUID,
                                      InvoiceId: UUID,
                                      Year: Integer,
                                      Month: Integer,
                                      TotalOnwards: Boolean) returns entities.CategoriesReturn;

    function RetrieveTransactionsByCategory(PersonId: UUID,
                                            CategoryId: UUID,
                                            Total: Boolean,
                                            Year: Integer,
                                            Month: Integer)  returns entities.TransactionsReturn;

    function RetrieveCompleteInvoice(PersonId: UUID,
                                     Year: Integer,
                                     Month: Integer)         returns entities.CompleteInvoiceReturn;

    //Liabilities
    function Dashboard(PersonId: UUID)                       returns entities.ActionResult;
    function Analytics(PersonId: UUID)                       returns entities.ActionResult;
    function PaymentSchedule(LiabilityId: UUID)              returns entities.ActionResult;
    function FutureImpact(PersonId: UUID)                    returns entities.ActionResult;

}

annotate ExpenseManager with @requires: [
    //'authenticated-user',
    'ExpenseManagerUser',
    //'any'
];
