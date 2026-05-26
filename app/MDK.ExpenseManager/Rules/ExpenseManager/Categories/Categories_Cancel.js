export default function Cancel(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Categories')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Categories'
                },
                'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
    }
}