(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./build.definitions/ExpenseManager/i18n/i18n.properties":
/*!***************************************************************!*\
  !*** ./build.definitions/ExpenseManager/i18n/i18n.properties ***!
  \***************************************************************/
/***/ ((module) => {

module.exports = "CreatedAt=CreatedAt\nDescription=Description\nCreatedBy=CreatedBy\nChangedAt=ChangedAt\nChangedBy=ChangedBy\nCurrency=Currency\nName=Name\nCurrencyCode=CurrencyCode\nCurrencySymbol=CurrencySymbol\nCurrencyMinorUnit=CurrencyMinorUnit\nDraft_DraftAdministrativeData=Draft_DraftAdministrativeData\nDraft_DraftUUID=Draft_DraftUUID\nDraft_CreationDateTime=Draft_CreationDateTime\nDraft_CreatedByUser=Draft_CreatedByUser\nDraft_DraftIsCreatedByMe=Draft_DraftIsCreatedByMe\nDraft_LastChangeDateTime=Draft_LastChangeDateTime\nDraft_LastChangedByUser=Draft_LastChangedByUser\nDraft_InProcessByUser=Draft_InProcessByUser\nDraft_DraftIsProcessedByMe=Draft_DraftIsProcessedByMe\nLanguageCode=LanguageCode\nBackups=Backups\nBackups_Detail=Backups Detail\nCreate_Backups_Detail=Create Backups Detail\nUpdate_Backups_Detail=Update Backups Detail\nCards=Cards\nCards_Detail=Cards Detail\nCreate_Cards_Detail=Create Cards Detail\nUpdate_Cards_Detail=Update Cards Detail\nCreate_Invoices=Create Invoices\nCategories=Categories\nCategories_Detail=Categories Detail\nCreate_Categories_Detail=Create Categories Detail\nUpdate_Categories_Detail=Update Categories Detail\nCreate_Transactions=Create Transactions\nCurrencies=Currencies\nCurrencies_Detail=Currencies Detail\nCreate_Currencies_Detail=Create Currencies Detail\nUpdate_Currencies_Detail=Update Currencies Detail\nCurrencies_texts=Currencies texts\nCurrencies_texts_Detail=Currencies texts Detail\nCreate_Currencies_texts_Detail=Create Currencies texts Detail\nUpdate_Currencies_texts_Detail=Update Currencies texts Detail\nEntities=Entities\nEntities_Detail=Entities Detail\nCreate_Entities_Detail=Create Entities Detail\nUpdate_Entities_Detail=Update Entities Detail\nInvoices=Invoices\nInvoices_Detail=Invoices Detail\nCreate_Invoices_Detail=Create Invoices Detail\nUpdate_Invoices_Detail=Update Invoices Detail\nLiabilities=Liabilities\nLiabilities_Detail=Liabilities Detail\nCreate_Liabilities_Detail=Create Liabilities Detail\nUpdate_Liabilities_Detail=Update Liabilities Detail\nCreate_LiabilityTransactions=Create LiabilityTransactions\nLiabilityTransactions=LiabilityTransactions\nLiabilityTransactions_Detail=LiabilityTransactions Detail\nCreate_LiabilityTransactions_Detail=Create LiabilityTransactions Detail\nUpdate_LiabilityTransactions_Detail=Update LiabilityTransactions Detail\nPersons=Persons\nPersons_Detail=Persons Detail\nCreate_Persons_Detail=Create Persons Detail\nUpdate_Persons_Detail=Update Persons Detail\nCreate_Shares=Create Shares\nCreate_Categories=Create Categories\nCreate_Cards=Create Cards\nShares=Shares\nShares_Detail=Shares Detail\nCreate_Shares_Detail=Create Shares Detail\nUpdate_Shares_Detail=Update Shares Detail\nCreate_Entities=Create Entities\nTransactions=Transactions\nTransactions_Detail=Transactions Detail\nCreate_Transactions_Detail=Create Transactions Detail\nUpdate_Transactions_Detail=Update Transactions Detail"

/***/ }),

/***/ "./build.definitions/application-index.js":
/*!************************************************!*\
  !*** ./build.definitions/application-index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

let application_app = __webpack_require__(/*! ./Application.app */ "./build.definitions/Application.app")
let expensemanager_actions_application_appupdate_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/AppUpdate.action */ "./build.definitions/ExpenseManager/Actions/Application/AppUpdate.action")
let expensemanager_actions_application_appupdatefailuremessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/AppUpdateFailureMessage.action */ "./build.definitions/ExpenseManager/Actions/Application/AppUpdateFailureMessage.action")
let expensemanager_actions_application_appupdateprogressbanner_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/AppUpdateProgressBanner.action */ "./build.definitions/ExpenseManager/Actions/Application/AppUpdateProgressBanner.action")
let expensemanager_actions_application_appupdatesuccessmessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/AppUpdateSuccessMessage.action */ "./build.definitions/ExpenseManager/Actions/Application/AppUpdateSuccessMessage.action")
let expensemanager_actions_application_logout_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/Logout.action */ "./build.definitions/ExpenseManager/Actions/Application/Logout.action")
let expensemanager_actions_application_navtoabout_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/NavToAbout.action */ "./build.definitions/ExpenseManager/Actions/Application/NavToAbout.action")
let expensemanager_actions_application_navtoactivitylog_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/NavToActivityLog.action */ "./build.definitions/ExpenseManager/Actions/Application/NavToActivityLog.action")
let expensemanager_actions_application_navtosupport_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/NavToSupport.action */ "./build.definitions/ExpenseManager/Actions/Application/NavToSupport.action")
let expensemanager_actions_application_onwillupdate_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/OnWillUpdate.action */ "./build.definitions/ExpenseManager/Actions/Application/OnWillUpdate.action")
let expensemanager_actions_application_reset_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/Reset.action */ "./build.definitions/ExpenseManager/Actions/Application/Reset.action")
let expensemanager_actions_application_resetmessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/ResetMessage.action */ "./build.definitions/ExpenseManager/Actions/Application/ResetMessage.action")
let expensemanager_actions_application_usermenupopover_action = __webpack_require__(/*! ./ExpenseManager/Actions/Application/UserMenuPopover.action */ "./build.definitions/ExpenseManager/Actions/Application/UserMenuPopover.action")
let expensemanager_actions_closemodalpage_cancel_action = __webpack_require__(/*! ./ExpenseManager/Actions/CloseModalPage_Cancel.action */ "./build.definitions/ExpenseManager/Actions/CloseModalPage_Cancel.action")
let expensemanager_actions_closemodalpage_complete_action = __webpack_require__(/*! ./ExpenseManager/Actions/CloseModalPage_Complete.action */ "./build.definitions/ExpenseManager/Actions/CloseModalPage_Complete.action")
let expensemanager_actions_closepage_action = __webpack_require__(/*! ./ExpenseManager/Actions/ClosePage.action */ "./build.definitions/ExpenseManager/Actions/ClosePage.action")
let expensemanager_actions_createentityfailuremessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/CreateEntityFailureMessage.action */ "./build.definitions/ExpenseManager/Actions/CreateEntityFailureMessage.action")
let expensemanager_actions_createentitysuccessmessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/CreateEntitySuccessMessage.action */ "./build.definitions/ExpenseManager/Actions/CreateEntitySuccessMessage.action")
let expensemanager_actions_deleteconfirmation_action = __webpack_require__(/*! ./ExpenseManager/Actions/DeleteConfirmation.action */ "./build.definitions/ExpenseManager/Actions/DeleteConfirmation.action")
let expensemanager_actions_deleteentityfailuremessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/DeleteEntityFailureMessage.action */ "./build.definitions/ExpenseManager/Actions/DeleteEntityFailureMessage.action")
let expensemanager_actions_deleteentitysuccessmessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/DeleteEntitySuccessMessage.action */ "./build.definitions/ExpenseManager/Actions/DeleteEntitySuccessMessage.action")
let expensemanager_actions_draftdiscardentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/DraftDiscardEntity.action */ "./build.definitions/ExpenseManager/Actions/DraftDiscardEntity.action")
let expensemanager_actions_drafteditentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/DraftEditEntity.action */ "./build.definitions/ExpenseManager/Actions/DraftEditEntity.action")
let expensemanager_actions_draftsaveentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/DraftSaveEntity.action */ "./build.definitions/ExpenseManager/Actions/DraftSaveEntity.action")
let expensemanager_actions_expensemanager_backups_backups_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Backups/Backups_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_CreateEntity.action")
let expensemanager_actions_expensemanager_backups_backups_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Backups/Backups_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_DeleteEntity.action")
let expensemanager_actions_expensemanager_backups_backups_detailpopover_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Backups/Backups_DetailPopover.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_DetailPopover.action")
let expensemanager_actions_expensemanager_backups_backups_opendocument_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Backups/Backups_OpenDocument.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_OpenDocument.action")
let expensemanager_actions_expensemanager_backups_backups_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Backups/Backups_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UpdateEntity.action")
let expensemanager_actions_expensemanager_backups_backups_uploadstream_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Backups/Backups_UploadStream.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UploadStream.action")
let expensemanager_actions_expensemanager_backups_navtobackups_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Create.action")
let expensemanager_actions_expensemanager_backups_navtobackups_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Detail.action")
let expensemanager_actions_expensemanager_backups_navtobackups_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Edit.action")
let expensemanager_actions_expensemanager_backups_navtobackups_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_List.action")
let expensemanager_actions_expensemanager_cards_cards_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateEntity.action")
let expensemanager_actions_expensemanager_cards_cards_createinvoices_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateInvoices.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateInvoices.action")
let expensemanager_actions_expensemanager_cards_cards_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/Cards_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_DeleteEntity.action")
let expensemanager_actions_expensemanager_cards_cards_detailpopover_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/Cards_DetailPopover.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_DetailPopover.action")
let expensemanager_actions_expensemanager_cards_cards_opendocument_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/Cards_OpenDocument.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_OpenDocument.action")
let expensemanager_actions_expensemanager_cards_cards_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/Cards_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UpdateEntity.action")
let expensemanager_actions_expensemanager_cards_cards_uploadstream_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/Cards_UploadStream.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UploadStream.action")
let expensemanager_actions_expensemanager_cards_navtocards_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Create.action")
let expensemanager_actions_expensemanager_cards_navtocards_createinvoices_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_CreateInvoices.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_CreateInvoices.action")
let expensemanager_actions_expensemanager_cards_navtocards_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Detail.action")
let expensemanager_actions_expensemanager_cards_navtocards_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Edit.action")
let expensemanager_actions_expensemanager_cards_navtocards_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_List.action")
let expensemanager_actions_expensemanager_categories_categories_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateEntity.action")
let expensemanager_actions_expensemanager_categories_categories_createtransactions_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateTransactions.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateTransactions.action")
let expensemanager_actions_expensemanager_categories_categories_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/Categories_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_DeleteEntity.action")
let expensemanager_actions_expensemanager_categories_categories_detailpopover_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/Categories_DetailPopover.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_DetailPopover.action")
let expensemanager_actions_expensemanager_categories_categories_opendocument_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/Categories_OpenDocument.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_OpenDocument.action")
let expensemanager_actions_expensemanager_categories_categories_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/Categories_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UpdateEntity.action")
let expensemanager_actions_expensemanager_categories_categories_uploadstream_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action")
let expensemanager_actions_expensemanager_categories_navtocategories_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Create.action")
let expensemanager_actions_expensemanager_categories_navtocategories_createtransactions_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_CreateTransactions.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_CreateTransactions.action")
let expensemanager_actions_expensemanager_categories_navtocategories_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Detail.action")
let expensemanager_actions_expensemanager_categories_navtocategories_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Edit.action")
let expensemanager_actions_expensemanager_categories_navtocategories_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_List.action")
let expensemanager_actions_expensemanager_currencies_currencies_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_CreateEntity.action")
let expensemanager_actions_expensemanager_currencies_currencies_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_DeleteEntity.action")
let expensemanager_actions_expensemanager_currencies_currencies_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_UpdateEntity.action")
let expensemanager_actions_expensemanager_currencies_navtocurrencies_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Create.action")
let expensemanager_actions_expensemanager_currencies_navtocurrencies_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Detail.action")
let expensemanager_actions_expensemanager_currencies_navtocurrencies_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Edit.action")
let expensemanager_actions_expensemanager_currencies_navtocurrencies_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_List.action")
let expensemanager_actions_expensemanager_currencies_texts_currencies_texts_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.action")
let expensemanager_actions_expensemanager_currencies_texts_currencies_texts_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_DeleteEntity.action")
let expensemanager_actions_expensemanager_currencies_texts_currencies_texts_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.action")
let expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Create.action")
let expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Detail.action")
let expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.action")
let expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_List.action")
let expensemanager_actions_expensemanager_entities_entities_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Entities/Entities_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/Entities_CreateEntity.action")
let expensemanager_actions_expensemanager_entities_entities_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Entities/Entities_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/Entities_DeleteEntity.action")
let expensemanager_actions_expensemanager_entities_entities_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Entities/Entities_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/Entities_UpdateEntity.action")
let expensemanager_actions_expensemanager_entities_navtoentities_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Create.action")
let expensemanager_actions_expensemanager_entities_navtoentities_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Detail.action")
let expensemanager_actions_expensemanager_entities_navtoentities_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Edit.action")
let expensemanager_actions_expensemanager_entities_navtoentities_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_List.action")
let expensemanager_actions_expensemanager_invoices_invoices_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateEntity.action")
let expensemanager_actions_expensemanager_invoices_invoices_createtransactions_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateTransactions.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateTransactions.action")
let expensemanager_actions_expensemanager_invoices_invoices_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_DeleteEntity.action")
let expensemanager_actions_expensemanager_invoices_invoices_detailpopover_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_DetailPopover.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_DetailPopover.action")
let expensemanager_actions_expensemanager_invoices_invoices_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_UpdateEntity.action")
let expensemanager_actions_expensemanager_invoices_navtoinvoices_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Create.action")
let expensemanager_actions_expensemanager_invoices_navtoinvoices_createtransactions_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.action")
let expensemanager_actions_expensemanager_invoices_navtoinvoices_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Detail.action")
let expensemanager_actions_expensemanager_invoices_navtoinvoices_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Edit.action")
let expensemanager_actions_expensemanager_invoices_navtoinvoices_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_List.action")
let expensemanager_actions_expensemanager_liabilities_liabilities_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateEntity.action")
let expensemanager_actions_expensemanager_liabilities_liabilities_createliabilitytransactions_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.action")
let expensemanager_actions_expensemanager_liabilities_liabilities_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_DeleteEntity.action")
let expensemanager_actions_expensemanager_liabilities_liabilities_detailpopover_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_DetailPopover.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_DetailPopover.action")
let expensemanager_actions_expensemanager_liabilities_liabilities_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_UpdateEntity.action")
let expensemanager_actions_expensemanager_liabilities_navtoliabilities_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Create.action")
let expensemanager_actions_expensemanager_liabilities_navtoliabilities_createliabilitytransactions_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.action")
let expensemanager_actions_expensemanager_liabilities_navtoliabilities_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Detail.action")
let expensemanager_actions_expensemanager_liabilities_navtoliabilities_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Edit.action")
let expensemanager_actions_expensemanager_liabilities_navtoliabilities_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_List.action")
let expensemanager_actions_expensemanager_liabilitytransactions_liabilitytransactions_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.action")
let expensemanager_actions_expensemanager_liabilitytransactions_liabilitytransactions_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_DeleteEntity.action")
let expensemanager_actions_expensemanager_liabilitytransactions_liabilitytransactions_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.action")
let expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Create.action")
let expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Detail.action")
let expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.action")
let expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_List.action")
let expensemanager_actions_expensemanager_persons_navtopersons_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Create.action")
let expensemanager_actions_expensemanager_persons_navtopersons_createcards_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCards.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCards.action")
let expensemanager_actions_expensemanager_persons_navtopersons_createcategories_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCategories.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCategories.action")
let expensemanager_actions_expensemanager_persons_navtopersons_createshares_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateShares.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateShares.action")
let expensemanager_actions_expensemanager_persons_navtopersons_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Detail.action")
let expensemanager_actions_expensemanager_persons_navtopersons_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Edit.action")
let expensemanager_actions_expensemanager_persons_navtopersons_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_List.action")
let expensemanager_actions_expensemanager_persons_persons_createcards_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCards.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCards.action")
let expensemanager_actions_expensemanager_persons_persons_createcategories_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCategories.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCategories.action")
let expensemanager_actions_expensemanager_persons_persons_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateEntity.action")
let expensemanager_actions_expensemanager_persons_persons_createshares_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateShares.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateShares.action")
let expensemanager_actions_expensemanager_persons_persons_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/Persons_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_DeleteEntity.action")
let expensemanager_actions_expensemanager_persons_persons_detailpopover_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/Persons_DetailPopover.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_DetailPopover.action")
let expensemanager_actions_expensemanager_persons_persons_opendocument_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/Persons_OpenDocument.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_OpenDocument.action")
let expensemanager_actions_expensemanager_persons_persons_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/Persons_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_UpdateEntity.action")
let expensemanager_actions_expensemanager_persons_persons_uploadstream_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Persons/Persons_UploadStream.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_UploadStream.action")
let expensemanager_actions_expensemanager_service_initializeonline_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Service/InitializeOnline.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Service/InitializeOnline.action")
let expensemanager_actions_expensemanager_service_initializeonlinefailuremessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Service/InitializeOnlineFailureMessage.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Service/InitializeOnlineFailureMessage.action")
let expensemanager_actions_expensemanager_shares_navtoshares_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Create.action")
let expensemanager_actions_expensemanager_shares_navtoshares_createentities_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_CreateEntities.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_CreateEntities.action")
let expensemanager_actions_expensemanager_shares_navtoshares_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Detail.action")
let expensemanager_actions_expensemanager_shares_navtoshares_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Edit.action")
let expensemanager_actions_expensemanager_shares_navtoshares_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_List.action")
let expensemanager_actions_expensemanager_shares_shares_createentities_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntities.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntities.action")
let expensemanager_actions_expensemanager_shares_shares_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntity.action")
let expensemanager_actions_expensemanager_shares_shares_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Shares/Shares_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_DeleteEntity.action")
let expensemanager_actions_expensemanager_shares_shares_detailpopover_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Shares/Shares_DetailPopover.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_DetailPopover.action")
let expensemanager_actions_expensemanager_shares_shares_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Shares/Shares_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_UpdateEntity.action")
let expensemanager_actions_expensemanager_transactions_navtotransactions_create_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Create.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Create.action")
let expensemanager_actions_expensemanager_transactions_navtotransactions_detail_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Detail.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Detail.action")
let expensemanager_actions_expensemanager_transactions_navtotransactions_edit_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Edit.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Edit.action")
let expensemanager_actions_expensemanager_transactions_navtotransactions_list_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_List.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_List.action")
let expensemanager_actions_expensemanager_transactions_transactions_createentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_CreateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_CreateEntity.action")
let expensemanager_actions_expensemanager_transactions_transactions_deleteentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_DeleteEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_DeleteEntity.action")
let expensemanager_actions_expensemanager_transactions_transactions_updateentity_action = __webpack_require__(/*! ./ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_UpdateEntity.action */ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_UpdateEntity.action")
let expensemanager_actions_genericbannermessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/GenericBannerMessage.action */ "./build.definitions/ExpenseManager/Actions/GenericBannerMessage.action")
let expensemanager_actions_genericmessagebox_action = __webpack_require__(/*! ./ExpenseManager/Actions/GenericMessageBox.action */ "./build.definitions/ExpenseManager/Actions/GenericMessageBox.action")
let expensemanager_actions_genericnavigation_action = __webpack_require__(/*! ./ExpenseManager/Actions/GenericNavigation.action */ "./build.definitions/ExpenseManager/Actions/GenericNavigation.action")
let expensemanager_actions_generictoastmessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/GenericToastMessage.action */ "./build.definitions/ExpenseManager/Actions/GenericToastMessage.action")
let expensemanager_actions_logging_loguploadfailure_action = __webpack_require__(/*! ./ExpenseManager/Actions/Logging/LogUploadFailure.action */ "./build.definitions/ExpenseManager/Actions/Logging/LogUploadFailure.action")
let expensemanager_actions_logging_loguploadsuccessful_action = __webpack_require__(/*! ./ExpenseManager/Actions/Logging/LogUploadSuccessful.action */ "./build.definitions/ExpenseManager/Actions/Logging/LogUploadSuccessful.action")
let expensemanager_actions_logging_uploadlog_action = __webpack_require__(/*! ./ExpenseManager/Actions/Logging/UploadLog.action */ "./build.definitions/ExpenseManager/Actions/Logging/UploadLog.action")
let expensemanager_actions_logging_uploadlogprogress_action = __webpack_require__(/*! ./ExpenseManager/Actions/Logging/UploadLogProgress.action */ "./build.definitions/ExpenseManager/Actions/Logging/UploadLogProgress.action")
let expensemanager_actions_updateentityfailuremessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/UpdateEntityFailureMessage.action */ "./build.definitions/ExpenseManager/Actions/UpdateEntityFailureMessage.action")
let expensemanager_actions_updateentitysuccessmessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/UpdateEntitySuccessMessage.action */ "./build.definitions/ExpenseManager/Actions/UpdateEntitySuccessMessage.action")
let expensemanager_actions_uploadstreamfailuremessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/UploadStreamFailureMessage.action */ "./build.definitions/ExpenseManager/Actions/UploadStreamFailureMessage.action")
let expensemanager_actions_uploadstreamsuccessmessage_action = __webpack_require__(/*! ./ExpenseManager/Actions/UploadStreamSuccessMessage.action */ "./build.definitions/ExpenseManager/Actions/UploadStreamSuccessMessage.action")
let expensemanager_globals_application_appdefinition_version_global = __webpack_require__(/*! ./ExpenseManager/Globals/Application/AppDefinition_Version.global */ "./build.definitions/ExpenseManager/Globals/Application/AppDefinition_Version.global")
let expensemanager_globals_application_applicationname_global = __webpack_require__(/*! ./ExpenseManager/Globals/Application/ApplicationName.global */ "./build.definitions/ExpenseManager/Globals/Application/ApplicationName.global")
let expensemanager_globals_application_supportemail_global = __webpack_require__(/*! ./ExpenseManager/Globals/Application/SupportEmail.global */ "./build.definitions/ExpenseManager/Globals/Application/SupportEmail.global")
let expensemanager_globals_application_supportphone_global = __webpack_require__(/*! ./ExpenseManager/Globals/Application/SupportPhone.global */ "./build.definitions/ExpenseManager/Globals/Application/SupportPhone.global")
let expensemanager_i18n_i18n_properties = __webpack_require__(/*! ./ExpenseManager/i18n/i18n.properties */ "./build.definitions/ExpenseManager/i18n/i18n.properties")
let expensemanager_jsconfig_json = __webpack_require__(/*! ./ExpenseManager/jsconfig.json */ "./build.definitions/ExpenseManager/jsconfig.json")
let expensemanager_pages_application_about_page = __webpack_require__(/*! ./ExpenseManager/Pages/Application/About.page */ "./build.definitions/ExpenseManager/Pages/Application/About.page")
let expensemanager_pages_application_support_page = __webpack_require__(/*! ./ExpenseManager/Pages/Application/Support.page */ "./build.definitions/ExpenseManager/Pages/Application/Support.page")
let expensemanager_pages_application_useractivitylog_page = __webpack_require__(/*! ./ExpenseManager/Pages/Application/UserActivityLog.page */ "./build.definitions/ExpenseManager/Pages/Application/UserActivityLog.page")
let expensemanager_pages_expensemanager_backups_backups_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Backups/Backups_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Create.page")
let expensemanager_pages_expensemanager_backups_backups_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Backups/Backups_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Detail.page")
let expensemanager_pages_expensemanager_backups_backups_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Backups/Backups_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Edit.page")
let expensemanager_pages_expensemanager_backups_backups_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Backups/Backups_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_List.page")
let expensemanager_pages_expensemanager_cards_cards_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Cards/Cards_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Create.page")
let expensemanager_pages_expensemanager_cards_cards_createinvoices_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Cards/Cards_CreateInvoices.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_CreateInvoices.page")
let expensemanager_pages_expensemanager_cards_cards_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Cards/Cards_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Detail.page")
let expensemanager_pages_expensemanager_cards_cards_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Cards/Cards_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Edit.page")
let expensemanager_pages_expensemanager_cards_cards_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Cards/Cards_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_List.page")
let expensemanager_pages_expensemanager_categories_categories_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Categories/Categories_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Create.page")
let expensemanager_pages_expensemanager_categories_categories_createtransactions_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Categories/Categories_CreateTransactions.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_CreateTransactions.page")
let expensemanager_pages_expensemanager_categories_categories_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Categories/Categories_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Detail.page")
let expensemanager_pages_expensemanager_categories_categories_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Categories/Categories_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Edit.page")
let expensemanager_pages_expensemanager_categories_categories_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Categories/Categories_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_List.page")
let expensemanager_pages_expensemanager_currencies_currencies_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Create.page")
let expensemanager_pages_expensemanager_currencies_currencies_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Detail.page")
let expensemanager_pages_expensemanager_currencies_currencies_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Edit.page")
let expensemanager_pages_expensemanager_currencies_currencies_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_List.page")
let expensemanager_pages_expensemanager_currencies_texts_currencies_texts_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Create.page")
let expensemanager_pages_expensemanager_currencies_texts_currencies_texts_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Detail.page")
let expensemanager_pages_expensemanager_currencies_texts_currencies_texts_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Edit.page")
let expensemanager_pages_expensemanager_currencies_texts_currencies_texts_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_List.page")
let expensemanager_pages_expensemanager_entities_entities_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Entities/Entities_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Create.page")
let expensemanager_pages_expensemanager_entities_entities_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Entities/Entities_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Detail.page")
let expensemanager_pages_expensemanager_entities_entities_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Entities/Entities_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Edit.page")
let expensemanager_pages_expensemanager_entities_entities_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Entities/Entities_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_List.page")
let expensemanager_pages_expensemanager_invoices_invoices_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Create.page")
let expensemanager_pages_expensemanager_invoices_invoices_createtransactions_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_CreateTransactions.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_CreateTransactions.page")
let expensemanager_pages_expensemanager_invoices_invoices_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Detail.page")
let expensemanager_pages_expensemanager_invoices_invoices_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Edit.page")
let expensemanager_pages_expensemanager_invoices_invoices_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_List.page")
let expensemanager_pages_expensemanager_liabilities_liabilities_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Create.page")
let expensemanager_pages_expensemanager_liabilities_liabilities_createliabilitytransactions_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_CreateLiabilityTransactions.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_CreateLiabilityTransactions.page")
let expensemanager_pages_expensemanager_liabilities_liabilities_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Detail.page")
let expensemanager_pages_expensemanager_liabilities_liabilities_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Edit.page")
let expensemanager_pages_expensemanager_liabilities_liabilities_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_List.page")
let expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Create.page")
let expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Detail.page")
let expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Edit.page")
let expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_List.page")
let expensemanager_pages_expensemanager_persons_persons_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Persons/Persons_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Create.page")
let expensemanager_pages_expensemanager_persons_persons_createcards_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateCards.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateCards.page")
let expensemanager_pages_expensemanager_persons_persons_createcategories_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateCategories.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateCategories.page")
let expensemanager_pages_expensemanager_persons_persons_createshares_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateShares.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateShares.page")
let expensemanager_pages_expensemanager_persons_persons_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Persons/Persons_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Detail.page")
let expensemanager_pages_expensemanager_persons_persons_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Persons/Persons_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Edit.page")
let expensemanager_pages_expensemanager_persons_persons_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Persons/Persons_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_List.page")
let expensemanager_pages_expensemanager_shares_shares_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Shares/Shares_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Create.page")
let expensemanager_pages_expensemanager_shares_shares_createentities_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Shares/Shares_CreateEntities.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_CreateEntities.page")
let expensemanager_pages_expensemanager_shares_shares_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Shares/Shares_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Detail.page")
let expensemanager_pages_expensemanager_shares_shares_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Shares/Shares_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Edit.page")
let expensemanager_pages_expensemanager_shares_shares_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Shares/Shares_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_List.page")
let expensemanager_pages_expensemanager_transactions_transactions_create_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Create.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Create.page")
let expensemanager_pages_expensemanager_transactions_transactions_detail_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Detail.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Detail.page")
let expensemanager_pages_expensemanager_transactions_transactions_edit_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Edit.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Edit.page")
let expensemanager_pages_expensemanager_transactions_transactions_list_page = __webpack_require__(/*! ./ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_List.page */ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_List.page")
let expensemanager_pages_main_page = __webpack_require__(/*! ./ExpenseManager/Pages/Main.page */ "./build.definitions/ExpenseManager/Pages/Main.page")
let expensemanager_rules_application_appupdatefailure_js = __webpack_require__(/*! ./ExpenseManager/Rules/Application/AppUpdateFailure.js */ "./build.definitions/ExpenseManager/Rules/Application/AppUpdateFailure.js")
let expensemanager_rules_application_appupdatesuccess_js = __webpack_require__(/*! ./ExpenseManager/Rules/Application/AppUpdateSuccess.js */ "./build.definitions/ExpenseManager/Rules/Application/AppUpdateSuccess.js")
let expensemanager_rules_application_clientismultiusermode_js = __webpack_require__(/*! ./ExpenseManager/Rules/Application/ClientIsMultiUserMode.js */ "./build.definitions/ExpenseManager/Rules/Application/ClientIsMultiUserMode.js")
let expensemanager_rules_application_getclientsupportversions_js = __webpack_require__(/*! ./ExpenseManager/Rules/Application/GetClientSupportVersions.js */ "./build.definitions/ExpenseManager/Rules/Application/GetClientSupportVersions.js")
let expensemanager_rules_application_getclientversion_js = __webpack_require__(/*! ./ExpenseManager/Rules/Application/GetClientVersion.js */ "./build.definitions/ExpenseManager/Rules/Application/GetClientVersion.js")
let expensemanager_rules_application_onwillupdate_js = __webpack_require__(/*! ./ExpenseManager/Rules/Application/OnWillUpdate.js */ "./build.definitions/ExpenseManager/Rules/Application/OnWillUpdate.js")
let expensemanager_rules_application_resetappsettingsandlogout_js = __webpack_require__(/*! ./ExpenseManager/Rules/Application/ResetAppSettingsAndLogout.js */ "./build.definitions/ExpenseManager/Rules/Application/ResetAppSettingsAndLogout.js")
let expensemanager_rules_expensemanager_backups_backups_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Backups/Backups_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_Cancel.js")
let expensemanager_rules_expensemanager_backups_backups_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Backups/Backups_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_CreateEntity.js")
let expensemanager_rules_expensemanager_backups_backups_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Backups/Backups_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_backups_backups_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Backups/Backups_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_UpdateEntity.js")
let expensemanager_rules_expensemanager_backups_navtobackups_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Backups/NavToBackups_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/NavToBackups_Edit.js")
let expensemanager_rules_expensemanager_cards_cards_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Cards/Cards_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_Cancel.js")
let expensemanager_rules_expensemanager_cards_cards_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Cards/Cards_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_CreateEntity.js")
let expensemanager_rules_expensemanager_cards_cards_createinvoices_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Cards/Cards_CreateInvoices.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_CreateInvoices.js")
let expensemanager_rules_expensemanager_cards_cards_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Cards/Cards_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_cards_cards_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Cards/Cards_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_UpdateEntity.js")
let expensemanager_rules_expensemanager_cards_navtocards_createinvoices_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Cards/NavToCards_CreateInvoices.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/NavToCards_CreateInvoices.js")
let expensemanager_rules_expensemanager_cards_navtocards_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Cards/NavToCards_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/NavToCards_Edit.js")
let expensemanager_rules_expensemanager_categories_categories_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Categories/Categories_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_Cancel.js")
let expensemanager_rules_expensemanager_categories_categories_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Categories/Categories_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_CreateEntity.js")
let expensemanager_rules_expensemanager_categories_categories_createtransactions_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Categories/Categories_CreateTransactions.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_CreateTransactions.js")
let expensemanager_rules_expensemanager_categories_categories_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Categories/Categories_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_categories_categories_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Categories/Categories_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_UpdateEntity.js")
let expensemanager_rules_expensemanager_categories_navtocategories_createtransactions_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Categories/NavToCategories_CreateTransactions.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/NavToCategories_CreateTransactions.js")
let expensemanager_rules_expensemanager_categories_navtocategories_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Categories/NavToCategories_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/NavToCategories_Edit.js")
let expensemanager_rules_expensemanager_currencies_currencies_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_Cancel.js")
let expensemanager_rules_expensemanager_currencies_currencies_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_CreateEntity.js")
let expensemanager_rules_expensemanager_currencies_currencies_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_currencies_currencies_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_UpdateEntity.js")
let expensemanager_rules_expensemanager_currencies_navtocurrencies_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Currencies/NavToCurrencies_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/NavToCurrencies_Edit.js")
let expensemanager_rules_expensemanager_currencies_texts_currencies_texts_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_Cancel.js")
let expensemanager_rules_expensemanager_currencies_texts_currencies_texts_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.js")
let expensemanager_rules_expensemanager_currencies_texts_currencies_texts_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_currencies_texts_currencies_texts_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.js")
let expensemanager_rules_expensemanager_currencies_texts_navtocurrencies_texts_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.js")
let expensemanager_rules_expensemanager_entities_entities_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Entities/Entities_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_Cancel.js")
let expensemanager_rules_expensemanager_entities_entities_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Entities/Entities_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_CreateEntity.js")
let expensemanager_rules_expensemanager_entities_entities_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Entities/Entities_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_entities_entities_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Entities/Entities_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_UpdateEntity.js")
let expensemanager_rules_expensemanager_entities_navtoentities_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Entities/NavToEntities_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/NavToEntities_Edit.js")
let expensemanager_rules_expensemanager_invoices_invoices_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_Cancel.js")
let expensemanager_rules_expensemanager_invoices_invoices_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_CreateEntity.js")
let expensemanager_rules_expensemanager_invoices_invoices_createtransactions_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_CreateTransactions.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_CreateTransactions.js")
let expensemanager_rules_expensemanager_invoices_invoices_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_invoices_invoices_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_UpdateEntity.js")
let expensemanager_rules_expensemanager_invoices_navtoinvoices_createtransactions_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.js")
let expensemanager_rules_expensemanager_invoices_navtoinvoices_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Invoices/NavToInvoices_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/NavToInvoices_Edit.js")
let expensemanager_rules_expensemanager_liabilities_liabilities_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_Cancel.js")
let expensemanager_rules_expensemanager_liabilities_liabilities_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_CreateEntity.js")
let expensemanager_rules_expensemanager_liabilities_liabilities_createliabilitytransactions_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.js")
let expensemanager_rules_expensemanager_liabilities_liabilities_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_liabilities_liabilities_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_UpdateEntity.js")
let expensemanager_rules_expensemanager_liabilities_navtoliabilities_createliabilitytransactions_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.js")
let expensemanager_rules_expensemanager_liabilities_navtoliabilities_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Liabilities/NavToLiabilities_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/NavToLiabilities_Edit.js")
let expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_Cancel.js")
let expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.js")
let expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.js")
let expensemanager_rules_expensemanager_liabilitytransactions_navtoliabilitytransactions_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.js")
let expensemanager_rules_expensemanager_persons_navtopersons_createcards_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateCards.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateCards.js")
let expensemanager_rules_expensemanager_persons_navtopersons_createcategories_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateCategories.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateCategories.js")
let expensemanager_rules_expensemanager_persons_navtopersons_createshares_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateShares.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateShares.js")
let expensemanager_rules_expensemanager_persons_navtopersons_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_Edit.js")
let expensemanager_rules_expensemanager_persons_persons_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/Persons_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_Cancel.js")
let expensemanager_rules_expensemanager_persons_persons_createcards_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateCards.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateCards.js")
let expensemanager_rules_expensemanager_persons_persons_createcategories_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateCategories.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateCategories.js")
let expensemanager_rules_expensemanager_persons_persons_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateEntity.js")
let expensemanager_rules_expensemanager_persons_persons_createshares_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateShares.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateShares.js")
let expensemanager_rules_expensemanager_persons_persons_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/Persons_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_persons_persons_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Persons/Persons_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_UpdateEntity.js")
let expensemanager_rules_expensemanager_shares_navtoshares_createentities_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Shares/NavToShares_CreateEntities.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/NavToShares_CreateEntities.js")
let expensemanager_rules_expensemanager_shares_navtoshares_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Shares/NavToShares_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/NavToShares_Edit.js")
let expensemanager_rules_expensemanager_shares_shares_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Shares/Shares_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_Cancel.js")
let expensemanager_rules_expensemanager_shares_shares_createentities_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Shares/Shares_CreateEntities.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_CreateEntities.js")
let expensemanager_rules_expensemanager_shares_shares_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Shares/Shares_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_CreateEntity.js")
let expensemanager_rules_expensemanager_shares_shares_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Shares/Shares_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_shares_shares_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Shares/Shares_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_UpdateEntity.js")
let expensemanager_rules_expensemanager_transactions_navtotransactions_edit_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Transactions/NavToTransactions_Edit.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/NavToTransactions_Edit.js")
let expensemanager_rules_expensemanager_transactions_transactions_cancel_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_Cancel.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_Cancel.js")
let expensemanager_rules_expensemanager_transactions_transactions_createentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_CreateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_CreateEntity.js")
let expensemanager_rules_expensemanager_transactions_transactions_deleteconfirmation_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_DeleteConfirmation.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_DeleteConfirmation.js")
let expensemanager_rules_expensemanager_transactions_transactions_updateentity_js = __webpack_require__(/*! ./ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_UpdateEntity.js */ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_UpdateEntity.js")
let expensemanager_rules_logging_loglevels_js = __webpack_require__(/*! ./ExpenseManager/Rules/Logging/LogLevels.js */ "./build.definitions/ExpenseManager/Rules/Logging/LogLevels.js")
let expensemanager_rules_logging_settracecategories_js = __webpack_require__(/*! ./ExpenseManager/Rules/Logging/SetTraceCategories.js */ "./build.definitions/ExpenseManager/Rules/Logging/SetTraceCategories.js")
let expensemanager_rules_logging_setuserloglevel_js = __webpack_require__(/*! ./ExpenseManager/Rules/Logging/SetUserLogLevel.js */ "./build.definitions/ExpenseManager/Rules/Logging/SetUserLogLevel.js")
let expensemanager_rules_logging_togglelogging_js = __webpack_require__(/*! ./ExpenseManager/Rules/Logging/ToggleLogging.js */ "./build.definitions/ExpenseManager/Rules/Logging/ToggleLogging.js")
let expensemanager_rules_logging_tracecategories_js = __webpack_require__(/*! ./ExpenseManager/Rules/Logging/TraceCategories.js */ "./build.definitions/ExpenseManager/Rules/Logging/TraceCategories.js")
let expensemanager_rules_logging_userlogsetting_js = __webpack_require__(/*! ./ExpenseManager/Rules/Logging/UserLogSetting.js */ "./build.definitions/ExpenseManager/Rules/Logging/UserLogSetting.js")
let expensemanager_rules_service_initialize_js = __webpack_require__(/*! ./ExpenseManager/Rules/Service/Initialize.js */ "./build.definitions/ExpenseManager/Rules/Service/Initialize.js")
let expensemanager_services_expensemanager_service = __webpack_require__(/*! ./ExpenseManager/Services/ExpenseManager.service */ "./build.definitions/ExpenseManager/Services/ExpenseManager.service")
let expensemanager_styles_styles_css = __webpack_require__(/*! ./ExpenseManager/Styles/Styles.css */ "./build.definitions/ExpenseManager/Styles/Styles.css")
let expensemanager_styles_styles_json = __webpack_require__(/*! ./ExpenseManager/Styles/Styles.json */ "./build.definitions/ExpenseManager/Styles/Styles.json")
let expensemanager_styles_styles_less = __webpack_require__(/*! ./ExpenseManager/Styles/Styles.less */ "./build.definitions/ExpenseManager/Styles/Styles.less")
let expensemanager_styles_styles_nss = __webpack_require__(/*! ./ExpenseManager/Styles/Styles.nss */ "./build.definitions/ExpenseManager/Styles/Styles.nss")
let tsconfig_json = __webpack_require__(/*! ./tsconfig.json */ "./build.definitions/tsconfig.json")
let version_mdkbundlerversion = __webpack_require__(/*! ./version.mdkbundlerversion */ "./build.definitions/version.mdkbundlerversion")

module.exports = {
	application_app : application_app,
	expensemanager_actions_application_appupdate_action : expensemanager_actions_application_appupdate_action,
	expensemanager_actions_application_appupdatefailuremessage_action : expensemanager_actions_application_appupdatefailuremessage_action,
	expensemanager_actions_application_appupdateprogressbanner_action : expensemanager_actions_application_appupdateprogressbanner_action,
	expensemanager_actions_application_appupdatesuccessmessage_action : expensemanager_actions_application_appupdatesuccessmessage_action,
	expensemanager_actions_application_logout_action : expensemanager_actions_application_logout_action,
	expensemanager_actions_application_navtoabout_action : expensemanager_actions_application_navtoabout_action,
	expensemanager_actions_application_navtoactivitylog_action : expensemanager_actions_application_navtoactivitylog_action,
	expensemanager_actions_application_navtosupport_action : expensemanager_actions_application_navtosupport_action,
	expensemanager_actions_application_onwillupdate_action : expensemanager_actions_application_onwillupdate_action,
	expensemanager_actions_application_reset_action : expensemanager_actions_application_reset_action,
	expensemanager_actions_application_resetmessage_action : expensemanager_actions_application_resetmessage_action,
	expensemanager_actions_application_usermenupopover_action : expensemanager_actions_application_usermenupopover_action,
	expensemanager_actions_closemodalpage_cancel_action : expensemanager_actions_closemodalpage_cancel_action,
	expensemanager_actions_closemodalpage_complete_action : expensemanager_actions_closemodalpage_complete_action,
	expensemanager_actions_closepage_action : expensemanager_actions_closepage_action,
	expensemanager_actions_createentityfailuremessage_action : expensemanager_actions_createentityfailuremessage_action,
	expensemanager_actions_createentitysuccessmessage_action : expensemanager_actions_createentitysuccessmessage_action,
	expensemanager_actions_deleteconfirmation_action : expensemanager_actions_deleteconfirmation_action,
	expensemanager_actions_deleteentityfailuremessage_action : expensemanager_actions_deleteentityfailuremessage_action,
	expensemanager_actions_deleteentitysuccessmessage_action : expensemanager_actions_deleteentitysuccessmessage_action,
	expensemanager_actions_draftdiscardentity_action : expensemanager_actions_draftdiscardentity_action,
	expensemanager_actions_drafteditentity_action : expensemanager_actions_drafteditentity_action,
	expensemanager_actions_draftsaveentity_action : expensemanager_actions_draftsaveentity_action,
	expensemanager_actions_expensemanager_backups_backups_createentity_action : expensemanager_actions_expensemanager_backups_backups_createentity_action,
	expensemanager_actions_expensemanager_backups_backups_deleteentity_action : expensemanager_actions_expensemanager_backups_backups_deleteentity_action,
	expensemanager_actions_expensemanager_backups_backups_detailpopover_action : expensemanager_actions_expensemanager_backups_backups_detailpopover_action,
	expensemanager_actions_expensemanager_backups_backups_opendocument_action : expensemanager_actions_expensemanager_backups_backups_opendocument_action,
	expensemanager_actions_expensemanager_backups_backups_updateentity_action : expensemanager_actions_expensemanager_backups_backups_updateentity_action,
	expensemanager_actions_expensemanager_backups_backups_uploadstream_action : expensemanager_actions_expensemanager_backups_backups_uploadstream_action,
	expensemanager_actions_expensemanager_backups_navtobackups_create_action : expensemanager_actions_expensemanager_backups_navtobackups_create_action,
	expensemanager_actions_expensemanager_backups_navtobackups_detail_action : expensemanager_actions_expensemanager_backups_navtobackups_detail_action,
	expensemanager_actions_expensemanager_backups_navtobackups_edit_action : expensemanager_actions_expensemanager_backups_navtobackups_edit_action,
	expensemanager_actions_expensemanager_backups_navtobackups_list_action : expensemanager_actions_expensemanager_backups_navtobackups_list_action,
	expensemanager_actions_expensemanager_cards_cards_createentity_action : expensemanager_actions_expensemanager_cards_cards_createentity_action,
	expensemanager_actions_expensemanager_cards_cards_createinvoices_action : expensemanager_actions_expensemanager_cards_cards_createinvoices_action,
	expensemanager_actions_expensemanager_cards_cards_deleteentity_action : expensemanager_actions_expensemanager_cards_cards_deleteentity_action,
	expensemanager_actions_expensemanager_cards_cards_detailpopover_action : expensemanager_actions_expensemanager_cards_cards_detailpopover_action,
	expensemanager_actions_expensemanager_cards_cards_opendocument_action : expensemanager_actions_expensemanager_cards_cards_opendocument_action,
	expensemanager_actions_expensemanager_cards_cards_updateentity_action : expensemanager_actions_expensemanager_cards_cards_updateentity_action,
	expensemanager_actions_expensemanager_cards_cards_uploadstream_action : expensemanager_actions_expensemanager_cards_cards_uploadstream_action,
	expensemanager_actions_expensemanager_cards_navtocards_create_action : expensemanager_actions_expensemanager_cards_navtocards_create_action,
	expensemanager_actions_expensemanager_cards_navtocards_createinvoices_action : expensemanager_actions_expensemanager_cards_navtocards_createinvoices_action,
	expensemanager_actions_expensemanager_cards_navtocards_detail_action : expensemanager_actions_expensemanager_cards_navtocards_detail_action,
	expensemanager_actions_expensemanager_cards_navtocards_edit_action : expensemanager_actions_expensemanager_cards_navtocards_edit_action,
	expensemanager_actions_expensemanager_cards_navtocards_list_action : expensemanager_actions_expensemanager_cards_navtocards_list_action,
	expensemanager_actions_expensemanager_categories_categories_createentity_action : expensemanager_actions_expensemanager_categories_categories_createentity_action,
	expensemanager_actions_expensemanager_categories_categories_createtransactions_action : expensemanager_actions_expensemanager_categories_categories_createtransactions_action,
	expensemanager_actions_expensemanager_categories_categories_deleteentity_action : expensemanager_actions_expensemanager_categories_categories_deleteentity_action,
	expensemanager_actions_expensemanager_categories_categories_detailpopover_action : expensemanager_actions_expensemanager_categories_categories_detailpopover_action,
	expensemanager_actions_expensemanager_categories_categories_opendocument_action : expensemanager_actions_expensemanager_categories_categories_opendocument_action,
	expensemanager_actions_expensemanager_categories_categories_updateentity_action : expensemanager_actions_expensemanager_categories_categories_updateentity_action,
	expensemanager_actions_expensemanager_categories_categories_uploadstream_action : expensemanager_actions_expensemanager_categories_categories_uploadstream_action,
	expensemanager_actions_expensemanager_categories_navtocategories_create_action : expensemanager_actions_expensemanager_categories_navtocategories_create_action,
	expensemanager_actions_expensemanager_categories_navtocategories_createtransactions_action : expensemanager_actions_expensemanager_categories_navtocategories_createtransactions_action,
	expensemanager_actions_expensemanager_categories_navtocategories_detail_action : expensemanager_actions_expensemanager_categories_navtocategories_detail_action,
	expensemanager_actions_expensemanager_categories_navtocategories_edit_action : expensemanager_actions_expensemanager_categories_navtocategories_edit_action,
	expensemanager_actions_expensemanager_categories_navtocategories_list_action : expensemanager_actions_expensemanager_categories_navtocategories_list_action,
	expensemanager_actions_expensemanager_currencies_currencies_createentity_action : expensemanager_actions_expensemanager_currencies_currencies_createentity_action,
	expensemanager_actions_expensemanager_currencies_currencies_deleteentity_action : expensemanager_actions_expensemanager_currencies_currencies_deleteentity_action,
	expensemanager_actions_expensemanager_currencies_currencies_updateentity_action : expensemanager_actions_expensemanager_currencies_currencies_updateentity_action,
	expensemanager_actions_expensemanager_currencies_navtocurrencies_create_action : expensemanager_actions_expensemanager_currencies_navtocurrencies_create_action,
	expensemanager_actions_expensemanager_currencies_navtocurrencies_detail_action : expensemanager_actions_expensemanager_currencies_navtocurrencies_detail_action,
	expensemanager_actions_expensemanager_currencies_navtocurrencies_edit_action : expensemanager_actions_expensemanager_currencies_navtocurrencies_edit_action,
	expensemanager_actions_expensemanager_currencies_navtocurrencies_list_action : expensemanager_actions_expensemanager_currencies_navtocurrencies_list_action,
	expensemanager_actions_expensemanager_currencies_texts_currencies_texts_createentity_action : expensemanager_actions_expensemanager_currencies_texts_currencies_texts_createentity_action,
	expensemanager_actions_expensemanager_currencies_texts_currencies_texts_deleteentity_action : expensemanager_actions_expensemanager_currencies_texts_currencies_texts_deleteentity_action,
	expensemanager_actions_expensemanager_currencies_texts_currencies_texts_updateentity_action : expensemanager_actions_expensemanager_currencies_texts_currencies_texts_updateentity_action,
	expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_create_action : expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_create_action,
	expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_detail_action : expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_detail_action,
	expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_edit_action : expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_edit_action,
	expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_list_action : expensemanager_actions_expensemanager_currencies_texts_navtocurrencies_texts_list_action,
	expensemanager_actions_expensemanager_entities_entities_createentity_action : expensemanager_actions_expensemanager_entities_entities_createentity_action,
	expensemanager_actions_expensemanager_entities_entities_deleteentity_action : expensemanager_actions_expensemanager_entities_entities_deleteentity_action,
	expensemanager_actions_expensemanager_entities_entities_updateentity_action : expensemanager_actions_expensemanager_entities_entities_updateentity_action,
	expensemanager_actions_expensemanager_entities_navtoentities_create_action : expensemanager_actions_expensemanager_entities_navtoentities_create_action,
	expensemanager_actions_expensemanager_entities_navtoentities_detail_action : expensemanager_actions_expensemanager_entities_navtoentities_detail_action,
	expensemanager_actions_expensemanager_entities_navtoentities_edit_action : expensemanager_actions_expensemanager_entities_navtoentities_edit_action,
	expensemanager_actions_expensemanager_entities_navtoentities_list_action : expensemanager_actions_expensemanager_entities_navtoentities_list_action,
	expensemanager_actions_expensemanager_invoices_invoices_createentity_action : expensemanager_actions_expensemanager_invoices_invoices_createentity_action,
	expensemanager_actions_expensemanager_invoices_invoices_createtransactions_action : expensemanager_actions_expensemanager_invoices_invoices_createtransactions_action,
	expensemanager_actions_expensemanager_invoices_invoices_deleteentity_action : expensemanager_actions_expensemanager_invoices_invoices_deleteentity_action,
	expensemanager_actions_expensemanager_invoices_invoices_detailpopover_action : expensemanager_actions_expensemanager_invoices_invoices_detailpopover_action,
	expensemanager_actions_expensemanager_invoices_invoices_updateentity_action : expensemanager_actions_expensemanager_invoices_invoices_updateentity_action,
	expensemanager_actions_expensemanager_invoices_navtoinvoices_create_action : expensemanager_actions_expensemanager_invoices_navtoinvoices_create_action,
	expensemanager_actions_expensemanager_invoices_navtoinvoices_createtransactions_action : expensemanager_actions_expensemanager_invoices_navtoinvoices_createtransactions_action,
	expensemanager_actions_expensemanager_invoices_navtoinvoices_detail_action : expensemanager_actions_expensemanager_invoices_navtoinvoices_detail_action,
	expensemanager_actions_expensemanager_invoices_navtoinvoices_edit_action : expensemanager_actions_expensemanager_invoices_navtoinvoices_edit_action,
	expensemanager_actions_expensemanager_invoices_navtoinvoices_list_action : expensemanager_actions_expensemanager_invoices_navtoinvoices_list_action,
	expensemanager_actions_expensemanager_liabilities_liabilities_createentity_action : expensemanager_actions_expensemanager_liabilities_liabilities_createentity_action,
	expensemanager_actions_expensemanager_liabilities_liabilities_createliabilitytransactions_action : expensemanager_actions_expensemanager_liabilities_liabilities_createliabilitytransactions_action,
	expensemanager_actions_expensemanager_liabilities_liabilities_deleteentity_action : expensemanager_actions_expensemanager_liabilities_liabilities_deleteentity_action,
	expensemanager_actions_expensemanager_liabilities_liabilities_detailpopover_action : expensemanager_actions_expensemanager_liabilities_liabilities_detailpopover_action,
	expensemanager_actions_expensemanager_liabilities_liabilities_updateentity_action : expensemanager_actions_expensemanager_liabilities_liabilities_updateentity_action,
	expensemanager_actions_expensemanager_liabilities_navtoliabilities_create_action : expensemanager_actions_expensemanager_liabilities_navtoliabilities_create_action,
	expensemanager_actions_expensemanager_liabilities_navtoliabilities_createliabilitytransactions_action : expensemanager_actions_expensemanager_liabilities_navtoliabilities_createliabilitytransactions_action,
	expensemanager_actions_expensemanager_liabilities_navtoliabilities_detail_action : expensemanager_actions_expensemanager_liabilities_navtoliabilities_detail_action,
	expensemanager_actions_expensemanager_liabilities_navtoliabilities_edit_action : expensemanager_actions_expensemanager_liabilities_navtoliabilities_edit_action,
	expensemanager_actions_expensemanager_liabilities_navtoliabilities_list_action : expensemanager_actions_expensemanager_liabilities_navtoliabilities_list_action,
	expensemanager_actions_expensemanager_liabilitytransactions_liabilitytransactions_createentity_action : expensemanager_actions_expensemanager_liabilitytransactions_liabilitytransactions_createentity_action,
	expensemanager_actions_expensemanager_liabilitytransactions_liabilitytransactions_deleteentity_action : expensemanager_actions_expensemanager_liabilitytransactions_liabilitytransactions_deleteentity_action,
	expensemanager_actions_expensemanager_liabilitytransactions_liabilitytransactions_updateentity_action : expensemanager_actions_expensemanager_liabilitytransactions_liabilitytransactions_updateentity_action,
	expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_create_action : expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_create_action,
	expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_detail_action : expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_detail_action,
	expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_edit_action : expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_edit_action,
	expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_list_action : expensemanager_actions_expensemanager_liabilitytransactions_navtoliabilitytransactions_list_action,
	expensemanager_actions_expensemanager_persons_navtopersons_create_action : expensemanager_actions_expensemanager_persons_navtopersons_create_action,
	expensemanager_actions_expensemanager_persons_navtopersons_createcards_action : expensemanager_actions_expensemanager_persons_navtopersons_createcards_action,
	expensemanager_actions_expensemanager_persons_navtopersons_createcategories_action : expensemanager_actions_expensemanager_persons_navtopersons_createcategories_action,
	expensemanager_actions_expensemanager_persons_navtopersons_createshares_action : expensemanager_actions_expensemanager_persons_navtopersons_createshares_action,
	expensemanager_actions_expensemanager_persons_navtopersons_detail_action : expensemanager_actions_expensemanager_persons_navtopersons_detail_action,
	expensemanager_actions_expensemanager_persons_navtopersons_edit_action : expensemanager_actions_expensemanager_persons_navtopersons_edit_action,
	expensemanager_actions_expensemanager_persons_navtopersons_list_action : expensemanager_actions_expensemanager_persons_navtopersons_list_action,
	expensemanager_actions_expensemanager_persons_persons_createcards_action : expensemanager_actions_expensemanager_persons_persons_createcards_action,
	expensemanager_actions_expensemanager_persons_persons_createcategories_action : expensemanager_actions_expensemanager_persons_persons_createcategories_action,
	expensemanager_actions_expensemanager_persons_persons_createentity_action : expensemanager_actions_expensemanager_persons_persons_createentity_action,
	expensemanager_actions_expensemanager_persons_persons_createshares_action : expensemanager_actions_expensemanager_persons_persons_createshares_action,
	expensemanager_actions_expensemanager_persons_persons_deleteentity_action : expensemanager_actions_expensemanager_persons_persons_deleteentity_action,
	expensemanager_actions_expensemanager_persons_persons_detailpopover_action : expensemanager_actions_expensemanager_persons_persons_detailpopover_action,
	expensemanager_actions_expensemanager_persons_persons_opendocument_action : expensemanager_actions_expensemanager_persons_persons_opendocument_action,
	expensemanager_actions_expensemanager_persons_persons_updateentity_action : expensemanager_actions_expensemanager_persons_persons_updateentity_action,
	expensemanager_actions_expensemanager_persons_persons_uploadstream_action : expensemanager_actions_expensemanager_persons_persons_uploadstream_action,
	expensemanager_actions_expensemanager_service_initializeonline_action : expensemanager_actions_expensemanager_service_initializeonline_action,
	expensemanager_actions_expensemanager_service_initializeonlinefailuremessage_action : expensemanager_actions_expensemanager_service_initializeonlinefailuremessage_action,
	expensemanager_actions_expensemanager_shares_navtoshares_create_action : expensemanager_actions_expensemanager_shares_navtoshares_create_action,
	expensemanager_actions_expensemanager_shares_navtoshares_createentities_action : expensemanager_actions_expensemanager_shares_navtoshares_createentities_action,
	expensemanager_actions_expensemanager_shares_navtoshares_detail_action : expensemanager_actions_expensemanager_shares_navtoshares_detail_action,
	expensemanager_actions_expensemanager_shares_navtoshares_edit_action : expensemanager_actions_expensemanager_shares_navtoshares_edit_action,
	expensemanager_actions_expensemanager_shares_navtoshares_list_action : expensemanager_actions_expensemanager_shares_navtoshares_list_action,
	expensemanager_actions_expensemanager_shares_shares_createentities_action : expensemanager_actions_expensemanager_shares_shares_createentities_action,
	expensemanager_actions_expensemanager_shares_shares_createentity_action : expensemanager_actions_expensemanager_shares_shares_createentity_action,
	expensemanager_actions_expensemanager_shares_shares_deleteentity_action : expensemanager_actions_expensemanager_shares_shares_deleteentity_action,
	expensemanager_actions_expensemanager_shares_shares_detailpopover_action : expensemanager_actions_expensemanager_shares_shares_detailpopover_action,
	expensemanager_actions_expensemanager_shares_shares_updateentity_action : expensemanager_actions_expensemanager_shares_shares_updateentity_action,
	expensemanager_actions_expensemanager_transactions_navtotransactions_create_action : expensemanager_actions_expensemanager_transactions_navtotransactions_create_action,
	expensemanager_actions_expensemanager_transactions_navtotransactions_detail_action : expensemanager_actions_expensemanager_transactions_navtotransactions_detail_action,
	expensemanager_actions_expensemanager_transactions_navtotransactions_edit_action : expensemanager_actions_expensemanager_transactions_navtotransactions_edit_action,
	expensemanager_actions_expensemanager_transactions_navtotransactions_list_action : expensemanager_actions_expensemanager_transactions_navtotransactions_list_action,
	expensemanager_actions_expensemanager_transactions_transactions_createentity_action : expensemanager_actions_expensemanager_transactions_transactions_createentity_action,
	expensemanager_actions_expensemanager_transactions_transactions_deleteentity_action : expensemanager_actions_expensemanager_transactions_transactions_deleteentity_action,
	expensemanager_actions_expensemanager_transactions_transactions_updateentity_action : expensemanager_actions_expensemanager_transactions_transactions_updateentity_action,
	expensemanager_actions_genericbannermessage_action : expensemanager_actions_genericbannermessage_action,
	expensemanager_actions_genericmessagebox_action : expensemanager_actions_genericmessagebox_action,
	expensemanager_actions_genericnavigation_action : expensemanager_actions_genericnavigation_action,
	expensemanager_actions_generictoastmessage_action : expensemanager_actions_generictoastmessage_action,
	expensemanager_actions_logging_loguploadfailure_action : expensemanager_actions_logging_loguploadfailure_action,
	expensemanager_actions_logging_loguploadsuccessful_action : expensemanager_actions_logging_loguploadsuccessful_action,
	expensemanager_actions_logging_uploadlog_action : expensemanager_actions_logging_uploadlog_action,
	expensemanager_actions_logging_uploadlogprogress_action : expensemanager_actions_logging_uploadlogprogress_action,
	expensemanager_actions_updateentityfailuremessage_action : expensemanager_actions_updateentityfailuremessage_action,
	expensemanager_actions_updateentitysuccessmessage_action : expensemanager_actions_updateentitysuccessmessage_action,
	expensemanager_actions_uploadstreamfailuremessage_action : expensemanager_actions_uploadstreamfailuremessage_action,
	expensemanager_actions_uploadstreamsuccessmessage_action : expensemanager_actions_uploadstreamsuccessmessage_action,
	expensemanager_globals_application_appdefinition_version_global : expensemanager_globals_application_appdefinition_version_global,
	expensemanager_globals_application_applicationname_global : expensemanager_globals_application_applicationname_global,
	expensemanager_globals_application_supportemail_global : expensemanager_globals_application_supportemail_global,
	expensemanager_globals_application_supportphone_global : expensemanager_globals_application_supportphone_global,
	expensemanager_i18n_i18n_properties : expensemanager_i18n_i18n_properties,
	expensemanager_jsconfig_json : expensemanager_jsconfig_json,
	expensemanager_pages_application_about_page : expensemanager_pages_application_about_page,
	expensemanager_pages_application_support_page : expensemanager_pages_application_support_page,
	expensemanager_pages_application_useractivitylog_page : expensemanager_pages_application_useractivitylog_page,
	expensemanager_pages_expensemanager_backups_backups_create_page : expensemanager_pages_expensemanager_backups_backups_create_page,
	expensemanager_pages_expensemanager_backups_backups_detail_page : expensemanager_pages_expensemanager_backups_backups_detail_page,
	expensemanager_pages_expensemanager_backups_backups_edit_page : expensemanager_pages_expensemanager_backups_backups_edit_page,
	expensemanager_pages_expensemanager_backups_backups_list_page : expensemanager_pages_expensemanager_backups_backups_list_page,
	expensemanager_pages_expensemanager_cards_cards_create_page : expensemanager_pages_expensemanager_cards_cards_create_page,
	expensemanager_pages_expensemanager_cards_cards_createinvoices_page : expensemanager_pages_expensemanager_cards_cards_createinvoices_page,
	expensemanager_pages_expensemanager_cards_cards_detail_page : expensemanager_pages_expensemanager_cards_cards_detail_page,
	expensemanager_pages_expensemanager_cards_cards_edit_page : expensemanager_pages_expensemanager_cards_cards_edit_page,
	expensemanager_pages_expensemanager_cards_cards_list_page : expensemanager_pages_expensemanager_cards_cards_list_page,
	expensemanager_pages_expensemanager_categories_categories_create_page : expensemanager_pages_expensemanager_categories_categories_create_page,
	expensemanager_pages_expensemanager_categories_categories_createtransactions_page : expensemanager_pages_expensemanager_categories_categories_createtransactions_page,
	expensemanager_pages_expensemanager_categories_categories_detail_page : expensemanager_pages_expensemanager_categories_categories_detail_page,
	expensemanager_pages_expensemanager_categories_categories_edit_page : expensemanager_pages_expensemanager_categories_categories_edit_page,
	expensemanager_pages_expensemanager_categories_categories_list_page : expensemanager_pages_expensemanager_categories_categories_list_page,
	expensemanager_pages_expensemanager_currencies_currencies_create_page : expensemanager_pages_expensemanager_currencies_currencies_create_page,
	expensemanager_pages_expensemanager_currencies_currencies_detail_page : expensemanager_pages_expensemanager_currencies_currencies_detail_page,
	expensemanager_pages_expensemanager_currencies_currencies_edit_page : expensemanager_pages_expensemanager_currencies_currencies_edit_page,
	expensemanager_pages_expensemanager_currencies_currencies_list_page : expensemanager_pages_expensemanager_currencies_currencies_list_page,
	expensemanager_pages_expensemanager_currencies_texts_currencies_texts_create_page : expensemanager_pages_expensemanager_currencies_texts_currencies_texts_create_page,
	expensemanager_pages_expensemanager_currencies_texts_currencies_texts_detail_page : expensemanager_pages_expensemanager_currencies_texts_currencies_texts_detail_page,
	expensemanager_pages_expensemanager_currencies_texts_currencies_texts_edit_page : expensemanager_pages_expensemanager_currencies_texts_currencies_texts_edit_page,
	expensemanager_pages_expensemanager_currencies_texts_currencies_texts_list_page : expensemanager_pages_expensemanager_currencies_texts_currencies_texts_list_page,
	expensemanager_pages_expensemanager_entities_entities_create_page : expensemanager_pages_expensemanager_entities_entities_create_page,
	expensemanager_pages_expensemanager_entities_entities_detail_page : expensemanager_pages_expensemanager_entities_entities_detail_page,
	expensemanager_pages_expensemanager_entities_entities_edit_page : expensemanager_pages_expensemanager_entities_entities_edit_page,
	expensemanager_pages_expensemanager_entities_entities_list_page : expensemanager_pages_expensemanager_entities_entities_list_page,
	expensemanager_pages_expensemanager_invoices_invoices_create_page : expensemanager_pages_expensemanager_invoices_invoices_create_page,
	expensemanager_pages_expensemanager_invoices_invoices_createtransactions_page : expensemanager_pages_expensemanager_invoices_invoices_createtransactions_page,
	expensemanager_pages_expensemanager_invoices_invoices_detail_page : expensemanager_pages_expensemanager_invoices_invoices_detail_page,
	expensemanager_pages_expensemanager_invoices_invoices_edit_page : expensemanager_pages_expensemanager_invoices_invoices_edit_page,
	expensemanager_pages_expensemanager_invoices_invoices_list_page : expensemanager_pages_expensemanager_invoices_invoices_list_page,
	expensemanager_pages_expensemanager_liabilities_liabilities_create_page : expensemanager_pages_expensemanager_liabilities_liabilities_create_page,
	expensemanager_pages_expensemanager_liabilities_liabilities_createliabilitytransactions_page : expensemanager_pages_expensemanager_liabilities_liabilities_createliabilitytransactions_page,
	expensemanager_pages_expensemanager_liabilities_liabilities_detail_page : expensemanager_pages_expensemanager_liabilities_liabilities_detail_page,
	expensemanager_pages_expensemanager_liabilities_liabilities_edit_page : expensemanager_pages_expensemanager_liabilities_liabilities_edit_page,
	expensemanager_pages_expensemanager_liabilities_liabilities_list_page : expensemanager_pages_expensemanager_liabilities_liabilities_list_page,
	expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_create_page : expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_create_page,
	expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_detail_page : expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_detail_page,
	expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_edit_page : expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_edit_page,
	expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_list_page : expensemanager_pages_expensemanager_liabilitytransactions_liabilitytransactions_list_page,
	expensemanager_pages_expensemanager_persons_persons_create_page : expensemanager_pages_expensemanager_persons_persons_create_page,
	expensemanager_pages_expensemanager_persons_persons_createcards_page : expensemanager_pages_expensemanager_persons_persons_createcards_page,
	expensemanager_pages_expensemanager_persons_persons_createcategories_page : expensemanager_pages_expensemanager_persons_persons_createcategories_page,
	expensemanager_pages_expensemanager_persons_persons_createshares_page : expensemanager_pages_expensemanager_persons_persons_createshares_page,
	expensemanager_pages_expensemanager_persons_persons_detail_page : expensemanager_pages_expensemanager_persons_persons_detail_page,
	expensemanager_pages_expensemanager_persons_persons_edit_page : expensemanager_pages_expensemanager_persons_persons_edit_page,
	expensemanager_pages_expensemanager_persons_persons_list_page : expensemanager_pages_expensemanager_persons_persons_list_page,
	expensemanager_pages_expensemanager_shares_shares_create_page : expensemanager_pages_expensemanager_shares_shares_create_page,
	expensemanager_pages_expensemanager_shares_shares_createentities_page : expensemanager_pages_expensemanager_shares_shares_createentities_page,
	expensemanager_pages_expensemanager_shares_shares_detail_page : expensemanager_pages_expensemanager_shares_shares_detail_page,
	expensemanager_pages_expensemanager_shares_shares_edit_page : expensemanager_pages_expensemanager_shares_shares_edit_page,
	expensemanager_pages_expensemanager_shares_shares_list_page : expensemanager_pages_expensemanager_shares_shares_list_page,
	expensemanager_pages_expensemanager_transactions_transactions_create_page : expensemanager_pages_expensemanager_transactions_transactions_create_page,
	expensemanager_pages_expensemanager_transactions_transactions_detail_page : expensemanager_pages_expensemanager_transactions_transactions_detail_page,
	expensemanager_pages_expensemanager_transactions_transactions_edit_page : expensemanager_pages_expensemanager_transactions_transactions_edit_page,
	expensemanager_pages_expensemanager_transactions_transactions_list_page : expensemanager_pages_expensemanager_transactions_transactions_list_page,
	expensemanager_pages_main_page : expensemanager_pages_main_page,
	expensemanager_rules_application_appupdatefailure_js : expensemanager_rules_application_appupdatefailure_js,
	expensemanager_rules_application_appupdatesuccess_js : expensemanager_rules_application_appupdatesuccess_js,
	expensemanager_rules_application_clientismultiusermode_js : expensemanager_rules_application_clientismultiusermode_js,
	expensemanager_rules_application_getclientsupportversions_js : expensemanager_rules_application_getclientsupportversions_js,
	expensemanager_rules_application_getclientversion_js : expensemanager_rules_application_getclientversion_js,
	expensemanager_rules_application_onwillupdate_js : expensemanager_rules_application_onwillupdate_js,
	expensemanager_rules_application_resetappsettingsandlogout_js : expensemanager_rules_application_resetappsettingsandlogout_js,
	expensemanager_rules_expensemanager_backups_backups_cancel_js : expensemanager_rules_expensemanager_backups_backups_cancel_js,
	expensemanager_rules_expensemanager_backups_backups_createentity_js : expensemanager_rules_expensemanager_backups_backups_createentity_js,
	expensemanager_rules_expensemanager_backups_backups_deleteconfirmation_js : expensemanager_rules_expensemanager_backups_backups_deleteconfirmation_js,
	expensemanager_rules_expensemanager_backups_backups_updateentity_js : expensemanager_rules_expensemanager_backups_backups_updateentity_js,
	expensemanager_rules_expensemanager_backups_navtobackups_edit_js : expensemanager_rules_expensemanager_backups_navtobackups_edit_js,
	expensemanager_rules_expensemanager_cards_cards_cancel_js : expensemanager_rules_expensemanager_cards_cards_cancel_js,
	expensemanager_rules_expensemanager_cards_cards_createentity_js : expensemanager_rules_expensemanager_cards_cards_createentity_js,
	expensemanager_rules_expensemanager_cards_cards_createinvoices_js : expensemanager_rules_expensemanager_cards_cards_createinvoices_js,
	expensemanager_rules_expensemanager_cards_cards_deleteconfirmation_js : expensemanager_rules_expensemanager_cards_cards_deleteconfirmation_js,
	expensemanager_rules_expensemanager_cards_cards_updateentity_js : expensemanager_rules_expensemanager_cards_cards_updateentity_js,
	expensemanager_rules_expensemanager_cards_navtocards_createinvoices_js : expensemanager_rules_expensemanager_cards_navtocards_createinvoices_js,
	expensemanager_rules_expensemanager_cards_navtocards_edit_js : expensemanager_rules_expensemanager_cards_navtocards_edit_js,
	expensemanager_rules_expensemanager_categories_categories_cancel_js : expensemanager_rules_expensemanager_categories_categories_cancel_js,
	expensemanager_rules_expensemanager_categories_categories_createentity_js : expensemanager_rules_expensemanager_categories_categories_createentity_js,
	expensemanager_rules_expensemanager_categories_categories_createtransactions_js : expensemanager_rules_expensemanager_categories_categories_createtransactions_js,
	expensemanager_rules_expensemanager_categories_categories_deleteconfirmation_js : expensemanager_rules_expensemanager_categories_categories_deleteconfirmation_js,
	expensemanager_rules_expensemanager_categories_categories_updateentity_js : expensemanager_rules_expensemanager_categories_categories_updateentity_js,
	expensemanager_rules_expensemanager_categories_navtocategories_createtransactions_js : expensemanager_rules_expensemanager_categories_navtocategories_createtransactions_js,
	expensemanager_rules_expensemanager_categories_navtocategories_edit_js : expensemanager_rules_expensemanager_categories_navtocategories_edit_js,
	expensemanager_rules_expensemanager_currencies_currencies_cancel_js : expensemanager_rules_expensemanager_currencies_currencies_cancel_js,
	expensemanager_rules_expensemanager_currencies_currencies_createentity_js : expensemanager_rules_expensemanager_currencies_currencies_createentity_js,
	expensemanager_rules_expensemanager_currencies_currencies_deleteconfirmation_js : expensemanager_rules_expensemanager_currencies_currencies_deleteconfirmation_js,
	expensemanager_rules_expensemanager_currencies_currencies_updateentity_js : expensemanager_rules_expensemanager_currencies_currencies_updateentity_js,
	expensemanager_rules_expensemanager_currencies_navtocurrencies_edit_js : expensemanager_rules_expensemanager_currencies_navtocurrencies_edit_js,
	expensemanager_rules_expensemanager_currencies_texts_currencies_texts_cancel_js : expensemanager_rules_expensemanager_currencies_texts_currencies_texts_cancel_js,
	expensemanager_rules_expensemanager_currencies_texts_currencies_texts_createentity_js : expensemanager_rules_expensemanager_currencies_texts_currencies_texts_createentity_js,
	expensemanager_rules_expensemanager_currencies_texts_currencies_texts_deleteconfirmation_js : expensemanager_rules_expensemanager_currencies_texts_currencies_texts_deleteconfirmation_js,
	expensemanager_rules_expensemanager_currencies_texts_currencies_texts_updateentity_js : expensemanager_rules_expensemanager_currencies_texts_currencies_texts_updateentity_js,
	expensemanager_rules_expensemanager_currencies_texts_navtocurrencies_texts_edit_js : expensemanager_rules_expensemanager_currencies_texts_navtocurrencies_texts_edit_js,
	expensemanager_rules_expensemanager_entities_entities_cancel_js : expensemanager_rules_expensemanager_entities_entities_cancel_js,
	expensemanager_rules_expensemanager_entities_entities_createentity_js : expensemanager_rules_expensemanager_entities_entities_createentity_js,
	expensemanager_rules_expensemanager_entities_entities_deleteconfirmation_js : expensemanager_rules_expensemanager_entities_entities_deleteconfirmation_js,
	expensemanager_rules_expensemanager_entities_entities_updateentity_js : expensemanager_rules_expensemanager_entities_entities_updateentity_js,
	expensemanager_rules_expensemanager_entities_navtoentities_edit_js : expensemanager_rules_expensemanager_entities_navtoentities_edit_js,
	expensemanager_rules_expensemanager_invoices_invoices_cancel_js : expensemanager_rules_expensemanager_invoices_invoices_cancel_js,
	expensemanager_rules_expensemanager_invoices_invoices_createentity_js : expensemanager_rules_expensemanager_invoices_invoices_createentity_js,
	expensemanager_rules_expensemanager_invoices_invoices_createtransactions_js : expensemanager_rules_expensemanager_invoices_invoices_createtransactions_js,
	expensemanager_rules_expensemanager_invoices_invoices_deleteconfirmation_js : expensemanager_rules_expensemanager_invoices_invoices_deleteconfirmation_js,
	expensemanager_rules_expensemanager_invoices_invoices_updateentity_js : expensemanager_rules_expensemanager_invoices_invoices_updateentity_js,
	expensemanager_rules_expensemanager_invoices_navtoinvoices_createtransactions_js : expensemanager_rules_expensemanager_invoices_navtoinvoices_createtransactions_js,
	expensemanager_rules_expensemanager_invoices_navtoinvoices_edit_js : expensemanager_rules_expensemanager_invoices_navtoinvoices_edit_js,
	expensemanager_rules_expensemanager_liabilities_liabilities_cancel_js : expensemanager_rules_expensemanager_liabilities_liabilities_cancel_js,
	expensemanager_rules_expensemanager_liabilities_liabilities_createentity_js : expensemanager_rules_expensemanager_liabilities_liabilities_createentity_js,
	expensemanager_rules_expensemanager_liabilities_liabilities_createliabilitytransactions_js : expensemanager_rules_expensemanager_liabilities_liabilities_createliabilitytransactions_js,
	expensemanager_rules_expensemanager_liabilities_liabilities_deleteconfirmation_js : expensemanager_rules_expensemanager_liabilities_liabilities_deleteconfirmation_js,
	expensemanager_rules_expensemanager_liabilities_liabilities_updateentity_js : expensemanager_rules_expensemanager_liabilities_liabilities_updateentity_js,
	expensemanager_rules_expensemanager_liabilities_navtoliabilities_createliabilitytransactions_js : expensemanager_rules_expensemanager_liabilities_navtoliabilities_createliabilitytransactions_js,
	expensemanager_rules_expensemanager_liabilities_navtoliabilities_edit_js : expensemanager_rules_expensemanager_liabilities_navtoliabilities_edit_js,
	expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_cancel_js : expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_cancel_js,
	expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_createentity_js : expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_createentity_js,
	expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_deleteconfirmation_js : expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_deleteconfirmation_js,
	expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_updateentity_js : expensemanager_rules_expensemanager_liabilitytransactions_liabilitytransactions_updateentity_js,
	expensemanager_rules_expensemanager_liabilitytransactions_navtoliabilitytransactions_edit_js : expensemanager_rules_expensemanager_liabilitytransactions_navtoliabilitytransactions_edit_js,
	expensemanager_rules_expensemanager_persons_navtopersons_createcards_js : expensemanager_rules_expensemanager_persons_navtopersons_createcards_js,
	expensemanager_rules_expensemanager_persons_navtopersons_createcategories_js : expensemanager_rules_expensemanager_persons_navtopersons_createcategories_js,
	expensemanager_rules_expensemanager_persons_navtopersons_createshares_js : expensemanager_rules_expensemanager_persons_navtopersons_createshares_js,
	expensemanager_rules_expensemanager_persons_navtopersons_edit_js : expensemanager_rules_expensemanager_persons_navtopersons_edit_js,
	expensemanager_rules_expensemanager_persons_persons_cancel_js : expensemanager_rules_expensemanager_persons_persons_cancel_js,
	expensemanager_rules_expensemanager_persons_persons_createcards_js : expensemanager_rules_expensemanager_persons_persons_createcards_js,
	expensemanager_rules_expensemanager_persons_persons_createcategories_js : expensemanager_rules_expensemanager_persons_persons_createcategories_js,
	expensemanager_rules_expensemanager_persons_persons_createentity_js : expensemanager_rules_expensemanager_persons_persons_createentity_js,
	expensemanager_rules_expensemanager_persons_persons_createshares_js : expensemanager_rules_expensemanager_persons_persons_createshares_js,
	expensemanager_rules_expensemanager_persons_persons_deleteconfirmation_js : expensemanager_rules_expensemanager_persons_persons_deleteconfirmation_js,
	expensemanager_rules_expensemanager_persons_persons_updateentity_js : expensemanager_rules_expensemanager_persons_persons_updateentity_js,
	expensemanager_rules_expensemanager_shares_navtoshares_createentities_js : expensemanager_rules_expensemanager_shares_navtoshares_createentities_js,
	expensemanager_rules_expensemanager_shares_navtoshares_edit_js : expensemanager_rules_expensemanager_shares_navtoshares_edit_js,
	expensemanager_rules_expensemanager_shares_shares_cancel_js : expensemanager_rules_expensemanager_shares_shares_cancel_js,
	expensemanager_rules_expensemanager_shares_shares_createentities_js : expensemanager_rules_expensemanager_shares_shares_createentities_js,
	expensemanager_rules_expensemanager_shares_shares_createentity_js : expensemanager_rules_expensemanager_shares_shares_createentity_js,
	expensemanager_rules_expensemanager_shares_shares_deleteconfirmation_js : expensemanager_rules_expensemanager_shares_shares_deleteconfirmation_js,
	expensemanager_rules_expensemanager_shares_shares_updateentity_js : expensemanager_rules_expensemanager_shares_shares_updateentity_js,
	expensemanager_rules_expensemanager_transactions_navtotransactions_edit_js : expensemanager_rules_expensemanager_transactions_navtotransactions_edit_js,
	expensemanager_rules_expensemanager_transactions_transactions_cancel_js : expensemanager_rules_expensemanager_transactions_transactions_cancel_js,
	expensemanager_rules_expensemanager_transactions_transactions_createentity_js : expensemanager_rules_expensemanager_transactions_transactions_createentity_js,
	expensemanager_rules_expensemanager_transactions_transactions_deleteconfirmation_js : expensemanager_rules_expensemanager_transactions_transactions_deleteconfirmation_js,
	expensemanager_rules_expensemanager_transactions_transactions_updateentity_js : expensemanager_rules_expensemanager_transactions_transactions_updateentity_js,
	expensemanager_rules_logging_loglevels_js : expensemanager_rules_logging_loglevels_js,
	expensemanager_rules_logging_settracecategories_js : expensemanager_rules_logging_settracecategories_js,
	expensemanager_rules_logging_setuserloglevel_js : expensemanager_rules_logging_setuserloglevel_js,
	expensemanager_rules_logging_togglelogging_js : expensemanager_rules_logging_togglelogging_js,
	expensemanager_rules_logging_tracecategories_js : expensemanager_rules_logging_tracecategories_js,
	expensemanager_rules_logging_userlogsetting_js : expensemanager_rules_logging_userlogsetting_js,
	expensemanager_rules_service_initialize_js : expensemanager_rules_service_initialize_js,
	expensemanager_services_expensemanager_service : expensemanager_services_expensemanager_service,
	expensemanager_styles_styles_css : expensemanager_styles_styles_css,
	expensemanager_styles_styles_json : expensemanager_styles_styles_json,
	expensemanager_styles_styles_less : expensemanager_styles_styles_less,
	expensemanager_styles_styles_nss : expensemanager_styles_styles_nss,
	tsconfig_json : tsconfig_json,
	version_mdkbundlerversion : version_mdkbundlerversion
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Application/AppUpdateFailure.js":
/*!********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Application/AppUpdateFailure.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AppUpdateFailure)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function AppUpdateFailure(clientAPI) {
  let result = clientAPI.actionResults.AppUpdate.error.toString();
  var message;
  console.log(result);
  if (result.startsWith('Error: Uncaught app extraction failure:')) {
    result = 'Error: Uncaught app extraction failure:';
  }
  if (result.startsWith('Error: LCMS GET Version Response Error Response Status: 404 | Body: 404 Not Found: Requested route')) {
    result = 'Application instance is not up or running';
  }
  if (result.startsWith('Error: LCMS GET Version Response Error Response Status: 404 | Body')) {
    result = 'Service instance not found.';
  }
  switch (result) {
    case 'Service instance not found.':
      message = 'Mobile App Update feature is not assigned or not running for your application. Please add the Mobile App Update feature, deploy your application, and try again.';
      break;
    case 'Error: LCMS GET Version Response Error Response Status: 404 | Body: Failed to find a matched endpoint':
      message = 'Mobile App Update feature is not assigned to your application. Please add the Mobile App Update feature, deploy your application, and try again.';
      break;
    case 'Error: LCMS GET Version Response failed: Error: Optional(OAuth2Error.tokenRejected: The newly acquired or refreshed token got rejected.)':
      message = 'The Mobile App Update feature is not assigned to your application or there is no Application metadata deployed. Please check your application in Mobile Services and try again.';
      break;
    case 'Error: Uncaught app extraction failure:':
      message = 'Error extracting metadata. Please redeploy and try again.';
      break;
    case 'Application instance is not up or running':
      message = 'Communication failure. Verify that the BindMobileApplicationRoutesToME Application route is running in your BTP space cockpit.';
      break;
    default:
      message = result;
      break;
  }
  return clientAPI.getPageProxy().executeAction({
    "Name": "/ExpenseManager/Actions/Application/AppUpdateFailureMessage.action",
    "Properties": {
      "Duration": 0,
      "Message": message
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Application/AppUpdateSuccess.js":
/*!********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Application/AppUpdateSuccess.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AppUpdateSuccess)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function sleep(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, ms);
  });
}
function AppUpdateSuccess(clientAPI) {
  var message;
  // Force a small pause to let the progress banner show in case there is no new version available
  return sleep(500).then(function () {
    let result = clientAPI.actionResults.AppUpdate.data;
    console.log(result);
    let versionNum = result.split(': ')[1];
    if (result.startsWith('Current version is already up to date')) {
      return clientAPI.getPageProxy().executeAction({
        "Name": "/ExpenseManager/Actions/Application/AppUpdateSuccessMessage.action",
        "Properties": {
          "Message": `You are already using the latest version: ${versionNum}`,
          "NumberOfLines": 2
        }
      });
    } else if (result === 'AppUpdate feature is not enabled or no new revision found.') {
      message = 'No Application metadata found. Please deploy your application and try again.';
      return clientAPI.getPageProxy().executeAction({
        "Name": "/ExpenseManager/Actions/Application/AppUpdateSuccessMessage.action",
        "Properties": {
          "Duration": 5,
          "Message": message,
          "NumberOfLines": 2
        }
      });
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Application/ClientIsMultiUserMode.js":
/*!*************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Application/ClientIsMultiUserMode.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ClientIsMultiUserMode)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function ClientIsMultiUserMode(clientAPI) {
  return clientAPI.isAppInMultiUserMode();
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Application/GetClientSupportVersions.js":
/*!****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Application/GetClientSupportVersions.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GetClientSupportVersions)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function GetClientSupportVersions(clientAPI) {
  let versionInfo = clientAPI.getVersionInfo();
  let versionStr = '';
  Object.keys(versionInfo).forEach(function (key, index) {
    // key: the name of the object key
    // index: the ordinal position of the key within the object
    //console.log(`Key: ${key}   Index: ${index}`);
    if (key != 'Application Version') {
      versionStr += `${key}: ${versionInfo[key]}\n`;
    }
  });
  return versionStr;
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Application/GetClientVersion.js":
/*!********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Application/GetClientVersion.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GetClientVersion)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function GetClientVersion(clientAPI) {
  let versionInfo = clientAPI.getVersionInfo();
  if (versionInfo.hasOwnProperty('Application Version')) {
    return versionInfo['Application Version'];
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Application/OnWillUpdate.js":
/*!****************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Application/OnWillUpdate.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OnWillUpdate)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function OnWillUpdate(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/Application/OnWillUpdate.action').then(result => {
    if (result.data) {
      return Promise.resolve();
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Application/ResetAppSettingsAndLogout.js":
/*!*****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Application/ResetAppSettingsAndLogout.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResetAppSettingsAndLogout)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function ResetAppSettingsAndLogout(clientAPI) {
  let logger = clientAPI.getLogger();
  let platform = clientAPI.nativescript.platformModule;
  let appSettings = clientAPI.nativescript.appSettingsModule;
  var appId;
  if (platform && (platform.isIOS || platform.isAndroid)) {
    appId = clientAPI.evaluateTargetPath('#Application/#AppData/MobileServiceAppId');
  } else {
    appId = 'WindowsClient';
  }
  try {
    // Remove any other app specific settings
    appSettings.getAllKeys().forEach(key => {
      if (key.substring(0, appId.length) === appId) {
        appSettings.remove(key);
      }
    });
  } catch (err) {
    logger.log(`ERROR: AppSettings cleanup failure - ${err}`, 'ERROR');
  } finally {
    // Logout 
    return clientAPI.getPageProxy().executeAction('/ExpenseManager/Actions/Application/Reset.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_Cancel.js":
/*!*****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_Cancel.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Backups')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Backups'
        },
        'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_CreateEntity.js":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_CreateEntity.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  return clientAPI.executeAction({
    'Name': '/ExpenseManager/Actions/ExpenseManager/Backups/Backups_CreateEntity.action',
    'Properties': {
      'OnSuccess': ''
    }
  }).then(result => {
    let newEntity = JSON.parse(result.data);
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Backups')) {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          },
          'OnSuccess': ''
        }
      }).then(() => {
        return clientAPI.executeAction({
          'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
          'Properties': {
            'Target': {
              'EntitySet': 'Backups',
              'ReadLink': newEntity['@odata.readLink']
            }
          }
        });
      });
    } else {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_DeleteConfirmation.js":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_DeleteConfirmation.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Backups/Backups_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_UpdateEntity.js":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/Backups_UpdateEntity.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Backups')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Backups'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/NavToBackups_Edit.js":
/*!********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Backups/NavToBackups_Edit.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Backups')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Backups'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_Cancel.js":
/*!*************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_Cancel.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Cards')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Cards'
        },
        'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_CreateEntity.js":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_CreateEntity.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  return clientAPI.executeAction({
    'Name': '/ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateEntity.action',
    'Properties': {
      'OnSuccess': ''
    }
  }).then(result => {
    let newEntity = JSON.parse(result.data);
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Cards')) {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          },
          'OnSuccess': ''
        }
      }).then(() => {
        return clientAPI.executeAction({
          'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
          'Properties': {
            'Target': {
              'EntitySet': 'Cards',
              'ReadLink': newEntity['@odata.readLink']
            }
          }
        });
      });
    } else {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_CreateInvoices.js":
/*!*********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_CreateInvoices.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateRelatedEntity)
/* harmony export */ });
function CreateRelatedEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Cards')) {
    let readLink = clientAPI.binding['@odata.readLink'];
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateInvoices.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Cards',
            'ReadLink': readLink
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateInvoices.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_DeleteConfirmation.js":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_DeleteConfirmation.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Cards/Cards_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_UpdateEntity.js":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/Cards_UpdateEntity.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Cards')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Cards'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/NavToCards_CreateInvoices.js":
/*!**************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/NavToCards_CreateInvoices.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToCreate)
/* harmony export */ });
function NavToCreate(clientAPI) {
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

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/NavToCards_Edit.js":
/*!****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Cards/NavToCards_Edit.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Cards')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Cards'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_Cancel.js":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_Cancel.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
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

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_CreateEntity.js":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_CreateEntity.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  return clientAPI.executeAction({
    'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateEntity.action',
    'Properties': {
      'OnSuccess': ''
    }
  }).then(result => {
    let newEntity = JSON.parse(result.data);
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Categories')) {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          },
          'OnSuccess': ''
        }
      }).then(() => {
        return clientAPI.executeAction({
          'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
          'Properties': {
            'Target': {
              'EntitySet': 'Categories',
              'ReadLink': newEntity['@odata.readLink']
            }
          }
        });
      });
    } else {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_CreateTransactions.js":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_CreateTransactions.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateRelatedEntity)
/* harmony export */ });
function CreateRelatedEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Categories')) {
    let readLink = clientAPI.binding['@odata.readLink'];
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateTransactions.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Categories',
            'ReadLink': readLink
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateTransactions.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_DeleteConfirmation.js":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_DeleteConfirmation.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Categories/Categories_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_UpdateEntity.js":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/Categories_UpdateEntity.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Categories')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
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

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/NavToCategories_CreateTransactions.js":
/*!****************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/NavToCategories_CreateTransactions.js ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToCreate)
/* harmony export */ });
function NavToCreate(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Categories')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Categories'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_CreateTransactions.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_CreateTransactions.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/NavToCategories_Edit.js":
/*!**************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Categories/NavToCategories_Edit.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Categories')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Categories'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_Cancel.js":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_Cancel.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
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

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_CreateEntity.js":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_CreateEntity.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Currencies')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_CreateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      let newEntity = JSON.parse(result.data);
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Currencies',
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_CreateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_DeleteConfirmation.js":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_DeleteConfirmation.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_UpdateEntity.js":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_UpdateEntity.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Currencies')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Currencies'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/NavToCurrencies_Edit.js":
/*!**************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies/NavToCurrencies_Edit.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Currencies')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Currencies'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_Cancel.js":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_Cancel.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Currencies_texts')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Currencies_texts'
        },
        'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.js":
/*!*****************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.js ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Currencies_texts')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      let newEntity = JSON.parse(result.data);
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Currencies_texts',
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_DeleteConfirmation.js":
/*!***********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_DeleteConfirmation.js ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.js":
/*!*****************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.js ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Currencies_texts')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Currencies_texts'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.js":
/*!**************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
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

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_Cancel.js":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_Cancel.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Entities')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Entities'
        },
        'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_CreateEntity.js":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_CreateEntity.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Entities')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Entities/Entities_CreateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      let newEntity = JSON.parse(result.data);
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Entities',
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Entities/Entities_CreateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_DeleteConfirmation.js":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_DeleteConfirmation.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Entities/Entities_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_UpdateEntity.js":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/Entities_UpdateEntity.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Entities')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Entities/Entities_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Entities'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Entities/Entities_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/NavToEntities_Edit.js":
/*!**********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Entities/NavToEntities_Edit.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Entities')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Entities'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_Cancel.js":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_Cancel.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Invoices')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Invoices'
        },
        'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_CreateEntity.js":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_CreateEntity.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Invoices')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      let newEntity = JSON.parse(result.data);
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Invoices',
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_CreateTransactions.js":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_CreateTransactions.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateRelatedEntity)
/* harmony export */ });
function CreateRelatedEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Invoices')) {
    let readLink = clientAPI.binding['@odata.readLink'];
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateTransactions.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Invoices',
            'ReadLink': readLink
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateTransactions.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_DeleteConfirmation.js":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_DeleteConfirmation.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_UpdateEntity.js":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_UpdateEntity.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Invoices')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Invoices'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.js":
/*!************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.js ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToCreate)
/* harmony export */ });
function NavToCreate(clientAPI) {
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

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/NavToInvoices_Edit.js":
/*!**********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Invoices/NavToInvoices_Edit.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Invoices')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Invoices'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_Cancel.js":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_Cancel.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Liabilities')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Liabilities'
        },
        'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_CreateEntity.js":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_CreateEntity.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Liabilities')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      let newEntity = JSON.parse(result.data);
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Liabilities',
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.js":
/*!**********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.js ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateRelatedEntity)
/* harmony export */ });
function CreateRelatedEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Liabilities')) {
    let readLink = clientAPI.binding['@odata.readLink'];
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Liabilities',
            'ReadLink': readLink
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_DeleteConfirmation.js":
/*!*************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_DeleteConfirmation.js ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_UpdateEntity.js":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_UpdateEntity.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Liabilities')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Liabilities'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.js":
/*!***************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.js ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToCreate)
/* harmony export */ });
function NavToCreate(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Liabilities')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Liabilities'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/NavToLiabilities_Edit.js":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Liabilities/NavToLiabilities_Edit.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Liabilities')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Liabilities'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_Cancel.js":
/*!*********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_Cancel.js ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('LiabilityTransactions')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'LiabilityTransactions'
        },
        'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.js":
/*!***************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.js ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('LiabilityTransactions')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      let newEntity = JSON.parse(result.data);
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'LiabilityTransactions',
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_DeleteConfirmation.js":
/*!*********************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_DeleteConfirmation.js ***!
  \*********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.js":
/*!***************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.js ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('LiabilityTransactions')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'LiabilityTransactions'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.js":
/*!************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.js ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('LiabilityTransactions')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'LiabilityTransactions'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateCards.js":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateCards.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToCreate)
/* harmony export */ });
function NavToCreate(clientAPI) {
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

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateCategories.js":
/*!********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateCategories.js ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToCreate)
/* harmony export */ });
function NavToCreate(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Persons'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCategories.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCategories.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateShares.js":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateShares.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToCreate)
/* harmony export */ });
function NavToCreate(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Persons'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateShares.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateShares.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_Edit.js":
/*!********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_Edit.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Persons'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_Cancel.js":
/*!*****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_Cancel.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Persons'
        },
        'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateCards.js":
/*!**********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateCards.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateRelatedEntity)
/* harmony export */ });
function CreateRelatedEntity(clientAPI) {
  let readLink = clientAPI.binding['@odata.readLink'];
  return clientAPI.executeAction({
    'Name': '/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCards.action',
    'Properties': {
      'OnSuccess': ''
    }
  }).then(result => {
    let newEntity = JSON.parse(result.data);
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          },
          'OnSuccess': ''
        }
      }).then(result => {
        return clientAPI.executeAction({
          'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
          'Properties': {
            'Target': {
              'EntitySet': 'Persons',
              'ReadLink': readLink
            }
          }
        });
      });
    } else {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateCategories.js":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateCategories.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateRelatedEntity)
/* harmony export */ });
function CreateRelatedEntity(clientAPI) {
  let readLink = clientAPI.binding['@odata.readLink'];
  return clientAPI.executeAction({
    'Name': '/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCategories.action',
    'Properties': {
      'OnSuccess': ''
    }
  }).then(result => {
    let newEntity = JSON.parse(result.data);
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          },
          'OnSuccess': ''
        }
      }).then(result => {
        return clientAPI.executeAction({
          'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
          'Properties': {
            'Target': {
              'EntitySet': 'Persons',
              'ReadLink': readLink
            }
          }
        });
      });
    } else {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateEntity.js":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateEntity.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  return clientAPI.executeAction({
    'Name': '/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateEntity.action',
    'Properties': {
      'OnSuccess': ''
    }
  }).then(result => {
    let newEntity = JSON.parse(result.data);
    if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Persons/Persons_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          },
          'OnSuccess': ''
        }
      }).then(() => {
        return clientAPI.executeAction({
          'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
          'Properties': {
            'Target': {
              'EntitySet': 'Persons',
              'ReadLink': newEntity['@odata.readLink']
            }
          }
        });
      });
    } else {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/ExpenseManager/Persons/Persons_UploadStream.action',
        'Properties': {
          'Target': {
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateShares.js":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateShares.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateRelatedEntity)
/* harmony export */ });
function CreateRelatedEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
    let readLink = clientAPI.binding['@odata.readLink'];
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateShares.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Persons',
            'ReadLink': readLink
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateShares.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_DeleteConfirmation.js":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_DeleteConfirmation.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Persons/Persons_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_UpdateEntity.js":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Persons/Persons_UpdateEntity.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Persons')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Persons/Persons_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Persons'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Persons/Persons_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/NavToShares_CreateEntities.js":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/NavToShares_CreateEntities.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToCreate)
/* harmony export */ });
function NavToCreate(clientAPI) {
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

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/NavToShares_Edit.js":
/*!******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/NavToShares_Edit.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Shares')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Shares'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_Cancel.js":
/*!***************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_Cancel.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Shares')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Shares'
        },
        'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_CreateEntities.js":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_CreateEntities.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateRelatedEntity)
/* harmony export */ });
function CreateRelatedEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Shares')) {
    let readLink = clientAPI.binding['@odata.readLink'];
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntities.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Shares',
            'ReadLink': readLink
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntities.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_CreateEntity.js":
/*!*********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_CreateEntity.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Shares')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      let newEntity = JSON.parse(result.data);
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Shares',
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_DeleteConfirmation.js":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_DeleteConfirmation.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Shares/Shares_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_UpdateEntity.js":
/*!*********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Shares/Shares_UpdateEntity.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Shares')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Shares/Shares_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Shares'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Shares/Shares_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/NavToTransactions_Edit.js":
/*!******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/NavToTransactions_Edit.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavToEdit)
/* harmony export */ });
function NavToEdit(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Transactions')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftEditEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Transactions'
        },
        'OnSuccess': '/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Edit.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Edit.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_Cancel.js":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_Cancel.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cancel)
