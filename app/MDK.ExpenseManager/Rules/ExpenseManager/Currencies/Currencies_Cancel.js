export default function Cancel(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Currencies')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Currencies'
                },
                'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
    }
}