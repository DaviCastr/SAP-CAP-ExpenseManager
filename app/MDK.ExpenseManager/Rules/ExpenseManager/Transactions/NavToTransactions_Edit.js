export default function NavToEdit(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Transactions')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Transactions'
                },
                'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Edit.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Edit.action');
    }
}