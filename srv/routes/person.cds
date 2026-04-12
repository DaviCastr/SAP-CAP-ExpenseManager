using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Person'
@requires: 'authenticated-user'

service PersonService {

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            where: `createdBy = $user or 
                exists (
                    select 1 from apps.dflc.gestordegastos.entities.Shares as S
                    where 
                        S.Person_ID = ID and
                        S.User = $user and
                        exists (
                            select 1 from apps.dflc.gestordegastos.entities.Entities as E
                            where 
                                E.Share_ID = S.ID and
                                E.Entity = 1 and
                                E.Permission is not null
                        )
                )`
        },
        {grant: [
            'CREATE',
            'UPDATE',
            'DELETE'
        ]}
    ]
    entity Persons as projection on entities.Persons;

}

annotate PersonService with @requires: [
    'authenticated-user',
    'any'
];
