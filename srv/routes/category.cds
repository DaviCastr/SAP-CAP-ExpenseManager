using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Category'
@requires: 'authenticated-user'

service CategoryService {

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            where: `Person.createdBy = $user or 
                    exists (
                        select 1 from apps.dflc.gestordegastos.entities.Shares as S
                        inner join apps.dflc.gestordegastos.entities.Entities as E
                            on E.Share_ID = S.ID
                        where 
                        S.Person_ID = Person.ID and
                        S.User = $user and
                        E.Entity = 2 and
                        E.Permission is not null
                    )`
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
