using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Transaction'
@requires: 'authenticated-user'

service TransactionService {

    @odata.draft.enabled
    entity Transactions as projection on entities.Transactions;                                                                                          

}

annotate TransactionService with @requires: [
    'authenticated-user',
    'any'
];
