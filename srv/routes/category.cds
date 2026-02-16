using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Category'
@requires: 'authenticated-user'

service CategoryService {

    @odata.draft.enabled
    entity Categories as projection on entities.Categories;                                                                                          

}

annotate CategoryService with @requires: [
    'authenticated-user',
    'any'
];
