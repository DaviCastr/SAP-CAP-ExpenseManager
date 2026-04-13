using {apps.dflc.gestordegastos.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/GestorDeGastos/Backup'
@requires: 'authenticated-user'

service BackupService {

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            where: `createdBy = $user`
        },

        {grant: [
            'CREATE',
            'UPDATE',
            'DELETE'
        ]}
    ]
    entity Entities as projection on entities.Entities;

}

annotate BackupService with @requires: [
    'authenticated-user',
    'any'
];
