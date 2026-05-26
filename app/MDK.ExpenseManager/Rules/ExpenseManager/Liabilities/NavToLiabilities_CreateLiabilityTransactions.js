export default function NavToCreate(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Liabilities')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Liabilities'
                },
                'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.action');
    }
}