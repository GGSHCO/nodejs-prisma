// const express = require('express')
// const cors = require('cors')
// const bodyParser = require('body-parser')
// const { stateCodeDetails, reportCreation, getData, deleteData } = require('../syfReports/js/allRcmInvoice') // RCM report
// const { onloadData, insertVendor, saveRcm, updateRcm, rcm_getUvData, rcm_deleteDataLid } = require('../syfForms/js/rcmInvoice') // RCM form
// const { getAssignmentNature, getAllMilestones, deleteMilestoneList, milestonesbulkUpload } = require('../syfReports/js/allMilestones') // Milestone Report
// const { getAllAssignmentOptions, updateMilestone, milestoneUvData, saveMilestones, delSingleMilestone } = require('../syfForms/js/milestones') // Milestone Form
// const { getAssignmentNatureData, deleteAssignmentNature, assignmentBulkUpload } = require('../syfReports/js/allAssignmentNature') // Assignment Nature Report
// const { getVendorData, getLeadData, getCustomerData, deleteContact, deleteLead } = require('../projectManagement/js/contacts') // Contacts Report
// const { getOnLoadDataLead, getUvDataLead, saveLead, updateLead, saveNewContact } = require('../syfForms/js/leadContact') // lead Contacts form
// const { getUvDataClient, saveClient, updateClient } = require('../syfForms/js/clientContact') // client Contacts form
// const { getContracts, getLeads, getProposals } = require('../projectManagement/js/proposals') // Proposal Report
// const { getOngoingContractData } = require('../projectManagement/js/ongoingContracts') // ongoing Contract Report
// const { getAllAssignmentNature, deleteAllProjects, duplicateContract, getContractData, contractCreation, updateBlobUrl } = require('../projectManagement/js/pendingContracts') // pending Contract Report
// const { onloadDataContracts, fetchContract, milestoneSubForm, milestoneMaster, saveContract, deleteContractAssignment, deleteContractMilestone } = require('../syfForms/js/contracts') // Contract Form
// const { getAllProjects } = require('../projectManagement/js/projects') // Project Report
// const { getAllInvoices, updateInvoice, pendingToSent } = require('../projectManagement/js/invoice') // Invoice Report
// const { getGgshCoa, tbTable, saveMapping, updateMapping, coaExcelUpload, coaLedgerData } = require('../financials/js/coaMapping') //  Financials coa mapping
// const { getCoaOptions, fetchTemplates, insertTransaction, updateTransaction, balanceSheet, updateCoaMapped } = require('../audit/js/fs_template') //  Financials fs_template
// const { misTable, pendingCoaCount, voucherData } = require('../audit/js/mis') //  Financials mis
// const { coa_financialView, createCoa, deleteCoa, updateCoaMaster, updateCoaMasterSeq, bulkInsertCoaMapped } = require('../audit/js/fs_design') //  Financials design
// const { getEndpoints} = require('../endpoints')








// const app = express();
// const port = 3000;

// app.use(cors({ origin: 'http://desktop-dssus3g:82' }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json())




// // rcm_report start

// app.get("/api/test", async (req, res) => {
//     res.json({ "message": "success" })
// })


// // return endpoints

// app.get("/api/getEndpoints", async (req, res) => {
//     let result=await getEndpoints()
//     res.json(result)
// })



// app.post("/api/rcm_stateCodeDetails", async (req, res) => {
//     let company = req.body;
//     let result = await stateCodeDetails(company);
//     res.json(result)
// })

// app.post("/api/rcm_reportCreation", async (req, res) => {
//     let data = req.body;
//     result = await reportCreation(data);
//     res.json(result)
// })

// app.post("/api/rcm_getData", async (req, res) => {
//     let data = req.body;
//     let result = await getData(data);
//     res.json(result)
// })

// app.post("/api/rcm_deleteData", async (req, res) => {
//     let data = req.body;
//     let result = await deleteData(data);
//     res.json(result)
// })

// // rcm_report start

// // rcm_form start

// app.post("/api/rcm_onloadData", async (req, res) => {
//     let data = req.body;
//     result = await onloadData(data);
//     res.json(result)
// })

// app.post("/api/rcm_insertvendor", async (req, res) => {
//     let data = req.body;
//     result = await insertVendor(data);
//     res.json(result)
// })

