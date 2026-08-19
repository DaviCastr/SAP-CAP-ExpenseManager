using {apps.dflc.expensemanager.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/ExpenseManager/LiabilityTransaction'
@requires: 'authenticated-user'

service LiabilityTransactionService {

    @odata.draft.enabled

    // @restrict: [

    //     {
    //         grant: 'READ',
    //         where: `Liability.Person.createdBy = $user or
    //                 exists (
    //                     select 1
    //                     from apps.dflc.expensemanager.entities.Shares as S
    //                     inner join apps.dflc.expensemanager.entities.Entities as E
    //                         on E.Share_ID = S.ID
    //                     where
    //                         S.Person_ID = Liability.Person.ID and
    //                         S.User = $user and
    //                         E.Entity = 10 and
    //                         E.Permission <> null
    //                 )`
    //     },

    //     {grant: [
    //         'CREATE',
    //         'UPDATE',
    //         'DELETE'
    //     ]}

    // ]

    entity LiabilityTransactions as projection on entities.LiabilityTransactions;

}

annotate LiabilityTransactionService with @requires: [
    //'authenticated-user',
    'ExpenseManagerUser',
    //'any'
];
