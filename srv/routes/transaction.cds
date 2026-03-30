using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Transaction'
@requires: 'authenticated-user'

service TransactionService {

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            where: `Invoice.Card.Person.createdBy = $user or
                    exists (
                        select 1 from apps.dflc.gestordegastos.entities.Shares as S
                        inner join apps.dflc.gestordegastos.entities.Entities as E
                            on E.Share_ID = S.ID
                        where 
                        S.Person_ID = Person.ID and
                        S.User = $user and
                        E.Entity = 7 and
                        E.Permission is not null
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
    entity Transactions as projection on entities.Transactions;

}

annotate TransactionService with @requires: [
    'authenticated-user',
    'any'
];