// app.post("/api/rcm_save", async (req, res) => {
//     let data = req.body;
//     result = await saveRcm(data);
//     res.json(result)
// })

// app.post("/api/rcm_update", async (req, res) => {
//     let data = req.body;
//     result = await updateRcm(data);
//     res.json(result)
// })

// app.post("/api/rcm_getUvData", async (req, res) => {
//     let data = req.body;
//     result = await rcm_getUvData(data);
//     res.json(result)
// })

// app.post("/api/rcm_deleteDataLid", async (req, res) => {
//     let data = req.body;
//     result = await rcm_deleteDataLid(data);
//     res.json(result)
// })

// // rcm_form end

// // milestone report start

// app.get("/api/pm_getAssignmentNature", async (req, res) => {
//     let result = await getAssignmentNature();
//     res.json(result)
// })

// app.get("/api/pm_getmilestones", async (req, res) => {
//     let result = await getAllMilestones();
//     res.json(result)
// })

// app.post("/api/pm_delMilestones", async (req, res) => {
//     let data = req.body;
//     result = await deleteMilestoneList(data);
//     res.json(result)
// })

// app.post("/api/pm_milestoneBulkUpload", async (req, res) => {
//     let data = req.body;
//     result = await milestonesbulkUpload(data);
//     res.json(result)
// })


// // milestone report end

// // milestone form start

// app.get("/api/pm_getAssignmentNatureOptions", async (req, res) => {
//     let result = await getAllAssignmentOptions();
//     res.json(result)
// })

// app.post("/api/pm_milestoneUpdate", async (req, res) => {
//     let data = req.body;
//     let result = await updateMilestone(data);
//     res.json(result)
// })

// app.post("/api/pm_getMilestoneUvData", async (req, res) => {
//     let data = req.body;
//     let result = await milestoneUvData(data);
//     res.json(result)
// })

// app.post("/api/pm_saveMilestones", async (req, res) => {
//     let data = req.body;
//     let result = await saveMilestones(data);
//     res.json(result)
// })

// app.post("/api/pm_delSingleMilestone", async (req, res) => {
//     let data = req.body;
//     let result = await delSingleMilestone(data);
//     res.json(result)
// })

// // milestone form end

// // assignmentnature report start

// app.get("/api/pm_getAssignmentData", async (req, res) => {
//     let result = await getAssignmentNatureData();
//     res.json(result)
// })

// app.post("/api/pm_deleteAssignment", async (req, res) => {
//     let data = req.body;
//     let result = await deleteAssignmentNature(data);
//     res.json(result)
// })

// app.post("/api/pm_assignmentBulkUpload", async (req, res) => {
//     let data = req.body;
//     result = await assignmentBulkUpload(data);
//     res.json(result)
// })

// // assignmentnature report end

// // assignmentnature Form start

// app.post("/api/pm_getAssignmentUvData", async (req, res) => {
//     let data = req.body;
//     let result = await getAssignmentUvData(data);
//     res.json(result)
// })

// app.post("/api/pm_saveAssignment", async (req, res) => {
//     let data = req.body;
//     result = await saveAssignment(data);
//     res.json(result)
// })

// app.post("/api/pm_updateAssignment", async (req, res) => {
//     let data = req.body;
//     result = await updateAssignment(data);
//     res.json(result)
// })

// // assignmentnature form end

// // contact report start

// app.post("/api/pm_getLeadsData", async (req, res) => {
//     let data = req.body;
//     result = await getLeadData(data);
//     res.json(result)
// })

// app.post("/api/pm_getVendorData", async (req, res) => {
//     let data = req.body;
//     result = await getVendorData(data);
//     res.json(result)
// })

// app.post("/api/pm_getCustomerData", async (req, res) => {
//     let data = req.body;
//     result = await getCustomerData(data);
//     res.json(result)
// })

// app.post("/api/pm_deleteContact", async (req, res) => {
//     let data = req.body;
//     result = await deleteContact(data);
//     res.json(result)
// })

// app.post("/api/pm_deleteLead", async (req, res) => {
//     let data = req.body;
//     result = await deleteLead(data);
//     res.json(result)
// })


// // contact report end

// // lead contact form start

// app.post("/api/pm_getOnloadDataLead", async (req, res) => {
//     let data = req.body;
//     result = await getOnLoadDataLead(data);
//     res.json(result)
// })

