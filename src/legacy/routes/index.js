var express = require("express");
// const bodyParser = require('body-parser')
// const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");
var fileUpload = require("express-fileupload");
const Razorpay = require('razorpay');
const crypto = require('crypto');
require("dotenv").config();
var app = express();
// app.use(cors());
// app.use(express.json());
// // app.use(bodyParser.json({ limit: '100mb' }));
// // app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
// app.use(express.json({ limit: "100mb" }));
// app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(fileUpload());

// const application = express();
// application.use(cors());
// application.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
// application.use(bodyParser.json({ limit: '100mb' }));

// app.use(express.json({ limit: '100mb' })); // Increase as needed
// app.use(express.urlencoded({ limit: '100mb', extended: true }));

// ZOHO Credentials

// const ZOHO_AUTH_URL = `https://accounts.zoho.in/oauth/v2/auth`;
// const ZOHO_TOKEN_URL = `https://accounts.zoho.in/oauth/v2/token`;
// const API_BASE_URL = "https://www.zohoapis.in/books/v3";

// const CLIENT_ID = "1000.MNPXUV2WZX8LI6GQ4YOHODP9I7ZJYJ";
// const CLIENT_SECRET = "189d8fe970be9f55cdd53823cf29ec48bc2e3c3384";
// const REDIRECT_URI = "http://desktop-dssus3g:3000/auth/callback";
const ZOHO_AUTH_URL = `${process.env.ZOHO_BASE_URL}/oauth/v2/auth`;
const ZOHO_TOKEN_URL = `${process.env.ZOHO_BASE_URL}/oauth/v2/token`;
const API_BASE_URL = process.env.API_BASE_URL;
const REDIRECT_URI = process.env.ZOHO_REDIRECT_URI;

let CLIENT_ID = process.env.ZOHO_CLIENT_ID;
let CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// let formUrl = `https://speeduiggsh.azurewebsites.net`
// let formUrl = `https://syftestenv.speedyourfin.in` // Dev Cloud
// let formUrl = `https://speedyourfin.ai`
// let formUrl=`http://desktop-dssus3g:225`
let formUrl = `http://desktop-dssus3g:82`;

const {
  dateTimeGeneration,
  exeQuery,
  fetchTable,
  queryGet,
  getZBSecret,
  getUserModules,
  bulkInsert,
  changeInviteStatus,
  getSchema,
  getAcceptedInvites,
  changeSyncStatus,
  setMainJson,
  fetchUserInfo,
  getAcbkDetails,
  getCompanyDetails,
  getRoles,
  getCountry,
  sendMail,
  getUserRoles,
  workPaper,
} = require("../config");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require("@azure/storage-blob");
const {
  stateCodeDetails,
  reportCreation,
  getData,
  deleteData,
  bulkReportCreation,
} = require("../syfReports/js/allRcmInvoice"); // RCM report
const {
  onloadData,
  insertVendor,
  saveRcm,
  updateRcm,
  rcm_getUvData,
  rcm_deleteDataLid,
} = require("../syfForms/js/rcmInvoice"); // RCM form
const {
  getAssignmentNature,
  getAllMilestones,
  deleteMilestoneList,
  milestonesbulkUpload,
} = require("../syfReports/js/allMilestones"); // Milestone Report
const {
  getAllAssignmentOptions,
  updateMilestone,
  milestoneUvData,
  saveMilestones,
  delSingleMilestone,
} = require("../syfForms/js/milestones"); // Milestone Form
const {
  getAssignmentNatureData,
  deleteAssignmentNature,
  assignmentBulkUpload,
} = require("../syfReports/js/allAssignmentNature"); // Assignment Nature Report
const {
  getAssignmentUvData,
  saveAssignment,
  updateAssignment,
  getInvitedUserNames,
} = require("../syfForms/js/assignmentNature"); // assignment nature form

const {
  getAssignmentCriteria,addAssignmentService,updateAssignmentService,deleteAssignmentCriteria,
  deleteCritDoc,
} = require("../syfReports/js/assignmentCriteria"); // Assignment Criteria Report  

const {
  zohoNames,
  insertIntoGstNotices,
  updateGstNotice,
} = require("../syfForms/js/gstTrackerForm"); // gst notice tracker form

const {
  getNoticeTrackerData,
  updateStatusNoticeTracker,
  updateContractIdNoticeTracker,
  updateTimeExtensionFieldNoticeTracker,
} = require("../syfReports/js/gstTracker"); // gst notice tracker form

const {
  getVendorData,
  getLeadData,
  getCustomerData,
  deleteContact,
  deleteLead,
} = require("../projectManagement/js/contacts"); // Contacts Report
const {
  getOnLoadDataLead,
  getUvDataLead,
  saveLead,
  updateLead,
  saveNewContact,
} = require("../syfForms/js/leadContact"); // lead Contacts form
const {
  getUvDataClient,
  saveClient,
  updateClient,
} = require("../syfForms/js/clientContact"); // client Contacts form
const {
  getContracts,
  getLeads,
  getProposals,
  getPendingLeads,
  changeStatusPending,
} = require("../projectManagement/js/proposals"); // Proposal Report
const {
  getOngoingContractData,
} = require("../projectManagement/js/ongoingContracts"); // ongoing Contract Report
const {
  getAllAssignmentNature,
  deleteAllProjects,
  duplicateContract,
  updateOngoing,
  updateContract,
  getContractData,
  contractCreation,
  updateBlobUrl,
  timesheetAlert,
  cancelContracts,
} = require("../projectManagement/js/pendingContracts"); // pending Contract Report
const {
  onloadDataContracts,
  fetchContract,
  milestoneSubForm,
  milestoneMaster,
  saveContract,
  deleteContractAssignment,
  deleteContractMilestone,
  getMaxContId,
  getMaxAssignmentId,
  getMaxMilestoneId,
  changeAmount,
} = require("../syfForms/js/contracts"); // Contract Form
const {
  getAllProjects,
  updateProjects,
} = require("../projectManagement/js/projects"); // Project Report
const {
  getAllInvoices,
  updateInvoice,
  pendingToSent,
} = require("../projectManagement/js/invoice"); // Invoice Report
const {
  getGgshCoa,
  tbTable,
  saveMapping,
  updateMapping,
  coaExcelUpload,
  coaLedgerData,
} = require("../financials/js/coaMapping"); //  Financials coa mapping
const {
  getCoaOptions,
  fetchTemplates,
  insertTransaction,
  updateTransaction,
  balanceSheet,
  updateCoaMapped,
} = require("../audit/js/fs_template"); //  Financials fs_template
const {
  fetchCompanyGroup,
  misTable,
  adv_misTable,
  pendingCoaCount,
  voucherData,
} = require("../audit/js/mis"); //  Financials mis
const {
  coa_financialView,
  createCoa,
  deleteCoa,
  updateCoaMaster,
  updateCoaMasterSeq,
  bulkInsertCoaMapped,
  resetCompanyCoa,
} = require("../audit/js/fs_design"); //  Financials design
const { getEndpoints } = require("../endpoints");
const {
  getAllTimesheet,
  deleteTimesheetReport,
} = require("../timesheet/js/allTimesheet"); //  Timesheet weekly report
const {
  getProjects,
  getDetails,
  getAllObservations,
  getDayRecords,
  choosenweek,
  getDepartment,
  saveData,
  updateData,
  saveDayReport,
} = require("../timesheet/js/timesheet"); //  Timesheet Form
const { fetchDayReportFilter } = require("../timesheet/js/dayReport"); //  Timesheet daily report
const {
  fetchCoaGroups,
  getDistinctOptions,
  bulkUpdate,
  filterCoa,
  updateMutipleRow,
  updateSingleRow,
  updateInputField,
} = require("../t2zMigration/js/coa"); //  T2Z coa
const { t2z_contacts } = require("../t2zMigration/js/contact"); //  T2Z contact
const {
  onloadDataTb,
  fetchToDate,
  filterTb,
} = require("../t2zMigration/js/tb"); //  T2Z tb
const { tableData, getMaxAmount } = require("../t2zMigration/js/table"); //  T2Z tb
const {
  onloadVoucherType,
  updateVoucher,
} = require("../t2zMigration/js/voucherType"); //  T2Z voucher type
const {
  getCompanies,
  addNew,
  updateGroup,
  updateCompany,
  updateGroupName,
} = require("../settings/js/addGroup"); //  Settings addGroup
const { displayRole, updateRole, saveRole } = require("../syfForms/js/roles");//  form Roles


