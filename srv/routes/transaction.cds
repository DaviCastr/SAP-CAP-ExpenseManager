using {apps.dflc.expensemanager.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/ExpenseManager/Transaction'
@requires: 'authenticated-user'

service TransactionService {

    @odata.draft.enabled
    // @restrict: [
    //     {
    //         grant: 'READ',
    //         where: `Invoice.Card.Person.createdBy = $user or
    //                 exists (
    //                     select 1 from apps.dflc.expensemanager.entities.Shares as S
    //                     inner join apps.dflc.expensemanager.entities.Entities as E
    //                         on E.Share_ID = S.ID
    //                     where 
    //                     S.Person_ID = Person.ID and
    //                     S.User = $user and
    //                     E.Entity = 7 and
    //                     E.Permission <> null
    //                 )`
    //     },

    //     {
    //         grant: [
    //             'CREATE',
    //             'UPDATE',
    //             'DELETE'
    //         ]
            
    //     }
    // ]
    entity Transactions as projection on entities.Transactions;

}

annotate TransactionService with @requires: [
    'ExpenseManagerUser',
    //'authenticated-user',
    //'any'
];
