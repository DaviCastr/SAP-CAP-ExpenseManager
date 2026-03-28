using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Category'
@requires: 'authenticated-user'

service CategoryService {

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            where: 'Person.createdBy=$user or exists Person.Shares[ User = $user and exists Entities[ Share = $self and Entity = 2 and Permission is not null] ]'
        },

        {grant: [
            'CREATE',
            'UPDATE',
            'DELETE'
        ]}
    ]
    entity Categories as projection on entities.Categories;

}

annotate CategoryService with @requires: [
    'authenticated-user',
    'any'
];
