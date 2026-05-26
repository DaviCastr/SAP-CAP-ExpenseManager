export default function Initialize(context) {

    // Perform pre data initialization task

    // Initialize all your Data sources
    let _ExpenseManager = context.executeAction('/ExpenseManager/Actions/ExpenseManager/Service/InitializeOnline.action');

    //You can add more service initialize actions here

    return Promise.all([_ExpenseManager]).then(() => {
        // After Initializing the DB connections

        // Display successful initialization  message to the user
        return context.executeAction({

            "Name": "/ExpenseManager/Actions/GenericToastMessage.action",
            "Properties": {
                "Message": "Application Services Initialized",
                "Animated": true,
                "Duration": 1,
                "IsIconHidden": true,
                "NumberOfLines": 1
            }
        });
    }).catch(() => {
        return false;
    });
}