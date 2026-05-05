using {apps.dflc.expensemanager.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/ExpenseManager/LiabilityTransaction'
@requires: 'authenticated-user'

service LiabilityTransactionService {

    @restrict: [

        {
            grant: 'READ',
            where: `Liability.Person.createdBy = $user or
                    exists (
                        select 1
                        from apps.dflc.expensemanager.entities.Shares as S
                        inner join apps.dflc.expensemanager.entities.Entities as E
                            on E.Share_ID = S.ID
                        where
                            S.Person_ID = Liability.Person.ID and
                            S.User = $user and
                            E.Entity = 10 and
                            E.Permission is not null
                    )`
        },

        {grant: [
            'CREATE',
            'UPDATE',
            'DELETE'
        ]}

    ]

    entity LiabilityTransactions as projection on entities.LiabilityTransactions;


    action ReverseTransaction(TransactionId: UUID) returns entities.ActionResult;


    action RecalculateLiability(LiabilityId: UUID) returns entities.ActionResult;

}

annotate LiabilityTransactionService with @requires: [
    'authenticated-user',
    'any'
];
