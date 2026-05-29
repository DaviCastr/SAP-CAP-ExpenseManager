using {apps.dflc.expensemanager.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/ExpenseManager/Card'
@requires: 'authenticated-user'

service CardService {

    @odata.draft.enabled
    // @restrict: [
    //     {
    //         grant: 'READ',
    //         where: `Person.createdBy = $user or
    //                 exists (
    //                     select 1 from apps.dflc.expensemanager.entities.Shares as S
    //                     inner join apps.dflc.expensemanager.entities.Entities as E
    //                         on E.Share_ID = S.ID
    //                     where 
    //                     S.Person_ID = Person.ID and
    //                     S.User = $user and
    //                     E.Entity = 6 and
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
    entity Cards as projection on entities.Cards;

}

annotate CardService with @requires: [
    //'authenticated-user',
    'ExpenseManagerUser',
    //'any'
];