// app.post("/api/pm_getUvDataLead", async (req, res) => {
//     let data = req.body;
//     result = await getUvDataLead(data);
//     res.json(result)
// })

// app.post("/api/pm_saveLead", async (req, res) => {
//     let data = req.body;
//     result = await saveLead(data);
//     res.json(result)
// })

// app.post("/api/pm_updateLead", async (req, res) => {
//     let data = req.body;
//     result = await updateLead(data);
//     res.json(result)
// })

// app.post("/api/pm_saveNewContact", async (req, res) => {
//     let data = req.body;
//     result = await saveNewContact(data);
//     res.json(result)
// })

// // lead contact form end

// // client contact form start

// app.post("/api/pm_getUvDataClient", async (req, res) => {
//     let data = req.body;
//     result = await getUvDataClient(data);
//     res.json(result)
// })

// app.post("/api/pm_saveClient", async (req, res) => {
//     let data = req.body;
//     result = await saveClient(data);
//     res.json(result)
// })

// app.post("/api/pm_updateClient", async (req, res) => {
//     let data = req.body;
//     result = await updateClient(data);
//     res.json(result)
// })

// //  client contact form end

// // proposal report start

// app.post("/api/pm_getLeads", async (req, res) => {
//     let data = req.body;
//     result = await getLeads(data);
//     res.json(result)
// })

// app.post("/api/pm_getContracts", async (req, res) => {
//     let data = req.body;
//     result = await getContracts(data);
//     res.json(result)
// })

// app.post("/api/pm_getProposals", async (req, res) => {
//     let data = req.body;
//     result = await getProposals(data);
//     res.json(result)
// })

// // proposal report end


// // pending contract report start

// app.get("/api/pm_getAssignments", async (req, res) => {
//     let data = req.body;
//     result = await getAllAssignmentNature(data);
//     res.json(result)
// })

// app.post("/api/pm_deleteAllProjects", async (req, res) => {
//     let data = req.body;
//     result = await deleteAllProjects(data);
//     res.json(result)
// })

// app.post("/api/pm_duplicateContract", async (req, res) => {
//     let data = req.body;
//     result = await duplicateContract(data);
//     res.json(result)
// })

// app.post("/api/pm_getContractData", async (req, res) => {
//     let data = req.body;
//     result = await getContractData(data);
//     res.json(result)
// })

// app.post("/api/pm_createContract", async (req, res) => {
//     let data = req.body;
//     result = await contractCreation(data);
//     res.json(result)
// })

// app.post("/api/pm_updateBlobUrl", async (req, res) => {
//     let data = req.body;
//     result = await updateBlobUrl(data);
//     res.json(result)
// })


// // pending contract report end

// // ongoing contract report start

// app.post("/api/pm_getOngoingContractData", async (req, res) => {
//     let data = req.body;
//     result = await getOngoingContractData(data);
//     res.json(result)
// })

// // ongoing contract report end


// // contract form start

// app.post("/api/pm_onloadDataContracts", async (req, res) => {
//     let data = req.body;
//     result = await onloadDataContracts(data);
//     res.json(result)
// })

// app.post("/api/pm_fetchContract", async (req, res) => {
//     let data = req.body;
//     result = await fetchContract(data);
//     res.json(result)
// })

// app.post("/api/pm_milestoneMaster", async (req, res) => {
//     let data = req.body;
//     result = await milestoneMaster(data);
//     res.json(result)
// })

// app.post("/api/pm_milestoneSubForm", async (req, res) => {
//     let data = req.body;
//     result = await milestoneSubForm(data);
//     res.json(result)
// })

// app.post("/api/pm_saveContract", async (req, res) => {
//     let data = req.body;
//     result = await saveContract(data);
//     res.json(result)
// })

// app.post("/api/pm_deleteContractAssignment", async (req, res) => {
//     let data = req.body;
//     result = await deleteContractAssignment(data);
//     res.json(result)
// })

// app.post("/api/pm_deleteContractMilestone", async (req, res) => {
//     let data = req.body;
//     result = await deleteContractMilestone(data);
//     res.json(result)
// })

// // contract form end

// //  project report start

// app.get("/api/pm_getAllProjects", async (req, res) => {
//     let data = req.body;
//     result = await getAllProjects(data);
//     res.json(result)
// })