const { getExsistingUserList, services_userAdd_addNewUser,services_userAdd_addToPivot} = require("../syfForms/js/services_userAdd"); //  form Roles


const { displayAllRoles, deleteRoles } = require("../syfReports/js/allRoles"); //  report Roles
const {
  createAccount,
  emailVerify,
  setExpiryDate,
  getVerifyStatus,
  deleteVerifyMail,
} = require("../syf_signup/js/signup"); //  signup
const {
  updateLoginStatus,
  checkUser,
  checkEmail,
} = require("../login/js/login"); //  login
const { getAllInvites, deleteAccess } = require("../syfReports/js/manageUsers"); //  user access report
const {
  saveAccess,
  updateAccess,
  displayAccess,
  roleBasedModules,
  getInvitedUser,
} = require("../syfForms/js/manageUsers"); //  user access form
const { changePassword } = require("../login/js/forgot"); //  forgot password form
const { createAccountNew } = require("../syf_signup1/js/signup"); //  forgot password form
const {
  getUserPlanAndModules,
  updatePlan,
} = require("../settings/js/myPlanPage"); //  forgot password form
const {
  updateTable,
  getPlanOptions,
  basicsFetch,
  accountsFetch,
  branchFetch,
  tanFetch,
  gstFetch,
  emptyValueInsertUserId,
  emptyValueInsertAcbk,
  updateACBKTable,
  updateCompanyName,
  deleteRow,
} = require("../settings/js/companyPage"); //  company settings edit
const { getAllRecoJson, deleteReco } = require("../syfReports/js/reco"); //  reco json report

const {services_userList_zohoData,services_userList_zohocontact} = require("../syfReports/js/services_userList"); //


const { getRecoData, saveRecoJson } = require("../syfForms/js/createReco"); //  reco json form
const {
  getRecoTableData,
  completeReco,
  completeBulkReco,
  rejectReco,
  removeLineItem,
  deleteTableData,
  manualMatching,
} = require("../reco/js/dynamicReco"); // dynamic reco page
const {
  getSegments,
  saveSegment,
  updateCoaSegment,
} = require("../financials/js/segmentMapping"); //  Financials segment mapping
const { updateProfile } = require("../settings/js/users-profile"); //settings user-profile
const {
  fetchModules,
  insertEmptyModule,
  deleteModule,
  updateModule,
  updateModuleSubcategory,
} = require("../admin/js/modules"); //  admin modules page
const {
  fetchAllModules,
  getAllPlans,
  insertEmptyPlan,
  deletePlan,
  updatePlanName,
} = require("../admin/js/plans"); //  admin plans page
const { saveSop, updateSop, getSop } = require("../SOP/js/sop"); //  sop form
const { getAllSopData, deleteSop } = require("../SOP/js/allSop"); //  sop report
const { getDataById } = require("../SOP/js/dashboard"); //  sop dashboard
const {
  fetchProjects,
  markProjectCompletion,
  fetchMilestones,
  changeStatus,
  updateMilestoneStatus,
  saveTasks,
  addNewTasks,
  updatePersonResponsible,
  myworksUpdateColumns,
  deleteMyWorkTasks,
  getTeamProgress,
  statusUpdate,
  getTableDataPettyTask,
  updatePettyTaskStatus,
  updatePettyTaskComment,
  getProjectNames,
  getMilestonesCount,
  updateAllObservationObs,
  getProjectDataObservation,
  updateObservationStatus,
  updateObservationComment,
  updateObservationremarks,
  cancelProject,
  reverseProject,
  pettyTaskStatus,
  totalUsersCount,
  getObservationType,
  getPresalesvalidation,
  saveMilestonePsvalidation,
  allContractsValidationChange,
} = require("../dashboards/js/observationDashboard"); // PM Observation dashboard
const {
  onloadTemplates,
  getTabCounts,
  getTableData,
  updateWorkflowstage,
  updateInputs,
} = require("../formTemplates/js/reportWorkflow"); // template workflows
const {
  fetchFormOptions,
  deleteRowData,
  getUvSubFormData,
  saveFormData,
  getEmployeeOptions,
  getUvFormData,
  updateFormData,
  saveSubform,
} = require("../formTemplates/js/forms"); // form workflows
const {
  fetchKpiMaster,
  updateKpiMaster,
  insertKpiMaster,
  deleteKpiMaster,
} = require("../myspace/js/kpiMaster"); // PM Observation dashboard
const { saveClassification } = require("../syfForms/js/classification"); // classification form
const {
  showClassification,
  deleteClassification,
} = require("../syfReports/js/classification"); //classification report
const {
  showCommitment,
  delCommitment,
} = require("../financials/js/commitmentRegister"); // commitment register report
const {
  fetchRawCoa,
  getUserNames,
  saveCommitment,
  getCommitment,
  updateCommitment,
} = require("../financials/js/commitmentForm"); // commitment register report
const {
  showChecklist,
  deleteChecklist,
} = require("../syfReports/js/checklist"); // checklist report
const {
  fetchclassification,
  fetchChecklistData,
  saveChecklist,
} = require("../syfForms/js/checklist");
const {
  getBillingAddress,
  getTotalAmount,
  getProjectData,
  getAllProjectData,
  updatePaidInvoice,
  updateSentInvoice,
} = require("../projectManagement/js/template"); // invoice template
const {
  onloadTemplate,
  fetchContractAssignmentNature,
  fetchMilestoneSubform,
  getDisplayTermsConditions,
  getContractStatusQuery,
  insertTemplateTransaction,
  updateTemplateTransaction,
  getChatfromProposalTemplate,
  updateChatProposal,
  updateProposalStatus,
  getAssignmentNatureName,
  getClientDetails,
  getContactMaster,
  checkEmailClients

} = require("../projectManagement/js/proposalTemplate");
const {
  getDropdownList,
  deleteDropdown,
} = require("../syfReports/js/dropdown"); // dropdown report
const {
  viewDropdown,
  saveDropdown,
  updateDropdown,
  getAllDropdownNames,
} = require("../syfForms/js/dropdown"); // dropdown form
const {
  checkOpeningBalance,
  getAllExtTabs,
  extTableData,
  checkData,
  deleteExtData,
  deleteBatch,
  fetchPartyNames,
  extUpdatetags,
} = require("../extDocs/js/extDocs"); // extDocs
const {
  manageData,
  insertExtData,
  getContactsPartyNames,
  getCoaOptionsDocs,
  updateExtData,
  extDeleteData,
} = require("../analystDeveloper/js/manageExtDocs"); // analytics - manage ext docs
const { getAllReco } = require("../analystDeveloper/js/recoBots"); // AnalystDeveloper - RecoBots
const {
  insertExtTab,
  updateExtTab,
  viewExtTab,
  getMasterExtTabs,
} = require("../analystDeveloper/js/addExtDocs.js"); // Analyst developer - extdocs form
const {
  getExtTabsData,
  deleteExtTabsData,
} = require("../analystDeveloper/js/allextDocs.js"); // Analyst developer - extdocs report
const {
  getAllRecords,
  deleteRecords,
} = require("../analystDeveloper/js/allRecords.js"); // Analyst developer - records report
const {
  addRecords,
  getRecordData,
} = require("../analystDeveloper/js/addRecords.js"); // Analyst developer - records form
const { getRecordsGroupBy } = require("../finance/js/record.js"); // Finance - records page
const { getGstin, getGstr2bData } = require("../gst/js/gstr2b.js"); // GST - gstr2b page
const {
  getGlobalReport,
  getLidGlobalReport,
  getGlobalTemplate,
  getTemplateTransaction,
  getTransactionCompany,
  getSpeedFileDrive,
  getSpeedFileDriveCompany,
  getSpeedDriveData,
  getSpeedFileCheck,
  insertFileRecord,
  insertRoleFileRecord,
  updateFileRecord,
  getFinancialYear,
  getMonth,
} = require("../speedDrive/js/globalTemplate.js"); //speeddrive-Globaluser page
const {
  getTransactionCompanyMaster,
  getGlobalId,
  getTransactionId,
  updateGlobalMaster,
  insertGlobalMaster,
  insertTransactionMaster,
  updateTransactionMaster,
  getPathtransactionReportMaster,
} = require("../documentation/js/documentEditor.js"); //documetation module

