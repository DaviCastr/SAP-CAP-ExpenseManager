using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Category'
@requires: 'authenticated-user'

service CategoryService {

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            where: 'Person.createdBy = $user or exists Person.Shares[User = $user and Permission in (1,2)]'
        },

        {
            grant: [
                'CREATE',
                'UPDATE',
                'DELETE'
            ],
            where: 'createdBy = $user'
        }
        //     {
        //         grant: 'UPDATE',
        //         where: 'Person.createdBy = $user or exists Person.Shares[User = $user and Permission = #Modifier]'
        //     },
        //     {
        //         grant: 'CREATE',
        //         where: 'Person.createdBy = $user or exists Person.Shares[User = $user and Permission = #Modifier]'
        //     }
    ]
    entity Categories as projection on entities.Categories;

}

annotate CategoryService with @requires: [
    'authenticated-user',
    'any'
];
