using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Person'
@requires: 'authenticated-user'

service PersonService {

    @odata.draft.enabled
    entity Persons as projection on entities.Persons;

    action AddCardExpense(CardId: UUID, CategoryId: UUID, Description: String, Value: Decimal, Currency: String, TransactionDate: Date, Installments: Integer, FixedExpense: Boolean) returns entities.ActionResult;

}

annotate PersonService with @requires: [
    'authenticated-user',
    'any'
];
