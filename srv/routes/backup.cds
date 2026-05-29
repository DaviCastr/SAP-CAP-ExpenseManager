using {apps.dflc.expensemanager.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/ExpenseManager/Backup'
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

    action ExportBackup() returns entities.ActionResult;

}

annotate BackupService with @requires: [
    //'authenticated-user',
    'ExpenseManagerUser',
    //'any'
];
