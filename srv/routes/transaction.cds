using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Transaction'
@requires: 'authenticated-user'

service TransactionService {

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            where: 'Invoice.Card.Person.createdBy = $user or exists Invoice.Card.Person.Shares[User = $user and exists Entities[ Entity = 2 and Permission is not null] ]'
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
