export default function NavToCreate(clientAPI) {
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
        return clientAPI.executeAction({
            'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'Persons'
                },
                'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCards.action'
            }
        });
    } else {
        return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCards.action');
    }
}