const {
  getProjectDataObservationJob,
  jobcard_fetchProjects
} = require("../jobCard/js/jobCard.js"); //Jobcard module

const{ getObservstionDetail, getMilestoneDetails } = require("../portal/js/projectdeck.js");

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRY_TIME = process.env.JWT_EXPIRY;

const accountName = "ggshstorageaccount";
const accountKey =
  "0IXQ76pgBXL7aUwsh42/wCSLAfFYNoZhx5n4Gy4XyiSohH0+2pizCUhZ9kNeSMWRz3KvM6OgDjpW+AStau5gMA=="; // pHYFfJ9pTdEZrsd3ffVPMp3U5F8vUhkK6Q9fnK3cspCTubWZ9gHJFsc9j+qV7RBzSJJUgbZvLtOX+AStL1jNuQ==
const containerName = "ggshstorageblobcontainer";
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);
const expiresOn = new Date();
expiresOn.setFullYear(expiresOn.getFullYear() + 1);

//  jwt token authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
  console.log(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Store user info in request
    // Prevent caching of sensitive user-related data
    // app.set('etag', false);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Etag", Date.now().toString());

    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

app.get("/api/test", async (req, res) => {
  try {
    let  result = await fetchTable(
      `select * from tbl_tallyprime_trialbalances where companyid='1000010181'`
    );
    // let  result = await exeQuery(`delete from kpimaster where dimension='dimension_2025-3-8 12:27:21'`)
    //
    // let  result = await exeQuery(`delete from allobservations where contractcode='109100001001044'`)
    // let  result = await exeQuery(`delete from allInvoices where contractid='109100001001044'`)
    // let  result = await exeQuery(`delete from allProjects where contractid='109100001001044'`)
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
  // await getKeys()
});

app.get("/api/performanceTest", async (req, res) => {
  try {
    let data = req.body.data;
    console.log(data);
    let company = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
    let  result = await fetchTable(
      `select * from tbl_tallyprime_vouchers where companyid='${company.companyID}'`
    );
    console.log(result);
    let jsonData = JSON.stringify(result);
    let encryptResult = Buffer.from(jsonData).toString("base64");
    res.json({ data: encryptResult });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
  // await getKeys()
});

// app.get("/api", async (req, res) => {
//     try {
//         let  result = await getZBSecret(['zb-clientid', 'zb-clientsecret', 'zb-refreshtoken'])
//         CLIENT_ID = result['zb-clientid'];
//         CLIENT_SECRET = result['zb-clientsecret'];
//         REFRESH_TOKEN = result['zb-refreshtoken'];
//         res.json({'test':'test'})
//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error', error: error });
//     }
//     // await getKeys()
// })

app.post("/api/createOrder", async (req, res) => {
    const { amount, currency = "INR", receipt } = req.body;
    const options = {
        amount: Math.round(amount * 100), 
        currency,
        receipt: receipt || `receipt_order_${new Date().getTime()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).send("Error creating order");
    }
});
app.post("/api/verifyPayment", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // This is your Razorpay Key Secret, loaded from environment variables
    const key_secret = process.env.RAZORPAY_KEY_SECRET; 

    // This is the crucial verification step
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        console.log("Payment verification successful!");
        // IMPORTANT: This is where you update your database
        // e.g., mark the return filing as "Paid"
        res.json({ status: 'success', orderId: razorpay_order_id });
    } else {
        console.error("Payment verification failed!");
        res.status(400).json({ status: 'failure' });
    }
});


app.post("/api/uploadDocumentationfile", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No file uploaded.");
    }
    const file = req.files.file;
    const originalname = file.name;
    const teamName = req.body.teamName;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // const blobName = `academyVideo-${new Date().getTime()}-${teamName}-${originalname}`;
    const blobName = `${originalname}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(file.data, file.data.length, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype || "application/octet-stream",
      },
    });

    const blobSAS = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"),
        startsOn: new Date(),
        expiresOn: expiresOn,
      },
      sharedKeyCredential
    ).toString();

    const blobUrl = `${blockBlobClient.url}?${blobSAS}`;
    res.status(200).json({
      message: "File uploaded successfully.",
      originalname: originalname,
      teamName: teamName,
      blobUrl: blobUrl,
    });
  } catch (error) {
    res.status(500).send("Error uploading file.");
  }
});

// return endpoints

app.get("/api/getEndpoints", async (req, res) => {
  let  result = await getEndpoints();
  res.json(result);
});

// rcm_report start

app.post("/api/rcm_stateCodeDetails", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await stateCodeDetails(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/rcm_reportCreation", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await reportCreation(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/rcm_bulkreportCreation", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let zipBuffer = await bulkReportCreation(params);
  res.set({
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="RCM.zip"',
  });
  res.send(zipBuffer);
});

