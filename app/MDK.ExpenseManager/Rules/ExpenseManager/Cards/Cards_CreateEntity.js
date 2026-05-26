export default function CreateEntity(clientAPI) {
    return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateEntity.action',
        'Properties': {
            'OnSuccess': ''
        }
    }).then((result) => {
        let newEntity = JSON.parse(result.data);
        if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Cards')) {
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UploadStream.action',
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
                            'EntitySet': 'Cards',
                            'ReadLink': newEntity['@odata.readLink']
                        }
                    }
                });
            });
        } else {
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UploadStream.action',
                'Properties': {
                    'Target': {
                        'ReadLink': newEntity['@odata.readLink']
                    }
                }
            });
        }
    });
}