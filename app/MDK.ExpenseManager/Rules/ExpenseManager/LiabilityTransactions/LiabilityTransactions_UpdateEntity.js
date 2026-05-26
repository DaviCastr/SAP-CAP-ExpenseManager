export default function UpdateEntity(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('LiabilityTransactions')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.action',
            'Properties': {
                'OnSuccess': ''
            }
        }).then((result) => {
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'LiabilityTransactions'
                    }
                }
            });
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.action');
    }
}