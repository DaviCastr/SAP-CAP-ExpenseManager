export default function UpdateEntity(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Liabilities')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_UpdateEntity.action',
            'Properties': {
                'OnSuccess': ''
            }
        }).then((result) => {
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'Liabilities'
                    }
                }
            });
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_UpdateEntity.action');
    }
}