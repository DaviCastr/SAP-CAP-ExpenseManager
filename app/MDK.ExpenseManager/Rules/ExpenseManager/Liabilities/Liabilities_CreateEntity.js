export default function CreateEntity(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Liabilities')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateEntity.action',
            'Properties': {
                'OnSuccess': ''
            }
        }).then((result) => {
            let newEntity = JSON.parse(result.data);
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'Liabilities',
                        'ReadLink': newEntity['@odata.readLink']
                    }
                }
            });
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateEntity.action');
    }
}