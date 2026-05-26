export default function UpdateEntity(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Categories')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UpdateEntity.action',
            'Properties': {
                'OnSuccess': ''
            }
        }).then((result) => {
            return clientAPI.executeAction({
                'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'Categories'
                    }
                }
            });
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UpdateEntity.action');
    }
}