// //  project report end


// //  invoice report start

// app.get("/api/pm_getAllInvoices", async (req, res) => {
//     let data = req.body;
//     result = await getAllInvoices(data);
//     res.json(result)
// })

// app.post("/api/pm_updateinvoice", async (req, res) => {
//     let data = req.body;
//     result = await updateInvoice(data);
//     res.json(result)
// })

// app.post("/api/pm_pendingToSent", async (req, res) => {
//     let data = req.body;
//     result = await pendingToSent(data);
//     res.json(result)
// })

// //  invoice report end

// // financials coa mapping start

// app.post("/api/financial_ggshCoa", async (req, res) => {
//     let data = req.body;
//     result = await getGgshCoa(data);
//     res.json(result)
// })

// app.post("/api/financial_tbTable", async (req, res) => {
//     let data = req.body;
//     result = await tbTable(data);
//     res.json(result)
// })

// app.post("/api/financial_saveMapping", async (req, res) => {
//     let data = req.body;
//     result = await saveMapping(data);
//     res.json(result)
// })

// app.post("/api/financial_updateMapping", async (req, res) => {
//     let data = req.body;
//     result = await updateMapping(data);
//     res.json(result)
// })


// app.post("/api/financial_coaExcelUpload", async (req, res) => {
//     let data = req.body;
//     result = await coaExcelUpload(data);
//     res.json(result)
// })


// app.post("/api/financial_coaLedgerData", async (req, res) => {
//     let data = req.body;
//     result = await coaLedgerData(data);
//     res.json(result)
// })


// //  financials coa mapping end

// // financials fs template start

// app.post("/api/financial_getCoaOptions", async (req, res) => {
//     let data = req.body;
//     result = await getCoaOptions(data);
//     res.json(result)
// })

// app.post("/api/financial_fetchTemplate", async (req, res) => {
//     let data = req.body;
//     result = await fetchTemplates(data);
//     res.json(result)
// })

// app.post("/api/financial_insertTemplate", async (req, res) => {
//     let data = req.body;
//     result = await insertTransaction(data);
//     res.json(result)
// })

// app.post("/api/financial_updateTemplate", async (req, res) => {
//     let data = req.body;
//     result = await updateTransaction(data);
//     res.json(result)
// })

// app.post("/api/financial_balanceSheet", async (req, res) => {
//     let data = req.body;
//     result = await balanceSheet(data);
//     res.json(result)
// })

// app.post("/api/financial_updateCoaMapped", async (req, res) => {
//     let data = req.body;
//     result = await updateCoaMapped(data);
//     res.json(result)
// })

// // financials fs template end

// // financials mis start

// app.post("/api/financial_misTable", async (req, res) => {
//     let data = req.body;
//     result = await misTable(data);
//     res.json(result)
// })

// app.post("/api/financial_voucherData", async (req, res) => {
//     let data = req.body;
//     result = await voucherData(data);
//     res.json(result)
// })

// app.post("/api/financial_pendingCoacount", async (req, res) => {
//     let data = req.body;
//     result = await pendingCoaCount(data);
//     res.json(result)
// })

// // fiancials mis end

// // financials design start

// app.post("/api/financial_coaView", async (req, res) => {
//     let data = req.body;
//     result = await coa_financialView(data);
//     res.json(result)
// })

// app.post("/api/financial_createCoa", async (req, res) => {
//     let data = req.body;
//     result = await createCoa(data);
//     res.json(result)
// })

// app.post("/api/financial_deleteCoa", async (req, res) => {
//     let data = req.body;
//     result = await deleteCoa(data);
//     res.json(result)
// })

// app.post("/api/financial_updateCoaMaster", async (req, res) => {
//     let data = req.body;
//     result = await updateCoaMaster(data);
//     res.json(result)
// })


// app.post("/api/financial_updateCoaMasterSeq", async (req, res) => {
//     let data = req.body;
//     result = await updateCoaMasterSeq(data);
//     res.json(result)
// })


// app.post("/api/financial_bulkInsertCoaMapped", async (req, res) => {
//     let data = req.body;
//     result = await bulkInsertCoaMapped(data);
//     res.json(result)
// })

// module.exports = app
// financials design end







// app.listen(port, "0.0.0.0", () => {
//     console.log(`Server is running on http://0.0.0.0:${port}`)
// })