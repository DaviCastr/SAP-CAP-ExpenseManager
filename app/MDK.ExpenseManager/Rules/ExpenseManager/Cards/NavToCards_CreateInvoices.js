export default function NavToCreate(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Cards')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Cards'
                },
                'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_CreateInvoices.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_CreateInvoices.action');
    }
}