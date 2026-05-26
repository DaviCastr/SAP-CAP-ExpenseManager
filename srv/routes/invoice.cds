using {apps.dflc.expensemanager.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/ExpenseManager/Invoice'
@requires: 'authenticated-user'

service InvoiceService {

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            where: `Card.Person.createdBy = $user or
                    exists (
                        select 1 from apps.dflc.expensemanager.entities.Shares as S
                        inner join apps.dflc.expensemanager.entities.Entities as E
                            on E.Share_ID = S.ID
                        where 
                        S.Person_ID = Person.ID and
                        S.User = $user and
                        E.Entity = 6 and
                        E.Permission <> null null
                    )`
        },

        {
            grant: [
                'CREATE',
                'UPDATE',
                'DELETE'
            ]
            
        }
    ]
    entity Invoices as projection on entities.Invoices;

}

annotate InvoiceService with @requires: [
    'authenticated-user',
    'ExpenseManagerUser',
    'any'
];
