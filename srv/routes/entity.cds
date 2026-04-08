using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Entity'
@requires: 'authenticated-user'

service EntityService {

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            where: `Share.Person.createdBy = $user or 
                    exists (
                        select 1 from apps.dflc.gestordegastos.entities.Shares as S
                        inner join apps.dflc.gestordegastos.entities.Entities as E
                            on E.Share_ID = S.ID
                        where 
                        S.Person_ID = Person.ID and
                        S.User = $user and
                        E.Entity = 3 and
                        E.Permission is not null
                    )`
        },

        {grant: [
            'CREATE',
            'UPDATE',
            'DELETE'
        ]}
    ]
    entity Entities as projection on entities.Entities;                                                                                          

}

annotate EntityService with @requires: [
    'authenticated-user',
    'any'
];
