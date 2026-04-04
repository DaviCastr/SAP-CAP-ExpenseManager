using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Entity'
@requires: 'authenticated-user'

service EntityService {

    @odata.draft.enabled
    entity Entities as projection on entities.Entities;                                                                                          

}

annotate EntityService with @requires: [
    'authenticated-user',
    'any'
];
