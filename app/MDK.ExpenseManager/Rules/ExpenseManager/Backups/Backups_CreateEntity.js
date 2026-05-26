export default function CreateEntity(clientAPI) {
    return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Backups/Backups_CreateEntity.action',
        'Properties': {
            'OnSuccess': ''
        }
    }).then((result) => {
        let newEntity = JSON.parse(result.data);
        if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Backups')) {
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UploadStream.action',
                'Properties': {
                    'Target': {
                        'ReadLink': newEntity['@odata.readLink']
                    },
                    'OnSuccess': ''
                }
            }).then(() => {
                return clientAPI.executeAction({
                    'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
                    'Properties': {
                        'Target': {
                            'EntitySet': 'Backups',
                            'ReadLink': newEntity['@odata.readLink']
                        }
                    }
                });
            });
        } else {
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UploadStream.action',
                'Properties': {
                    'Target': {
                        'ReadLink': newEntity['@odata.readLink']
                    }
                }
            });
        }
    });
}