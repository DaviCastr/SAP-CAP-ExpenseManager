export default function CreateRelatedEntity(clientAPI) {
    let readLink = clientAPI.binding['@odata.readLink'];
    return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCategories.action',
        'Properties': {
            'OnSuccess': ''
        }
    }).then((result) => {
        let newEntity = JSON.parse(result.data);
        if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action',
                'Properties': {
                    'Target': {
                        'ReadLink': newEntity['@odata.readLink']
                    },
                    'OnSuccess': ''
                }
            }).then((result) => {
                return clientAPI.executeAction({
                    'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
                    'Properties': {
                        'Target': {
                            'EntitySet': 'Persons',
                            'ReadLink': readLink
                        }
                    }
                });
            });
        } else {
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action',
                'Properties': {
                    'Target': {
                        'ReadLink': newEntity['@odata.readLink']
                    }
                }
            });
        }
    });
}