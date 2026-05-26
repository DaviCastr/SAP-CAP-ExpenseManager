export default function NavToEdit(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Currencies_texts')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Currencies_texts'
                },
                'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.action');
    }
}