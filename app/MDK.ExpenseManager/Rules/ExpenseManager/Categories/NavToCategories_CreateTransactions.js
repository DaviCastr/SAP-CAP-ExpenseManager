export default function NavToCreate(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Categories')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Categories'
                },
                'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_CreateTransactions.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_CreateTransactions.action');
    }
}