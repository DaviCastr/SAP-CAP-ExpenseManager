export default function NavToEdit(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('LiabilityTransactions')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'LiabilityTransactions'
                },
                'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.action');
    }
}