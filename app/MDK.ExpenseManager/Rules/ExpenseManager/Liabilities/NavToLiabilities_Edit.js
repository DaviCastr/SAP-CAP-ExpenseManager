export default function NavToEdit(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Liabilities')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Liabilities'
                },
                'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Edit.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Edit.action');
    }
}