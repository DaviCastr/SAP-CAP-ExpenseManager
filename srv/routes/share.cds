using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Share'
@requires: 'authenticated-user'

service ShareService {

    @odata.draft.enabled
    entity Shares as projection on entities.Shares;                                                                                          

}

annotate ShareService with @requires: [
    'authenticated-user',
    'any'
];
