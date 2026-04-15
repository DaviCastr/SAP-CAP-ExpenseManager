using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Person'
@requires: 'authenticated-user'

service PersonService {

    @odata.draft.enabled
    entity Persons as projection on entities.Persons;

}

annotate PersonService with @requires: [
    'authenticated-user',
    'any'
];
