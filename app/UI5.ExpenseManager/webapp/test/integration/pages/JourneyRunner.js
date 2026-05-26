sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"expensemanager/expensemanager/test/integration/pages/PersonsMain"
], function (JourneyRunner, PersonsMain) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('expensemanager/expensemanager') + '/test/flpSandbox.html#ExpenseManager-tile',
        pages: {
			onThePersonsMain: PersonsMain
        },
        async: true
    });

    return runner;
});

