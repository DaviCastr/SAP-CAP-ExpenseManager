export default function CreateEntity(clientAPI) {
    return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateEntity.action',
        'Properties': {
            'OnSuccess': ''
        }
    }).then((result) => {
        let newEntity = JSON.parse(result.data);
        if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Categories')) {
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action',
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
                            'EntitySet': 'Categories',
                            'ReadLink': newEntity['@odata.readLink']
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