/* harmony export */ });
function Cancel(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Transactions')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/DraftDiscardEntity.action',
      'Properties': {
        'Target': {
          'EntitySet': 'Transactions'
        },
        'OnSuccess': '/ExpenseManager/Actions/CloseModalPage_Cancel.action'
      }
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/CloseModalPage_Cancel.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_CreateEntity.js":
/*!*********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_CreateEntity.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateEntity)
/* harmony export */ });
function CreateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Transactions')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_CreateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      let newEntity = JSON.parse(result.data);
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Transactions',
            'ReadLink': newEntity['@odata.readLink']
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_CreateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_DeleteConfirmation.js":
/*!***************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_DeleteConfirmation.js ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeleteConfirmation)
/* harmony export */ });
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
function DeleteConfirmation(clientAPI) {
  return clientAPI.executeAction('/ExpenseManager/Actions/DeleteConfirmation.action').then(result => {
    if (result.data) {
      return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_DeleteEntity.action').then(success => Promise.resolve(success), failure => Promise.reject('Delete entity failed ' + failure));
    } else {
      return Promise.reject('User Deferred');
    }
  });
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_UpdateEntity.js":
/*!*********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_UpdateEntity.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateEntity)
/* harmony export */ });
function UpdateEntity(clientAPI) {
  if (clientAPI.getODataProvider('/ExpenseManager/Services/ExpenseManager.service').isDraftEnabled('Transactions')) {
    return clientAPI.executeAction({
      'Name': '/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_UpdateEntity.action',
      'Properties': {
        'OnSuccess': ''
      }
    }).then(result => {
      return clientAPI.executeAction({
        'Name': '/ExpenseManager/Actions/DraftSaveEntity.action',
        'Properties': {
          'Target': {
            'EntitySet': 'Transactions'
          }
        }
      });
    });
  } else {
    return clientAPI.executeAction('/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_UpdateEntity.action');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Logging/LogLevels.js":
/*!*********************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Logging/LogLevels.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LogLevels)
/* harmony export */ });
function LogLevels(clientAPI) {
  var levels = [];
  levels.push({
    'DisplayValue': 'Error',
    'ReturnValue': 'Error'
  });
  levels.push({
    'DisplayValue': 'Warning',
    'ReturnValue': 'Warn'
  });
  levels.push({
    'DisplayValue': 'Info',
    'ReturnValue': 'Info'
  });
  levels.push({
    'DisplayValue': 'Debug',
    'ReturnValue': 'Debug'
  });
  levels.push({
    'DisplayValue': 'Trace',
    'ReturnValue': 'Trace'
  });
  return levels;
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Logging/SetTraceCategories.js":
/*!******************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Logging/SetTraceCategories.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SetTraceCategories)
/* harmony export */ });
function SetTraceCategories(clientAPI) {
  var logger = clientAPI.getLogger();
  const sectionedTable = clientAPI.getPageProxy().getControl('SectionedTable');
  const fcsection = sectionedTable.getSection('FormCellSection0');
  const traceCategory = fcsection.getControl('TracingCategoriesListPicker');
  const odataTrace = fcsection.getControl('odataTrace');
  try {
    if (traceCategory.getValue()) {
      var values = traceCategory.getValue();
      var categories = [];
      if (values && values.length) {
        categories = values.map(value => {
          return 'mdk.trace.' + value.ReturnValue;
        });
      }
      clientAPI.setDebugSettings(odataTrace.getValue(), true, categories);
    }
  } catch (exception) {
    logger.log(String(exception), 'Error');
    return undefined;
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Logging/SetUserLogLevel.js":
/*!***************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Logging/SetUserLogLevel.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SetUserLogLevel)
/* harmony export */ });
function SetUserLogLevel(clientAPI) {
  try {
    if (clientAPI.getValue() && clientAPI.getValue()[0]) {
      var logger = clientAPI.getLogger();
      var listPickerValue = clientAPI.getValue()[0].ReturnValue;
      if (listPickerValue) {
        switch (listPickerValue) {
          case 'Debug':
            logger.setLevel('Debug');
            ShowTraceOptions(clientAPI, false);
            break;
          case 'Error':
            logger.setLevel('Error');
            ShowTraceOptions(clientAPI, false);
            break;
          case 'Warn':
            logger.setLevel('Warn');
            ShowTraceOptions(clientAPI, false);
            break;
          case 'Info':
            logger.setLevel('Info');
            ShowTraceOptions(clientAPI, false);
            break;
          case 'Trace':
            logger.setLevel('Trace');
            ShowTraceOptions(clientAPI, true);
            break;
          default:
            // eslint-disable-next-line no-console
            console.log(`unrecognized key ${listPickerValue}`);
        }
        return listPickerValue;
      }
    }
  } catch (exception) {
    logger.log(String(exception), 'Error');
    return undefined;
  }
}
function ShowTraceOptions(clientAPI, tracingEnabled) {
  let categories = clientAPI.getPageProxy().getControl('SectionedTable').getControl('TracingCategoriesListPicker');
  let odataTrace = clientAPI.getPageProxy().getControl('SectionedTable').getControl('odataTrace');
  categories.setVisible(tracingEnabled);
  odataTrace.setVisible(tracingEnabled);
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Logging/ToggleLogging.js":
/*!*************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Logging/ToggleLogging.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ToggleLogging)
/* harmony export */ });
function ToggleLogging(clientAPI) {
  try {
    var logger = clientAPI.getLogger();
    const sectionedTable = clientAPI.getPageProxy().getControl('SectionedTable');
    const fcsection = sectionedTable.getSection('FormCellSection0');
    const enableLogSwitch = fcsection.getControl('EnableLogSwitch');
    const logLevelListPicker = fcsection.getControl('LogLevelListPicker');
    let switchValue = enableLogSwitch.getValue();
    if (switchValue) {
      logger.on();
      logLevelListPicker.setVisible(true);
      logLevelListPicker.setEditable(true);
      logLevelListPicker.redraw();
    } else {
      logger.off();
      logLevelListPicker.setEditable(false);
      logLevelListPicker.setVisible(false);
      logLevelListPicker.redraw();
    }
    return switchValue;
  } catch (exception) {
    logger.log(String(exception), 'Error');
    return undefined;
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Logging/TraceCategories.js":
/*!***************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Logging/TraceCategories.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TraceCategories)
/* harmony export */ });
function TraceCategories(clientAPI) {
  var categories = ['action', 'api', 'app', 'binding', 'branding', 'core', 'i18n', 'lcms', 'logging', 'odata', 'onboarding', 'profiling', 'push', 'restservice', 'settings', 'targetpath', 'ui'];
  var values = [];
  categories.forEach(category => {
    values.push({
      'DisplayValue': category,
      'ReturnValue': category
    });
  });
  return values;
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Logging/UserLogSetting.js":
/*!**************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Logging/UserLogSetting.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UserLogSetting)
/* harmony export */ });
function UserLogSetting(clientAPI) {
  try {
    var logger = clientAPI.getLogger();
    const sectionedTable = clientAPI.getControl('SectionedTable');
    const fcsection = sectionedTable.getSection('FormCellSection0');
    const enableLogSwitch = fcsection.getControl('EnableLogSwitch');
    const logLevelListPicker = fcsection.getControl('LogLevelListPicker');
    const traceCategory = fcsection.getControl('TracingCategoriesListPicker');
    const odataTrace = fcsection.getControl('odataTrace');

    //Persist the user logging preferences
    if (logger) {
      console.log("in logger state");
      if (logger.isTurnedOn()) {
        if (enableLogSwitch) {
          enableLogSwitch.setValue(true);
        }
        if (logLevelListPicker) {
          logLevelListPicker.setEditable(true);
        }
      } else {
        if (enableLogSwitch) {
          enableLogSwitch.setValue(false);
        }
        if (logLevelListPicker) {
          logLevelListPicker.setEditable(false);
        }
      }
      var logLevel = logger.getLevel();
      if (logLevel) {
        if (logLevelListPicker) {
          logLevelListPicker.setValue([logLevel]);
        }
      }
      if (logLevel === 'Trace') {
        traceCategory.setVisible(true);
        odataTrace.setVisible(true);
      }

      //Upon selecting a value in the List picker and clicking the back button 
      //will enable the onload page rule. This will set the selected value
      //in the control
      if (logLevelListPicker.getValue()[0]) {
        var returnValue = logLevelListPicker.getValue()[0].ReturnValue;
        if (returnValue) {
          logLevelListPicker.setValue([returnValue]);
          logger.setLevel(returnValue);
        }
      }
    }
  } catch (exception) {
    // eslint-disable-next-line no-console
    console.log(String(exception), 'Error User Logger could not be set');
  }
}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Rules/Service/Initialize.js":
/*!**********************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Rules/Service/Initialize.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Initialize)
/* harmony export */ });
function Initialize(context) {
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

/***/ }),

