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
    entity Backups as projection on entities.Backups;

}

annotate BackupService with @requires: [
    'authenticated-user',
    'any'
];