app.post("/api/rcm_getData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/rcm_deleteData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// rcm_report start

// rcm_form start

app.post("/api/rcm_onloadData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await onloadData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/rcm_insertvendor", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await insertVendor(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/rcm_save", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveRcm(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/rcm_update", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateRcm(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/rcm_getUvData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await rcm_getUvData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/rcm_deleteDataLid", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await rcm_deleteDataLid(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// rcm_form end

// milestone report start

app.post("/api/pm_getAssignmentNature", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAssignmentNature(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getmilestones", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAllMilestones(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_delMilestones", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteMilestoneList(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_milestoneBulkUpload", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await milestonesbulkUpload(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// milestone report end

// milestone form start

app.post("/api/pm_getAssignmentNatureOptions", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAllAssignmentOptions(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_milestoneUpdate", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateMilestone(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getMilestoneUvData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await milestoneUvData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_saveMilestones", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveMilestones(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_delSingleMilestone", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await delSingleMilestone(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// milestone form end

// assignmentnature report start

app.post("/api/pm_getAssignmentData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAssignmentNatureData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_deleteAssignment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteAssignmentNature(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_assignmentBulkUpload", async (req, res) => {
  let data = req.body;
  let  result = await assignmentBulkUpload(data);
  res.json(result);
});

// assignmentnature report end

// assignmentnature Form start

app.post("/api/pm_getAssignmentUvData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAssignmentUvData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_saveAssignment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveAssignment(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_updateAssignment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateAssignment(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getInvitedUserNames", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getInvitedUserNames(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// assignmentnature form end

// assignment criteria start

app.post("/api/pm_getAssigmentCriteria", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAssignmentCriteria(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_addAssignmentService", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await addAssignmentService(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_updateAssignmentService", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateAssignmentService(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_deleteCritDoc", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteCritDoc(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_deleteAssignmentCriteria", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteAssignmentCriteria(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// assignment criteria end

// contact report start

// app.post("/api/pm_getLeadsData", async (req, res) => {
//   let data = req.body;
//   let  result = await getLeadData(data);
//   res.json(result);
// });

app.post("/api/pm_getLeadsData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getLeadData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getVendorData", async (req, res) => {
  let data = req.body;
  let  result = await getVendorData(data);
  res.json(result);
});

app.post("/api/pm_getCustomerData", async (req, res) => {
  let data = req.body;
  let  result = await getCustomerData(data);
  res.json(result);
});

app.post("/api/pm_deleteContact", async (req, res) => {
  let data = req.body;
  let  result = await deleteContact(data);
  res.json(result);
});

app.post("/api/pm_deleteLead", async (req, res) => {
  let data = req.body;
  let  result = await deleteLead(data);
  res.json(result);
});

// contact report end

// lead contact form start

app.post("/api/pm_getOnloadDataLead", async (req, res) => {
  let data = req.body;
  let  result = await getOnLoadDataLead(data);
  res.json(result);
});

app.post("/api/pm_getUvDataLead", async (req, res) => {
  let data = req.body;
  let  result = await getUvDataLead(data);
  res.json(result);
});

app.post("/api/pm_saveLead", async (req, res) => {
  let data = req.body;
  let  result = await saveLead(data);
  res.json(result);
});

app.post("/api/pm_updateLead", async (req, res) => {
  let data = req.body;
  let  result = await updateLead(data);
  res.json(result);
});

app.post("/api/pm_saveNewContact", async (req, res) => {
  let data = req.body;
  let  result = await saveNewContact(data);
  res.json(result);
});

// lead contact form end

// client contact form start

app.post("/api/pm_getUvDataClient", async (req, res) => {
  let data = req.body;
  let  result = await getUvDataClient(data);
  res.json(result);
});

app.post("/api/pm_saveClient", async (req, res) => {
  let data = req.body;
  let  result = await saveClient(data);
  res.json(result);
});

app.post("/api/pm_updateClient", async (req, res) => {
  let data = req.body;
  let  result = await updateClient(data);
  res.json(result);
});

//  client contact form end

// proposal report start

// app.post("/api/pm_getLeads", async (req, res) => {
//   let data = req.body;
//   let  result = await getLeads(data);
//   res.json(result);
// });

app.post("/api/pm_getLeads", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getLeads(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getContracts", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getContracts(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getProposals", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getProposals(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getPendingLeads", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  console.log(params);
  let  result = await getPendingLeads(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/contractStatusChange", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  console.log(params);
  let  result = await changeStatusPending(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// proposal report end

// pending contract report start

app.get("/api/pm_getAssignments", async (req, res) => {
  let data = req.body;
  let  result = await getAllAssignmentNature(data);
  res.json(result);
});

app.post("/api/pm_deleteAllProjects", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteAllProjects(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_duplicateContract", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await duplicateContract(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_updateOngoing", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateOngoing(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_updateContract", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateContract(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_timesheetAlert", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await timesheetAlert(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_cancelContracts", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await cancelContracts(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getContractData", async (req, res) => {
  let data = req.body;
  let  result = await getContractData(data);
  res.json(result);
});

app.post("/api/pm_createContract", async (req, res) => {
  let data = req.body;
  let  result = await contractCreation(data);
  res.json(result);
});

app.post("/api/pm_updateBlobUrl", async (req, res) => {
  let data = req.body;
  let  result = await updateBlobUrl(data);
  res.json(result);
});

// pending contract report end

// ongoing contract report start

app.post("/api/pm_getOngoingContractData", async (req, res) => {
  let data = req.body;
  let  result = await getOngoingContractData(data);
  res.json(result);
});

// ongoing contract report end

// contract form start

app.post("/api/pm_onloadDataContracts", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await onloadDataContracts(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_changeAmount", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await changeAmount(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_fetchContract", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await fetchContract(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_milestoneMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await milestoneMaster(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_milestoneSubForm", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await milestoneSubForm(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_saveContract", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveContract(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_deleteContractAssignment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteContractAssignment(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_deleteContractMilestone", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteContractMilestone(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getMaxContId", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getMaxContId(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getMaxAssignmentId", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getMaxAssignmentId(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getMaxMilestoneId", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getMaxMilestoneId(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// contract form end

//  project report start

app.post("/api/pm_getAllProjects", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAllProjects(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_updateProjects", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateProjects(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  project report end

//  invoice report start

app.post("/api/pm_getAllInvoices", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAllInvoices(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_updateinvoice", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateInvoice(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_pendingToSent", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await pendingToSent(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  invoice report end

// financials coa mapping start

app.post("/api/financial_ggshCoa", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getGgshCoa(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_tbTable", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await tbTable(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_saveMapping", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveMapping(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_updateMapping", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateMapping(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_coaExcelUpload", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await coaExcelUpload(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_coaLedgerData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await coaLedgerData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  financials coa mapping end

// financials fs template start

app.post("/api/financial_getCoaOptions", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getCoaOptions(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_fetchTemplate", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await fetchTemplates(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_insertTemplate", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await insertTransaction(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_updateTemplate", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateTransaction(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_balanceSheet", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await balanceSheet(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_updateCoaMapped", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateCoaMapped(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// financials fs template end

// financials mis start
app.post("/api/fetchCompanyGroup", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await fetchCompanyGroup(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_misTable", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  params.advFilter.startYear != ""
    ? (result = await adv_misTable(params))
    : (result = await misTable(params));
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_voucherData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await voucherData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_pendingCoacount", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await pendingCoaCount(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// fiancials mis end

// financials design start

app.post("/api/financial_coaView", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await coa_financialView(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_createCoa", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await createCoa(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_deleteCoa", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteCoa(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_updateCoaMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateCoaMaster(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_updateCoaMasterSeq", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateCoaMasterSeq(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_bulkInsertCoaMapped", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await bulkInsertCoaMapped(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_resetCompanyCoa", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await resetCompanyCoa(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// financials design end

// timesheet weekly report start

app.post("/api/timesheet_getAllData", async (req, res) => {
  let data = req.body;
  let  result = await getAllTimesheet(data);
  res.json(result);
});

app.post("/api/timesheet_delReportdata", async (req, res) => {
  let data = req.body;
  let  result = await deleteTimesheetReport(data);
  res.json(result);
});

// timesheet weekly report end

// timesheet form start

app.post("/api/timesheet_getProjects", async (req, res) => {
  let data = req.body;
  let  result = await getProjects(data);
  res.json(result);
});

app.post("/api/timesheet_getDetails", async (req, res) => {
  let data = req.body;
  let  result = await getDetails(data);
  res.json(result);
});

app.post("/api/timesheet_getAllObservations", async (req, res) => {
  let data = req.body;
  let  result = await getAllObservations(data);
  res.json(result);
});

app.post("/api/timesheet_getDayRecords", async (req, res) => {
  let data = req.body;
  let  result = await getDayRecords(data);
  res.json(result);
});

app.post("/api/timesheet_choosenweek", async (req, res) => {
  let data = req.body;
  let  result = await choosenweek(data);
  res.json(result);
});

app.post("/api/timesheet_getDepartment", async (req, res) => {
  let data = req.body;
  let  result = await getDepartment(data);
  res.json(result);
});

app.post("/api/timesheet_saveData", async (req, res) => {
  let data = req.body;
  let  result = await saveData(data);
  res.json(result);
});

app.post("/api/timesheet_updateData", async (req, res) => {
  let data = req.body;
  let  result = await updateData(data);
  res.json(result);
});

app.post("/api/timesheet_saveDayReport", async (req, res) => {
  let data = req.body;
  let  result = await saveDayReport(data);
  res.json(result);
});

// timesheet form end

// timesheet daily report start

app.post("/api/timesheet_fetchDayReportFilter", async (req, res) => {
  let data = req.body;
  let  result = await fetchDayReportFilter(data);
  res.json(result);
});

// timesheet daily report end

// t2z coa start

app.post("/api/t2z_fetchCoaGroups", async (req, res) => {
  let data = req.body;
  let  result = await fetchCoaGroups(data);
  res.json(result);
});

app.post("/api/t2z_getDistinctOptions", async (req, res) => {
  let data = req.body;
  let  result = await getDistinctOptions(data);
  res.json(result);
});

app.post("/api/t2z_bulkUpdate", async (req, res) => {
  let data = req.body;
  let  result = await bulkUpdate(data);
  res.json(result);
});

app.post("/api/t2z_filterCoa", async (req, res) => {
  let data = req.body;
  let  result = await filterCoa(data);
  res.json(result);
});

app.post("/api/t2z_updateMutipleRow", async (req, res) => {
  let data = req.body;
  let  result = await updateMutipleRow(data);
  res.json(result);
});

app.post("/api/t2z_updateSingleRow", async (req, res) => {
  let data = req.body;
  let  result = await updateSingleRow(data);
  res.json(result);
});

app.post("/api/t2z_updateInputField", async (req, res) => {
  let data = req.body;
  let  result = await updateInputField(data);
  res.json(result);
});

// t2z coa end

// t2z contact start

app.post("/api/t2z_contacts", async (req, res) => {
  let data = req.body;
  let  result = await t2z_contacts(data);
  res.json(result);
});

// t2z contact end

// T2Z common table js start

app.post("/api/t2z_tableData", async (req, res) => {
  let data = req.body;
  let  result = await tableData(data);
  res.json(result);
});

app.post("/api/t2z_getMaxAmount", async (req, res) => {
  let data = req.body;
  let  result = await getMaxAmount(data);
  res.json(result);
});

// T2Z common table js end

// t2z tb report start

app.post("/api/t2z_onloadDataTb", async (req, res) => {
  let data = req.body;
  let  result = await onloadDataTb(data);
  res.json(result);
});

app.post("/api/t2z_fetchToDate", async (req, res) => {
  let data = req.body;
  let  result = await fetchToDate(data);
  res.json(result);
});

app.post("/api/t2z_filterTb", async (req, res) => {
  let data = req.body;
  let  result = await filterTb(data);
  res.json(result);
});

// t2z tb report end

// t2z tb voucher type start

app.post("/api/t2z_onloadvoucherType", async (req, res) => {
  let data = req.body;
  let  result = await onloadVoucherType(data);
  res.json(result);
});

app.post("/api/t2z_updateVoucher", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateVoucher(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// t2z tb voucher type end

// settings add group start

app.post("/api/settings_getCompanies", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getCompanies(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_addNew", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await addNew(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_updateGroup", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateGroup(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_updateCompany", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateCompany(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_updateGroupName", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateGroupName(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// settings add group end

// form - roles start

app.post("/api/settings_displayRole", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await displayRole(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_saveRole", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveRole(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_updateRole", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateRole(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// form - roles end
//services_userAdd.js //

app.post("/api/services_userAdd_GetExsistingUserList", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getExsistingUserList(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/services_userAdd_addNewUser", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await services_userAdd_addNewUser(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/services_userAdd_addToPivot", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await services_userAdd_addToPivot(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// 
//  report - roles start

app.post("/api/settings_displayAllRoles", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await displayAllRoles(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_deleteRoles", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteRoles(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// report - roles end

//  sign up start new

app.post("/api/window_createAccountNew", async (req, res) => {
  let data = req.body.data;
  // let params = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
  let params = data;
  let  result = await createAccountNew(params);
  let jsonData = JSON.stringify(result);
  // let encryptResult = Buffer.from(jsonData).toString('base64');
  res.json(jsonData);
});

//  sign up start end

//  sign up start

app.post("/api/window_createAccount", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await createAccount(params);
  let jsonData = JSON.stringify(result);
  // let encryptResult = Buffer.from(jsonData).toString('base64');
  res.json({ data: jsonData });
});

app.post("/api/window_emailVerify", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await emailVerify(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_setExpiry", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await setExpiryDate(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_checkStatus", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getVerifyStatus(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_deleteVerifymail", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteVerifyMail(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// sign up end

// login start

app.post("/api/window_checkUser", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await checkUser(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_loginStatus", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateLoginStatus(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_checkEmail", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await checkEmail(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// login end

// manage users report start

app.post("/api/window_getInvites", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAllInvites(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_deleteAccess", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteAccess(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// manage users report end

// manage users form start

app.post("/api/window_saveAccess", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveAccess(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_updateAccess", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateAccess(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_displayAccess", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await displayAccess(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_roleBasedModules", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await roleBasedModules(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_getInvitedUser", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getInvitedUser(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// manage users form end

// forgot password start

app.post("/api/window_changePassword", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await changePassword(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// forgot password end

// Zoho Sync Start
let userId;
app.get("/auth/zoho", (req, res) => {
  let id = req.query.uv;
  userId = Buffer.from(id, "base64").toString("utf-8");
  const authURL = `${ZOHO_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=ZohoBooks.fullaccess.all&redirect_uri=${REDIRECT_URI}&access_type=offline&state=random_string&prompt=consent`;
  res.redirect(authURL);
});

let userTokens = {};
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Authorization code missing");
  }

  try {
    const tokenResponse = await axios.post(
      ZOHO_TOKEN_URL,
      querystring.stringify({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
      })
    );

    const { access_token, refresh_token } = tokenResponse.data;
    userTokens = { access_token, refresh_token };
    console.log("Refresh Token - " + userTokens.refresh_token);
    let response = await zohoOrganization(userTokens);
    let enc_org = Buffer.from(JSON.stringify(response)).toString("base64");
    res.redirect(`${formUrl}/admin/myorganization.html?q1=${enc_org}`);
  } catch (error) {
    console.error("Error fetching access token:", error);
    res.status(500).send("Failed to authenticate with Zoho");
  }
});

async function zohoOrganization(userToken) {
  try {
    const response = await axios.get(`${API_BASE_URL}/organizations`, {
      headers: { Authorization: `Bearer ${userToken.access_token}` },
    });
    let organization = response.data;

    let organizationList = [];
    for (let company of organization.organizations) {
      organizationList.push({
        label: company.name,
        value: company.organization_id,
      });
    }
    return {
      userToken: userToken,
      organizationList: organizationList,
    };
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return "error";
  }
}

app.post("/api/syncZbOrganization", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await syncZohoOrganization(params);
  console.log(result);

  if (result.message == "success") {
    await exeQuery(
      `update syf_usermaster set ZBStatus='Connected' where lid='${result.userId}'`
    );
  }
  let uv = Buffer.from(result.message).toString("base64");
  res.redirect(`${formUrl}/index.html?result=${uv}`);

  // let jsonData = JSON.stringify(result)
  // let encryptResult = Buffer.from(jsonData).toString('base64');
  // res.json({ data: encryptResult })
});
async function syncZohoOrganization(params) {
  try {
    let userToken = params.userToken;
    let organizationList = params.organizationList;
    let userId = params.userId;

    const response = await axios.get(`${API_BASE_URL}/organizations`, {
      headers: { Authorization: `Bearer ${userToken.access_token}` },
    });
    let zbOrganization = response.data.organizations;

    let organization = [];
    zbOrganization.map((item) => {
      organizationList.map((userOrg) => {
        if (item.organization_id == userOrg) {
          organization.push(item);
        }
      });
    });

    let addedTime = dateTimeGeneration(new Date());
    let count = 0;
    let user = await fetchTable(
      `select * from syf_usermaster where lid='${userId}'`
    );
    let userInfo = user[0];
    let organizationIds = [];
    let organizationRes = await fetchTable(
      `select * from syf_companyacbkmaster where email='${userInfo.email}'`
    );
    if (organizationRes.length > 0) {
      organizationRes.map((item) => {
        organizationIds.push(item.organizationid);
      });
    }
    for (let company of organization) {
      let groupid = `${userInfo.lid}` + `01`;
      let domain = "com";
      if (company.version == "india") {
        domain = "in";
      }
      if (organizationIds.includes(company.organization_id)) {
        let existingCompany = organizationRes.find(
          (item) => item.organizationid === company.organization_id
        );
        let updateacbkQuery = `update syf_companyacbkmaster set companyname='${company.name}',namepersoftware='${company.name}',
                domain='${domain}' where organizationid='${company.organization_id}'`;
        let updateacbk = Buffer.from(updateacbkQuery).toString("base64");
        let updateCompanyQuery = `update syf_companymaster set companyname='${company.name}' where lid='${existingCompany.companyid}'`;
        let updateCompany = Buffer.from(updateCompanyQuery).toString("base64");
        let queryList = [updateacbk, updateCompany];
        let res = await queryGet(queryList);
        if (res.responseType == "SUCCESS") {
          count++;
        }
      } else {
        let companyData = await exeQuery(`insert into syf_companymaster
                    (userid,username,email,companyname,addeduser,addedtime,groupid,groupname,subscription,financialstartmonth,dateformat) 
                    OUTPUT Inserted.lid values ('${userInfo.lid}','${
          userInfo.name
        }','${userInfo.email}','${company.name}',
                    '${userInfo.name}','${addedTime}','${BigInt(
          groupid
        )}','Default Group','Free Trial','04','FY')`);
        if (companyData.responseType == "SUCCESS") {
          let companyId = companyData.responseData.table[0].lid;
          let res =
            await exeQuery(`insert into syf_companyacbkmaster (companyid,companyname,namepersoftware,organizationid,domain,email,addedtime,addeduser,software,clientid,clientsecret,scope,refreshtoken) values
                            ('${companyId}','${company.name}','${company.name}','${company.organization_id}','${domain}','${userInfo.email}','${addedTime}','${userInfo.name}','ZOHO Books','${CLIENT_ID}','${CLIENT_SECRET}','ZohoBooks.fullaccess.all','${userToken.refresh_token}')`);
          if (res.responseType == "SUCCESS") {
            count++;
          }
        }
      }
    }
    if (count == organization.length) {
      return {
        message: "success",
        userId: userId,
      };
    } else {
      return "error org";
    }
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return "error";
  }
}

// app.post("/zoho/organizations", async (req, res) => {
//     let data = req.body;
//     let userToken = data.userToken
//     // const userToken = userTokens["user1"];
//     // const userToken = {
//     //     'access_token': '1000.683470a496637dd8b16b94d42ef534f4.ad597b075ae9d97a2a9296d7f927aff4',
//     // };
//     // let localData = localStorage.getItem("data")
//     // console.log(localData)
//     // const userToken = localData.userTokens["user1"];
//     if (!userToken) return res.status(401).send("User not authenticated");

//     try {
//         const response = await axios.get(`${API_BASE_URL}/organizations`, {
//             headers: { Authorization: `Bearer ${userToken.access_token}` }
//         });
//         res.json(response.data);
//     } catch (error) {
//         console.error("Error fetching organizations:", error.response.data);
//         res.status(500).send("Failed to fetch organizations");
//     }
// });

app.get("/auth/refresh", async (req, res) => {
  // let REFRESH_TOKEN = req.body.refreshToken
  let id = req.query.uv;
  userId = Buffer.from(id, "base64").toString("utf-8");
  let getRefreshToken = await fetchTable(
    `select top 1 refreshtoken from syf_companyacbkmaster where companyid in(select lid from syf_companymaster where userid='${userId}')`
  );
  let REFRESH_TOKEN = getRefreshToken[0].refreshtoken;

  if (!REFRESH_TOKEN) return res.status(401).send("User not authenticated");

  try {
    const tokenResponse = await axios.post(
      ZOHO_TOKEN_URL,
      querystring.stringify({
        grant_type: "refresh_token",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
      })
    );

    let access_token = tokenResponse.data.access_token;
    let userToken = {
      refresh_token: REFRESH_TOKEN,
      access_token: access_token,
    };
    let response = await zohoOrganization(userToken);
    if (response == "success") {
      await exeQuery(
        `update syf_usermaster set ZBStatus='Connected' where lid='${userId}'`
      );
    }
    let uv = Buffer.from(response).toString("base64");
    res.redirect(`${formUrl}/index.html?result=${uv}`);
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).send("Failed to refresh token");
  }
});

// Zoho Sync End

// my-plans page start

app.post("/api/settings_getMyPlans", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getUserPlanAndModules(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_updatePlan", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updatePlan(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// my-plans page end

// comany edit page start

app.get("/api/settings_getPlanOptions", async (req, res) => {
  let  result = await getPlanOptions();
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_basicsFetch", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await basicsFetch(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_basicsFetch", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await basicsFetch(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_accountsFetch", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await accountsFetch(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_branchFetch", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await branchFetch(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_tanFetch", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await tanFetch(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_gstFetch", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await gstFetch(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_emptyValueInsert", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await emptyValueInsertUserId(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_emptyValueInsertAcbk", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await emptyValueInsertAcbk(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_updateTable", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateTable(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_updateACBKTable", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateACBKTable(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_deleteRow", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteRow(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/settings_updateCompanyName", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateCompanyName(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  company edit page end

//  config settings start

app.post("/api/config_getAcbkDetails", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAcbkDetails(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/window_changeSyncStatus", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await changeSyncStatus(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_bulkInsert", async (req, res) => {
  // let data = req.body.data;
  // let params = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
  // let  result = await bulkInsert(params);
  // let jsonData = JSON.stringify(result)
  // let encryptResult = Buffer.from(jsonData).toString('base64');
  // res.json({ data: encryptResult })
  let data = req.body.data;
  let  result = await bulkInsert(data);

  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_setMainJson", async (req, res) => {
  let data = req.body.data;
  // console.log(data)
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await setMainJson(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_fetchUserInfo", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await fetchUserInfo(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_getCompanyInfo", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getCompanyDetails(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/config_getUserRoles", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getUserRoles(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_getUserModules", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getUserModules(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_getRoles", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getRoles(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_getCountry", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getCountry();
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_sendMail", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await sendMail(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_getAcceptedInvites", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAcceptedInvites(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_getAcceptedInvites", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getAcceptedInvites(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_changeInviteStatus", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await changeInviteStatus(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.get("/api/config_getSchema", async (req, res) => {
  let  result = await getSchema();
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/config_workpaper", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await workPaper(params.data, params.url);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  config settings end

//  reco json report start

app.get("/api/reco_getAll", async (req, res) => {
  let  result = await getAllRecoJson();
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/reco_delete", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteReco(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  reco json report end

//  reco json form start

app.post("/api/reco_getData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getRecoData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/reco_saveJson", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveRecoJson(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  reco json form end

// dynamic reco page start

app.post("/api/reco_completeReco", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await completeReco(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/reco_getTableData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getRecoTableData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/reco_completeBulkReco", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await completeBulkReco(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/reco_rejectReco", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await rejectReco(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/reco_deleteTableData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteTableData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/reco_manualMatching", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await manualMatching(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/reco_removeLineItem", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await removeLineItem(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// dynamic reco page end

// segment mapping page start

app.post("/api/financials_getSegments", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getSegments(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_saveNewSegment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveSegment(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_updateSegment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateCoaSegment(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// segment mapping page end

//  settings userProfile start

app.post("/api/settings_updateProfile", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateProfile(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  settings userProfile end

// admin modules page start

app.get("/api/admin_fetchModules", async (req, res) => {
  let  result = await fetchModules();
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/admin_insertEmptyModule", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await insertEmptyModule(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/admin_deleteModule", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteModule(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/admin_updateModule", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateModule(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/admin_updateModuleSubCategory", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateModuleSubcategory(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  admin modules page end

//  admin plams page start

app.get("/api/admin_getAllModules", async (req, res) => {
  let  result = await fetchAllModules();
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.get("/api/admin_getAllPlans", async (req, res) => {
  let  result = await getAllPlans();
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/admin_insertEmptyPlan", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await insertEmptyPlan(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/admin_deletePlan", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deletePlan(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/admin_updatePlan", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updatePlanName(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// admin plans end

// sop form start

app.post("/api/sop_save", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveSop(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/sop_update", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateSop(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/sop_getData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getSop(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// sop form end

//  sop report start

app.get("/api/sop_getAllData", async (req, res) => {
  let  result = await getAllSopData();
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/sop_deleteData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteSop(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// sop report end

// sop dashboard start

app.post("/api/sop_getById", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getDataById(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
// sop dashboard end

// PM Observation dashboard start
app.post("/api/pm_obsDashboard", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await fetchProjects(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/pm_obsDashboard_markProjectCompletion", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await markProjectCompletion(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/pm_obsDashboard_getmilestones", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await fetchMilestones(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_updateMilestone", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateMilestoneStatus(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/pm_totalUsersCount", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await totalUsersCount(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_statistics_getObservationType", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getObservationType(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/obs_getPreSalesValidationData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getPresalesvalidation(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/obs_saveMilestonePsvalidation", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await saveMilestonePsvalidation(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/obs_PSsalesAllcontractsstatusChange", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await allContractsValidationChange(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_changeStatus", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await changeStatus(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_addNewTask", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await addNewTasks(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_updatePersonResponsible", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updatePersonResponsible(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_deleteTasks", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await deleteMyWorkTasks(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_update", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await myworksUpdateColumns(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_getTeamProgress", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getTeamProgress(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_saveTasks", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await saveTasks(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_statusUpdate", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await statusUpdate(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_getTableDataPettyTask", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getTableDataPettyTask(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_updatePettyTaskStatus", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updatePettyTaskStatus(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_updatePettyTaskComment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updatePettyTaskComment(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_getPettyTaskUpdates", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await pettyTaskStatus();
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_getProjectNames", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getProjectNames(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_getMilestonesCount", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getMilestonesCount(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_updateAllObservationObs", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateAllObservationObs(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_getProjectDataObservation", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getProjectDataObservation(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_updateObservationStatus", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateObservationStatus(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_updateObservationComment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateObservationComment(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_obsDashboard_updateObservationremarks", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateObservationremarks(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_cancelProjects", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await cancelProject(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_reverseProject", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await reverseProject(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// PM Observation dashboard end

// template workflows start

app.post("/api/templates_onloadData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await onloadTemplates(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/templates_getTabCounts", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getTabCounts(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/templates_getTableData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getTableData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/templates_updateStage", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateWorkflowstage(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/templates_updateInputs", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateInputs(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// template workflows end

// form workflows start

app.post("/api/forms_fetchOption", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await fetchFormOptions(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/forms_getEmployeeList", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getEmployeeOptions(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/forms_saveData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await saveFormData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/forms_getuvData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getUvFormData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/forms_updateData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateFormData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/forms_saveSubform", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await saveSubform(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/forms_getUvSubFormData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getUvSubFormData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/forms_deleteRowData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await deleteRowData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// form workflows end

// Myspace start
app.post("/api/myspace_getKpiMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await fetchKpiMaster(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/myspace_updateKpiMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateKpiMaster(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/myspace_insertKpiMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await insertKpiMaster(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/myspace_deleteKpiMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await deleteKpiMaster(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
// Myspace end

// classification form start

app.post("/api/pm_saveClassification", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await saveClassification(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// classification form end

// classification report start

app.post("/api/pm_showClassification", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await showClassification(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_deleteClassification", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await deleteClassification(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// classification report end

//  commitment register report start

app.post("/api/financial_showCommitment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await showCommitment(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_delCommitment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await delCommitment(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  commitment register report end

// commitment register form start

app.post("/api/financial_fetchRawCoa", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await fetchRawCoa(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_getusernames", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getUserNames(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_saveCommitment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await saveCommitment(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_getCommitment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getCommitment(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/financial_updateCommitment", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateCommitment(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  commitement register form end

// checklist report start

app.post("/api/pm_showChecklist", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await showChecklist(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_deleteChecklist", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await deleteChecklist(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// checklist report end

// checklist form start

app.post("/api/pm_fetchMilestones", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await fetchclassification(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_fetchChecklist", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await fetchChecklistData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_saveChecklist", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await saveChecklist(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// checklist form end

// invoice template start

app.post("/api/pm_getProjectData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getProjectData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getAllProjectData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getAllProjectData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getBillingAddress", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getBillingAddress(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getTotalAmount", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getTotalAmount(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_updatePaidInvoice", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updatePaidInvoice(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_updateSentInvoice", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateSentInvoice(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// invoice template end

// proposal template start

app.post("/api/pm_onloadTemplate", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await onloadTemplate(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_fetchContractAssignmentNature", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await fetchContractAssignmentNature(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getAssignmentNatureName", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getAssignmentNatureName(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getClientDetails", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getClientDetails(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getContractMasterDetails", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getContactMaster(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_checkEmailClients", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await checkEmailClients(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});



app.post("/api/pm_fetchMilestoneSubform", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await fetchMilestoneSubform(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_displayTermsConditions", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getDisplayTermsConditions(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getContractStatusQuery", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getContractStatusQuery(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_insertTemplateTransaction", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await insertTemplateTransaction(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});


app.post("/api/pm_updateProposalTemplateTransaction", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateTemplateTransaction(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_getChatFromProposalTrans", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getChatfromProposalTemplate(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_updateChatProposal", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateChatProposal(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/pm_updateProposalStatus", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateProposalStatus(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});



//  proposal template end

//  dropdown report start

app.post("/api/getDropdownData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getDropdownList(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/master_deleteDropdown", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await deleteDropdown(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

//  dropdown report end

// dropdown form start

app.post("/api/master_saveDropdown", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await saveDropdown(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/master_updateDropdown", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateDropdown(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/master_getAllDropdownNames", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getAllDropdownNames(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/master_viewDropdown", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await viewDropdown(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// dropdown form end

// extdocs start

app.post("/api/extDocs_getBalance", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await checkOpeningBalance(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_getTableData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await extTableData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_checkData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await checkData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_deleteBatch", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await deleteBatch(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_deleteExtData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await deleteExtData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_getPartyNames", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await fetchPartyNames(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_updateTag", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await extUpdatetags(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_getAllExtTabs", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getAllExtTabs(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// extdocs end

// manage external docs start

app.post("/api/extDocs_getCoaOptionsDocs", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getCoaOptionsDocs(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_manageData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await manageData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_insertExtData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await insertExtData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_updateExtData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateExtData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_deleteData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await extDeleteData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_getContactsPartyNames", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getContactsPartyNames(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// manage external docs end

// Reco Bots start
app.post("/api/recoBots_getAllReco", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getAllReco(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
// Reco Bots end

// Analyst developer - extdocs form start

app.post("/api/extDocs_insertExtTab", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await insertExtTab(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_updateExtTab", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateExtTab(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_viewExtTab", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await viewExtTab(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_getMasterExtTabs", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getMasterExtTabs(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// Analyst developer - extdocs form end

// Analyst developer - extdocs report start

app.post("/api/extDocs_getExtTabsData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getExtTabsData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/extDocs_deleteExtTabsData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await deleteExtTabsData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// Analyst developer - extdocs report end

// Analyst developer - records report start

app.post("/api/records_getAllRecords", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getAllRecords(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/records_deleteRecords", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await deleteRecords(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// Analyst developer - records report  end


// services_userList.js
app.post("/api/services_userList_zohoData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await services_userList_zohoData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/services_userList_zohocontact", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await services_userList_zohocontact(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
// end services_userList.js

// Analyst developer - records form start

app.post("/api/records_addRecords", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await addRecords(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/records_getRecordData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getRecordData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// Analyst developer - records form  end

// Finance - records page start

app.post("/api/records_getRecordsGroupBy", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getRecordsGroupBy(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// Finance - records page end

// GST - gstr2b start

app.post("/api/gst_getGstin", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getGstin(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/gst_getGstr2bData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getGstr2bData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// GST - gstr2b end
// Job card
app.post("/api/jobcard_getProjectDataObservation", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getProjectDataObservationJob(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/jobcard_fetchProjects", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await jobcard_fetchProjects(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// projectdesk
app.post("/api/projectdesk_getObservstionDetail", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getObservstionDetail(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/projectdesk_getMilestoneDetails", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getMilestoneDetails(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// speed drive start
app.post("/api/speed_getGlobalReport", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getGlobalReport();
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/speed_getLidGlobalReport", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getLidGlobalReport(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/speed_getGlobalTemplate", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getGlobalTemplate();
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/speed_getTemplateTransaction", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getTemplateTransaction();
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/speed_getTransactionCompany", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getTransactionCompany();
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/speed_getSpeedFileDrive", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getSpeedFileDrive(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/speed_getSpeedFileDriveDataCompany", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getSpeedFileDriveCompany(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/speed_getSpeedDriveData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getSpeedDriveData(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/speed_checkfileRecord", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getSpeedFileCheck(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/speed_insertFileRecord", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await insertFileRecord(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/speed_insertRoleFileRecord", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await insertRoleFileRecord(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/speed_updateFileRecord", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateFileRecord(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/document_getTransactionCompanyMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getTransactionCompanyMaster();
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/document_getPathtransactionReportMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getPathtransactionReportMaster(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/document_getPathtemplateTransaction", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getPathTemplateTransaction(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/document_getGlobalId", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getGlobalId();
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/document_getTransactionId", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getTransactionId();
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/speed_financialYearOnly", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getFinancialYear();
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/speed_getMonth", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await getMonth();
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/document_updateGlobalMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateGlobalMaster(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/document_insertGlobalMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await insertGlobalMaster(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/document_updateTransactionMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await updateTransactionMaster(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/document_insertTransactionMaster", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let response = await insertTransactionMaster(params);
  let jsonData = JSON.stringify(response);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

// gstTrackerForm  start

app.post("/api/gst_zohoNames", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await zohoNames(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/gst_insertIntoGstNotices", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await insertIntoGstNotices(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
app.post("/api/gst_updateGstNotice", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateGstNotice(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
// gstTrackerForm  end
// gstTrackerReport  start
app.post("/api/gst_getNoticeTrackerData", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await getNoticeTrackerData(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/gst_updateStatusNoticeTracker", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateStatusNoticeTracker(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/gst_updateContractIdNoticeTracker", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateContractIdNoticeTracker(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});

app.post("/api/gst_updateTimeExtensionFieldNoticeTracker", async (req, res) => {
  let data = req.body.data;
  let params = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  let  result = await updateTimeExtensionFieldNoticeTracker(params);
  let jsonData = JSON.stringify(result);
  let encryptResult = Buffer.from(jsonData).toString("base64");
  res.json({ data: encryptResult });
});
// gstTrackerReport  end

module.exports = app;