/***/ "./build.definitions/ExpenseManager/Styles/Styles.css":
/*!************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Styles/Styles.css ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../../../../css-loader/dist/runtime/sourceMaps.js */ "../../../../css-loader/dist/runtime/sourceMaps.js");
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../../../css-loader/dist/runtime/api.js */ "../../../../css-loader/dist/runtime/api.js");
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* The LESS stylesheet provides the ability to define styling styles that can be used to style the UI in the MDK app.

Examples:

@mdkYellow1: #ffbb33;
@mdkRed1: #ff0000;

//// By-Type style: All Pages in the application will now have a yellow background
div.MDKPage

{ background-color: @mdkYellow1; }
//// By-Name style: All Buttons with _Name == "BlueButton" will now have this style
#BlueButton

{ color: @mdkYellow1; background-color: #0000FF; }
//// By-Class style: These style classes can be referenced from rules and set using ClientAPI setStyle function

.MyButton

{ color: @mdkYellow1; background-color: @mdkRed1; }
*/
`, "",{"version":3,"sources":["webpack://./build.definitions/ExpenseManager/Styles/Styles.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;;;;;;;CAoBC","sourcesContent":["/* The LESS stylesheet provides the ability to define styling styles that can be used to style the UI in the MDK app.\n\nExamples:\n\n@mdkYellow1: #ffbb33;\n@mdkRed1: #ff0000;\n\n//// By-Type style: All Pages in the application will now have a yellow background\ndiv.MDKPage\n\n{ background-color: @mdkYellow1; }\n//// By-Name style: All Buttons with _Name == \"BlueButton\" will now have this style\n#BlueButton\n\n{ color: @mdkYellow1; background-color: #0000FF; }\n//// By-Class style: These style classes can be referenced from rules and set using ClientAPI setStyle function\n\n.MyButton\n\n{ color: @mdkYellow1; background-color: @mdkRed1; }\n*/\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ "./build.definitions/ExpenseManager/Styles/Styles.less":
/*!*************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Styles/Styles.less ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../../../../css-loader/dist/runtime/sourceMaps.js */ "../../../../css-loader/dist/runtime/sourceMaps.js");
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../../../css-loader/dist/runtime/api.js */ "../../../../css-loader/dist/runtime/api.js");
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* The LESS stylesheet provides the ability to define styling styles that can be used to style the UI in the MDK app.

Examples:

@mdkYellow1: #ffbb33;
@mdkRed1: #ff0000;

//// By-Type style: All Pages in the application will now have a yellow background
Page

{ background-color: @mdkYellow1; }
//// By-Name style: All Buttons with _Name == "BlueButton" will now have this style
#BlueButton

{ color: @mdkYellow1; background-color: #0000FF; }
//// By-Class style: These style classes can be referenced from rules and set using ClientAPI setStyle function

.MyButton

{ color: @mdkYellow1; background-color: @mdkRed1; }
*/`, "",{"version":3,"sources":["webpack://./build.definitions/ExpenseManager/Styles/Styles.less"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;;;;;;;CAoBC","sourcesContent":["/* The LESS stylesheet provides the ability to define styling styles that can be used to style the UI in the MDK app.\n\nExamples:\n\n@mdkYellow1: #ffbb33;\n@mdkRed1: #ff0000;\n\n//// By-Type style: All Pages in the application will now have a yellow background\nPage\n\n{ background-color: @mdkYellow1; }\n//// By-Name style: All Buttons with _Name == \"BlueButton\" will now have this style\n#BlueButton\n\n{ color: @mdkYellow1; background-color: #0000FF; }\n//// By-Class style: These style classes can be referenced from rules and set using ClientAPI setStyle function\n\n.MyButton\n\n{ color: @mdkYellow1; background-color: @mdkRed1; }\n*/"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ "./build.definitions/ExpenseManager/Styles/Styles.nss":
/*!************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Styles/Styles.nss ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../../../../css-loader/dist/runtime/sourceMaps.js */ "../../../../css-loader/dist/runtime/sourceMaps.js");
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../../../css-loader/dist/runtime/api.js */ "../../../../css-loader/dist/runtime/api.js");
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ "../../../../css-loader/dist/runtime/api.js":
/*!**************************************************!*\
  !*** ../../../../css-loader/dist/runtime/api.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "../../../../css-loader/dist/runtime/sourceMaps.js":
/*!*********************************************************!*\
  !*** ../../../../css-loader/dist/runtime/sourceMaps.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/Application/About.page":
/*!***********************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/Application/About.page ***!
  \***********************************************************************/
/***/ ((module) => {

module.exports = {"Controls":[{"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable0","Sections":[{"KeyAndValues":[{"_Name":"KeyValue0","KeyName":"User ID","Value":"#Application/#AppData/UserId","Visible":true,"_Type":"KeyValue.Type.Item"},{"Value":"#Application/#AppData/DeviceId","_Name":"KeyValue1","KeyName":"Device ID","Visible":true,"_Type":"KeyValue.Type.Item"},{"Value":"/ExpenseManager/Globals/Application/ApplicationName.global","_Name":"KeyValue2","KeyName":"Application","Visible":true,"_Type":"KeyValue.Type.Item"},{"Value":"/ExpenseManager/Globals/Application/AppDefinition_Version.global","_Name":"KeyValue3","KeyName":"Application Metadata Version","Visible":true,"_Type":"KeyValue.Type.Item"}],"MaxItemCount":1,"_Type":"Section.Type.KeyValue","_Name":"SectionKeyValue0","Visible":true,"EmptySection":{"FooterVisible":false},"Layout":{"NumberOfColumns":1}},{"KeyAndValues":[{"Value":"/ExpenseManager/Rules/Application/GetClientVersion.js","_Name":"KeyValue4","KeyName":"Client Version","Visible":"$(PLT,true,true,false)","_Type":"KeyValue.Type.Item"},{"Value":"/ExpenseManager/Rules/Application/GetClientSupportVersions.js","_Name":"KeyValue5","KeyName":"Client Support Versions","Visible":true,"_Type":"KeyValue.Type.Item"}],"MaxItemCount":1,"_Type":"Section.Type.KeyValue","_Name":"SectionKeyValue1","Visible":true,"EmptySection":{"FooterVisible":false},"Layout":{"NumberOfColumns":1}}]}],"_Type":"Page","_Name":"About","ActionBar":{"Items":[{"_Name":"ActionBarItem0","Caption":"Done","SystemItem":"Done","Position":"Right","IsIconCircular":false,"Visible":true,"OnPress":"/ExpenseManager/Actions/CloseModalPage_Complete.action","_Type":"Control.Type.ActionBarItem"}],"_Name":"ActionBar1","Caption":"About","PreferredCaptionSize":"Large","_Type":"Control.Type.ActionBar"}}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/Application/Support.page":
/*!*************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/Application/Support.page ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = {"Controls":[{"FilterFeedbackBar":{"ShowAllFilters":true,"_Type":"Control.Type.FilterFeedbackBar"},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable0","Sections":[{"_Type":"Section.Type.ContactCell","_Name":"SectionContactCellTable1","EmptySection":{"FooterVisible":false},"ContactCells":[{"ContactCell":{"_Name":"ContactCellItem0","Headline":"Contact Support","ActivityItems":[{"ActivityType":"Phone","ActivityValue":"/ExpenseManager/Globals/Application/SupportPhone.global"},{"ActivityType":"Email","ActivityValue":"/ExpenseManager/Globals/Application/SupportEmail.global"},{"ActivityType":"Message","ActivityValue":"/ExpenseManager/Globals/Application/SupportPhone.global"}]}}]},{"Separators":{"TopSectionSeparator":false,"BottomSectionSeparator":true,"HeaderSeparator":false,"FooterSeparator":true,"ControlSeparator":true},"_Type":"Section.Type.SimplePropertyCollection","_Name":"SectionSimplePropertyCollection0","Visible":"$(PLT,true,true,false)","EmptySection":{"FooterVisible":false},"SimplePropertyCells":[{"SimplePropertyCell":{"_Name":"SectionSimplePropertyCell0","KeyName":"Activity Log","AccessoryType":"DisclosureIndicator","Visible":"$(PLT,true,true,false)","OnPress":"/ExpenseManager/Actions/Application/NavToActivityLog.action","_Type":"SimplePropertyCollection.Type.Cell"}}],"Layout":{"NumberOfColumns":1,"MinimumInteritemSpacing":66}}]}],"_Type":"Page","_Name":"Settings","ActionBar":{"Items":[{"_Name":"ActionBarItem0","Caption":"Done","SystemItem":"Done","Position":"Right","IsIconCircular":false,"Visible":true,"OnPress":"/ExpenseManager/Actions/CloseModalPage_Complete.action","_Type":"Control.Type.ActionBarItem"}],"_Name":"ActionBar1","Caption":"Settings","PreferredCaptionSize":"Small","_Type":"Control.Type.ActionBar"}}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/Application/UserActivityLog.page":
/*!*********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/Application/UserActivityLog.page ***!
  \*********************************************************************************/
/***/ ((module) => {

module.exports = {"Controls":[{"FilterFeedbackBar":{"ShowAllFilters":true,"_Type":"Control.Type.FilterFeedbackBar"},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable","Sections":[{"Controls":[{"Value":false,"_Type":"Control.Type.FormCell.Switch","_Name":"EnableLogSwitch","IsVisible":true,"Separator":true,"Caption":"Enable Logging","OnValueChange":"/ExpenseManager/Rules/Logging/ToggleLogging.js","IsEditable":true},{"IsSearchEnabled":false,"_Type":"Control.Type.FormCell.ListPicker","_Name":"LogLevelListPicker","IsVisible":true,"Separator":true,"AllowMultipleSelection":false,"AllowEmptySelection":false,"Caption":"Log Level","OnValueChange":"/ExpenseManager/Rules/Logging/SetUserLogLevel.js","IsSelectedSectionEnabled":false,"IsPickerDismissedOnSelection":true,"AllowDefaultValueIfOneItem":false,"IsEditable":false,"PickerItems":"/ExpenseManager/Rules/Logging/LogLevels.js"},{"_Type":"Control.Type.FormCell.ListPicker","_Name":"TracingCategoriesListPicker","IsVisible":false,"Separator":true,"AllowMultipleSelection":true,"AllowEmptySelection":true,"Caption":"Tracing Categories","PickerPrompt":"Select Categories for Tracing","OnValueChange":"/ExpenseManager/Rules/Logging/SetTraceCategories.js","IsSelectedSectionEnabled":true,"IsPickerDismissedOnSelection":false,"IsSearchCancelledAfterSelection":false,"AllowDefaultValueIfOneItem":false,"IsEditable":true,"PickerItems":"/ExpenseManager/Rules/Logging/TraceCategories.js"},{"Value":false,"_Type":"Control.Type.FormCell.Switch","_Name":"odataTrace","IsVisible":false,"Separator":true,"Caption":"OData Tracing","OnValueChange":"/ExpenseManager/Rules/Logging/SetTraceCategories.js","IsEditable":true}],"Separators":{"TopSectionSeparator":false,"BottomSectionSeparator":true,"HeaderSeparator":true,"FooterSeparator":true,"ControlSeparator":true},"Visible":true,"EmptySection":{"FooterVisible":false},"_Type":"Section.Type.FormCell","_Name":"FormCellSection0"},{"Controls":[{"_Type":"Control.Type.FormCell.Button","_Name":"Send","IsVisible":true,"Separator":true,"Title":"Send Activity Log","Alignment":"Center","ButtonType":"Text","Semantic":"Tint","ImagePosition":"Leading","Enabled":true,"OnPress":"/ExpenseManager/Actions/Logging/UploadLogProgress.action"}],"Separators":{"TopSectionSeparator":false,"BottomSectionSeparator":true,"HeaderSeparator":true,"FooterSeparator":true,"ControlSeparator":true},"Visible":true,"EmptySection":{"FooterVisible":false},"_Type":"Section.Type.FormCell","_Name":"FormCellSection1"}]}],"_Type":"Page","_Name":"UserActivityLog","ActionBar":{"Caption":"Activity Log","PreferredCaptionSize":"Small","_Type":"Control.Type.ActionBar"},"OnLoaded":"/ExpenseManager/Rules/Logging/UserLogSetting.js"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Create.page":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Create.page ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Backups/Backups_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Backups_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"AttachmentTitle":"Backup","AttachmentAddTitle":"Browse","AttachmentActionType":["AddPhoto","TakePhoto","SelectFile"],"AllowedFileTypes":["jpg","png","gif"],"_Name":"Backup","_Type":"Control.Type.FormCell.Attachment"},{"Caption":"BackupType","_Name":"BackupType","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Backups_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Detail.page":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Detail.page ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Backups","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Backups/NavToBackups_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Backups/Backups_DetailPopover.action","Position":"Right","Caption":"More","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Backups_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Backup","HeadlineText":"{ID}","Subhead":"{createdAt}","BodyText":"","Footnote":"{modifiedAt}","Description":"{createdBy}","StatusText":"{modifiedBy}","StatusImage":"","SubstatusImage":"","SubstatusText":"{BackupType}"},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,CreatedAt)","Value":"{createdAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CreatedBy)","Value":"{createdBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedAt)","Value":"{modifiedAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedBy)","Value":"{modifiedBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"BackupType","Value":"{BackupType}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"}],"DataSubscriptions":[],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Backups_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Edit.page":
/*!*****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Edit.page ***!
  \*****************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Backups","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Backups/Backups_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Backups/Backups_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Backups_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"BackupType","_Name":"BackupType","Value":"{BackupType}","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Backups_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_List.page":
/*!*****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Backups/Backups_List.page ***!
  \*****************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Backups)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Backup"}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Detail.action","StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{BackupType}","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Backups","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Backups_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Create.page":
/*!***************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Create.page ***!
  \***************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Cards/Cards_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Cards_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Name","_Name":"Name","_Type":"Control.Type.FormCell.SimpleProperty"},{"AttachmentTitle":"Image","AttachmentAddTitle":"Browse","AttachmentActionType":["AddPhoto","TakePhoto","SelectFile"],"AllowedFileTypes":["jpg","png","gif"],"_Name":"Image","_Type":"Control.Type.FormCell.Attachment"},{"Caption":"ImageType","_Name":"ImageType","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Limit","KeyboardType":"Number","_Name":"Limit","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"DueDay","KeyboardType":"Number","_Name":"DueDay","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"ClosingDay","KeyboardType":"Number","_Name":"ClosingDay","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Cards_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_CreateInvoices.page":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_CreateInvoices.page ***!
  \***********************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Cards/Cards_CreateInvoices.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Invoices)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Year","KeyboardType":"Number","_Name":"Year","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Month","KeyboardType":"Number","_Name":"Month","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"TotalAmount","KeyboardType":"Number","_Name":"TotalAmount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"_Name":"InvoiceSent","Caption":"InvoiceSent","Value":false,"_Type":"Control.Type.FormCell.Switch"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Cards_CreateInvoices"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Detail.page":
/*!***************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Detail.page ***!
  \***************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Cards","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Cards/NavToCards_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Cards/Cards_DetailPopover.action","Position":"Right","Caption":"More","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Cards_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image","HeadlineText":"{Name}","Subhead":"{createdAt}","BodyText":"","Footnote":"{modifiedAt}","Description":"{createdBy}","StatusText":"{modifiedBy}","StatusImage":"","SubstatusImage":"","SubstatusText":"{ImageType}"},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,CreatedAt)","Value":"{createdAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CreatedBy)","Value":"{createdBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedAt)","Value":"{modifiedAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedBy)","Value":"{modifiedBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"Name","Value":"{Name}","_Type":"KeyValue.Type.Item"},{"KeyName":"ImageType","Value":"{ImageType}","_Type":"KeyValue.Type.Item"},{"KeyName":"Limit","Value":"{Limit}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,Currency)","Value":"{Currency_code}","_Type":"KeyValue.Type.Item"},{"KeyName":"AvailableLimit","Value":"{AvailableLimit}","_Type":"KeyValue.Type.Item"},{"KeyName":"DueDay","Value":"{DueDay}","_Type":"KeyValue.Type.Item"},{"KeyName":"ClosingDay","Value":"{ClosingDay}","_Type":"KeyValue.Type.Item"},{"KeyName":"InvoiceAmountForPayment","Value":"{InvoiceAmountForPayment}","_Type":"KeyValue.Type.Item"},{"KeyName":"InvoiceAmountToPay","Value":"{InvoiceAmountToPay}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"},{"Header":{"Caption":"Invoices","_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{Year}","OnPress":"/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Detail.action","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Target":{"EntitySet":"{@odata.readLink}/Invoices","Service":"/ExpenseManager/Services/ExpenseManager.service"},"_Type":"Section.Type.ObjectTable"}],"DataSubscriptions":["Invoices"],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Cards_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Edit.page":
/*!*************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Edit.page ***!
  \*************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Cards","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Cards/Cards_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Cards/Cards_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Cards_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Name","_Name":"Name","Value":"{Name}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"ImageType","_Name":"ImageType","Value":"{ImageType}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Limit","_Name":"Limit","Value":"{Limit}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"Value":"{Currency_code}","_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"DueDay","_Name":"DueDay","Value":"{DueDay}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"ClosingDay","_Name":"ClosingDay","Value":"{ClosingDay}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Cards_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_List.page":
/*!*************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Cards/Cards_List.page ***!
  \*************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Cards)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image"}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Detail.action","StatusImage":"","Title":"{Name}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{ImageType}","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Cards","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Cards_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Create.page":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Create.page ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Categories/Categories_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Categories_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Name","_Name":"Name","_Type":"Control.Type.FormCell.SimpleProperty"},{"AttachmentTitle":"Image","AttachmentAddTitle":"Browse","AttachmentActionType":["AddPhoto","TakePhoto","SelectFile"],"AllowedFileTypes":["jpg","png","gif"],"_Name":"Image","_Type":"Control.Type.FormCell.Attachment"},{"Caption":"ImageType","_Name":"ImageType","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Categories_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_CreateTransactions.page":
/*!*************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_CreateTransactions.page ***!
  \*************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Categories/Categories_CreateTransactions.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Transactions)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Mode":"Date","_Name":"Date","Caption":"Date","_Type":"Control.Type.FormCell.DatePicker"},{"Caption":"TotalAmount","KeyboardType":"Number","_Name":"TotalAmount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Amount","KeyboardType":"Number","_Name":"Amount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"TotalInstallments","KeyboardType":"Number","_Name":"TotalInstallments","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Installment","KeyboardType":"Number","_Name":"Installment","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Categories_CreateTransactions"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Detail.page":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Detail.page ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Categories","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Categories/NavToCategories_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Categories/Categories_DetailPopover.action","Position":"Right","Caption":"More","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Categories_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image","HeadlineText":"{Name}","Subhead":"{createdAt}","BodyText":"","Footnote":"{modifiedAt}","Description":"{createdBy}","StatusText":"{modifiedBy}","StatusImage":"","SubstatusImage":"","SubstatusText":"{ImageType}"},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,CreatedAt)","Value":"{createdAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CreatedBy)","Value":"{createdBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedAt)","Value":"{modifiedAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedBy)","Value":"{modifiedBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"Name","Value":"{Name}","_Type":"KeyValue.Type.Item"},{"KeyName":"ImageType","Value":"{ImageType}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"},{"Header":{"Caption":"Transactions","_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{Date}","OnPress":"/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Detail.action","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Target":{"EntitySet":"{@odata.readLink}/Transactions","Service":"/ExpenseManager/Services/ExpenseManager.service"},"_Type":"Section.Type.ObjectTable"}],"DataSubscriptions":["Transactions"],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Categories_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Edit.page":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Edit.page ***!
  \***********************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Categories","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Categories/Categories_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Categories/Categories_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Categories_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Name","_Name":"Name","Value":"{Name}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"ImageType","_Name":"ImageType","Value":"{ImageType}","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Categories_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_List.page":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Categories/Categories_List.page ***!
  \***********************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Categories)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image"}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Detail.action","StatusImage":"","Title":"{Name}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{ImageType}","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Categories","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Categories_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Create.page":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Create.page ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Currencies_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"$(L,Name)","_Name":"name","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Description)","_Name":"descr","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,CurrencyCode)","_Name":"code","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,CurrencySymbol)","_Name":"symbol","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,CurrencyMinorUnit)","KeyboardType":"Number","_Name":"minorUnit","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Currencies_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Detail.page":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Detail.page ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Currencies","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Currencies/NavToCurrencies_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_DeleteConfirmation.js","Position":"Right","SystemItem":"Trash","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Currencies_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"","HeadlineText":"{name}","Subhead":"{descr}","BodyText":"","Footnote":"{symbol}","Description":"{code}","StatusText":"{minorUnit}","StatusImage":"","SubstatusImage":"","SubstatusText":""},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,Name)","Value":"{name}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,Description)","Value":"{descr}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CurrencyCode)","Value":"{code}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CurrencySymbol)","Value":"{symbol}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CurrencyMinorUnit)","Value":"{minorUnit}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"}],"DataSubscriptions":[],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Currencies_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Edit.page":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Edit.page ***!
  \***********************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Currencies","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Currencies/Currencies_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Currencies_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"$(L,Name)","_Name":"name","Value":"{name}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Description)","_Name":"descr","Value":"{descr}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,CurrencyCode)","_Name":"code","Value":"{code}","_Type":"Control.Type.FormCell.SimpleProperty","IsEditable":false},{"Caption":"$(L,CurrencySymbol)","_Name":"symbol","Value":"{symbol}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,CurrencyMinorUnit)","_Name":"minorUnit","Value":"{minorUnit}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Currencies_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_List.page":
/*!***********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_List.page ***!
  \***********************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Currencies)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{code}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Detail.action","StatusImage":"","Title":"{name}","Footnote":"{symbol}","PreserveIconStackSpacing":false,"StatusText":"{minorUnit}","Subhead":"{descr}","SubstatusText":"","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Currencies_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Create.page":
/*!*************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Create.page ***!
  \*************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Currencies_texts_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"$(L,LanguageCode)","_Name":"locale","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Name)","_Name":"name","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Description)","_Name":"descr","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,CurrencyCode)","_Name":"code","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Currencies_texts_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Detail.page":
/*!*************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Detail.page ***!
  \*************************************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Currencies_texts","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_DeleteConfirmation.js","Position":"Right","SystemItem":"Trash","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Currencies_texts_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"","HeadlineText":"{name}","Subhead":"{locale}","BodyText":"","Footnote":"{code}","Description":"{descr}","StatusText":"","StatusImage":"","SubstatusImage":"","SubstatusText":""},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,LanguageCode)","Value":"{locale}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,Name)","Value":"{name}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,Description)","Value":"{descr}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CurrencyCode)","Value":"{code}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"}],"DataSubscriptions":[],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Currencies_texts_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Edit.page":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Edit.page ***!
  \***********************************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Currencies_texts","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Currencies_texts_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"$(L,LanguageCode)","_Name":"locale","Value":"{locale}","_Type":"Control.Type.FormCell.SimpleProperty","IsEditable":false},{"Caption":"$(L,Name)","_Name":"name","Value":"{name}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Description)","_Name":"descr","Value":"{descr}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,CurrencyCode)","_Name":"code","Value":"{code}","_Type":"Control.Type.FormCell.SimpleProperty","IsEditable":false}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Currencies_texts_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_List.page":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_List.page ***!
  \***********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Currencies_texts)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{descr}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Detail.action","StatusImage":"","Title":"{name}","Footnote":"{code}","PreserveIconStackSpacing":false,"StatusText":"","Subhead":"{locale}","SubstatusText":"","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Currencies_texts","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Currencies_texts_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Create.page":
/*!*********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Create.page ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Entities/Entities_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Entities_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Entity","KeyboardType":"Number","_Name":"Entity","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Permission","KeyboardType":"Number","_Name":"Permission","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Entities_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Detail.page":
/*!*********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Detail.page ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Entities","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Entities/NavToEntities_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Entities/Entities_DeleteConfirmation.js","Position":"Right","SystemItem":"Trash","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Entities_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"","HeadlineText":"{ID}","Subhead":"{createdAt}","BodyText":"","Footnote":"{modifiedAt}","Description":"{createdBy}","StatusText":"{modifiedBy}","StatusImage":"","SubstatusImage":"","SubstatusText":"{Entity}"},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,CreatedAt)","Value":"{createdAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CreatedBy)","Value":"{createdBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedAt)","Value":"{modifiedAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedBy)","Value":"{modifiedBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"Entity","Value":"{Entity}","_Type":"KeyValue.Type.Item"},{"KeyName":"Permission","Value":"{Permission}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"}],"DataSubscriptions":[],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Entities_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Edit.page":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Edit.page ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Entities","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Entities/Entities_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Entities/Entities_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Entities_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Entity","_Name":"Entity","Value":"{Entity}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Permission","_Name":"Permission","Value":"{Permission}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Entities_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_List.page":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Entities/Entities_List.page ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Entities)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Detail.action","StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{Entity}","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Entities","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Entities_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Create.page":
/*!*********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Create.page ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Invoices_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Year","KeyboardType":"Number","_Name":"Year","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Month","KeyboardType":"Number","_Name":"Month","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"TotalAmount","KeyboardType":"Number","_Name":"TotalAmount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"_Name":"InvoiceSent","Caption":"InvoiceSent","Value":false,"_Type":"Control.Type.FormCell.Switch"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Invoices_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_CreateTransactions.page":
/*!*********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_CreateTransactions.page ***!
  \*********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_CreateTransactions.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Transactions)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Mode":"Date","_Name":"Date","Caption":"Date","_Type":"Control.Type.FormCell.DatePicker"},{"Caption":"TotalAmount","KeyboardType":"Number","_Name":"TotalAmount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Amount","KeyboardType":"Number","_Name":"Amount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"TotalInstallments","KeyboardType":"Number","_Name":"TotalInstallments","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Installment","KeyboardType":"Number","_Name":"Installment","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Invoices_CreateTransactions"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Detail.page":
/*!*********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Detail.page ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Invoices","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Invoices/NavToInvoices_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_DetailPopover.action","Position":"Right","Caption":"More","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Invoices_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"","HeadlineText":"{ID}","Subhead":"{createdAt}","BodyText":"","Footnote":"{modifiedAt}","Description":"{createdBy}","StatusText":"{modifiedBy}","StatusImage":"","SubstatusImage":"","SubstatusText":"{Year}"},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,CreatedAt)","Value":"{createdAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CreatedBy)","Value":"{createdBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedAt)","Value":"{modifiedAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedBy)","Value":"{modifiedBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"Year","Value":"{Year}","_Type":"KeyValue.Type.Item"},{"KeyName":"Month","Value":"{Month}","_Type":"KeyValue.Type.Item"},{"KeyName":"Description","Value":"{Description}","_Type":"KeyValue.Type.Item"},{"KeyName":"TotalAmount","Value":"{TotalAmount}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,Currency)","Value":"{Currency_code}","_Type":"KeyValue.Type.Item"},{"KeyName":"InvoiceSent","Value":"{InvoiceSent}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"},{"Header":{"Caption":"Transactions","_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{Date}","OnPress":"/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Detail.action","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Target":{"EntitySet":"{@odata.readLink}/Transactions","Service":"/ExpenseManager/Services/ExpenseManager.service"},"_Type":"Section.Type.ObjectTable"}],"DataSubscriptions":["Transactions"],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Invoices_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Edit.page":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Edit.page ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Invoices","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Invoices_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Year","_Name":"Year","Value":"{Year}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Month","_Name":"Month","Value":"{Month}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","Value":"{Description}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"TotalAmount","_Name":"TotalAmount","Value":"{TotalAmount}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"Value":"{Currency_code}","_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"_Name":"InvoiceSent","Caption":"InvoiceSent","Value":"{InvoiceSent}","_Type":"Control.Type.FormCell.Switch"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Invoices_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_List.page":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_List.page ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Invoices)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Detail.action","StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{Year}","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Invoices","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Invoices_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Create.page":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Create.page ***!
  \***************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Liabilities_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Name","_Name":"Name","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Creditor","_Name":"Creditor","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Type","_Name":"Type","_Type":"Control.Type.FormCell.SimpleProperty","Value":"GENERAL"},{"Caption":"Status","_Name":"Status","_Type":"Control.Type.FormCell.SimpleProperty","Value":"OPEN"},{"Caption":"OriginalAmount","KeyboardType":"Number","_Name":"OriginalAmount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"CurrentBalance","KeyboardType":"Number","_Name":"CurrentBalance","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"PaidAmount","KeyboardType":"Number","_Name":"PaidAmount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"InterestMode","_Name":"InterestMode","_Type":"Control.Type.FormCell.SimpleProperty","Value":"MANUAL"},{"Caption":"InterestRate","KeyboardType":"Number","_Name":"InterestRate","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Installments","KeyboardType":"Number","_Name":"Installments","_Type":"Control.Type.FormCell.SimpleProperty","Value":"1"},{"Caption":"InstallmentAmount","KeyboardType":"Number","_Name":"InstallmentAmount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Mode":"Date","_Name":"StartDate","Caption":"StartDate","_Type":"Control.Type.FormCell.DatePicker"},{"Mode":"Date","_Name":"FirstDueDate","Caption":"FirstDueDate","_Type":"Control.Type.FormCell.DatePicker"},{"Mode":"Date","_Name":"EndDate","Caption":"EndDate","_Type":"Control.Type.FormCell.DatePicker"},{"Mode":"Date","_Name":"LastPaymentDate","Caption":"LastPaymentDate","_Type":"Control.Type.FormCell.DatePicker"},{"Caption":"ExternalReference","_Name":"ExternalReference","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Liabilities_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_CreateLiabilityTransactions.page":
/*!************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_CreateLiabilityTransactions.page ***!
  \************************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_LiabilityTransactions)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Type","_Name":"Type","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","_Type":"Control.Type.FormCell.SimpleProperty"},{"Mode":"Date","_Name":"MovementDate","Caption":"MovementDate","_Type":"Control.Type.FormCell.DatePicker"},{"Caption":"Installment","KeyboardType":"Number","_Name":"Installment","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"TotalInstallments","KeyboardType":"Number","_Name":"TotalInstallments","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Amount","KeyboardType":"Number","_Name":"Amount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"BalanceAfter","KeyboardType":"Number","_Name":"BalanceAfter","_Type":"Control.Type.FormCell.SimpleProperty"},{"_Name":"IsAutomatic","Caption":"IsAutomatic","Value":false,"_Type":"Control.Type.FormCell.Switch"},{"Caption":"ExternalReference","_Name":"ExternalReference","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Liabilities_CreateLiabilityTransactions"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Detail.page":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Detail.page ***!
  \***************************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Liabilities","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Liabilities/NavToLiabilities_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_DetailPopover.action","Position":"Right","Caption":"More","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Liabilities_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"","HeadlineText":"{Name}","Subhead":"{createdAt}","BodyText":"","Footnote":"{modifiedAt}","Description":"{createdBy}","StatusText":"{modifiedBy}","StatusImage":"","SubstatusImage":"","SubstatusText":"{Creditor}"},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,CreatedAt)","Value":"{createdAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CreatedBy)","Value":"{createdBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedAt)","Value":"{modifiedAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedBy)","Value":"{modifiedBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"Name","Value":"{Name}","_Type":"KeyValue.Type.Item"},{"KeyName":"Creditor","Value":"{Creditor}","_Type":"KeyValue.Type.Item"},{"KeyName":"Description","Value":"{Description}","_Type":"KeyValue.Type.Item"},{"KeyName":"Type","Value":"{Type}","_Type":"KeyValue.Type.Item"},{"KeyName":"Status","Value":"{Status}","_Type":"KeyValue.Type.Item"},{"KeyName":"OriginalAmount","Value":"{OriginalAmount}","_Type":"KeyValue.Type.Item"},{"KeyName":"CurrentBalance","Value":"{CurrentBalance}","_Type":"KeyValue.Type.Item"},{"KeyName":"PaidAmount","Value":"{PaidAmount}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,Currency)","Value":"{Currency_code}","_Type":"KeyValue.Type.Item"},{"KeyName":"InterestMode","Value":"{InterestMode}","_Type":"KeyValue.Type.Item"},{"KeyName":"InterestRate","Value":"{InterestRate}","_Type":"KeyValue.Type.Item"},{"KeyName":"Installments","Value":"{Installments}","_Type":"KeyValue.Type.Item"},{"KeyName":"InstallmentAmount","Value":"{InstallmentAmount}","_Type":"KeyValue.Type.Item"},{"KeyName":"StartDate","Value":"{StartDate}","_Type":"KeyValue.Type.Item"},{"KeyName":"FirstDueDate","Value":"{FirstDueDate}","_Type":"KeyValue.Type.Item"},{"KeyName":"EndDate","Value":"{EndDate}","_Type":"KeyValue.Type.Item"},{"KeyName":"LastPaymentDate","Value":"{LastPaymentDate}","_Type":"KeyValue.Type.Item"},{"KeyName":"ExternalReference","Value":"{ExternalReference}","_Type":"KeyValue.Type.Item"},{"KeyName":"RemainingAmount","Value":"{RemainingAmount}","_Type":"KeyValue.Type.Item"},{"KeyName":"ProgressPercent","Value":"{ProgressPercent}","_Type":"KeyValue.Type.Item"},{"KeyName":"PaidInstallments","Value":"{PaidInstallments}","_Type":"KeyValue.Type.Item"},{"KeyName":"RemainingInstallments","Value":"{RemainingInstallments}","_Type":"KeyValue.Type.Item"},{"KeyName":"NextDueDate","Value":"{NextDueDate}","_Type":"KeyValue.Type.Item"},{"KeyName":"IsOverdue","Value":"{IsOverdue}","_Type":"KeyValue.Type.Item"},{"KeyName":"HealthScore","Value":"{HealthScore}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"},{"Header":{"Caption":"Transactions","_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{Type}","OnPress":"/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Detail.action","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Target":{"EntitySet":"{@odata.readLink}/Transactions","Service":"/ExpenseManager/Services/ExpenseManager.service"},"_Type":"Section.Type.ObjectTable"}],"DataSubscriptions":["LiabilityTransactions"],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Liabilities_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Edit.page":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Edit.page ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Liabilities","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Liabilities_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Name","_Name":"Name","Value":"{Name}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Creditor","_Name":"Creditor","Value":"{Creditor}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","Value":"{Description}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Type","_Name":"Type","Value":"{Type}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Status","_Name":"Status","Value":"{Status}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"OriginalAmount","_Name":"OriginalAmount","Value":"{OriginalAmount}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"CurrentBalance","_Name":"CurrentBalance","Value":"{CurrentBalance}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"PaidAmount","_Name":"PaidAmount","Value":"{PaidAmount}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"Value":"{Currency_code}","_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"InterestMode","_Name":"InterestMode","Value":"{InterestMode}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"InterestRate","_Name":"InterestRate","Value":"{InterestRate}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Installments","_Name":"Installments","Value":"{Installments}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"InstallmentAmount","_Name":"InstallmentAmount","Value":"{InstallmentAmount}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Mode":"Date","_Name":"StartDate","Value":"{StartDate}","Caption":"StartDate","_Type":"Control.Type.FormCell.DatePicker"},{"Mode":"Date","_Name":"FirstDueDate","Value":"{FirstDueDate}","Caption":"FirstDueDate","_Type":"Control.Type.FormCell.DatePicker"},{"Mode":"Date","_Name":"EndDate","Value":"{EndDate}","Caption":"EndDate","_Type":"Control.Type.FormCell.DatePicker"},{"Mode":"Date","_Name":"LastPaymentDate","Value":"{LastPaymentDate}","Caption":"LastPaymentDate","_Type":"Control.Type.FormCell.DatePicker"},{"Caption":"ExternalReference","_Name":"ExternalReference","Value":"{ExternalReference}","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Liabilities_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_List.page":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_List.page ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Liabilities)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Detail.action","StatusImage":"","Title":"{Name}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{Creditor}","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Liabilities","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Liabilities_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Create.page":
/*!***********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Create.page ***!
  \***********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_LiabilityTransactions_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Type","_Name":"Type","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","_Type":"Control.Type.FormCell.SimpleProperty"},{"Mode":"Date","_Name":"MovementDate","Caption":"MovementDate","_Type":"Control.Type.FormCell.DatePicker"},{"Caption":"Installment","KeyboardType":"Number","_Name":"Installment","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"TotalInstallments","KeyboardType":"Number","_Name":"TotalInstallments","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Amount","KeyboardType":"Number","_Name":"Amount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"BalanceAfter","KeyboardType":"Number","_Name":"BalanceAfter","_Type":"Control.Type.FormCell.SimpleProperty"},{"_Name":"IsAutomatic","Caption":"IsAutomatic","Value":false,"_Type":"Control.Type.FormCell.Switch"},{"Caption":"ExternalReference","_Name":"ExternalReference","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"LiabilityTransactions_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Detail.page":
/*!***********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Detail.page ***!
  \***********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"LiabilityTransactions","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_DeleteConfirmation.js","Position":"Right","SystemItem":"Trash","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,LiabilityTransactions_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"","HeadlineText":"{ID}","Subhead":"{createdAt}","BodyText":"","Footnote":"{modifiedAt}","Description":"{createdBy}","StatusText":"{modifiedBy}","StatusImage":"","SubstatusImage":"","SubstatusText":"{Type}"},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,CreatedAt)","Value":"{createdAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CreatedBy)","Value":"{createdBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedAt)","Value":"{modifiedAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedBy)","Value":"{modifiedBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"Type","Value":"{Type}","_Type":"KeyValue.Type.Item"},{"KeyName":"Description","Value":"{Description}","_Type":"KeyValue.Type.Item"},{"KeyName":"MovementDate","Value":"{MovementDate}","_Type":"KeyValue.Type.Item"},{"KeyName":"Installment","Value":"{Installment}","_Type":"KeyValue.Type.Item"},{"KeyName":"TotalInstallments","Value":"{TotalInstallments}","_Type":"KeyValue.Type.Item"},{"KeyName":"Amount","Value":"{Amount}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,Currency)","Value":"{Currency_code}","_Type":"KeyValue.Type.Item"},{"KeyName":"BalanceAfter","Value":"{BalanceAfter}","_Type":"KeyValue.Type.Item"},{"KeyName":"IsAutomatic","Value":"{IsAutomatic}","_Type":"KeyValue.Type.Item"},{"KeyName":"ExternalReference","Value":"{ExternalReference}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"}],"DataSubscriptions":[],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"LiabilityTransactions_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Edit.page":
/*!*********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Edit.page ***!
  \*********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"LiabilityTransactions","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_LiabilityTransactions_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Type","_Name":"Type","Value":"{Type}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","Value":"{Description}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Mode":"Date","_Name":"MovementDate","Value":"{MovementDate}","Caption":"MovementDate","_Type":"Control.Type.FormCell.DatePicker"},{"Caption":"Installment","_Name":"Installment","Value":"{Installment}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"TotalInstallments","_Name":"TotalInstallments","Value":"{TotalInstallments}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Amount","_Name":"Amount","Value":"{Amount}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"Value":"{Currency_code}","_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"BalanceAfter","_Name":"BalanceAfter","Value":"{BalanceAfter}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"_Name":"IsAutomatic","Caption":"IsAutomatic","Value":"{IsAutomatic}","_Type":"Control.Type.FormCell.Switch"},{"Caption":"ExternalReference","_Name":"ExternalReference","Value":"{ExternalReference}","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"LiabilityTransactions_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_List.page":
/*!*********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_List.page ***!
  \*********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,LiabilityTransactions)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Detail.action","StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{Type}","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"LiabilityTransactions","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"LiabilityTransactions_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Create.page":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Create.page ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Persons_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Name","_Name":"Name","_Type":"Control.Type.FormCell.SimpleProperty"},{"AttachmentTitle":"Image","AttachmentAddTitle":"Browse","AttachmentActionType":["AddPhoto","TakePhoto","SelectFile"],"AllowedFileTypes":["jpg","png","gif"],"_Name":"Image","_Type":"Control.Type.FormCell.Attachment"},{"Caption":"ImageType","_Name":"ImageType","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Income","KeyboardType":"Number","_Name":"Income","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"Email","_Name":"Email","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Phone","_Name":"Phone","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"ExpenseTarget","KeyboardType":"Number","_Name":"ExpenseTarget","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Persons_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateCards.page":
/*!************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateCards.page ***!
  \************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateCards.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Cards)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Name","_Name":"Name","_Type":"Control.Type.FormCell.SimpleProperty"},{"AttachmentTitle":"Image","AttachmentAddTitle":"Browse","AttachmentActionType":["AddPhoto","TakePhoto","SelectFile"],"AllowedFileTypes":["jpg","png","gif"],"_Name":"Image","_Type":"Control.Type.FormCell.Attachment"},{"Caption":"ImageType","_Name":"ImageType","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Limit","KeyboardType":"Number","_Name":"Limit","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"DueDay","KeyboardType":"Number","_Name":"DueDay","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"ClosingDay","KeyboardType":"Number","_Name":"ClosingDay","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Persons_CreateCards"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateCategories.page":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateCategories.page ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateCategories.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Categories)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Name","_Name":"Name","_Type":"Control.Type.FormCell.SimpleProperty"},{"AttachmentTitle":"Image","AttachmentAddTitle":"Browse","AttachmentActionType":["AddPhoto","TakePhoto","SelectFile"],"AllowedFileTypes":["jpg","png","gif"],"_Name":"Image","_Type":"Control.Type.FormCell.Attachment"},{"Caption":"ImageType","_Name":"ImageType","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Persons_CreateCategories"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateShares.page":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateShares.page ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/Persons_CreateShares.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Shares)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"User","_Name":"User","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Persons_CreateShares"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Detail.page":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Detail.page ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Persons","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Persons/Persons_DetailPopover.action","Position":"Right","Caption":"More","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Persons_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image","HeadlineText":"{Name}","Subhead":"{createdAt}","BodyText":"","Footnote":"{modifiedAt}","Description":"{createdBy}","StatusText":"{modifiedBy}","StatusImage":"","SubstatusImage":"","SubstatusText":"{ImageType}"},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,CreatedAt)","Value":"{createdAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CreatedBy)","Value":"{createdBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedAt)","Value":"{modifiedAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedBy)","Value":"{modifiedBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"Name","Value":"{Name}","_Type":"KeyValue.Type.Item"},{"KeyName":"ImageType","Value":"{ImageType}","_Type":"KeyValue.Type.Item"},{"KeyName":"Income","Value":"{Income}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,Currency)","Value":"{Currency_code}","_Type":"KeyValue.Type.Item"},{"KeyName":"Email","Value":"{Email}","_Type":"KeyValue.Type.Item"},{"KeyName":"Phone","Value":"{Phone}","_Type":"KeyValue.Type.Item"},{"KeyName":"ExpenseTarget","Value":"{ExpenseTarget}","_Type":"KeyValue.Type.Item"},{"KeyName":"AmountToSave","Value":"{AmountToSave}","_Type":"KeyValue.Type.Item"},{"KeyName":"TotalExpenses","Value":"{TotalExpenses}","_Type":"KeyValue.Type.Item"},{"KeyName":"TotalExpensesMonth","Value":"{TotalExpensesMonth}","_Type":"KeyValue.Type.Item"},{"KeyName":"TotalExpensesPayed","Value":"{TotalExpensesPayed}","_Type":"KeyValue.Type.Item"},{"KeyName":"TotalExpensesToPay","Value":"{TotalExpensesToPay}","_Type":"KeyValue.Type.Item"},{"KeyName":"TotalExpensesClosed","Value":"{TotalExpensesClosed}","_Type":"KeyValue.Type.Item"},{"KeyName":"MonthCriticallity","Value":"{MonthCriticallity}","_Type":"KeyValue.Type.Item"},{"KeyName":"CriticallityToPay","Value":"{CriticallityToPay}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"},{"Header":{"Caption":"Shares","_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{User}","OnPress":"/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Detail.action","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Target":{"EntitySet":"{@odata.readLink}/Shares","Service":"/ExpenseManager/Services/ExpenseManager.service"},"_Type":"Section.Type.ObjectTable"},{"Header":{"Caption":"Categories","_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image"}],"ImageIsCircular":false},"Icons":[],"StatusImage":"","Title":"{Name}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{ImageType}","OnPress":"/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Detail.action","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Target":{"EntitySet":"{@odata.readLink}/Categories","Service":"/ExpenseManager/Services/ExpenseManager.service"},"_Type":"Section.Type.ObjectTable"},{"Header":{"Caption":"Cards","_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image"}],"ImageIsCircular":false},"Icons":[],"StatusImage":"","Title":"{Name}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{ImageType}","OnPress":"/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Detail.action","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Target":{"EntitySet":"{@odata.readLink}/Cards","Service":"/ExpenseManager/Services/ExpenseManager.service"},"_Type":"Section.Type.ObjectTable"}],"DataSubscriptions":["Shares","Categories","Cards"],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Persons_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Edit.page":
/*!*****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Edit.page ***!
  \*****************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Persons","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/Persons_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/Persons_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Persons_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Name","_Name":"Name","Value":"{Name}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"ImageType","_Name":"ImageType","Value":"{ImageType}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Income","_Name":"Income","Value":"{Income}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"Value":"{Currency_code}","_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"Email","_Name":"Email","Value":"{Email}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Phone","_Name":"Phone","Value":"{Phone}","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"ExpenseTarget","_Name":"ExpenseTarget","Value":"{ExpenseTarget}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Persons_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_List.page":
/*!*****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Persons/Persons_List.page ***!
  \*****************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Persons)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image"}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Detail.action","StatusImage":"","Title":"{Name}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{ImageType}","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Persons","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Persons_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Create.page":
/*!*****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Create.page ***!
  \*****************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Shares/Shares_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Shares_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"User","_Name":"User","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Shares_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_CreateEntities.page":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_CreateEntities.page ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Shares/Shares_CreateEntities.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Entities)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"Entity","KeyboardType":"Number","_Name":"Entity","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Permission","KeyboardType":"Number","_Name":"Permission","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Shares_CreateEntities"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Detail.page":
/*!*****************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Detail.page ***!
  \*****************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Shares","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Shares/NavToShares_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Shares/Shares_DetailPopover.action","Position":"Right","Caption":"More","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Shares_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"","HeadlineText":"{ID}","Subhead":"{createdAt}","BodyText":"","Footnote":"{modifiedAt}","Description":"{createdBy}","StatusText":"{modifiedBy}","StatusImage":"","SubstatusImage":"","SubstatusText":"{User}"},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,CreatedAt)","Value":"{createdAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CreatedBy)","Value":"{createdBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedAt)","Value":"{modifiedAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedBy)","Value":"{modifiedBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"User","Value":"{User}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"},{"Header":{"Caption":"Entities","_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{Entity}","OnPress":"/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Detail.action","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Target":{"EntitySet":"{@odata.readLink}/Entities","Service":"/ExpenseManager/Services/ExpenseManager.service"},"_Type":"Section.Type.ObjectTable"}],"DataSubscriptions":["Entities"],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Shares_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Edit.page":
/*!***************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Edit.page ***!
  \***************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Shares","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Shares/Shares_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Shares/Shares_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Shares_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Caption":"User","_Name":"User","Value":"{User}","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Shares_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_List.page":
/*!***************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Shares/Shares_List.page ***!
  \***************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Shares)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Detail.action","StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{User}","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Shares","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Shares_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Create.page":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Create.page ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/CloseModalPage_Cancel.action","Position":"Left","SystemItem":"Cancel","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_CreateEntity.js","Position":"Right","SystemItem":"Save","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Create_Transactions_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Mode":"Date","_Name":"Date","Caption":"Date","_Type":"Control.Type.FormCell.DatePicker"},{"Caption":"TotalAmount","KeyboardType":"Number","_Name":"TotalAmount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Amount","KeyboardType":"Number","_Name":"Amount","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsEditable":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"TotalInstallments","KeyboardType":"Number","_Name":"TotalInstallments","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Installment","KeyboardType":"Number","_Name":"Installment","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Transactions_Create"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Detail.page":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Detail.page ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Transactions","QueryOptions":""},"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Transactions/NavToTransactions_Edit.js","Position":"Right","SystemItem":"Edit","_Type":"Control.Type.ActionBarItem"},{"OnPress":"/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_DeleteConfirmation.js","Position":"Right","SystemItem":"Trash","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Transactions_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"ObjectHeader":{"Tags":[],"DetailImage":"","HeadlineText":"{ID}","Subhead":"{createdAt}","BodyText":"","Footnote":"{modifiedAt}","Description":"{createdBy}","StatusText":"{modifiedBy}","StatusImage":"","SubstatusImage":"","SubstatusText":"{Date}"},"_Type":"Section.Type.ObjectHeader"},{"KeyAndValues":[{"KeyName":"$(L,CreatedAt)","Value":"{createdAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,CreatedBy)","Value":"{createdBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedAt)","Value":"{modifiedAt}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,ChangedBy)","Value":"{modifiedBy}","_Type":"KeyValue.Type.Item"},{"KeyName":"Date","Value":"{Date}","_Type":"KeyValue.Type.Item"},{"KeyName":"TotalAmount","Value":"{TotalAmount}","_Type":"KeyValue.Type.Item"},{"KeyName":"Amount","Value":"{Amount}","_Type":"KeyValue.Type.Item"},{"KeyName":"$(L,Currency)","Value":"{Currency_code}","_Type":"KeyValue.Type.Item"},{"KeyName":"TotalInstallments","Value":"{TotalInstallments}","_Type":"KeyValue.Type.Item"},{"KeyName":"Installment","Value":"{Installment}","_Type":"KeyValue.Type.Item"},{"KeyName":"Description","Value":"{Description}","_Type":"KeyValue.Type.Item"}],"Layout":{"NumberOfColumns":2},"MaxItemCount":1,"_Name":"SectionKeyValue0","_Type":"Section.Type.KeyValue"}],"DataSubscriptions":[],"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Transactions_Detail"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Edit.page":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Edit.page ***!
  \***************************************************************************************************/
/***/ ((module) => {

module.exports = {"DesignTimeTarget":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Transactions","QueryOptions":""},"ActionBar":{"Items":[{"Position":"Left","Caption":"Cancel","OnPress":"/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_Cancel.js","_Type":"Control.Type.ActionBarItem"},{"Position":"Right","SystemItem":"Save","OnPress":"/ExpenseManager/Rules/ExpenseManager/Transactions/Transactions_UpdateEntity.js","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Update_Transactions_Detail)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"_Type":"Section.Type.FormCell","_Name":"SectionFormCell0","Visible":true,"Controls":[{"Mode":"Date","_Name":"Date","Value":"{Date}","Caption":"Date","_Type":"Control.Type.FormCell.DatePicker"},{"Caption":"TotalAmount","_Name":"TotalAmount","Value":"{TotalAmount}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Amount","_Name":"Amount","Value":"{Amount}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"$(L,Currency)","AllowMultipleSelection":false,"AllowEmptySelection":true,"IsPickerDismissedOnSelection":true,"IsSelectedSectionEnabled":true,"PickerItems":{"DisplayValue":"{code}","ReturnValue":"{code}","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"}},"Value":"{Currency_code}","_Name":"Currency_code","_Type":"Control.Type.FormCell.ListPicker"},{"Caption":"TotalInstallments","_Name":"TotalInstallments","Value":"{TotalInstallments}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Installment","_Name":"Installment","Value":"{Installment}","KeyboardType":"Number","_Type":"Control.Type.FormCell.SimpleProperty"},{"Caption":"Description","_Name":"Description","Value":"{Description}","_Type":"Control.Type.FormCell.SimpleProperty"}]}],"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable"}],"_Type":"Page","_Name":"Transactions_Edit"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_List.page":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_List.page ***!
  \***************************************************************************************************/
/***/ ((module) => {

module.exports = {"ActionBar":{"Items":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Create.action","Position":"Right","SystemItem":"Add","_Type":"Control.Type.ActionBarItem"}],"Caption":"$(L,Transactions)","_Type":"Control.Type.ActionBar"},"Controls":[{"Sections":[{"Header":{"UseTopPadding":false,"_Type":"SectionCommon.Type.Header"},"ObjectCell":{"AccessoryType":"DisclosureIndicator","Description":"{createdBy}","AvatarStack":{"Avatars":[{"Image":""}],"ImageIsCircular":false},"Icons":[],"OnPress":"/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Detail.action","StatusImage":"","Title":"{ID}","Footnote":"{modifiedAt}","PreserveIconStackSpacing":false,"StatusText":"{modifiedBy}","Subhead":"{createdAt}","SubstatusText":"{Date}","_Type":"ObjectTable.Type.ObjectCell"},"EmptySection":{"Caption":"No record found!"},"Search":{"Enabled":true,"Placeholder":"Item Search","BarcodeScanner":true,"Delay":500,"MinimumCharacterThreshold":3},"DataPaging":{"ShowLoadingIndicator":true,"LoadingIndicatorText":"Loading more items, please wait..."},"Target":{"EntitySet":"Transactions","Service":"/ExpenseManager/Services/ExpenseManager.service","QueryOptions":""},"_Type":"Section.Type.ObjectTable"}],"LoadingIndicator":{"Enabled":true,"Text":"Loading, please wait..."},"_Type":"Control.Type.SectionedTable","_Name":"SectionedTable"}],"_Type":"Page","_Name":"Transactions_List"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Pages/Main.page":
/*!**********************************************************!*\
  !*** ./build.definitions/ExpenseManager/Pages/Main.page ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = {"Controls":[{"FilterFeedbackBar":{"ShowAllFilters":false,"_Type":"Control.Type.FilterFeedbackBar"},"_Name":"SectionedTable0","_Type":"Control.Type.SectionedTable","Sections":[{"Header":{"_Name":"SectionHeader_ExpenseManager","AccessoryType":"None","UseTopPadding":true,"Caption":"ExpenseManager","_Type":"SectionCommon.Type.Header"},"Separators":{"TopSectionSeparator":false,"BottomSectionSeparator":true,"HeaderSeparator":true,"FooterSeparator":true,"ControlSeparator":true},"Buttons":[{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_List.action","Alignment":"Center","Title":"Backups","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_List.action","Alignment":"Center","Title":"Cards","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_List.action","Alignment":"Center","Title":"Categories","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_List.action","Alignment":"Center","Title":"Currencies","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_List.action","Alignment":"Center","Title":"Currencies_texts","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_List.action","Alignment":"Center","Title":"Entities","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_List.action","Alignment":"Center","Title":"Invoices","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_List.action","Alignment":"Center","Title":"Liabilities","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_List.action","Alignment":"Center","Title":"LiabilityTransactions","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_List.action","Alignment":"Center","Title":"Persons","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_List.action","Alignment":"Center","Title":"Shares","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"},{"OnPress":"/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_List.action","Alignment":"Center","Title":"Transactions","ButtonType":"Text","Semantic":"Tint","_Type":"ButtonTable.Type.Button"}],"_Name":"SectionButtonTable_ExpenseManager","_Type":"Section.Type.ButtonTable"}]}],"_Name":"Main","_Type":"Page","ActionBar":{"Items":[{"_Name":"ActionBarItem0","Caption":"User Menu","Icon":"sap-icon://customer","Position":"Right","IsIconCircular":false,"Visible":true,"OnPress":"/ExpenseManager/Actions/Application/UserMenuPopover.action","_Type":"Control.Type.ActionBarItem"}],"_Name":"ActionBar1","Caption":"Main","PreferredCaptionSize":"Large","_Type":"Control.Type.ActionBar"}}

/***/ }),

/***/ "./build.definitions/Application.app":
/*!*******************************************!*\
  !*** ./build.definitions/Application.app ***!
  \*******************************************/
/***/ ((module) => {

module.exports = {"_Name":"ExpenseManager","Version":"/ExpenseManager/Globals/Application/AppDefinition_Version.global","MainPage":"/ExpenseManager/Pages/Main.page","OnLaunch":"/ExpenseManager/Rules/Service/Initialize.js","OnWillUpdate":"/ExpenseManager/Rules/Application/OnWillUpdate.js","OnDidUpdate":"/ExpenseManager/Rules/Service/Initialize.js","Styles":"/ExpenseManager/Styles/Styles.less","Localization":"/ExpenseManager/i18n/i18n.properties","_SchemaVersion":"26.3","StyleSheets":{"Styles":{"css":"/ExpenseManager/Styles/Styles.css","ios":"/ExpenseManager/Styles/Styles.nss","android":"/ExpenseManager/Styles/Styles.json"}}}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/AppUpdate.action":
/*!*******************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/AppUpdate.action ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ApplicationUpdate","ActionResult":{"_Name":"AppUpdate"},"OnFailure":"/ExpenseManager/Rules/Application/AppUpdateFailure.js","OnSuccess":"/ExpenseManager/Rules/Application/AppUpdateSuccess.js"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/AppUpdateFailureMessage.action":
/*!*********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/AppUpdateFailureMessage.action ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = {"Message":"Failed to update application - {#ActionResults:AppUpdate/error}","Duration":7,"Animated":true,"_Type":"Action.Type.BannerMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/AppUpdateProgressBanner.action":
/*!*********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/AppUpdateProgressBanner.action ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = {"Animated":true,"CompletionTimeout":3,"Message":"Checking for Updates...","OnSuccess":"/ExpenseManager/Actions/Application/AppUpdate.action","_Type":"Action.Type.ProgressBanner"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/AppUpdateSuccessMessage.action":
/*!*********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/AppUpdateSuccessMessage.action ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = {"Animated":true,"Duration":2,"Message":"Update application complete","_Type":"Action.Type.ToastMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/Logout.action":
/*!****************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/Logout.action ***!
  \****************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Logout","SkipReset":true}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/NavToAbout.action":
/*!********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/NavToAbout.action ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/Application/About.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/NavToActivityLog.action":
/*!**************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/NavToActivityLog.action ***!
  \**************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/Application/UserActivityLog.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/NavToSupport.action":
/*!**********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/NavToSupport.action ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPage":true,"NavigationType":"Cross","PageToOpen":"/ExpenseManager/Pages/Application/Support.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/OnWillUpdate.action":
/*!**********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/OnWillUpdate.action ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Message","Message":"A new version of the application is now ready to apply. Do you want to update to this version?","Title":"New Version Available!","OKCaption":"Now","CancelCaption":"Later","ActionResult":{"_Name":"OnWillUpdate"}}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/Reset.action":
/*!***************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/Reset.action ***!
  \***************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Logout","SkipReset":false}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/ResetMessage.action":
/*!**********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/ResetMessage.action ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Message","Message":"This action will remove all data and return to the Welcome screen. Any local data will be lost. Are you sure you want to continue?","Title":"Reset","OKCaption":"Yes","OnOK":"/ExpenseManager/Rules/Application/ResetAppSettingsAndLogout.js","CancelCaption":"No"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Application/UserMenuPopover.action":
/*!*************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Application/UserMenuPopover.action ***!
  \*************************************************************************************/
/***/ ((module) => {

module.exports = {"PopoverItems":[{"Enabled":true,"Icon":"sap-icon://headset","OnPress":"/ExpenseManager/Actions/Application/NavToSupport.action","Title":"Support","Visible":true},{"Enabled":true,"Icon":"sap-icon://refresh","OnPress":"/ExpenseManager/Actions/Application/AppUpdateProgressBanner.action","Title":"Check for Updates","Visible":"$(PLT,true,true,false)"},{"Enabled":true,"Icon":"sap-icon://hint","OnPress":"/ExpenseManager/Actions/Application/NavToAbout.action","Title":"About","Visible":true},{"Enabled":true,"Icon":"sap-icon://reset","OnPress":"/ExpenseManager/Actions/Application/ResetMessage.action","Title":"Reset","Visible":true},{"Enabled":true,"Icon":"sap-icon://log","OnPress":"/ExpenseManager/Actions/Application/Logout.action","Title":"Logout","Visible":"/ExpenseManager/Rules/Application/ClientIsMultiUserMode.js"}],"_Type":"Action.Type.PopoverMenu"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/CloseModalPage_Cancel.action":
/*!*******************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/CloseModalPage_Cancel.action ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = {"DismissModal":"Action.Type.ClosePage.Canceled","CancelPendingActions":true,"_Type":"Action.Type.ClosePage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/CloseModalPage_Complete.action":
/*!*********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/CloseModalPage_Complete.action ***!
  \*********************************************************************************/
/***/ ((module) => {

module.exports = {"DismissModal":"Action.Type.ClosePage.Completed","CancelPendingActions":false,"_Type":"Action.Type.ClosePage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ClosePage.action":
/*!*******************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ClosePage.action ***!
  \*******************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ClosePage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/CreateEntityFailureMessage.action":
/*!************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/CreateEntityFailureMessage.action ***!
  \************************************************************************************/
/***/ ((module) => {

module.exports = {"Message":"Create entity failure - {#ActionResults:create/error}","Duration":7,"Animated":true,"_Type":"Action.Type.BannerMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/CreateEntitySuccessMessage.action":
/*!************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/CreateEntitySuccessMessage.action ***!
  \************************************************************************************/
/***/ ((module) => {

module.exports = {"Animated":true,"Duration":2,"Message":"Entity created","IsIconHidden":true,"OnSuccess":"/ExpenseManager/Actions/CloseModalPage_Complete.action","_Type":"Action.Type.ToastMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/DeleteConfirmation.action":
/*!****************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/DeleteConfirmation.action ***!
  \****************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Message","Message":"Delete current entity?","Title":"Confirmation","OKCaption":"OK","CancelCaption":"Cancel","ActionResult":{"_Name":"DeleteConfirmation"}}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/DeleteEntityFailureMessage.action":
/*!************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/DeleteEntityFailureMessage.action ***!
  \************************************************************************************/
/***/ ((module) => {

module.exports = {"Message":"Delete entity failure - {#ActionResults:delete/error}","Duration":7,"Animated":true,"_Type":"Action.Type.BannerMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/DeleteEntitySuccessMessage.action":
/*!************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/DeleteEntitySuccessMessage.action ***!
  \************************************************************************************/
/***/ ((module) => {

module.exports = {"Animated":true,"Duration":2,"Message":"Entity deleted","Icon":"","IsIconHidden":false,"NumberOfLines":2,"OnSuccess":"/ExpenseManager/Actions/CloseModalPage_Complete.action","_Type":"Action.Type.ToastMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/DraftDiscardEntity.action":
/*!****************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/DraftDiscardEntity.action ***!
  \****************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.DraftEnabled.Discard","Target":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Backups","ReadLink":"{@odata.readLink}"},"ShowActivityIndicator":true,"ActionResult":{"_Name":"update"},"OnSuccess":{"Name":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","Properties":{"Message":"Draft Discarded"}},"OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/DraftEditEntity.action":
/*!*************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/DraftEditEntity.action ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.DraftEnabled.Edit","Target":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Backups","ReadLink":"{@odata.readLink}"},"ShowActivityIndicator":true,"ActionResult":{"_Name":"update"},"OnSuccess":{"Name":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","Properties":{"Message":"Draft Edit"}},"OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/DraftSaveEntity.action":
/*!*************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/DraftSaveEntity.action ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.DraftEnabled.Save","Target":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Backups","ReadLink":"{@odata.readLink}"},"ShowActivityIndicator":true,"ActionResult":{"_Name":"update"},"OnSuccess":{"Name":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","Properties":{"Message":"Draft Saved"}},"OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_CreateEntity.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_CreateEntity.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"BackupType":"#Page:Backups_Create/#Control:BackupType/#Value"},"Target":{"EntitySet":"Backups","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_DeleteEntity.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_DeleteEntity.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Backups","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_DetailPopover.action":
/*!******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_DetailPopover.action ***!
  \******************************************************************************************************/
/***/ ((module) => {

module.exports = {"PopoverItems":[{"Title":"Open Document","OnPress":"/ExpenseManager/Actions/ExpenseManager/Backups/Backups_OpenDocument.action"},{"Title":"Delete","OnPress":"/ExpenseManager/Rules/ExpenseManager/Backups/Backups_DeleteConfirmation.js"}],"_Type":"Action.Type.PopoverMenu"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_OpenDocument.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_OpenDocument.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.OpenDocument","Path":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Backup","MimeType":"image/jpeg"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UpdateEntity.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UpdateEntity.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Backups","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"BackupType":"#Page:Backups_Edit/#Control:BackupType/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UploadStream.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/Backups_UploadStream.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UploadStream","Target":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Backups","ReadLink":"{@odata.readLink}"},"Properties":{"Backup":"#Control:Backup/#Value"},"ShowActivityIndicator":true,"ActionResult":{"_Name":"uploadstream"},"OnSuccess":"/ExpenseManager/Actions/UploadStreamSuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UploadStreamFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Create.action":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Create.action ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Detail.action":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Detail.action ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Edit.action":
/*!**************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_Edit.action ***!
  \**************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Backups/Backups_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_List.action":
/*!**************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Backups/NavToBackups_List.action ***!
  \**************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Backups/Backups_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateEntity.action":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateEntity.action ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Name":"#Page:Cards_Create/#Control:Name/#Value","ImageType":"#Page:Cards_Create/#Control:ImageType/#Value","Limit":"#Page:Cards_Create/#Control:Limit/#Value","Currency_code":"#Page:Cards_Create/#Control:Currency_code/#SelectedValue","DueDay":"#Page:Cards_Create/#Control:DueDay/#Value","ClosingDay":"#Page:Cards_Create/#Control:ClosingDay/#Value"},"Target":{"EntitySet":"Cards","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateInvoices.action":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_CreateInvoices.action ***!
  \***************************************************************************************************/
/***/ ((module) => {

module.exports = {"ParentLink":{"Property":"Invoices","Target":{"EntitySet":"Cards","ReadLink":"{@odata.readLink}"}},"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Year":"#Page:Cards_CreateInvoices/#Control:Year/#Value","Month":"#Page:Cards_CreateInvoices/#Control:Month/#Value","Description":"#Page:Cards_CreateInvoices/#Control:Description/#Value","TotalAmount":"#Page:Cards_CreateInvoices/#Control:TotalAmount/#Value","Currency_code":"#Page:Cards_CreateInvoices/#Control:Currency_code/#SelectedValue","InvoiceSent":"#Page:Cards_CreateInvoices/#Control:InvoiceSent/#Value"},"Target":{"EntitySet":"Invoices","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateRelatedEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_DeleteEntity.action":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_DeleteEntity.action ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Cards","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_DetailPopover.action":
/*!**************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_DetailPopover.action ***!
  \**************************************************************************************************/
/***/ ((module) => {

module.exports = {"PopoverItems":[{"Title":"Open Document","OnPress":"/ExpenseManager/Actions/ExpenseManager/Cards/Cards_OpenDocument.action"},{"Title":"Add Invoices","OnPress":"/ExpenseManager/Rules/ExpenseManager/Cards/NavToCards_CreateInvoices.js"},{"Title":"Delete","OnPress":"/ExpenseManager/Rules/ExpenseManager/Cards/Cards_DeleteConfirmation.js"}],"_Type":"Action.Type.PopoverMenu"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_OpenDocument.action":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_OpenDocument.action ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.OpenDocument","Path":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image","MimeType":"image/jpeg"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UpdateEntity.action":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UpdateEntity.action ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Cards","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"Name":"#Page:Cards_Edit/#Control:Name/#Value","ImageType":"#Page:Cards_Edit/#Control:ImageType/#Value","Limit":"#Page:Cards_Edit/#Control:Limit/#Value","Currency_code":"#Page:Cards_Edit/#Control:Currency_code/#SelectedValue","DueDay":"#Page:Cards_Edit/#Control:DueDay/#Value","ClosingDay":"#Page:Cards_Edit/#Control:ClosingDay/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UploadStream.action":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/Cards_UploadStream.action ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UploadStream","Target":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Cards","ReadLink":"{@odata.readLink}"},"Properties":{"Image":"#Control:Image/#Value"},"ShowActivityIndicator":true,"ActionResult":{"_Name":"uploadstream"},"OnSuccess":"/ExpenseManager/Actions/UploadStreamSuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UploadStreamFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Create.action":
/*!************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Create.action ***!
  \************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_CreateInvoices.action":
/*!********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_CreateInvoices.action ***!
  \********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Cards/Cards_CreateInvoices.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Detail.action":
/*!************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Detail.action ***!
  \************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Edit.action":
/*!**********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_Edit.action ***!
  \**********************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Cards/Cards_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_List.action":
/*!**********************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Cards/NavToCards_List.action ***!
  \**********************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Cards/Cards_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateEntity.action":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateEntity.action ***!
  \***********************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Name":"#Page:Categories_Create/#Control:Name/#Value","ImageType":"#Page:Categories_Create/#Control:ImageType/#Value"},"Target":{"EntitySet":"Categories","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateTransactions.action":
/*!*****************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_CreateTransactions.action ***!
  \*****************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ParentLink":{"Property":"Transactions","Target":{"EntitySet":"Categories","ReadLink":"{@odata.readLink}"}},"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Date":"#Page:Categories_CreateTransactions/#Control:Date/#Value","TotalAmount":"#Page:Categories_CreateTransactions/#Control:TotalAmount/#Value","Amount":"#Page:Categories_CreateTransactions/#Control:Amount/#Value","Currency_code":"#Page:Categories_CreateTransactions/#Control:Currency_code/#SelectedValue","TotalInstallments":"#Page:Categories_CreateTransactions/#Control:TotalInstallments/#Value","Installment":"#Page:Categories_CreateTransactions/#Control:Installment/#Value","Description":"#Page:Categories_CreateTransactions/#Control:Description/#Value"},"Target":{"EntitySet":"Transactions","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateRelatedEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_DeleteEntity.action":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_DeleteEntity.action ***!
  \***********************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Categories","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_DetailPopover.action":
/*!************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_DetailPopover.action ***!
  \************************************************************************************************************/
/***/ ((module) => {

module.exports = {"PopoverItems":[{"Title":"Open Document","OnPress":"/ExpenseManager/Actions/ExpenseManager/Categories/Categories_OpenDocument.action"},{"Title":"Add Transactions","OnPress":"/ExpenseManager/Rules/ExpenseManager/Categories/NavToCategories_CreateTransactions.js"},{"Title":"Delete","OnPress":"/ExpenseManager/Rules/ExpenseManager/Categories/Categories_DeleteConfirmation.js"}],"_Type":"Action.Type.PopoverMenu"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_OpenDocument.action":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_OpenDocument.action ***!
  \***********************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.OpenDocument","Path":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image","MimeType":"image/jpeg"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UpdateEntity.action":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UpdateEntity.action ***!
  \***********************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Categories","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"Name":"#Page:Categories_Edit/#Control:Name/#Value","ImageType":"#Page:Categories_Edit/#Control:ImageType/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/Categories_UploadStream.action ***!
  \***********************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UploadStream","Target":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Categories","ReadLink":"{@odata.readLink}"},"Properties":{"Image":"#Control:Image/#Value"},"ShowActivityIndicator":true,"ActionResult":{"_Name":"uploadstream"},"OnSuccess":"/ExpenseManager/Actions/UploadStreamSuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UploadStreamFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Create.action":
/*!**********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Create.action ***!
  \**********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_CreateTransactions.action":
/*!**********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_CreateTransactions.action ***!
  \**********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Categories/Categories_CreateTransactions.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Detail.action":
/*!**********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Detail.action ***!
  \**********************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Edit.action":
/*!********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_Edit.action ***!
  \********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Categories/Categories_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_List.action":
/*!********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Categories/NavToCategories_List.action ***!
  \********************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Categories/Categories_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_CreateEntity.action":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_CreateEntity.action ***!
  \***********************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"name":"#Page:Currencies_Create/#Control:name/#Value","descr":"#Page:Currencies_Create/#Control:descr/#Value","code":"#Page:Currencies_Create/#Control:code/#Value","symbol":"#Page:Currencies_Create/#Control:symbol/#Value","minorUnit":"#Page:Currencies_Create/#Control:minorUnit/#Value"},"Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_DeleteEntity.action":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_DeleteEntity.action ***!
  \***********************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_UpdateEntity.action":
/*!***********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/Currencies_UpdateEntity.action ***!
  \***********************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Currencies","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"name":"#Page:Currencies_Edit/#Control:name/#Value","descr":"#Page:Currencies_Edit/#Control:descr/#Value","code":"#Page:Currencies_Edit/#Control:code/#Value","symbol":"#Page:Currencies_Edit/#Control:symbol/#Value","minorUnit":"#Page:Currencies_Edit/#Control:minorUnit/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Create.action":
/*!**********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Create.action ***!
  \**********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Detail.action":
/*!**********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Detail.action ***!
  \**********************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Edit.action":
/*!********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_Edit.action ***!
  \********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_List.action":
/*!********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies/NavToCurrencies_List.action ***!
  \********************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Currencies/Currencies_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.action":
/*!***********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_CreateEntity.action ***!
  \***********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"locale":"#Page:Currencies_texts_Create/#Control:locale/#Value","name":"#Page:Currencies_texts_Create/#Control:name/#Value","descr":"#Page:Currencies_texts_Create/#Control:descr/#Value","code":"#Page:Currencies_texts_Create/#Control:code/#Value"},"Target":{"EntitySet":"Currencies_texts","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_DeleteEntity.action":
/*!***********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_DeleteEntity.action ***!
  \***********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Currencies_texts","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.action":
/*!***********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/Currencies_texts_UpdateEntity.action ***!
  \***********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Currencies_texts","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"locale":"#Page:Currencies_texts_Edit/#Control:locale/#Value","name":"#Page:Currencies_texts_Edit/#Control:name/#Value","descr":"#Page:Currencies_texts_Edit/#Control:descr/#Value","code":"#Page:Currencies_texts_Edit/#Control:code/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Create.action":
/*!**********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Create.action ***!
  \**********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Detail.action":
/*!**********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Detail.action ***!
  \**********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.action":
/*!********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_Edit.action ***!
  \********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_List.action":
/*!********************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Currencies_texts/NavToCurrencies_texts_List.action ***!
  \********************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Currencies_texts/Currencies_texts_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/Entities_CreateEntity.action":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/Entities_CreateEntity.action ***!
  \*******************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Entity":"#Page:Entities_Create/#Control:Entity/#Value","Permission":"#Page:Entities_Create/#Control:Permission/#Value"},"Target":{"EntitySet":"Entities","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/Entities_DeleteEntity.action":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/Entities_DeleteEntity.action ***!
  \*******************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Entities","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/Entities_UpdateEntity.action":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/Entities_UpdateEntity.action ***!
  \*******************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Entities","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"Entity":"#Page:Entities_Edit/#Control:Entity/#Value","Permission":"#Page:Entities_Edit/#Control:Permission/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Create.action":
/*!******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Create.action ***!
  \******************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Detail.action":
/*!******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Detail.action ***!
  \******************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Edit.action":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_Edit.action ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Entities/Entities_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_List.action":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Entities/NavToEntities_List.action ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Entities/Entities_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateEntity.action":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateEntity.action ***!
  \*******************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Year":"#Page:Invoices_Create/#Control:Year/#Value","Month":"#Page:Invoices_Create/#Control:Month/#Value","Description":"#Page:Invoices_Create/#Control:Description/#Value","TotalAmount":"#Page:Invoices_Create/#Control:TotalAmount/#Value","Currency_code":"#Page:Invoices_Create/#Control:Currency_code/#SelectedValue","InvoiceSent":"#Page:Invoices_Create/#Control:InvoiceSent/#Value"},"Target":{"EntitySet":"Invoices","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateTransactions.action":
/*!*************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_CreateTransactions.action ***!
  \*************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ParentLink":{"Property":"Transactions","Target":{"EntitySet":"Invoices","ReadLink":"{@odata.readLink}"}},"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Date":"#Page:Invoices_CreateTransactions/#Control:Date/#Value","TotalAmount":"#Page:Invoices_CreateTransactions/#Control:TotalAmount/#Value","Amount":"#Page:Invoices_CreateTransactions/#Control:Amount/#Value","Currency_code":"#Page:Invoices_CreateTransactions/#Control:Currency_code/#SelectedValue","TotalInstallments":"#Page:Invoices_CreateTransactions/#Control:TotalInstallments/#Value","Installment":"#Page:Invoices_CreateTransactions/#Control:Installment/#Value","Description":"#Page:Invoices_CreateTransactions/#Control:Description/#Value"},"Target":{"EntitySet":"Transactions","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateRelatedEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_DeleteEntity.action":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_DeleteEntity.action ***!
  \*******************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Invoices","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_DetailPopover.action":
/*!********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_DetailPopover.action ***!
  \********************************************************************************************************/
/***/ ((module) => {

module.exports = {"PopoverItems":[{"Title":"Add Transactions","OnPress":"/ExpenseManager/Rules/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.js"},{"Title":"Delete","OnPress":"/ExpenseManager/Rules/ExpenseManager/Invoices/Invoices_DeleteConfirmation.js"}],"_Type":"Action.Type.PopoverMenu"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_UpdateEntity.action":
/*!*******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/Invoices_UpdateEntity.action ***!
  \*******************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Invoices","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"Year":"#Page:Invoices_Edit/#Control:Year/#Value","Month":"#Page:Invoices_Edit/#Control:Month/#Value","Description":"#Page:Invoices_Edit/#Control:Description/#Value","TotalAmount":"#Page:Invoices_Edit/#Control:TotalAmount/#Value","Currency_code":"#Page:Invoices_Edit/#Control:Currency_code/#SelectedValue","InvoiceSent":"#Page:Invoices_Edit/#Control:InvoiceSent/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Create.action":
/*!******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Create.action ***!
  \******************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.action":
/*!******************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_CreateTransactions.action ***!
  \******************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_CreateTransactions.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Detail.action":
/*!******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Detail.action ***!
  \******************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Edit.action":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_Edit.action ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_List.action":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Invoices/NavToInvoices_List.action ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Invoices/Invoices_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateEntity.action":
/*!*************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateEntity.action ***!
  \*************************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Name":"#Page:Liabilities_Create/#Control:Name/#Value","Creditor":"#Page:Liabilities_Create/#Control:Creditor/#Value","Description":"#Page:Liabilities_Create/#Control:Description/#Value","Type":"#Page:Liabilities_Create/#Control:Type/#Value","Status":"#Page:Liabilities_Create/#Control:Status/#Value","OriginalAmount":"#Page:Liabilities_Create/#Control:OriginalAmount/#Value","CurrentBalance":"#Page:Liabilities_Create/#Control:CurrentBalance/#Value","PaidAmount":"#Page:Liabilities_Create/#Control:PaidAmount/#Value","Currency_code":"#Page:Liabilities_Create/#Control:Currency_code/#SelectedValue","InterestMode":"#Page:Liabilities_Create/#Control:InterestMode/#Value","InterestRate":"#Page:Liabilities_Create/#Control:InterestRate/#Value","Installments":"#Page:Liabilities_Create/#Control:Installments/#Value","InstallmentAmount":"#Page:Liabilities_Create/#Control:InstallmentAmount/#Value","StartDate":"#Page:Liabilities_Create/#Control:StartDate/#Value","FirstDueDate":"#Page:Liabilities_Create/#Control:FirstDueDate/#Value","EndDate":"#Page:Liabilities_Create/#Control:EndDate/#Value","LastPaymentDate":"#Page:Liabilities_Create/#Control:LastPaymentDate/#Value","ExternalReference":"#Page:Liabilities_Create/#Control:ExternalReference/#Value"},"Target":{"EntitySet":"Liabilities","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.action":
/*!****************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_CreateLiabilityTransactions.action ***!
  \****************************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ParentLink":{"Property":"Transactions","Target":{"EntitySet":"Liabilities","ReadLink":"{@odata.readLink}"}},"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Type":"#Page:Liabilities_CreateLiabilityTransactions/#Control:Type/#Value","Description":"#Page:Liabilities_CreateLiabilityTransactions/#Control:Description/#Value","MovementDate":"#Page:Liabilities_CreateLiabilityTransactions/#Control:MovementDate/#Value","Installment":"#Page:Liabilities_CreateLiabilityTransactions/#Control:Installment/#Value","TotalInstallments":"#Page:Liabilities_CreateLiabilityTransactions/#Control:TotalInstallments/#Value","Amount":"#Page:Liabilities_CreateLiabilityTransactions/#Control:Amount/#Value","Currency_code":"#Page:Liabilities_CreateLiabilityTransactions/#Control:Currency_code/#SelectedValue","BalanceAfter":"#Page:Liabilities_CreateLiabilityTransactions/#Control:BalanceAfter/#Value","IsAutomatic":"#Page:Liabilities_CreateLiabilityTransactions/#Control:IsAutomatic/#Value","ExternalReference":"#Page:Liabilities_CreateLiabilityTransactions/#Control:ExternalReference/#Value"},"Target":{"EntitySet":"LiabilityTransactions","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateRelatedEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_DeleteEntity.action":
/*!*************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_DeleteEntity.action ***!
  \*************************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Liabilities","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_DetailPopover.action":
/*!**************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_DetailPopover.action ***!
  \**************************************************************************************************************/
/***/ ((module) => {

module.exports = {"PopoverItems":[{"Title":"Add LiabilityTransactions","OnPress":"/ExpenseManager/Rules/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.js"},{"Title":"Delete","OnPress":"/ExpenseManager/Rules/ExpenseManager/Liabilities/Liabilities_DeleteConfirmation.js"}],"_Type":"Action.Type.PopoverMenu"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_UpdateEntity.action":
/*!*************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/Liabilities_UpdateEntity.action ***!
  \*************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Liabilities","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"Name":"#Page:Liabilities_Edit/#Control:Name/#Value","Creditor":"#Page:Liabilities_Edit/#Control:Creditor/#Value","Description":"#Page:Liabilities_Edit/#Control:Description/#Value","Type":"#Page:Liabilities_Edit/#Control:Type/#Value","Status":"#Page:Liabilities_Edit/#Control:Status/#Value","OriginalAmount":"#Page:Liabilities_Edit/#Control:OriginalAmount/#Value","CurrentBalance":"#Page:Liabilities_Edit/#Control:CurrentBalance/#Value","PaidAmount":"#Page:Liabilities_Edit/#Control:PaidAmount/#Value","Currency_code":"#Page:Liabilities_Edit/#Control:Currency_code/#SelectedValue","InterestMode":"#Page:Liabilities_Edit/#Control:InterestMode/#Value","InterestRate":"#Page:Liabilities_Edit/#Control:InterestRate/#Value","Installments":"#Page:Liabilities_Edit/#Control:Installments/#Value","InstallmentAmount":"#Page:Liabilities_Edit/#Control:InstallmentAmount/#Value","StartDate":"#Page:Liabilities_Edit/#Control:StartDate/#Value","FirstDueDate":"#Page:Liabilities_Edit/#Control:FirstDueDate/#Value","EndDate":"#Page:Liabilities_Edit/#Control:EndDate/#Value","LastPaymentDate":"#Page:Liabilities_Edit/#Control:LastPaymentDate/#Value","ExternalReference":"#Page:Liabilities_Edit/#Control:ExternalReference/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Create.action":
/*!************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Create.action ***!
  \************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.action":
/*!*********************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_CreateLiabilityTransactions.action ***!
  \*********************************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_CreateLiabilityTransactions.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Detail.action":
/*!************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Detail.action ***!
  \************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Edit.action":
/*!**********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_Edit.action ***!
  \**********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_List.action":
/*!**********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Liabilities/NavToLiabilities_List.action ***!
  \**********************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Liabilities/Liabilities_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.action":
/*!*********************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_CreateEntity.action ***!
  \*********************************************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Type":"#Page:LiabilityTransactions_Create/#Control:Type/#Value","Description":"#Page:LiabilityTransactions_Create/#Control:Description/#Value","MovementDate":"#Page:LiabilityTransactions_Create/#Control:MovementDate/#Value","Installment":"#Page:LiabilityTransactions_Create/#Control:Installment/#Value","TotalInstallments":"#Page:LiabilityTransactions_Create/#Control:TotalInstallments/#Value","Amount":"#Page:LiabilityTransactions_Create/#Control:Amount/#Value","Currency_code":"#Page:LiabilityTransactions_Create/#Control:Currency_code/#SelectedValue","BalanceAfter":"#Page:LiabilityTransactions_Create/#Control:BalanceAfter/#Value","IsAutomatic":"#Page:LiabilityTransactions_Create/#Control:IsAutomatic/#Value","ExternalReference":"#Page:LiabilityTransactions_Create/#Control:ExternalReference/#Value"},"Target":{"EntitySet":"LiabilityTransactions","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_DeleteEntity.action":
/*!*********************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_DeleteEntity.action ***!
  \*********************************************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"LiabilityTransactions","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.action":
/*!*********************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/LiabilityTransactions_UpdateEntity.action ***!
  \*********************************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"LiabilityTransactions","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"Type":"#Page:LiabilityTransactions_Edit/#Control:Type/#Value","Description":"#Page:LiabilityTransactions_Edit/#Control:Description/#Value","MovementDate":"#Page:LiabilityTransactions_Edit/#Control:MovementDate/#Value","Installment":"#Page:LiabilityTransactions_Edit/#Control:Installment/#Value","TotalInstallments":"#Page:LiabilityTransactions_Edit/#Control:TotalInstallments/#Value","Amount":"#Page:LiabilityTransactions_Edit/#Control:Amount/#Value","Currency_code":"#Page:LiabilityTransactions_Edit/#Control:Currency_code/#SelectedValue","BalanceAfter":"#Page:LiabilityTransactions_Edit/#Control:BalanceAfter/#Value","IsAutomatic":"#Page:LiabilityTransactions_Edit/#Control:IsAutomatic/#Value","ExternalReference":"#Page:LiabilityTransactions_Edit/#Control:ExternalReference/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Create.action":
/*!********************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Create.action ***!
  \********************************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Detail.action":
/*!********************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Detail.action ***!
  \********************************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.action":
/*!******************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_Edit.action ***!
  \******************************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_List.action":
/*!******************************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/LiabilityTransactions/NavToLiabilityTransactions_List.action ***!
  \******************************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_LiabilityTransactions/LiabilityTransactions_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Create.action":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Create.action ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCards.action":
/*!*********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCards.action ***!
  \*********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateCards.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCategories.action":
/*!**************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateCategories.action ***!
  \**************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateCategories.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateShares.action":
/*!**********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_CreateShares.action ***!
  \**********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Persons/Persons_CreateShares.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Detail.action":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Detail.action ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Edit.action":
/*!**************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_Edit.action ***!
  \**************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Persons/Persons_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_List.action":
/*!**************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/NavToPersons_List.action ***!
  \**************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Persons/Persons_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCards.action":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCards.action ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = {"ParentLink":{"Property":"Cards","Target":{"EntitySet":"Persons","ReadLink":"{@odata.readLink}"}},"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Name":"#Page:Persons_CreateCards/#Control:Name/#Value","ImageType":"#Page:Persons_CreateCards/#Control:ImageType/#Value","Limit":"#Page:Persons_CreateCards/#Control:Limit/#Value","Currency_code":"#Page:Persons_CreateCards/#Control:Currency_code/#SelectedValue","DueDay":"#Page:Persons_CreateCards/#Control:DueDay/#Value","ClosingDay":"#Page:Persons_CreateCards/#Control:ClosingDay/#Value"},"Target":{"EntitySet":"Cards","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateRelatedEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCategories.action":
/*!*********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateCategories.action ***!
  \*********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ParentLink":{"Property":"Categories","Target":{"EntitySet":"Persons","ReadLink":"{@odata.readLink}"}},"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Name":"#Page:Persons_CreateCategories/#Control:Name/#Value","ImageType":"#Page:Persons_CreateCategories/#Control:ImageType/#Value"},"Target":{"EntitySet":"Categories","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateRelatedEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateEntity.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateEntity.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Name":"#Page:Persons_Create/#Control:Name/#Value","ImageType":"#Page:Persons_Create/#Control:ImageType/#Value","Income":"#Page:Persons_Create/#Control:Income/#Value","Currency_code":"#Page:Persons_Create/#Control:Currency_code/#SelectedValue","Email":"#Page:Persons_Create/#Control:Email/#Value","Phone":"#Page:Persons_Create/#Control:Phone/#Value","ExpenseTarget":"#Page:Persons_Create/#Control:ExpenseTarget/#Value"},"Target":{"EntitySet":"Persons","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateShares.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_CreateShares.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"ParentLink":{"Property":"Shares","Target":{"EntitySet":"Persons","ReadLink":"{@odata.readLink}"}},"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"User":"#Page:Persons_CreateShares/#Control:User/#Value"},"Target":{"EntitySet":"Shares","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateRelatedEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_DeleteEntity.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_DeleteEntity.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Persons","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_DetailPopover.action":
/*!******************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_DetailPopover.action ***!
  \******************************************************************************************************/
/***/ ((module) => {

module.exports = {"PopoverItems":[{"Title":"Open Document","OnPress":"/ExpenseManager/Actions/ExpenseManager/Persons/Persons_OpenDocument.action"},{"Title":"Add Shares","OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateShares.js"},{"Title":"Add Categories","OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateCategories.js"},{"Title":"Add Cards","OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/NavToPersons_CreateCards.js"},{"Title":"Delete","OnPress":"/ExpenseManager/Rules/ExpenseManager/Persons/Persons_DeleteConfirmation.js"}],"_Type":"Action.Type.PopoverMenu"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_OpenDocument.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_OpenDocument.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.OpenDocument","Path":"/ExpenseManager/Services/ExpenseManager.service/{@odata.readLink}/Image","MimeType":"image/jpeg"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_UpdateEntity.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_UpdateEntity.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Persons","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"Name":"#Page:Persons_Edit/#Control:Name/#Value","ImageType":"#Page:Persons_Edit/#Control:ImageType/#Value","Income":"#Page:Persons_Edit/#Control:Income/#Value","Currency_code":"#Page:Persons_Edit/#Control:Currency_code/#SelectedValue","Email":"#Page:Persons_Edit/#Control:Email/#Value","Phone":"#Page:Persons_Edit/#Control:Phone/#Value","ExpenseTarget":"#Page:Persons_Edit/#Control:ExpenseTarget/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_UploadStream.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Persons/Persons_UploadStream.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UploadStream","Target":{"Service":"/ExpenseManager/Services/ExpenseManager.service","EntitySet":"Persons","ReadLink":"{@odata.readLink}"},"Properties":{"Image":"#Control:Image/#Value"},"ShowActivityIndicator":true,"ActionResult":{"_Name":"uploadstream"},"OnSuccess":"/ExpenseManager/Actions/UploadStreamSuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UploadStreamFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Service/InitializeOnline.action":
/*!*************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Service/InitializeOnline.action ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = {"Service":"/ExpenseManager/Services/ExpenseManager.service","_Type":"Action.Type.ODataService.Initialize","ShowActivityIndicator":true,"OnFailure":"/ExpenseManager/Actions/ExpenseManager/Service/InitializeOnlineFailureMessage.action","ActionResult":{"_Name":"init"}}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Service/InitializeOnlineFailureMessage.action":
/*!***************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Service/InitializeOnlineFailureMessage.action ***!
  \***************************************************************************************************************/
/***/ ((module) => {

module.exports = {"Message":"Failed to initialize application data service - {#ActionResults:init/error}","Duration":7,"Animated":true,"_Type":"Action.Type.BannerMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Create.action":
/*!**************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Create.action ***!
  \**************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_CreateEntities.action":
/*!**********************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_CreateEntities.action ***!
  \**********************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Shares/Shares_CreateEntities.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Detail.action":
/*!**************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Detail.action ***!
  \**************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Edit.action":
/*!************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_Edit.action ***!
  \************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Shares/Shares_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_List.action":
/*!************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/NavToShares_List.action ***!
  \************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Shares/Shares_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntities.action":
/*!*****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntities.action ***!
  \*****************************************************************************************************/
/***/ ((module) => {

module.exports = {"ParentLink":{"Property":"Entities","Target":{"EntitySet":"Shares","ReadLink":"{@odata.readLink}"}},"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Entity":"#Page:Shares_CreateEntities/#Control:Entity/#Value","Permission":"#Page:Shares_CreateEntities/#Control:Permission/#Value"},"Target":{"EntitySet":"Entities","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateRelatedEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntity.action":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_CreateEntity.action ***!
  \***************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"User":"#Page:Shares_Create/#Control:User/#Value"},"Target":{"EntitySet":"Shares","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_DeleteEntity.action":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_DeleteEntity.action ***!
  \***************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Shares","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_DetailPopover.action":
/*!****************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_DetailPopover.action ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = {"PopoverItems":[{"Title":"Add Entities","OnPress":"/ExpenseManager/Rules/ExpenseManager/Shares/NavToShares_CreateEntities.js"},{"Title":"Delete","OnPress":"/ExpenseManager/Rules/ExpenseManager/Shares/Shares_DeleteConfirmation.js"}],"_Type":"Action.Type.PopoverMenu"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_UpdateEntity.action":
/*!***************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Shares/Shares_UpdateEntity.action ***!
  \***************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Shares","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"User":"#Page:Shares_Edit/#Control:User/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Create.action":
/*!**************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Create.action ***!
  \**************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Create.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Detail.action":
/*!**************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Detail.action ***!
  \**************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Detail.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Edit.action":
/*!************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_Edit.action ***!
  \************************************************************************************************************/
/***/ ((module) => {

module.exports = {"ModalPageFullscreen":false,"ModalPage":true,"PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_Edit.page","_Type":"Action.Type.Navigation"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_List.action":
/*!************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/NavToTransactions_List.action ***!
  \************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","PageToOpen":"/ExpenseManager/Pages/ExpenseManager_Transactions/Transactions_List.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_CreateEntity.action":
/*!***************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_CreateEntity.action ***!
  \***************************************************************************************************************/
/***/ ((module) => {

module.exports = {"CreateLinks":[],"OnFailure":"/ExpenseManager/Actions/CreateEntityFailureMessage.action","OnSuccess":"/ExpenseManager/Actions/CreateEntitySuccessMessage.action","Properties":{"Date":"#Page:Transactions_Create/#Control:Date/#Value","TotalAmount":"#Page:Transactions_Create/#Control:TotalAmount/#Value","Amount":"#Page:Transactions_Create/#Control:Amount/#Value","Currency_code":"#Page:Transactions_Create/#Control:Currency_code/#SelectedValue","TotalInstallments":"#Page:Transactions_Create/#Control:TotalInstallments/#Value","Installment":"#Page:Transactions_Create/#Control:Installment/#Value","Description":"#Page:Transactions_Create/#Control:Description/#Value"},"Target":{"EntitySet":"Transactions","Service":"/ExpenseManager/Services/ExpenseManager.service"},"ActionResult":{"_Name":"create"},"_Type":"Action.Type.ODataService.CreateEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_DeleteEntity.action":
/*!***************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_DeleteEntity.action ***!
  \***************************************************************************************************************/
/***/ ((module) => {

module.exports = {"Target":{"EntitySet":"Transactions","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"OnSuccess":"/ExpenseManager/Actions/DeleteEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/DeleteEntityFailureMessage.action","ActionResult":{"_Name":"delete"},"_Type":"Action.Type.ODataService.DeleteEntity"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_UpdateEntity.action":
/*!***************************************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/ExpenseManager/Transactions/Transactions_UpdateEntity.action ***!
  \***************************************************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ODataService.UpdateEntity","Target":{"EntitySet":"Transactions","Service":"/ExpenseManager/Services/ExpenseManager.service","ReadLink":"{@odata.readLink}"},"Properties":{"Date":"#Page:Transactions_Edit/#Control:Date/#Value","TotalAmount":"#Page:Transactions_Edit/#Control:TotalAmount/#Value","Amount":"#Page:Transactions_Edit/#Control:Amount/#Value","Currency_code":"#Page:Transactions_Edit/#Control:Currency_code/#SelectedValue","TotalInstallments":"#Page:Transactions_Edit/#Control:TotalInstallments/#Value","Installment":"#Page:Transactions_Edit/#Control:Installment/#Value","Description":"#Page:Transactions_Edit/#Control:Description/#Value"},"UpdateLinks":[],"ActionResult":{"_Name":"update"},"OnSuccess":"/ExpenseManager/Actions/UpdateEntitySuccessMessage.action","OnFailure":"/ExpenseManager/Actions/UpdateEntityFailureMessage.action"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/GenericBannerMessage.action":
/*!******************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/GenericBannerMessage.action ***!
  \******************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.BannerMessage","ActionResult":{"_Name":"GenericBannerMessage"},"Message":"Message"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/GenericMessageBox.action":
/*!***************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/GenericMessageBox.action ***!
  \***************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Message","ActionResult":{"_Name":"GenericMessageBox"},"Message":"Message","OKCaption":"OK"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/GenericNavigation.action":
/*!***************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/GenericNavigation.action ***!
  \***************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.Navigation","ActionResult":{"_Name":"GenericNavigation"},"PageToOpen":"/ExpenseManager/Pages/Main.page"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/GenericToastMessage.action":
/*!*****************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/GenericToastMessage.action ***!
  \*****************************************************************************/
/***/ ((module) => {

module.exports = {"_Type":"Action.Type.ToastMessage","ActionResult":{"_Name":"GenericToastMessage"},"Message":"Message"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Logging/LogUploadFailure.action":
/*!**********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Logging/LogUploadFailure.action ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = {"Message":"Uploading log file failed with error: {#ActionResults:UploadLog/error}","OKCaption":"OK","Title":"Log Upload Failed","_Type":"Action.Type.Message"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Logging/LogUploadSuccessful.action":
/*!*************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Logging/LogUploadSuccessful.action ***!
  \*************************************************************************************/
/***/ ((module) => {

module.exports = {"Animated":true,"Duration":3,"IsIconHidden":false,"MaxNumberOfLines":1,"Message":"Log File Uploaded","_Type":"Action.Type.ToastMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Logging/UploadLog.action":
/*!***************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Logging/UploadLog.action ***!
  \***************************************************************************/
/***/ ((module) => {

module.exports = {"ActionResult":{"_Name":"UploadLog"},"ActivityIndicatorText":"Uploading...","OnFailure":"/ExpenseManager/Actions/Logging/LogUploadFailure.action","OnSuccess":"/ExpenseManager/Actions/Logging/LogUploadSuccessful.action","ShowActivityIndicator":false,"_Type":"Action.Type.Logger.Upload"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/Logging/UploadLogProgress.action":
/*!***********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/Logging/UploadLogProgress.action ***!
  \***********************************************************************************/
/***/ ((module) => {

module.exports = {"Animated":true,"CompletionMessage":"Logs Uploaded","CompletionTimeout":2,"Message":"Uploading Log Files...","OnSuccess":"/ExpenseManager/Actions/Logging/UploadLog.action","_Type":"Action.Type.ProgressBanner"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/UpdateEntityFailureMessage.action":
/*!************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/UpdateEntityFailureMessage.action ***!
  \************************************************************************************/
/***/ ((module) => {

module.exports = {"Message":"Update entity failure - {#ActionResults:update/error}","Duration":7,"Animated":true,"_Type":"Action.Type.BannerMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/UpdateEntitySuccessMessage.action":
/*!************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/UpdateEntitySuccessMessage.action ***!
  \************************************************************************************/
/***/ ((module) => {

module.exports = {"Animated":true,"Duration":2,"Message":"Entity updated","Icon":"","IsIconHidden":false,"NumberOfLines":2,"OnSuccess":"/ExpenseManager/Actions/CloseModalPage_Complete.action","_Type":"Action.Type.ToastMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/UploadStreamFailureMessage.action":
/*!************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/UploadStreamFailureMessage.action ***!
  \************************************************************************************/
/***/ ((module) => {

module.exports = {"Message":"Upload stream failure - {#ActionResults:uploadstream/error}","Duration":7,"Animated":true,"_Type":"Action.Type.BannerMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Actions/UploadStreamSuccessMessage.action":
/*!************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Actions/UploadStreamSuccessMessage.action ***!
  \************************************************************************************/
/***/ ((module) => {

module.exports = {"Animated":true,"Duration":2,"Message":"Stream uploaded","Icon":"","IsIconHidden":false,"NumberOfLines":2,"OnSuccess":"/ExpenseManager/Actions/CloseModalPage_Complete.action","_Type":"Action.Type.ToastMessage"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Globals/Application/AppDefinition_Version.global":
/*!*******************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Globals/Application/AppDefinition_Version.global ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = {"Value":"1.0.0","_Type":"String"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Globals/Application/ApplicationName.global":
/*!*************************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Globals/Application/ApplicationName.global ***!
  \*************************************************************************************/
/***/ ((module) => {

module.exports = {"Value":"MDK App","_Type":"String"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Globals/Application/SupportEmail.global":
/*!**********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Globals/Application/SupportEmail.global ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = {"Value":"support@mycompany.com","_Type":"String"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Globals/Application/SupportPhone.global":
/*!**********************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Globals/Application/SupportPhone.global ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = {"Value":"1-800-677-7271","_Type":"String"}

/***/ }),

/***/ "./build.definitions/ExpenseManager/Services/ExpenseManager.service":
/*!**************************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Services/ExpenseManager.service ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = {"DestinationName":"../service/ExpenseManager/","OfflineEnabled":false,"LanguageURLParam":"","OnlineOptions":{},"OfflineOptions":{},"PathSuffix":"","SourceType":"Cloud","ServiceUrl":""}

/***/ }),

/***/ "./build.definitions/version.mdkbundlerversion":
/*!*****************************************************!*\
  !*** ./build.definitions/version.mdkbundlerversion ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = "1.1\n";

/***/ }),

/***/ "./build.definitions/ExpenseManager/Styles/Styles.json":
/*!*************************************************************!*\
  !*** ./build.definitions/ExpenseManager/Styles/Styles.json ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = {};

/***/ }),

/***/ "./build.definitions/ExpenseManager/jsconfig.json":
/*!********************************************************!*\
  !*** ./build.definitions/ExpenseManager/jsconfig.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"include":["Rules/**/*",".typings/**/*"]}');

/***/ }),

/***/ "./build.definitions/tsconfig.json":
/*!*****************************************!*\
  !*** ./build.definitions/tsconfig.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"compilerOptions":{"module":"esnext","target":"es2019","moduleResolution":"node","lib":["esnext","dom"],"experimentalDecorators":true,"emitDecoratorMetadata":true,"removeComments":true,"inlineSourceMap":true,"noEmitOnError":false,"noEmitHelpers":true,"baseUrl":".","plugins":[{"transform":"@nativescript/webpack/dist/transformers/NativeClass","type":"raw"}]},"exclude":["node_modules"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./build.definitions/application-index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=bundle.js.map