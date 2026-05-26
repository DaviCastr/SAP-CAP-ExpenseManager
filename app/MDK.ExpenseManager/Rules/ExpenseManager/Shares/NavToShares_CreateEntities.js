export default function NavToCreate(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Shares')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Shares'
                },
                'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_CreateEntities.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_CreateEntities.action');
    }
}