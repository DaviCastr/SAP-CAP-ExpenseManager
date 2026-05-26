export default function NavToCreate(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Invoices')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Invoices'
                },
                'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.action');
    }
}