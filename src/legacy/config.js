const sql = require("mssql");
const { Connection, Request } = require("tedious");

require("dotenv").config();

// const pythonUrl = process.env.PYTHON_BACKEND_URL; // changed to environment variable
const pythonUrl = "https://speedyourfin.el.r.appspot.com/"; // Production
let baseUrl = "https://speedappggsh.azurewebsites.net"; // Dev .Net
// let baseUrl = "https://speedappggshprod.azurewebsites.net"; // Prod .Net meant for production which is not used right now
const keyvaultURL = `https://kvl-ggshstorageaccount.vault.azure.net/`;
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRY_TIME = process.env.JWT_EXPIRY;

// secret name prod => kvl-ggsh-sql-prod-conn-string

// secret name qa => kvl-ggsh-sql-qa-conn-string

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

let credential = new DefaultAzureCredential();
let client = new SecretClient(keyvaultURL, credential);

async function connectWithDB() {
  // connect.js

  // Read environment variables from .env (optional but recommended)

  const config = {
    server: process.env.AZURE_SQL_SERVER, // e.g. yourserver.database.windows.net
    authentication: {
      type: "default",
      options: {
        userName: process.env.AZURE_SQL_USER, // e.g. your username
        password: process.env.AZURE_SQL_PASSWORD, // e.g. your password
      },
    },
    options: {
      database: process.env.AZURE_SQL_DATABASE, // your DB name
      encrypt: true,
      trustServerCertificate: false,
    },
  };

  const connection = new Connection(config);

  connection.on("connect", (err) => {
    if (err) {
      console.error("Connection failed:", err.message);
      return;
    }
    console.log("Connected to Azure SQL Database.");

    const request = new Request("SELECT * from syf_", (err, rowCount) => {
      if (err) {
        console.error("Query failed:", err.message);
      }
      connection.close();
    });

    request.on("row", (columns) => {
      columns.forEach((column) => {
        console.log(`${column.metadata.colName}: ${column.value}`);
      });
    });

    connection.execSql(request);
  });

  connection.connect();
}

// connectWithDB();

async function getZBSecret(secretNamelList) {
  let result = {};
  for (let secretName of secretNamelList) {
    try {
      let secret = await client.getSecret(secretName);
      result[secretName] = secret.value;
    } catch (error) {
      result[secretName] = error;
    }
  }
  // console.log(result)
  return result;
}

// let secret = getZBSecret(['kvl-ggsh-sql-prod-conn-string'])
// async function main(keys) {
//     try {
//         let connectionString = await getSecret('kvl-ggsh-sql-qa-conn-string');

//     } catch (error) {
//     }
// }

// main();

// async function main() {
//   const credential = new DefaultAzureCredential ();

//   const keyVaultName = "kvl-ggshstorageaccount";
//   const url = "https://" + keyVaultName + ".vault.azure.net";

//   const client = new SecretClient(url, credential);

//   // Create a secret
//   // The secret can be a string of any kind. For example,
//   // a multiline text block such as an RSA private key with newline characters,
//   // or a stringified JSON object, like `JSON.stringify({ mySecret: 'SECRET_VALUE'})`.
//   const secretName = "kvl-ggsh-sql-qa-conn-string"
// //   const result = await client.setSecret(secretName, "SECRET_VALUE");

//   // Read the secret we created
//   const secret = await client.getSecret(secretName);

// //   // Update the secret with different attributes
// //   const updatedSecret = await client.updateSecretProperties(secretName, result.properties.version, {
// //     enabled: false
// //   });

// //   // Delete the secret
// //   await client.beginDeleteSecret(secretName);
// }

// main().catch((error) => {
//   process.exit(1);
// });

// Fetch BE table using SQL
async function fetchTable(query) {
  let getCompany_query = Buffer.from(query).toString("base64");
  let getCompany_call = await queryGet([getCompany_query]);
  // console.log(getCompany_call,"query response")
  let getCompany_res = getCompany_call.responseData.table;
  return getCompany_res;
}

// exeQuery
async function exeQuery(query) {
  let getCompany_query = Buffer.from(query).toString("base64");
  let getCompany_call = await queryGet([getCompany_query]);
  return getCompany_call;
}

// fetch options
async function fetchOptions(query, labelName, valueName) {
  let getTable_query = Buffer.from(query).toString("base64");
  let getTable_call = await queryGet([getTable_query]);
  let getTable_res = getTable_call.responseData.table;

  let tableOptions = [];
  getTable_res.filter((table) => {
    if (table[labelName] != null) {
      tableOptions.push({ label: table[labelName], value: table[valueName] });
    }
  });

  return tableOptions;
}

// 1. API for SQL Query
async function queryGet(data) {
  let fe = await fetch(`${baseUrl}/api/Speed/DQLQueryExecution`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  let jsonfe = await fe.json();
  return jsonfe;
}

// Bulk Insert
// async function bulkInsert(data) {
//     try{
//         // let fe = await fetch(`${baseUrl}/api/Speed/BulkInsertJsonToDataStore`, {
//         //     method: "POST",
//         //     headers: { "Content-Type": "application/json", 'accept': 'text/plain', "Access-Control-Allow-Origin": "*" },
//         //     body: JSON.stringify(data)
//         // })
//         // let jsonfe = await fe.json();
//         // return jsonfe;
//     }
//     catch(error){
//     }
// }

// python call

// get schema

// Decryption
// Buffer.from(query,'base64').toString('utf-8');
function INR(num) {
  let currency = num.toLocaleString("en-IN", {
    // style: 'currency',
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return currency;
}

// added Time generation
function dateTimeGeneration(date) {
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yy = date.getFullYear();
  let dateFormat = yy + "-" + mm + "-" + dd;
  let time = new Date().toLocaleTimeString().split(" ");
  let addedTime = dateFormat + " " + time[0];
  return addedTime;
}

async function changeSyncStatus({ lid, status, time }) {
  try {
    let res = await exeQuery(
      `update syf_usermaster set zbStatus='${status}',modifiedTime='${time}' where lid='${lid}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

// mainJSon creation
async function setMainJson({ userId, token }) {
  try {
    let mainJsonData = {};
    let userRes = await fetchTable(
      `select lid,name,email,zbStatus from syf_usermaster where lid='${userId}'`
    );
    mainJsonData.userName = userRes[0].name;
    mainJsonData.token = token;
    mainJsonData.userId = userRes[0].lid;
    mainJsonData.email = userRes[0].email;

    let companyRes = await fetchTable(
      `select * from syf_companymaster where userid='${userId}' and defaultload='checked'`
    );
    if (companyRes.length == 0) {
      companyRes = await fetchTable(
        `select * from syf_companymaster where userid='${userId}'`
      );
    }
    if (companyRes.length > 0) {
      mainJsonData.companyname = companyRes[0].companyname;
      mainJsonData.companyid = companyRes[0].companyid;
      mainJsonData.plan = companyRes[0].plan;
      mainJsonData.companyType = "owned";
      mainJsonData.defaultload = companyRes[0].defaultload;
    } else if (companyRes.length == 0) {
      let invitedUsers = await fetchTable(
        `select *  from invitedusers where inviteduserid='${userId}'`
      );
      console.log(invitedUsers);
      if (invitedUsers.length > 0) {
        companyRes = await fetchTable(
          `select * from syf_companymaster where lid='${invitedUsers[0].companyid}'`
        );
        mainJsonData.companyType = "shared";
        mainJsonData.defaultload = "";
      } else {
        companyRes = [];
      }
    }
    if (companyRes.length > 0) {
      let data = {
        mainJsonData: mainJsonData,
        companyid: companyRes[0].lid,
      };
      let companyData = await getCompanyDetails(data);
      mainJsonData = companyData;
    }
    return mainJsonData;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getAcbkDetails({ userid }) {
  try {
    let res = await fetchTable(
      `select namepersoftware,software,organizationid,companyid,companyName from syf_companyacbkmaster where companyid in (select lid from syf_companymaster where userid='${userid}')`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getCompanyDetails({ mainJsonData, companyid }) {
  try {
    let companyData = await fetchTable(
      `select * from syf_companymaster where lid='${companyid}'`
    );
    let companyRes = companyData[0];
    mainJsonData.companyname = companyRes.companyname;
    mainJsonData.companyid = companyRes.lid;
    mainJsonData.plan = companyRes.subscription;
    mainJsonData.groupid = companyRes.groupid;
    mainJsonData.financialstartmonth = companyRes.financialstartmonth;
    if (companyRes.financialstartmonth == null) {
      companyRes.financialstartmonth = "04";
    }
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let date = calculateFinancialYear(companyRes, year);
    mainJsonData.dateDetails = date;
    let s = `select * from syf_companyacbkmaster where companyid='${companyRes.lid}'`; //  and fromdate >= '${date.startDate}' and todate <= '${date.endDate}'

    let query = Buffer.from(s).toString("base64");
    let book = await queryGet([query]);

    let books = book.responseData.table;
    if (books.length > 0) {
      mainJsonData.books = books;
    }
    if (
      mainJsonData.companyType == "owned" &&
      mainJsonData.plan !== undefined
    ) {
      let modulesRes =
        await fetchTable(`select module from syf_planmaster where 
            name='${mainJsonData.plan}'`);
      if (modulesRes.length > 0) {
        let moduleList = JSON.parse(modulesRes[0].module).modules.join(", ");
        if (moduleList) {
          let modules = await fetchTable(
            `select * from syf_modulemaster where lid in (${moduleList})`
          );
          mainJsonData.modules = modules;
        }
      }
    } else {
      let moduleRes = await fetchTable(
        `select modules from invitedusers where companyid='${companyRes.lid}' and inviteduserid='${mainJsonData.userId}'`
      );
      if (moduleRes.length > 0) {
        let moduleList = JSON.parse(moduleRes[0].modules).join(", ");
        console.log(moduleList);
        if (moduleList) {
          let modules = await fetchTable(
            `select * from syf_modulemaster where lid in (${moduleList})`
          );
          mainJsonData.modules = modules;
        }
      }
    }

    return mainJsonData;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getUserRoles(params) {
  try {
    let userRoles = await fetchTable(
      `select role from invitedusers where inviteduseremail='${params.email}' and companyid='${params.companyid}'`
    );
    console.log(userRoles);
    return userRoles;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

function calculateFinancialYear(companyRes, year) {
  let fs_startMonth = Number(companyRes.financialstartmonth);
  let currentDate = new Date();
  let currentYear,
    previousYear,
    startMonth,
    endMonth,
    startDate,
    endDate,
    cy_current,
    cy_previous;

  if (fs_startMonth == 0) {
    currentYear = year;
    previousYear = Number(year) - 1;
    cy_current = year;
    cy_previous = Number(cy_current) - 1;
    startMonth = companyRes.financialstartmonth;
    endMonth = 12;
    if (endMonth < 9) {
      endMonth = `0${endMonth}`;
    }
    startDate = `${year}-${companyRes.financialstartmonth}-01`;
    endDate = `${year}-${endMonth}-31`;
  } else {
    let year_suffix = Number(year.toString().substring(2, 4));
    let currentYear_dateFormat = new Date(
      `${year}-${companyRes.financialstartmonth}-01`
    );
    let previousYear_dateFormat = new Date(
      currentYear_dateFormat.setMonth(currentYear_dateFormat.getMonth() - 12)
    );
    endMonth = previousYear_dateFormat.getMonth();
    if (endMonth < 9) {
      endMonth = `0${endMonth}`;
    }

    // Adjust currentYear and previousYear based on startMonth
    if (
      currentDate.getFullYear() === year &&
      currentDate.getMonth() + 1 < fs_startMonth
    ) {
      currentYear = `${year - 1}-${year_suffix}`;
      previousYear = `${year - 2}-${year_suffix - 1}`;
      startDate = `${year - 1}-${companyRes.financialstartmonth}-01`;
      endDate = `${year}-${endMonth}-31`;
      cy_current = Number("20" + year_suffix);
      cy_previous = Number(cy_current) - 1;
    } else {
      startDate = `${year}-${companyRes.financialstartmonth}-01`;
      endDate = `${year + 1}-${endMonth}-31`;
      currentYear = `${year}-${year_suffix + 1}`;
      previousYear = `${year - 1}-${year_suffix}`;
      cy_current = Number("20" + (year_suffix + 1));
      cy_previous = Number(cy_current) - 1;
    }

    startMonth = companyRes.financialstartmonth;
  }

  return {
    currentYear,
    previousYear,
    startMonth,
    endMonth,
    startDate,
    endDate,
    cy_current,
    cy_previous,
  };
}

//  mainJson end

// fetch user , company info

async function fetchUserInfo({ username, source, mainJson }) {
  let getUser_query = await fetchTable(
    `select lid,email,profileimage,name,zbStatus,country,phonenumber from SYF_USERMASTER where EMAIL='${username}'`
  );
  let userInfo = getUser_query[0];
  console.log(username);
  // Fetch Company Information
  let userid = userInfo.lid;
  let getCompany_query = await fetchTable(
    `select * from SYF_COMPANYMASTER where USERID='${userid}'`
  );
  let getCompany_res = getCompany_query;
  let companyInfo;
  if (getCompany_res.length != 0) {
    companyInfo = getCompany_res;
  } else {
    companyInfo = [];
  }
  let sharedCompanyInfo = [];

  let getSharedCompany_query = await fetchTable(
    `select * from INVITEDUSERS where INVITEDUSERID='${userid}' and status='accepted'`
  );
  let getSharedCompany_res = getSharedCompany_query;
  if (getSharedCompany_res.length != undefined) {
    sharedCompanyInfo = getSharedCompany_res;
  }

  // check if user has access to that page
  let access;
  if (mainJson.hasOwnProperty("modules")) {
    let modules = mainJson.modules;
    let list = [
      "index.html",
      "settings/companyPage.html",
      "settings/addGroup.html",
      "settings/users-profile.html",
      "login/login.html",
      "syf-signup/signup.html",
      "settings/myPlanPage.html",
    ];
    if (!list.includes(source)) {
      let findModule = modules.filter((item) => item.source == source);
      if (findModule.length == 0) {
        access = false;
      } else if (findModule.length == 1) {
        access = true;
      }
    } else {
      access = true;
    }
  }
  let companyid = mainJson.companyid;
  let data = {
    mainJson: mainJson,
    companyid: companyid,
  };
  // let getModules = await getCompanyDetails(data)
  let moduleStatus = "No change";
  // if(mainJson.modules.length!=getModules.modules.length){
  //     moduleStatus=getModules.modules
  // }
  return {
    userInfo: userInfo,
    companyInfo: companyInfo,
    sharedCompanyInfo: sharedCompanyInfo,
    access: access,
    moduleStatus: moduleStatus,
  };
}

// invited users

async function getUserModules({ companyid }) {
  try {
    let res = await fetchTable(
      `select * from syf_companymaster where LID='${companyid}'`
    );
    if ((res != undefined) & (res.length > 0)) {
      let plan = res[0].subscription;
      let getModules = await fetchTable(
        `select * from SYF_PLANMASTER where NAME='${plan}'`
      );
      let getModule = JSON.parse(getModules[0].module);
      let modulesId = getModule.modules;
      if (modulesId.length > 0) {
        let formattedIds = modulesId.join(", ");
        let modulesQuery = await fetchTable(
          `select * from SYF_MODULEMASTER WHERE LID IN (${formattedIds});`
        );
        let moduleList = modulesQuery.map((item) => {
          return {
            label: `${item.name} - ${item.subcategory}`,
            value: item.lid,
          };
        });
        return moduleList;
      } else {
        return [];
      }
    }
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getRoles({ companyId }) {
  try {
    let getRoles_res = await fetchTable(
      `SELECT distinct role from roles where companyId='${companyId}'`
    );
    let rolesOption = [];
    if (getRoles_res.length > 0) {
      getRoles_res.map((roles) => {
        rolesOption.push({ label: roles.role, value: roles.role });
      });
    }

    let response = {
      options: rolesOption,
      res: getRoles_res,
    };
    return response;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getCountry() {
  try {
    let res = await fetchOptions(
      `select * from countryMaster`,
      "country",
      "country"
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function workPaper(data, url) {
  try {
    let fe = await fetch(pythonUrl + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    let jsonfe = await fe.json();
    return jsonfe;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

// Send mail
async function sendMail({ data }) {
  let formData = new FormData();

  //   if data has no cc
  if (data.BCCList !== undefined) {
    data.BCCList.forEach((item) => {
      formData.append("BCCList", item);
    });
  }
  if (data.CCList !== undefined) {
    if (data.CCList.length > 1) {
      data.CCList.forEach((item) => {
        formData.append("CCList", item);
      });
    } else {
      formData.append("CCList", data.CCList);
    }
  }
  if (data.RecipientList != undefined) {
    if (data.RecipientList.length > 1) {
      data.RecipientList.forEach((item) => {
        formData.append("RecipientList", item);
      });
    } else {
      formData.append("RecipientList", data.RecipientList);
    }
  } else {
    formData.append("RecipientList", []);
  }

  formData.append("Subject", data.Subject);
  formData.append("Body", data.Body);
  let fe = await fetch(
    `${baseUrl}/api/GGSHEmailService/GGSHEmailSenderService`,
    {
      method: "POST",
      body: formData,
    }
  );
  let jsonfe = await fe.text();
  return jsonfe;
}

// Get Schema Details
async function getSchema() {
  let fe = await fetch(baseUrl + "/api/Speed/GetTablecolumnSchemaDetails", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "text/plain",
      "Access-Control-Allow-Origin": "*",
    },
  });
  let jsonfe = await fe.json();
  return jsonfe;
}

// bulk insert api
async function bulkInsert(data) {
  let fe = await fetch(baseUrl + "/api/Speed/BulkInsertJsonToDataStore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "text/plain",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data),
  });
  let jsonfe = await fe.json();
  return jsonfe;
}

async function getAcceptedInvites({ lid }) {
  try {
    let getRoles_res = await fetchTable(
      `SELECT * from INVITEDUSERS where inviteduserid='${lid}' and status='pending'`
    );
    let length = getRoles_res.length;
    let notifyList = `<li class="dropdown-header notificationItem">
                        You have <span class="top_count"></span> notifications
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>`;
    getRoles_res.filter((item) => {
      notifyList += `<li class="notification-item d-flex justify-content-center align-items-center p-3">
                            <div>
                                <div>
                                    <h5>Invitation from ${item.addeduser}</h5>
                                    <p>${item.companyname} - ${item.role}</p>
                                    <div class='d-flex' id='${item.lid}'><button class='btn btn-success acceptInvite m-1 p-1'>Accept</button><button class='btn btn-danger rejectInvite m-1 p-1'>Reject</button></div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <hr class="dropdown-divider">
                        </li>`;
    });
    return {
      notifyList: notifyList,
      length: length,
    };
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function changeInviteStatus({ id, status }) {
  try {
    let changeStatus_query = await exeQuery(
      `UPDATE INVITEDUSERS SET STATUS='${status}' where LID='${id}'`
    );
    return changeStatus_query;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

module.exports = {
  fetchTable,
  getAcbkDetails,
  getCountry,
  changeInviteStatus,
  sendMail,
  getSchema,
  bulkInsert,
  setMainJson,
  getRoles,
  fetchUserInfo,
  queryGet,
  changeSyncStatus,
  exeQuery,
  fetchOptions,
  bulkInsert,
  INR,
  dateTimeGeneration,
  getZBSecret,
  workPaper,
  getCompanyDetails,
  getUserRoles,
  getUserModules,
  getAcceptedInvites,
};

// let baseUrl, formUrl, pythonUrl, getRole, userInfo, companyInfo, sharedCompanyInfo, nodejsUrl, companyId, financialStartYear, financialEndYear, dateDetails, client, roles, modulesOptions;

// formUrl = "http://desktop-dssus3g:90";

// // formUrl = "http://desktop-dssus3g:1124";
// // formUrl = "https://speedyourfinui-cndfc4ebdyfbcvgc.southindia-01.azurewebsites.net";
// // formUrl = "https://speedyourfin.in";
// baseUrl = "https://speedappggsh.azurewebsites.net";
// nodejsUrl = "https://finspeednodejs.azurewebsites.net/";
// // pythonUrl = "https://djangotest04-a8cuhvcwf7gnf9ge.southindia-01.azurewebsites.net/";
// // pythonUrl = "http://192.168.1.21:8000/";
// pythonUrl = "https://speedyourfin.el.r.appspot.com/";
// let syf = {
//     arguments: `<div class="row mb-3">
//                                 <label for="clientName" class="col-sm-3 col-form-label">Client
//                                     Name</label>
//                                 <div class="col-sm-7">
//                                     <div class="virtualSel" id="clientName" required>

//                                     </div>

//                                 </div>
//                             </div>
//                             <div class="row mb-3">
//                                 <label for="head" class="col-sm-3 col-form-label">From Date</label>
//                                 <div class="col-sm-7">
//                                     <input type="date" class="form-control" id="trans_fromdate">
//                                 </div>
//                             </div>
//                             <div class="row mb-3">
//                                 <label for="head" class="col-sm-3 col-form-label">To Date</label>
//                                 <div class="col-sm-7">
//                                     <input type="date" class="form-control" id="trans_todate">
//                                 </div>
//                             </div>
//                             <div class="row mb-3">
//                                 <label for="fy" class="col-sm-3 col-form-label">FY</label>
//                                 <div class="col-sm-7">
//                                     <div id="fy"></div>
//                                 </div>
//                             </div>

//                             <div class="row mb-3">
//                                 <label for="calendarYear" class="col-sm-3 col-form-label">Calendar Year</label>
//                                 <div class="col-sm-7">
//                                     <div id="calendarYear"></div>
//                                 </div>
//                             </div>
//                             <div class="row mb-3">
//                                 <label for="month" class="col-sm-3 col-form-label">Month</label>
//                                 <div class="col-sm-7">
//                                     <div id="month"></div>
//                                 </div>
//                             </div>
//                             <div class="row mb-3">
//                                 <label for="gstin" class="col-sm-3 col-form-label">GSTIN</label>
//                                 <div class="col-sm-7">
//                                     <div id="gstin"></div>
//                                 </div>
//                             </div>`,
//     entity: [
//         { label: "GGSH & CO. LLP", value: "GGSH & CO. LLP" },
//         { label: "Triggermetrics", value: "Triggermetrics" },
//         { label: "Gokulakrishnan", value: "Gokulakrishnan" }
//     ],
//     companytype: [
//         { label: "Proprieter", value: "Proprieter" },
//         { label: "Pvt Ltd", value: "Pvt Ltd" },
//         { label: "Firm", value: "Firm" },
//         { label: "LLP", value: "LLP" },
//         { label: "Trust", value: "Trust" },
//         { label: "Public Ltd", value: "Public Ltd" },
//         { label: "Sec 8 Company", value: "Sec 8 Company" },
//         { label: "Society", value: "Society" }
//     ],
//     // tallyExeDownloadLink:

// }

// // ******************************** Page Components Fetch Start ********************************
// $(document).ready(async () => {

//     // atchaya
//     // let sidebar = localStorage.getItem('sidebar')
//     // let topbar = localStorage.getItem('topbar')
//     // if (topbar != null && sidebar != null) {
//     //     let decryptSidebar = base64ToString(sidebar)
//     //     $(".topbar").html(topbar)
//     //     $(".sidebar").html(decryptSidebar)
//     //     activeSideBar()
//     // }
//     // atchaya

//     await fetchTopbar();
//     // Fetch Topbar

//     // await fetchSidebar(); // Fetch Sidebar
//     // Topbar data updation
//     // window.onpageshow = function (event) {
//     //             if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
//     //                 sessionStorage.clear();
//     //                 window.open(`${formUrl}/landingpage/landingpage.html`, `_self`);
//     //             }
//     //         };

//     // done by yohaana
//     // Prevent back navigation after logout by clearing cache and session storage

//     // common.js

//     // async function updateCache() {
//     //     try {
//     //         const versionResponse = await fetch('http://localhost:3000/api/version');
//     //         if (!versionResponse.ok) {
//     //             throw new Error('Failed to fetch version');
//     //         }
//     //         const { version } = await versionResponse.json();

//     //         const currentVersion = localStorage.getItem('appVersion');
//     //         if (currentVersion !== version) {
//     //             localStorage.setItem('appVersion', version);

//     //             const assets = document.querySelectorAll('link[rel="stylesheet"],src');
//     //             assets.forEach(asset => {
//     //                 let src = asset.src || asset.href;
//     //                 if (src) {
//     //                     if (!src.includes(`?version=${version}`)) {
//     //                         if (src.includes('?')) {
//     //                             src = src.replace(/(\?version=)[^\&]+/, `$1${version}`);
//     //                         } else {
//     //                             src += `?version=${version}`;
//     //                         }

//     //                         if (asset.href) {
//     //                             asset.href = src; // Update the href for CSS files
//     //                         }
//     //                         else if (asset.src) {
//     //                             asset.src = src; // Update the src for JS files
//     //                         }
//     //                     }
//     //                 }
//     //             });

//     //         }
//     //     } catch (error) {
//     //     }
//     // }

//     // // Call the cache update function
//     // updateCache();

//     // end by yohana

//     // invite users onclick (atchaya)
//     $(document).on('click', '.acceptInvite', async (e) => {
//         let id = $(e.currentTarget).parent().attr("id")
//         await changeInviteStatus(id, 'accepted')
//     })
//     $(document).on('click', '.rejectInvite', async (e) => {
//         let id = $(e.currentTarget).parent().attr("id")
//         await changeInviteStatus(id, 'rejected')
//     })
//     // events for invite users modal - Atchaya
//     $(document).on('blur', '#userEmail', async (e) => {
//         let username = (e.target.value).toLowerCase();
//         if (username != "" && username !== userInfo.email) {
//             document.querySelector('#role').setValue('')
//             document.querySelector('#modules').setValue('')
//             document.querySelector('#companyName').setValue('')
//             let getUser_query = stringToBase64(`select * from SYF_USERMASTER where email='${username}'`);
//             let getUser_call = await queryGet([getUser_query]);
//             let getUser_res = getUser_call.responseData.table;

//             if (getUser_res.length > 0) {
//                 invitedUser = getUser_res[0]
//                 $('.inviteCheck').show()
//                 $('#invite').show()
//                 $('#newInvite').hide()
//             } else {
//                 $('#newInvite').show()
//                 $('.inviteCheck').hide()
//                 $('#invite').hide()
//             }
//         }
//     });
//     $(document).on('click', '#newInvite', async () => {
//         let userEmail = $('#userEmail').val()
//         if (userEmail == "") {
//             await dismissibleAlert('Fill mandatory fields', 'warning')
//         }
//         else {
//             let emailData = await generateNewInviteEmailContent(userEmail);
//             sendMail(emailData).then(function (mailRes) {
//                 if (mailRes == "GGSH email communication successful!") {

//                     $('#inviteUser').prepend(`<div class="alert alert-primary alert-dismissible fade show text-center" role="alert">
//                         Invitation sent! Access can only be granted once the user completes their sign-up.
//                         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//                       </div>`)
//                     $('#userEmail').val('')
//                 }
//             });

//         }

//     })
//     $(document).on('click', '#invite', async () => {
//         let role = $('#role').val()
//         let modules = $('#modules').val()
//         let company = $('#companyName').val()
//         let userEmail = $('#userEmail').val()
//         let addedTime = dateTimeGeneration(new Date())
//         let insertQuery = []
//         if (role == "" || modules == "") {
//             await dismissibleAlert('Fill mandatory fields', 'warning')
//         }
//         else {
//             let roleExists = await checkRoleForEmail(role);
//             if (roleExists.count === 0) {
//                 let roleQuery = stringToBase64(`insert into roles(role,modules,emailid,userid,addedUser,addedTime) values('${role}','${modules}','${userInfo.email}','${userInfo.lid}','${userInfo.name}','${addedTime}')`)
//                 insertQuery.push(roleQuery);
//             }

//             if (company.length == 0) {
//                 let invitedQuery = stringToBase64(`insert into invitedusers (userid,inviteduserid,inviteduseremail,role,modules,addedtime,addeduser,status)
//                     values('${userInfo.lid}','${invitedUser.lid}','${invitedUser.email}','${role}','${JSON.stringify(modules)}','${addedTime}','${userInfo.name}','pending')`)
//                 insertQuery.push(invitedQuery);
//             }
//             else if (company.length > 0) {
//                 let emailExists = false;
//                 // company.filter((item) => {
//                 for (const item of company) {
//                     let companyName = client.res.find((company) => company.lid == item)?.companyname;
//                     let emailCheckQuery = stringToBase64(`
//                         SELECT 1 FROM invitedusers
//                         WHERE companyname = '${companyName}' AND inviteduseremail = '${userEmail}'
//                     `);
//                     let result = await queryGet([emailCheckQuery]);
//                     if (result.length > 0) {
//                         emailExists = true;
//                         await dismissibleAlert('Already You have an emailid', 'warning')
//                     }
//                     else {
//                         let companyQuery = stringToBase64(`insert into invitedusers (companyname,companyid,userid,inviteduserid,inviteduseremail,role,modules,addedtime,addeduser,status)
//                             values('${companyName}','${item}','${userInfo.lid}','${invitedUser.lid}','${invitedUser.email}','${role}','${JSON.stringify(modules)}','${addedTime}','${userInfo.name}','pending')`)
//                         insertQuery.push(companyQuery);
//                     }

//                 }
//             }
//             if (insertQuery.length > 0) {
//                 let res = await queryGet(insertQuery)
//                 if (res.responseType == "SUCCESS") {
//                     let invitedUser = await fetchTable(`select password from syf_usermaster where email='${userEmail}'`);
//                     let password = base64ToString(invitedUser[0].password);
//                     let emailData = await generateInviteEmailContent(userEmail, password);
//                     sendMail(emailData).then(async function (mailRes) {
//                         if (mailRes == "GGSH email communication successful!") {

//                             $('#inviteUser').prepend(`<div class="alert alert-primary alert-dismissible fade show text-center" role="alert">
//                                 Invitation sent! Access can only be granted once the user completes their sign-up.
//                                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//                               </div>`)
//                             $('#userEmail').val('')
//                             await dismissibleAlert('Invite sent', 'success')
//                         }
//                     });

//                     document.querySelector('#role').setValue('')
//                     document.querySelector('#modules').setValue('')
//                     document.querySelector('#companyName').setValue('')
//                     $('#companyName').val('')
//                     $('#userEmail').val('')
//                     $('.inviteCheck').hide()
//                     $("#inviteUser").modal('hide')

//                 }
//                 else {
//                     await dismissibleAlert('Error', 'danger')
//                 }
//             }
//         }

//     })
//     $('.topbar').on("click", ".companyName", async (e) => {
//         setTimeout(async () => {
//             company = JSON.parse(base64ToString(localStorage.getItem("company")));
//             let value = $(e.currentTarget).parent().attr("val")
//             if (value == "sharedCompany") {
//                 let modules = await getSharedModules()
//                 showModules(modules)
//             }
//             else {
//                 await getInfo()
//             }
//         }, 1000)
//     })

// })

// // Function to fetch sidebar
// async function fetchTopbar() {
//     $.get("/topbar.html", (topbarHtml) => {
//         $(".topbar").html(topbarHtml)
//     })
// }

// // Function to fetch topbar
// async function fetchSidebar() {
//     $.get("/sidebar.html", (topbarHtml) => {
//         $(".sidebar").html(topbarHtml)
//     })
// }

// // ******************************** Page Components Fetch End ********************************

// // ******************************** API Section Start ********************************
// // 1. API for SQL Query
// async function queryGet(data) {
//     let fe = await fetch(`${baseUrl}/api/Speed/DQLQueryExecution`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", 'accept': 'text/plain', "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify(data)
//     })
//     let jsonfe = await fe.json();
//     return jsonfe;
// }
// //******************************** API Section End ********************************

// //******************************** API Templates Start ********************************
// async function getInfo() {
//     let encryptedUser = localStorage.getItem("user");
//     if (encryptedUser) {
//         let c = base64ToString(encryptedUser)
//         let username = base64ToString(encryptedUser);
//         let userDetails = await fetchUserInfo(username);
//         // await fetchCompanyInfo();
//         //invite user
//         client = await getClients();
//         modulesOptions = await getUserModules()
//         roles = await getInvitedRoles();
//         //    let moduleValuesArray=roles.modules;
//         //    let moduleValuesString = moduleValuesArray[0];
//         //    const moduleValues =moduleValuesString.split(',').map(Number);
//         //    document.querySelector('#modules').setValue(moduleValues);

//         VirtualSelect.init({
//             ele: `#companyName`,
//             options: client.options,
//             multiple: true,
//             search: true
//         });
//         VirtualSelect.init({
//             ele: `#modules`,
//             options: modulesOptions,
//             multiple: true,
//             search: true
//         });

//         VirtualSelect.init({
//             ele: `#role`,
//             options: roles.options,
//             allowNewOption: true,
//             search: true,
//         });

//         $('#role').change(async function () {
//             let roleValue = $(this).val();
//             await fetchModules(roleValue, modulesOptions);
//         })

//         return userDetails;

//     } else {
//         window.open(`${formUrl}/landingPage/landingPage.html`, `_self`)
//     }

// }
// async function fetchModules(roleValues, modulesOptions) {
//     let getModules_query = stringToBase64(`select modules from roles where role='${roleValues}' `);
//     let getModules_call = await queryGet([getModules_query]);
//     let getModules_res = getModules_call.responseData.table;
//     if (getModules_res.length > 0) {
//         let modulesString = getModules_res[0].modules;
//         let selectedValues = modulesString.split(',').map(Number);
//         VirtualSelect.init({
//             ele: `#modules`,
//             options: modulesOptions,
//             multiple: true,
//             search: true
//         });
//         document.querySelector('#modules').setValue(selectedValues);
//     }
//     else {
//         document.querySelector('#modules').setValue('');
//     }

// }

// async function fetchUserInfo(username) {
//     // Fetch User Information
//     let getUser_query = stringToBase64(`select * from SYF_USERMASTER where EMAIL='${username}'`);
//     let getUser_call = await queryGet([getUser_query]);
//     let getUser_res = getUser_call.responseData.table;
//     userInfo = getUser_res[0];

//     // Fetch Company Information
//     let userid = getUser_res[0].lid
//     let getCompany_query = stringToBase64(`select * from SYF_COMPANYMASTER where USERID='${userid}'`);
//     let getCompany_call = await queryGet([getCompany_query]);
//     let getCompany_res = getCompany_call.responseData.table;
//     if (getCompany_res.length != 0) {
//         companyInfo = getCompany_res;

//     }
//     else {
//         companyInfo = [];
//         // let newCompany = await createNewCompany();
//         // await resetCompanyCoa(userInfo.name, newCompany.companyname, newCompany.lid)
//         // await fetchUserInfo(username)
//     }

//     //fetch sharedCompanyInformation - Atchaya
//     let getSharedCompany_query = stringToBase64(`select * from INVITEDUSERS where INVITEDUSERID='${userid}' and status='accepted'`);
//     let getSharedCompany_call = await queryGet([getSharedCompany_query]);
//     let getSharedCompany_res = getSharedCompany_call.responseData.table;
//     if (getSharedCompany_res.length != undefined) {
//         sharedCompanyInfo = getSharedCompany_res;
//     }

//     //display user profile image
//     if (userInfo.profileimage !== "" && userInfo.profileimage !== null) {
//         $("#topbar_profile").attr("src", userInfo.profileimage)
//     }
//     else {
//         $("#topbar_profile").attr("src", '../assets/img/avatar_male1.png')
//     }

//     $(".username").text(userInfo.name);

//     //display notifications - invite users (atchaya)
//     await getAcceptedInvites(userInfo)

//     let includesList = ["ranjith@ggsh.in", "gokul@ggsh.in"]
//     if (includesList.includes(userInfo.email)) {
//         $(".topbar_item").show()
//     }

//     // // set in local storage - topbar,sidebar atchaya
//     // let info = localStorage.getItem('sidebar')
//     // let topbar = localStorage.getItem('topbar')

//     // if (info == null && topbar == null) {

//     // atchaya end

//     // Fetch User Information

//     let getPlan = await fetchTable(`select MODULE from SYF_PLANMASTER where name='${userInfo.subscription}'`);
//     if (getPlan.length != 0) {

//         let moduleJson = JSON.parse(getPlan[0].module);
//         let moduleList = moduleJson.modules;

//         let moduleId = "";
//         moduleList.map((lid, inx) => {
//             (moduleList.length == inx + 1) ? moduleId += `${lid}` : moduleId += `${lid},`;
//         });
//         if (moduleId != "") {
//             let getModule = await fetchTable(`select * from SYF_MODULEMASTER where lid in(${moduleId})`);

//             // Update topbar information and sidebar
//             showModules(getModule);
//             await fetchSelectedCompany();

//         }
//     }

//     //     // atchaya
//     //     let sidebar = $(".sidebar").html()
//     //     let encryptSidebar = stringToBase64(sidebar)
//     //     localStorage.setItem('sidebar', encryptSidebar)
//     //     let topbar = $(".topbar").html()
//     //     localStorage.setItem('topbar', topbar)
//     // }
//     // else {
//     //     await fetchSelectedCompany();
//     // }

//     // atchaya end

//     return userInfo
// }

// async function checkRoleForEmail(role) {
//     let checkRole_query = stringToBase64(`SELECT COUNT(*) as count FROM roles WHERE role = '${role}' AND userid = '${userInfo.lid}'`);
//     let checkRole_call = await queryGet([checkRole_query]);
//     let checkRole_res = checkRole_call.responseData.table[0];
//     return checkRole_res;
// }
// async function getSharedModules() {
//     //shared modules -atchaya
//     let sharedModulesId = []
//     sharedCompanyInfo.filter((item) => {
//         sharedModulesId.push(...JSON.parse(item.modules))

//     })
//     let sharedModuleList = sharedModulesId
//     let sharedIds = ''
//     sharedModuleList.map((lid, inx) => {
//         (sharedModuleList.length == inx + 1) ? sharedIds += `${lid}` : sharedIds += `${lid},`;
//     });
//     let getSharedModule = []
//     if (sharedIds != '') {
//         getSharedModule = await fetchTable(`select * from SYF_MODULEMASTER where lid in(${sharedIds})`);
//     }
//     return getSharedModule
// }

// async function getAllModules() {
//     let getPlan = await fetchTable(`select MODULE from SYF_PLANMASTER where name='${userInfo.subscription}'`);
//     if (getPlan.length != 0) {

//         let moduleJson = JSON.parse(getPlan[0].module);
//         let moduleList = moduleJson.modules;

//         let moduleId = "";
//         moduleList.map((lid, inx) => {
//             (moduleList.length == inx + 1) ? moduleId += `${lid}` : moduleId += `${lid},`;
//         });
//         if (moduleId != "") {
//             let getModule = await fetchTable(`select * from SYF_MODULEMASTER where lid in(${moduleId})`);

//             showModules(getModule);
//         }
//     }
// }

// function showModules(modules) {

//     let subcategoryList = [];
//     modules.map((module) => {
//         subcategoryList.push(module.subcategory)
//     })

//     let uniqueSubcategoryList = Array.from(new Set(subcategoryList));
//     let li = "";
//     uniqueSubcategoryList.map((subcategory, subcat_inx) => {
//         let moduleItem = "";
//         modules.map((module, module_inx) => {
//             let moduleActiveName = module.lid;
//             if (subcategory == module.subcategory) {
//                 moduleItem +=
//                     `<li>
//                         <a href="../${module.source}" class="moduleActive" id="${moduleActiveName}">
//                             <i class="bi bi-circle"></i><span>${module.name}</span>
//                         </a>
//                     </li>`
//             }
//         })

//         li +=
//             `<li class="nav-item">
//                 <a class="nav-link collapsed" data-bs-target="#forms-nav${subcat_inx}"  data-bs-toggle="collapse" href="#">
//                     <i class="bi bi-journal-text"></i><span>${subcategory}</span><i class="bi bi-chevron-down ms-auto"></i>
//                 </a>
//                 <ul id="forms-nav${subcat_inx}" class="nav-content collapse" data-bs-parent="#sidebar-nav">
//                     ${moduleItem}
//                 </ul>
//             </li>`
//     })
//     // let subcategoryListShared = [];
//     // sharedModules.map((module) => {
//     //     subcategoryListShared.push(module.subcategory)
//     // })

//     // let uniqueSubcategoryListShared = Array.from(new Set(subcategoryListShared));
//     // let sharedli = "";
//     // uniqueSubcategoryListShared.map((subcategory, subcat_inx) => {
//     //     let moduleItem = "";
//     //     sharedModules.map((module, module_inx) => {
//     //         let moduleActiveName = module.id;
//     //         if (subcategory == module.subcategory) {
//     //             moduleItem +=
//     //                 `<li>
//     //                     <a href="../${module.source}" class="moduleActive shared" id="${moduleActiveName}">
//     //                         <i class="bi bi-circle"></i><span>${module.name}</span>
//     //                     </a>
//     //                 </li>`
//     //         }
//     //     })

//     //     sharedli +=
//     //         `<li class="nav-item">
//     //             <a class="nav-link collapsed" data-bs-target="#forms-navshared${subcat_inx}"  data-bs-toggle="collapse" href="#">
//     //                 <i class="bi bi-journal-text"></i><span>${subcategory}</span><i class="bi bi-chevron-down ms-auto"></i>
//     //             </a>
//     //             <ul id="forms-navshared${subcat_inx}" class="nav-content collapse" data-bs-parent="#sidebar-nav">
//     //                 ${moduleItem}
//     //             </ul>
//     //         </li>`
//     // })

//     let sidebar =
//         `<aside id="sidebar" class="sidebar collapsed">

//             <ul class="sidebar-nav" id="sidebar-nav">
//                 <li class="nav-item">
//                     <a class="nav-link moduleActive" href="../index.html" id="home">
//                         <i class="bi bi-grid"></i>
//                         <span>Home</span>
//                     </a>
//                 </li>

//                 ${li}

//             </ul>

//         </aside>`
//     $(".sidebar").html(sidebar);

//     //sidebar active-Atchaya
//     let activeLink = localStorage.getItem('activeModule')
//     if (activeLink != "home") {
//         $('#sidebar-nav .nav-link').removeClass("active")
//         $(`#${activeLink}`).addClass('active')
//         $('#sidebar-nav #home.nav-link').css("background-color", "white")
//         $('#sidebar-nav #home.nav-link').css("color", "#012970")
//         $(`#${activeLink}`).parent().parent().parent().find('.nav-link').addClass('activeTab')
//         $(`#${activeLink}`).parent().parent().addClass('show')
//         $(`#${activeLink}`).parent().parent().addClass('active')

//     }
//     else {
//         $(`#${activeLink}`).addClass('active')
//     }
//     //sidebar active-Atchaya end

// }

// function activeSideBar() {
//     //sidebar active-Atchaya
//     let activeLink = localStorage.getItem('activeModule')
//     if (activeLink != "home") {
//         $('#sidebar-nav .nav-link').removeClass("active")
//         $(`#${activeLink}`).addClass('active')
//         $('#sidebar-nav #home.nav-link').css("background-color", "white")
//         $('#sidebar-nav #home.nav-link').css("color", "#012970")
//         $(`#${activeLink}`).parent().parent().parent().find('.nav-link').addClass('activeTab')
//         $(`#${activeLink}`).parent().parent().addClass('show')
//         $(`#${activeLink}`).parent().parent().addClass('active')

//     }
//     else {
//         $(`#${activeLink}`).addClass('active')
//     }
//     let activeTab = $(`#${activeLink}`)
//     if (activeTab.length) {
//         $("html, body .sidebar").animate({
//             scrollTop: activeTab.offset().top - ($(window).height() / 2) + (activeTab.height() / 2)
//         }, 0);
//     }
//     //sidebar active-Atchaya end
// }

// // async function fetchSelectedCompany() {
// //
// //         if (localStorage.getItem("company") == null || localStorage.getItem("company") == "null") {
// //             let selectedCompany;
// //             let defaultCompany = companyInfo.filter((company) => {
// //                 return (company.defaultload == "checked")
// //             })

// //             if (defaultCompany.length == 0) {
// //                 defaultCompany = [companyInfo[0]]
// //             }

// //             selectedCompany = {
// //                 "companyname": defaultCompany[0].companyname,
// //                 "companyID": defaultCompany[0].lid,
// //                 "id": defaultCompany[0].companyid,
// //                 "defaultload": defaultCompany[0].defaultload
// //             }
// //             localStorage.setItem("company", stringToBase64(JSON.stringify(selectedCompany)));

// //         }
// //         let localHistory = JSON.parse(base64ToString(localStorage.getItem("company")));
// //
// //     //check if localstorage company -shared atchaya
// //     let sharedcompany = sharedCompanyInfo.filter((company) => {
// //         return (company.companyid == localHistory.companyID)
// //     })
// //     if (sharedcompany.length > 0) {
// //         $(".selectedCompany,.companyList thead .companyName").text(localHistory.companyname);
// //         $(".companyList thead tr").attr("val", "sharedCompany")
// //         $(".companyList thead .editCompany fa-pen-to-square").hide();
// //         $(".companyList thead .companyID").text(`(${localHistory.companyID})`);
// //         let modules = await getSharedModules()
// //         showModules(modules)

// //     }

// //     else {
// //         $(".companyList thead .editCompany").show();
// //         $(".companyList thead tr").attr("val", "commonCompany")
// //         $(".selectedCompany,.companyList thead .companyName").text(localHistory.companyname);
// //         $(".companyList thead .companyID").text(`(${localHistory.companyID})`);
// //         $(".companyList thead .defaultload").html(`<input type="radio" name='companyL' ${localHistory.defaultload}>`);
// //         await getAllModules()
// //     }
// //     let companyOptions = "";
// //     if (companyInfo) {
// //         let companyList = companyInfo.filter((company) => {
// //             return (company.lid != localHistory.companyID)
// //         })

// //         companyId = localHistory.companyID

// //         companyList.map((company) => {
// //             companyOptions += `
// //             <tr val="commonCompany">
// //                 <td class="editCompany"><i class="fa-regular fa-pen-to-square"></i></td>
// //                 <td class="companyName">${company.companyname}</td>
// //                 <td class="companyID">(${company.lid})</td>
// //                 <td class="defaultload"><input type="radio" ${company.defaultload}></td>
// //             </tr>
// //         `;
// //         })
// //     }
// //     let sharedcompanyList = sharedCompanyInfo.filter((company) => {
// //         return (company.companyid != localHistory.companyID)
// //     })
// //     sharedcompanyList.map((company) => {
// //         companyOptions += `
// //             <tr val="sharedCompany">
// //                 <td></td>
// //                 <td class="companyName">${company.companyname}</td>
// //                 <td class="companyID">(${company.companyid})</td>
// //                 <td></td>
// //             </tr>
// //         `;
// //     })

// //     $(".companyList>tbody").html(companyOptions)

// //     // // get financial start year
// //     // let currentYear = $('.selectFinancialYear').text()
// //     // if (currentYear == "" || currentYear == undefined || currentYear == 'Year') {
// //     //     currentYear = new Date().getFullYear()
// //     // }
// //     // companyInfo.filter((item) => {
// //     //     if (item.lid === localHistory.companyID) {
// //     //         if (item.financialMonth !== '01') {

// //     //             financialStartYear = `${parseInt(currentYear) - 2} - ${parseInt(currentYear % 100) - 1}`
// //     //             financialEndYear = `${parseInt(currentYear) - 1} - ${parseInt(currentYear % 100)}`
// //     //         }
// //     //     }
// //     // })

// //     // shared module restriction - Atchaya
// //     if (localStorage.getItem('moduleType') == 'shared') {
// //         $('.commonCompany').hide()
// //         $('.companyList tfoot').hide()
// //         let sharedCompanyIds = sharedCompanyInfo.map(company => company.companyid)
// //         if (!sharedCompanyIds.includes(localHistory.companyID)) {
// //             $(".selectedCompany,.companyList thead .companyName").text(sharedCompanyInfo[0].companyname);
// //             $(".companyList thead .editCompany").hide();
// //             $(".companyList thead .companyID").text(`(${sharedCompanyInfo[0].companyid})`);
// //             $(".companyList thead .defaultload").hide();
// //         }
// //     }

// //     let selectedCompany_id = $(".companyList thead .companyID").text().replace("(", "").replace(")", "");
// //     await fetchSelectedFinancialYear(selectedCompany_id)
// // }
// async function fetchSelectedCompany() {
//     let selectedCompany;
//     if (localStorage.getItem("company") == null || localStorage.getItem("company") == "null") {
//         if (companyInfo && companyInfo.length > 0) {
//             let defaultCompany = companyInfo.filter((company) => company.defaultload === "checked");

//             if (defaultCompany.length === 0) {
//                 defaultCompany = [companyInfo[0]];
//             }

//             selectedCompany = {
//                 "companyname": defaultCompany[0].companyname,
//                 "companyID": defaultCompany[0].lid,
//                 "id": defaultCompany[0].companyid,
//                 "defaultload": defaultCompany[0].defaultload
//             };
//         } else if (sharedCompanyInfo && sharedCompanyInfo.length > 0) {
//             selectedCompany = {
//                 "companyname": sharedCompanyInfo[0].companyname,
//                 "companyID": sharedCompanyInfo[0].companyid,
//                 "id": sharedCompanyInfo[0].companyid,
//                 "defaultload": ""
//             };
//         } else {
//             await dismissibleAlert('No companies available', 'warning');
//             return;
//         }

//         localStorage.setItem("company", stringToBase64(JSON.stringify(selectedCompany)));
//     }

//     let localHistory = JSON.parse(base64ToString(localStorage.getItem("company")));
//     let sharedcompany = sharedCompanyInfo.filter((company) => company.companyid === localHistory.companyID);

//     if (sharedcompany.length > 0) {
//         $(".selectedCompany,.companyList thead .companyName").text(localHistory.companyname);
//         $(".companyList thead tr").attr("val", "sharedCompany");
//         $(".companyList thead .editCompany fa-pen-to-square").hide();
//         $(".companyList thead .companyID").text(`(${localHistory.companyID})`);
//         let modules = await getSharedModules();
//         showModules(modules);
//     } else {
//         $(".companyList thead .editCompany").show();
//         $(".companyList thead tr").attr("val", "commonCompany");
//         $(".selectedCompany,.companyList thead .companyName").text(localHistory.companyname);
//         $(".companyList thead .companyID").text(`(${localHistory.companyID})`);
//         $(".companyList thead .defaultload").html(`<input type="radio" name='companyL' ${localHistory.defaultload}>`);
//         await getAllModules();
//     }

//     let companyOptions = "";

//     if (companyInfo && companyInfo.length > 0) {
//         let companyList = companyInfo.filter((company) => { return company.lid != localHistory.companyID });
//         companyList.map((company) => {
//             companyOptions += `
//                 <tr val="commonCompany">
//                     <td class="editCompany"><i class="fa-regular fa-pen-to-square"></i></td>
//                     <td class="companyName">${company.companyname}</td>
//                     <td class="companyID">(${company.lid})</td>
//                     <td class="defaultload"><input type="radio" ${company.defaultload}></td>
//                 </tr>
//             `;
//         });
//     }

//     sharedCompanyInfo.filter((company) => company.companyid !== localHistory.companyID)
//         .map((company) => {
//             companyOptions += `
//                 <tr val="sharedCompany">
//                     <td></td>
//                     <td class="companyName">${company.companyname}</td>
//                     <td class="companyID">(${company.companyid})</td>
//                     <td></td>
//                 </tr>
//             `;
//         });

//     $(".companyList>tbody").html(companyOptions);

//     if (localStorage.getItem('moduleType') === 'shared') {
//         $('.commonCompany').hide();
//         $('.companyList tfoot').hide();
//         let sharedCompanyIds = sharedCompanyInfo.map(company => company.companyid);
//         if (!sharedCompanyIds.includes(localHistory.companyID)) {
//             $(".selectedCompany,.companyList thead .companyName").text(sharedCompanyInfo[0].companyname);
//             $(".companyList thead .editCompany").hide();
//             $(".companyList thead .companyID").text(`(${sharedCompanyInfo[0].companyid})`);
//             $(".companyList thead .defaultload").hide();
//         }
//     }

//     let selectedCompany_id = $(".companyList thead .companyID").text().replace("(", "").replace(")", "");
//     await fetchSelectedFinancialYear(selectedCompany_id);
// }

// //fetch financial start and end year -Atchaya
// async function fetchSelectedFinancialYear(selectedCompany_id) {
//     let calendarYear = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];
//     let financialYear = ["2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26", "2026-27", "2027-28", "2028-29", "2029-30", "2030-31"];
//     let dateDetail = localStorage.getItem("date")
//     let currentYear, previousYear, startMonth, endMonth, startDate, endDate, cy_current, cy_previous;
//     if (dateDetail != null) {
//         let dateDetails = JSON.parse(base64ToString(localStorage.getItem("date")));
//         currentYear = dateDetails.currentYear
//         previousYear = dateDetails.previousYear
//         startMonth = dateDetails.startMonth
//         endMonth = dateDetails.endMonth
//         startDate = dateDetails.startDate
//         endDate = dateDetails.endDate
//         cy_current = dateDetails.cy_current
//         cy_previous = dateDetails.cy_previous

//     } else {

//         let company_fe = await fetchTable(`select * from syf_companymaster where lid='${selectedCompany_id}'`)
//         let company = company_fe[0]
//         let fs_startMonth = Number(company.financialstartmonth)
//         let yearList;
//         let currentDate = new Date();
//         let year = currentDate.getFullYear();

//         if (fs_startMonth == 0) {
//             yearList = calendarYear
//             currentYear = year;
//             previousYear = Number(year) - 1;
//             cy_current = year;
//             cy_previous = Number(cy_current) - 1;
//             startMonth = company.financialstartmonth;
//             endMonth = 12;
//             if (endMonth < 9) {
//                 endMonth = `0${endMonth}`
//             }
//             startDate = `${year}-${company.financialstartmonth}-01`;
//             endDate = `${year}-${endMonth}-31`;
//         } else {
//             yearList = financialYear
//             let year_suffix = Number(year.toString().substring(2, 4))
//             currentYear = `${year}-${year_suffix + 1}`
//             let currentYear_dateFormat = new Date(`${year}-${company.financialstartmonth}-01`);
//             let previousYear_dateFormat = new Date(currentYear_dateFormat.setMonth(currentYear_dateFormat.getMonth() - 12))
//             let split1 = currentYear.split("-")
//             cy_current = Number("20" + split1[1]);
//             cy_previous = Number(cy_current) - 1;
//             previousYear = `${Number(split1[0]) - 1}-${Number(split1[1]) - 1}`;
//             startMonth = company.financialstartmonth;
//             endMonth = previousYear_dateFormat.getMonth();

//             if (endMonth < 9) {
//                 endMonth = `0${endMonth}`
//             }
//             startDate = `${split1[0]}-${company.financialstartmonth}-01`;
//             endDate = `20${split1[1]}-${endMonth}-31`;

//         }

//     }

//     $('.selectFinancialYear').text(currentYear)
//     let financialYearOptions = ""
//     financialYear.map((year) => {
//         financialYearOptions += `
//              <li><a class="dropdown-item m-0 p-1 pl-1 text-center startYearOption" href="#">${year}</a></li>
//         `;
//     })

//     $(".financialStartYearTable").html(financialYearOptions)

//     let date = {
//         "currentYear": currentYear,
//         "previousYear": previousYear,
//         "startMonth": startMonth,
//         "endMonth": endMonth,
//         "startDate": startDate,
//         "endDate": endDate,
//         "cy_current": cy_current,
//         "cy_previous": cy_previous
//     }
//     localStorage.setItem("date", stringToBase64(JSON.stringify(date)))
//     dateDetails = date;

// }
// // //fetch financial year end

// // Fetch all table names

// var test;

// // async function fetchSelectedCompany() {
// //     if (localStorage.getItem("company") == null || localStorage.getItem("company") == "null" || localStorage.getItem("company") == undefined) {
// //         if ($(".companyList>tbody").children().length > 0) {
// //             let companyId = $(".companyList>tbody>tr:first").find('.companyID').text().replace("(", "").replace(")", "")
// //             let companyDetails = await fetchTable(`select * from syf_companymaster where lid='${companyId}'`)
// //             let type = $(".companyList>tbody>tr:first").attr("val")
// //             companyDetails[0]['type'] = type
// //             companyInfo = companyDetails[0]

// //         }
// //         else {
// //             companyInfo = { 'status': 'No Company' }
// //         }
// //         localStorage.setItem("company", stringToBase64(JSON.stringify(companyInfo)));

// //     }
// //     let localHistory = JSON.parse(base64ToString(localStorage.getItem("company")));
// //     if (localHistory.hasOwnProperty("status") && localHistory.status == "No Company") {
// //         $(".selectedCompany,.companyList thead .companyName").text(localHistory.status);

// //     } else {
// //         // $(".companyList thead tr").attr("val", "commonCompany")
// //         if (localHistory.type == "commonCompany") {
// //             $(".companyList thead>tr>th:first").addClass("editCompany")
// //             $(".companyList thead>tr>th:first").html(`<i class="fa-regular fa-pen-to-square"></i>`)
// //             $(".companyList thead .defaultload").html(`<input type="radio" name='companyL' ${localHistory.defaultload}>`);
// //         }
// //         else if (localHistory.type == "sharedCompany") {
// //             $(".companyList thead>tr>th:first").remove("editCompany")
// //             $(".companyList thead>tr>th:first").html(``)
// //             $(".companyList thead .defaultload").html(``);
// //         }
// //         $(".selectedCompany,.companyList thead .companyName").text(localHistory.companyname);
// //         $(".companyList thead .companyID").text(`(${localHistory.lid})`);
// //         $(`#${localHistory.lid}`).parent().remove()
// //         companyInfo = localHistory
// //     }
// //     if (userInfo.type != syf.owner) {
// //         let modules = await getSharedModules()
// //         showModules(modules)
// //     }
// //     else {
// //         if (localHistory.type == "commonCompany") {
// //             await getAllModules()
// //         }
// //         else if (localHistory.type == "sharedCompany") {
// //             let modules = await getSharedModules()
// //             if (modules.length > 0) {
// //                 showModules(modules)
// //             }
// //         }

// //     }

// //     fetchSelectedFinancialYear()

// // }

// // function fetchSelectedFinancialYear() {
// //     // let calendarYear = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];
// //     let financialYear = ["2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26", "2026-27", "2027-28", "2028-29", "2029-30", "2030-31"];
// //     let dateDetail = localStorage.getItem("date")
// //     let currentYear, previousYear, startMonth, endMonth, startDate, endDate, cy_current, cy_previous;
// //     if (dateDetail != null) {
// //         let dateDetails = JSON.parse(base64ToString(localStorage.getItem("date")));
// //         currentYear = dateDetails.currentYear
// //         previousYear = dateDetails.previousYear
// //         startMonth = dateDetails.startMonth
// //         endMonth = dateDetails.endMonth
// //         startDate = dateDetails.startDate
// //         endDate = dateDetails.endDate
// //         cy_current = dateDetails.cy_current
// //         cy_previous = dateDetails.cy_previous

// //     } else {

// //         // let yearList;
// //         // let company_fe = await fetchTable(`select * from syf_companymaster where lid='${companyInfo.lid}'`)
// //         let company = companyInfo
// //         let fs_startMonth = Number(company.financialstartmonth)

// //         let currentDate = new Date();
// //         let year = currentDate.getFullYear();

// //         if (fs_startMonth == 0) {
// //             // yearList = calendarYear
// //             currentYear = year;
// //             previousYear = Number(year) - 1;
// //             cy_current = year;
// //             cy_previous = Number(cy_current) - 1;
// //             startMonth = company.financialstartmonth;
// //             endMonth = 12;
// //             if (endMonth < 9) {
// //                 endMonth = `0${endMonth}`
// //             }
// //             startDate = `${year}-${company.financialstartmonth}-01`;
// //             endDate = `${year}-${endMonth}-31`;
// //         } else {
// //             // yearList = financialYear
// //             let year_suffix = Number(year.toString().substring(2, 4))
// //             currentYear = `${year}-${year_suffix + 1}`
// //             let currentYear_dateFormat = new Date(`${year}-${company.financialstartmonth}-01`);
// //             let previousYear_dateFormat = new Date(currentYear_dateFormat.setMonth(currentYear_dateFormat.getMonth() - 12))
// //             let split1 = currentYear.split("-")
// //             cy_current = Number("20" + split1[1]);
// //             cy_previous = Number(cy_current) - 1;
// //             previousYear = `${Number(split1[0]) - 1}-${Number(split1[1]) - 1}`;
// //             startMonth = company.financialstartmonth;
// //             endMonth = previousYear_dateFormat.getMonth();

// //             if (endMonth < 9) {
// //                 endMonth = `0${endMonth}`
// //             }
// //             startDate = `${split1[0]}-${company.financialstartmonth}-01`;
// //             endDate = `20${split1[1]}-${endMonth}-31`;

// //         }

// //     }

// //     let financialYearOptions = ""
// //     financialYear.forEach((year) => {
// //         financialYearOptions += `
// //              <li><a class="dropdown-item m-0 p-1 pl-1 text-center startYearOption" href="#">${year}</a></li>
// //         `;
// //     })

// //     $(".financialStartYearTable").html(financialYearOptions)

// //     let date = {
// //         "currentYear": currentYear,
// //         "previousYear": previousYear,
// //         "startMonth": startMonth,
// //         "endMonth": endMonth,
// //         "startDate": startDate,
// //         "endDate": endDate,
// //         "cy_current": cy_current,
// //         "cy_previous": cy_previous
// //     }
// //     localStorage.setItem("date", stringToBase64(JSON.stringify(date)))
// //     dateDetails = date;
// //     $('.selectFinancialYear').text(currentYear)

// // }

// async function fetchTableList() {
//     let getTable_query = stringToBase64(`select * from tableMaster`);
//     let getTable_call = await queryGet([getTable_query]);
//     let getTable_res = getTable_call.responseData.table;

//     let tableOptions = [];
//     let tableObj = {};
//     getTable_res.map((table) => {
//         tableOptions.push({ label: table.tablename, value: table.lid });
//         tableObj[table.lid] = stringToBase64(table.tablelinkname)
//     });

//     return {
//         "obj": tableObj,
//         "options": tableOptions,
//     };
// }

// async function fetchWholeTable(tableLinkName, labelName, valueName) {
//     let tableName = base64ToString(tableLinkName)
//     let getTable_query = stringToBase64(`select * from ${tableName}`);
//     let getTable_call = await queryGet([getTable_query]);
//     let getTable_res = getTable_call.responseData.table;

//     let tableOptions = getTable_res.map((table) => {
//         return ({ label: table[labelName], value: table[valueName] });
//     });

//     return {
//         "obj": getTable_res,
//         "options": tableOptions,
//     };
// }

// async function fetchOptions(query, labelName, valueName) {
//     let getTable_query = stringToBase64(query);
//     let getTable_call = await queryGet([getTable_query]);
//     let getTable_res = getTable_call.responseData.table;

//     let tableOptions = getTable_res.map((table) => {
//         return ({ label: table[labelName], value: table[valueName] });
//     });

//     return tableOptions;
// }
// // Fetch BE table using SQL
// async function fetchTable(query) {
//     let getCompany_query = stringToBase64(query);
//     let getCompany_call = await queryGet([getCompany_query]);
//     let getCompany_res = getCompany_call.responseData.table;
//     return getCompany_res;
// }

// // CRUD operation in BE table using SQL
// async function exeQuery(query) {
//     let getCompany_query = stringToBase64(query);
//     let getCompany_call = await queryGet([getCompany_query]);
//     return getCompany_call;
// }

// // Send mail
// async function sendMail(data) {
//     let fe = await fetch(`${baseUrl}/api/GGSHEmailService/GGSHEmailSenderService`, {
//         method: "POST",
//         body: data
//     })
//     let jsonfe = await fe.text();
//     return jsonfe;
// }

// // function to get entity types
// async function getEntity() {
//     entityOption = [
//         { label: "PvtLtd", value: "PvtLtd" },
//         { label: "Public", value: "Public" },
//         { label: "FortNightly", value: "FortNightly" },
//         { label: "LLP", value: "LLP" },
//         { label: "Firm", value: "Firm" },
//         { label: "Soleproprieter", value: "Soleproprieter" }
//     ];
//     let response = {
//         options: entityOption
//     }
//     return response;
// }

// // function to get redirecturl
// async function getRedirectUrl() {
//     let urlOption = [
//         { label: "com", value: "com" },
//         { label: "in", value: "in" },
//         { label: "org", value: "org" },
//         { label: "io", value: "io" },
//         { label: "net", value: "net" },
//         { label: "biz", value: "biz" },
//     ]
//     let response = {
//         options: urlOption
//     }
//     return response;

// }

// //CRUD Operation API
// async function recordOperation(record) {
//     let postFe = await fetch(baseUrl + "/api/Speed/DynamicCRUDTables", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", 'accept': 'text/plain', "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify(record)
//     })
//     let postJsonfe = await postFe.json();
//     return postJsonfe;
// }

// async function recordGetPost(data) {
//     let fe = await fetch(baseUrl + "/api/Speed/DynamicGetDataTable", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", 'accept': 'text/plain', "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify(data)
//     })
//     let jsonfe = await fe.json();
//     return jsonfe;
// }

// // Get Schema Details
// async function getSchema() {
//     let fe = await fetch(baseUrl + "/api/Speed/GetTablecolumnSchemaDetails", {
//         method: "GET",
//         headers: { "Content-Type": "application/json", 'accept': 'text/plain', "Access-Control-Allow-Origin": "*" },
//     })
//     let jsonfe = await fe.json();
//     return jsonfe;
// }
// async function getAllContact(entity) {
//     let getContacts_query = stringToBase64(`SELECT * FROM contactMaster WHERE entity='${entity}'`);
//     let getContacts_call = await queryGet([getContacts_query]);
//     let allContact = getContacts_call.responseData.table;

//     let contactOption = [];
//     allContact.map((contactMap) => {
//         //mm if (permUser.includes(contactMap.name) == true) {
//         contactOption.push({ label: contactMap.name, value: contactMap.name });
//         // }s
//     });
//     let response = {
//         obj: allContact,
//         options: contactOption
//     }
//     return response;
// }

// // Get Company Master
// async function getCompanyMaster() {
//     let getCompany_query = stringToBase64(`SELECT * FROM companyMaster`);
//     let getCompany_call = await queryGet([getCompany_query]);
//     let getCompany_res = getCompany_call.responseData.table;
//     return getCompany_res;
// }

// // Get usermail
// async function checkUserEmail(emaildata) {
//     let getUserEmail_query = stringToBase64(`SELECT * FROM SYF_USERMASTER WHERE email='${emaildata}'`);
//     let getUserEmail_call = await queryGet([getUserEmail_query]);
//     let getUserEmail_res = getUserEmail_call.responseData.table;
//     return getUserEmail_res;
// }

// async function getsyfAcbkMaster() {
//     let getCompany_query = stringToBase64(`SELECT * FROM SYF_COMPANYACBKMASTER`);
//     let getCompany_call = await queryGet([getCompany_query]);
//     let getCompany_res = getCompany_call.responseData.table;
//     return getCompany_res;
// }

// // Get CompanyAcBk Master
// async function getCompanyAcBkMaster(data) {
//     let getCompanyAcbk_query = stringToBase64(`SELECT * FROM companyAcBkMaster WHERE addedUser='${data}'`);
//     let getCompanyAcbk_call = await queryGet([getCompanyAcbk_query]);
//     let getCompanyAcbk_res = getCompanyAcbk_call.responseData.table;

//     let accountOptions = [];
//     getCompanyAcbk_res.map((compaccounts) => {
//         accountOptions.push(compaccounts);
//     });
//     return accountOptions;
// }

// async function getFollowups() {
//     let date_query = stringToBase64(`SELECT * FROM followupLog`);
//     let date_call = await queryGet([date_query]);
//     let date_res = date_call.responseData.table;
//     return date_res;
// }

// // Get All PythonFunctions
// async function getAllPythonFunctions() {
//     let pythonFn = {
//         "tableName": "allPythonFunctions",
//         "crudOperation": "VIEW",
//         "columnData": null
//     }
//     let pythonFnRes = await recordGetPost(pythonFn);
//     let options = pythonFnRes.map((item) => {
//         return { label: item.name, value: item.url };
//     });

//     let res = {
//         obj: pythonFnRes,
//         options: options,
//     }
//     return res;
// }
// // get all assignmentnature
// async function getAssignmentNature() {
//     let assignNature = {
//         "tableName": "AssignmentNature",
//         "crudOperation": "VIEW",
//         "columnData": null
//     }
//     let assignNatureRes = await recordGetPost(assignNature);
//     let options = assignNatureRes.map((item) => {
//         return { label: item.assignmentNature, value: item.lid };
//     });

//     let res = {
//         obj: assignNatureRes,
//         options: options,
//     }
//     return res;
// }

// // GET INVITEDUSERS
// async function getInvitedUsers() {
//     company = JSON.parse(base64ToString(localStorage.getItem("company")));
//     let invitedUsers = {
//         "tableName": "INVITEDUSERS",
//         "crudOperation": "VIEW",
//         "columnData": null
//     }
//     let inviteUserRes = await recordGetPost(invitedUsers);
//     return inviteUserRes;
// }

// // Get All users
// async function getMasterUserList() { // EmailList
//     let fe_userList = stringToBase64(`select name from syf_usermaster`); //  where email IN (${EmailList})
//     let fe_userListCall = await queryGet([fe_userList]);
//     let fe_userListres = fe_userListCall.responseData.table;
//     let userOptions = fe_userListres.map(partner => {
//         return { label: partner.name, value: partner.name };
//     });

//     return userOptions;
// }

// // Get ALL Employees
// async function getEmployee(companyList) {
//     let companyItem = ""
//     companyList.map((item, inx) => {

//         if (companyList.length == inx + 1) {
//             companyItem += `'${item}'`;
//         }
//         else {
//             companyItem += `'${item}',`;
//         }
//     });
//     if (companyItem !== '') {

//         let getEmployee = stringToBase64(`SELECT * FROM userEntityMaster WHERE companyName IN(${companyItem})`);
//         let getEmployee_call = await queryGet([getEmployee]);
//         let getEmployee_res = getEmployee_call.responseData.table;

//         if (getEmployee_res.length > 0) {
//             let employeeList = [];
//             getEmployee_res.map((emp) => {
//                 employeeList.push(emp.userName);
//             });

//             let uniqueEmployee = Array.from(new Set(employeeList));
//             let empOptions = uniqueEmployee.map((userName) => {
//                 return ({ label: userName, value: userName });
//             });
//             return empOptions;
//         }
//     }
//     else {
//         let noData = [{ "nodata": "nodata" }]
//         return noData;
//     }

// }
// // Get Organization ID
// // async function getOrgID(data) {

// //     let fe = await fetch(baseUrl + "/api/Zoho/getZohoOrganizationsZohoConnector?loggedInUserEmail=" + data, {
// //         method: "GET",
// //         headers: { "Content-Type": "application/json", 'accept': 'text/plain', "Access-Control-Allow-Origin": "*" },
// //     })
// //     let jsonfe = await fe.json();
// //     return jsonfe;
// // }

// async function getOrgID(data) {
//     try {
//         let fe = await fetch(baseUrl + "/api/Zoho/getZohoOrganizationsZohoConnector?loggedInUserEmail=" + data, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "accept": "text/plain",
//                 "Access-Control-Allow-Origin": "*"
//             },
//         });

//         // Check if response is OK
//         if (!fe.ok) {
//             throw new Error(`HTTP error! status: ${fe.status}`);
//         }

//         // Log the raw response
//         const textResponse = await fe.text();

//         // Attempt to parse JSON only if response is not empty
//         if (textResponse) {
//             const jsonfe = JSON.parse(textResponse);
//             return jsonfe;
//         } else {
//             throw new Error("Empty response from server.");
//         }
//     } catch (error) {
//         return null;  // Handle or return fallback value
//     }
// }

// // Bulk Insert
// async function bulkInsert(data) {
//     let fe = await fetch(baseUrl + "/api/Speed/BulkInsertJsonToDataStore", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", 'accept': 'text/plain', "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify(data)
//     })
//     let jsonfe = await fe.json();
//     return jsonfe;
// }

// // Get ALL ggshCoa
// async function getGgshCoa(company) {
//     let getCompany_query = stringToBase64(`SELECT * FROM SYF_COMPANYMASTER WHERE companyName='${company}'`);
//     let getCompany_call = await queryGet([getCompany_query]);
//     let getCompany_res = getCompany_call.responseData.table;

//     let companyid = getCompany_res[0].lid;
//     let getggshCoa_query = stringToBase64(`SELECT * FROM coamaster WHERE companyid='${companyid}'`);
//     let getggshCoa_call = await queryGet([getggshCoa_query]);
//     let getggshCoa_res = getggshCoa_call.responseData.table;

//     // let getGgshAllCoa = stringToBase64(`SELECT * FROM ggshCoa`);

//     // await recordGetPost(getGgshCoa);
//     let ggshCoaOptions = [];

//     getggshCoa_res.map((gCoa) => {
//         ggshCoaOptions.push({ label: gCoa.coa + "=>" + gCoa.head, value: gCoa.coa + "=>" + gCoa.head });
//     });

//     let response = {
//         obj: getggshCoa_res,
//         options: ggshCoaOptions
//     }
//     return response;
// }

// // Get speedDrive Master

// async function getSpeedFileDrive(loginUserName) {
//     let getSpeedFileDrive_query = stringToBase64(`SELECT * FROM speedDrive where userName='${loginUserName}'`);
//     let getSpeedFileDrive_call = await queryGet([getSpeedFileDrive_query]);
//     let getSpeedFileDrive_res = getSpeedFileDrive_call.responseData.table;
//     return getSpeedFileDrive_res;
// }
// async function getSpeedFileDriveDataCompany(userid, companyid) {
//     let getSpeedFileDrive_querycompany = stringToBase64(`SELECT * FROM speedDrive where userid='${userid}' AND companyid='${companyid}'`);
//     let getSpeedFileDrive_callcompany = await queryGet([getSpeedFileDrive_querycompany]);
//     let getSpeedFileDrive_rescompany = getSpeedFileDrive_callcompany.responseData.table;
//     return getSpeedFileDrive_rescompany;

// }
// async function getSpeedDriveData() {
//     let getSpeedFileDrive_query = stringToBase64(`SELECT * FROM speedDrive`);
//     let getSpeedFileDrive_call = await queryGet([getSpeedFileDrive_query]);
//     let getSpeedFileDrive_res = getSpeedFileDrive_call.responseData.table;
//     return getSpeedFileDrive_res;
// }

// // / Get global report master
// async function getGlobalReportMaster() {
//     let getGlobalAudit_query = stringToBase64(`SELECT * FROM GlobalReportMaster`);
//     let getGlobalAudit_call = await queryGet([getGlobalAudit_query]);
//     let getGlobalAudit_res = getGlobalAudit_call.responseData.table;
//     return getGlobalAudit_res;
// }
// // Get gloalMasterID
// async function getGlobalID() {
//     let getDocumentID_query = stringToBase64(`SELECT MAX(documentID) FROM GlobalReportMaster`);
//     let getDocumentID_call = await queryGet([getDocumentID_query]);
//     let getDocumentID_res = getDocumentID_call.responseData.table;
//     return getDocumentID_res[0].column1;
// }
// // Get transactionReportMaster
// async function getTransactionCompanyMaster() {
//     let getTransactionAudit_query = stringToBase64(`SELECT * FROM transactionReportMaster`);
//     let getTransactionAudit_call = await queryGet([getTransactionAudit_query]);
//     let getTransactionAudit_res = getTransactionAudit_call.responseData.table;
//     return getTransactionAudit_res;
// }

// async function getGlobalTemplateMaster() {
//     let getGlobalAudit_query = stringToBase64(`SELECT * FROM SYF_GLOBALTEMPLATES`);
//     let getGlobalAudit_call = await queryGet([getGlobalAudit_query]);
//     let getGlobalAudit_res = getGlobalAudit_call.responseData.table;
//     return getGlobalAudit_res;
// }
// async function getTemplateTransactionMaster() {
//     let getTransAudit_query = stringToBase64(`SELECT * FROM templateTransaction`);
//     let getTransAudit_call = await queryGet([getTransAudit_query]);
//     let getTransAudit_res = getTransAudit_call.responseData.table;
//     return getTransAudit_res;
// }

// // / Get gloalMasterID
// async function getTransactionID() {
//     let getDocumentID_query = stringToBase64(`SELECT MAX(documentID) FROM transactionReportMaster`);
//     let getDocumentID_call = await queryGet([getDocumentID_query]);
//     let getDocumentID_res = getDocumentID_call.responseData.table;
//     return getDocumentID_res[0].column1;
// }

// // get Total Collections
// async function getTotalCollections() {

//     let date_query = stringToBase64(`SELECT *
//     FROM AllInvoices
//     WHERE status='Collected'`);
//     let date_call = await queryGet([date_query]);
//     let date_res = date_call.responseData.table;
//     return date_res;
// }

// // Generate Static alert messages
// async function staticAlert(message, color) {

//     let res =
//         `<div class="alert alert-${color} alert-dismissible fade show text-center" role="alert">
//             <strong> ${message} </strong>
//             <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//                 <span aria-hidden="true">&times;</span>
//             </button>

//         </div>`

//     $(".topbar").prepend(res);

// }

// // Generate alert messages
// async function dismissibleAlert(message, color) {

//     let res =
//         `<div class="alert alert-${color} alert-dismissible fade show text-center dismissibleAlert" style="position:fixed;top:0px;width:100%;" role="alert">
//             <strong> ${message} </strong>
//         </div>`

//     $(".topbar").prepend(res);

//     setTimeout(() => {
//         $(document).find(".dismissibleAlert").fadeOut(200)
//     }, 4000)

// }

// async function workPaper(data, url) {
//     let fe = await fetch(pythonUrl + url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//     });
//     let jsonfe = await fe.json();
//     return jsonfe;
// }

// async function getGstin() {
//     let query = stringToBase64(`SELECT * FROM gstinMaster`);
//     let res = await queryGet([query]);
//     let data = res.responseData.table;
//     return data;
// }

// async function getInvitedUserName() {
//     let query = stringToBase64(`SELECT * FROM SYF_USERMASTER WHERE EMAIL `);

// }

// async function getCalendarMonth() {
//     let monthList = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "7", "Aug": "8", "Sep": "9", "Oct": "10", "Nov": "11", "Dec": "12" };
//     let monthOption = [];
//     let keys = Object.keys(monthList);
//     keys.map((key) => {
//         monthOption.push({ label: key, value: monthList[key] });
//     });
//     return monthOption;
// }

// // Fetch all the months
// async function getMonth() {
//     let monthList = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" };
//     let monthOption = [];
//     let keys = Object.keys(monthList);
//     keys.map((key) => {
//         monthOption.push({ label: key, value: monthList[key] });
//     });
//     return monthOption;
// }

// async function getYear() {
//     let monthList = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];
//     let yearOption = [];
//     monthList.map((yearMap) => {
//         yearOption.push({ label: yearMap, value: yearMap });
//     });
//     return yearOption;
// }

// // get financial year
// async function getFinancialYear() {
//     let query = stringToBase64(`SELECT * FROM dbo.fnfetchfylist() ORDER BY FY`);
//     let res = await queryGet([query]);
//     let data = res.responseData.table;
//     let fy_options = data.map((item) => {
//         return ({ label: item.fy, value: item.fy });
//     });
//     return fy_options;
// }

// async function getFinancialYearOnly() {
//     let query = stringToBase64(`SELECT * FROM dbo.fnfetchfylist() ORDER BY FY`);
//     let res = await queryGet([query]);
//     let data = res.responseData.table;
//     let fy_options = data.map((item) => {
//         return item.fy
//     });
//     return fy_options;
// }
// // Rupee conversion for numbers

// // AR datas fetch
// async function getARjoinedData() {
//     let arJoined_query = stringToBase64(`SELECT * FROM arControljonied`);
//     let arJoined_call = await queryGet([arJoined_query]);
//     let arJoined_res = arJoined_call.responseData.table;
//     return arJoined_res;
// }

// async function getARContact() {
//     let contact_query = stringToBase64(`SELECT * FROM contactMaster`);
//     let contact_call = await queryGet([contact_query]);
//     let contact_res = contact_call.responseData.table;
//     return contact_res;
// }

// async function getARReminder() {
//     let reminder_query = stringToBase64(`SELECT * FROM AR_ReminderSettings`);
//     let reminder_call = await queryGet([reminder_query]);
//     let reminder_res = reminder_call.responseData.table;
//     return reminder_res;
// }
// // AR datas fetch end
// //******************************** API Templates End ********************************

// //******************************** Common Workflows Start ********************************
// // alert close workflow
// $("body").on("click", ".close", (e) => {
//     $(e.currentTarget).parent().slideUp(200);
// })
// $("body").on("click", ".signout", () => {
//     // Optionally, redirect to a different page

//     localStorage.removeItem("user");
//     localStorage.removeItem("date");
//     localStorage.removeItem("company");
//     localStorage.removeItem("activeModule");
//     localStorage.removeItem("moduleType");
//     localStorage.removeItem("topbar");
//     localStorage.removeItem("sidebar");
//     window.location.href = '/login/login.html';
//     // window.open(`${formUrl}/login/login.html`, `_self`)
//     // On your logout success page
//     window.history.pushState(null, '', `${formUrl}/landingPage/landingPage.html`);
//     window.history.go(-1); // Go back to previous page
//     window.history.go(-1); // Go back again to remove the original page from history

// })
// // Logout button click handler
// //  done by yohana
// // $("body").on("click", ".signout", async () => {
// //     localStorage.removeItem("user");
// //     localStorage.removeItem("date");
// //     localStorage.removeItem("company");
// //     localStorage.removeItem("activeModule");
// //     localStorage.removeItem("moduleType");
// //     localStorage.removeItem("topbar");
// //     localStorage.removeItem("sidebar");
// //     // Send logout request to the server
// //     var username = sessionStorage.getItem('user');
// //     if (!username) {
// //         window.open(`${formUrl}/landingPage/landingPage.html`, `_self`);
// //     } else {
// //     }
// //     try {
// //         const response = await fetch('http://localhost:3000/logout', {
// //             method: 'GET',
// //         });
// //         if (response.ok) {
// //             sessionStorage.removeItem('user');
// //             window.open(`${formUrl}/landingPage/landingPage.html`, `_self`);

// //         } else {
// //             alert('Error during logout. Please try again.');
// //         }
// //     } catch (error) {
// //         alert('Network error during logout. Please try again.');
// //     }

// //     window.onpageshow = function (event) {
// //         if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
// //             sessionStorage.clear();
// //             window.open(`${formUrl}/landingpage/landingpage.html`, `_self`);
// //         }
// //     };
// // });
// // Check if user is signed in
// // const userSession = sessionStorage.getItem("user");

// // if (!userSession) {
// //     window.open(`${formUrl}/landingPage/landingPage.html`);
// // }

// // $("body").on("click", ".signout", async () => {
// //     // Clear local and session storage
// //     localStorage.removeItem("user");
// //     localStorage.removeItem("date");
// //     localStorage.removeItem("company");
// //     localStorage.removeItem("activeModule");
// //     localStorage.removeItem("moduleType");
// //     localStorage.removeItem("topbar");
// //     localStorage.removeItem("sidebar");
// //     sessionStorage.clear();
// //     sessionStorage.setItem("signedOut", "true");

// //     // Send logout request to the server
// //     try {
// //         const response = await fetch('http://localhost:3000/logout', {
// //             method: 'GET',
// //         });
// //         if (response.ok) {
// //             window.location.replace(`${formUrl}/landingPage/landingPage.html`);
// //         } else {
// //             alert('Error during logout. Please try again.');
// //         }
// //     } catch (error) {
// //         alert('Network error during logout. Please try again.');
// //     }
// // });

// // done by yohana end

// // On click of edit icon in company menu
// $(".topbar").on("click", ".editCompany", (e) => {
//     let target = e.currentTarget;
//     let companyID = stringToBase64($(target).parent().find(".companyID").text().replace("(", "").replace(")", ""))
//     window.open(`${formUrl}/settings/companyPage.html?q1=${companyID}`, `_self`)
// });

// // On click of Company Name in company menu
// $(".topbar").on("click", ".companyName", async (e) => {
//     let target = e.currentTarget;
//     let companyName = $(target).text();
//     let companyID = $(target).parent().find(".companyID").text().replace("(", "").replace(")", "")
//     companyId = companyID
//     let checkStatus = $(target).parent().find(".defaultload input").prop("checked")
//     let loadStatus;
//     (checkStatus) ? loadStatus = "checked" : loadStatus = "";

//     let selectedCompany = {
//         "companyname": companyName,
//         "companyID": companyID,
//         "defaultload": loadStatus
//     }
//     localStorage.setItem("company", stringToBase64(JSON.stringify(selectedCompany)))
//     await fetchSelectedCompany();

// });

// // On click of default load checkbox in company menu
// $(".topbar").on("click", ".defaultload", async (e) => {
//     let target = e.currentTarget;
//     let loadStatus = $(target).find("input").prop("checked");
//     let companyID = $(target).parent().find(".companyID").text().replace("(", "").replace(")", "")

//     if (loadStatus) {
//         let clearDefaultLoadCompany = await exeQuery(`update syf_companymaster set defaultload='' where userid='${userInfo.lid}'`);
//         if (clearDefaultLoadCompany.responseType == "SUCCESS") {
//             let localHistory = JSON.parse(base64ToString(localStorage.getItem("company")));
//             localHistory.defaultload = "";
//             localStorage.setItem("company", stringToBase64(JSON.stringify(localHistory)))

//             let updateDefaultLoadCompany = await exeQuery(`update syf_companymaster set defaultload='checked' where lid='${companyID}'`);

//             if (updateDefaultLoadCompany.responseType == "SUCCESS") {
//                 $(".companyList").find(`.defaultload input`).prop("checked", false);
//                 $(target).find("input").prop("checked", true);
//             }
//         }
//     }
// });

// // On click of Add new button in company menu
// $(".topbar").on("click", "#addnew", async () => {
//     addPageLoader();
//     let newCompany = await createNewCompany();
//     let encrypted_companyID = stringToBase64(newCompany.lid);
//     await resetCompanyCoa(userInfo.name, newCompany.companyname, newCompany.lid)

//     removePageLoader();
//     window.open(`${formUrl}/settings/companyPage.html?q1=${encrypted_companyID}`, `_self`)
// });

// // toggle sidebar, active sidebar - Atchaya
// $(document).on('click', '.toggle-sidebar-btn', () => {
//     $('body').toggleClass('toggle-sidebar');
// })
// $(document).on('click', '.moduleActive', (e) => {
//     let value = $(e.currentTarget).attr("id")
//     if ($(e.currentTarget).hasClass('shared')) {
//         localStorage.setItem('moduleType', 'shared')
//     } else {
//         localStorage.setItem('moduleType', 'common')
//     }
//     localStorage.setItem('activeModule', value)
// })

// // onclick of financial start year option - Atchaya
// $(document).on('click', '.startYearOption', async (e) => {
//     let value = $(e.currentTarget).text()
//     $('.selectFinancialYear').text(value)

//     let selectedCompany_id = $(".companyList thead .companyID").text().replace("(", "").replace(")", "");
//     let company_fe = await fetchTable(`select * from syf_companymaster where lid='${selectedCompany_id}'`)
//     let company = company_fe[0]

//     let split1 = value.split("-")
//     let year = split1[0]
//     let currentYear, previousYear, startMonth, endMonth, startDate, endDate, cy_current, cy_previous;

//     if (split1.length == 0) {
//         currentYear = value;
//         previousYear = Number(year) - 1;
//         startMonth = company.financialstartmonth;
//         endMonth = "12";
//         if (endMonth < 9) {
//             endMonth = `0${endMonth}`
//         }
//         startDate = `${year}-${company.financialstartmonth}-01`;
//         endDate = `${year}-${endMonth}-31`;
//         cy_current = Number(year);
//         cy_previous = Number(cy_current) - 1;

//     } else {
//         currentYear = value;
//         previousYear = `${Number(split1[0]) - 1}-${Number(split1[1]) - 1}`;
//         startMonth = company.financialstartmonth;
//         let currentYear_dateFormat = new Date(`${split1[0]}-${company.financialstartmonth}-01`);
//         new Date(currentYear_dateFormat.setMonth(currentYear_dateFormat.getMonth() - 12))
//         endMonth = currentYear_dateFormat.getMonth();
//         if (endMonth < 9) {
//             endMonth = `0${endMonth}`
//         }
//         startDate = `${split1[0]}-${company.financialstartmonth}-01`;
//         endDate = `20${split1[1]}-${endMonth}-31`;
//         cy_current = Number("20" + split1[1]);
//         cy_previous = Number(cy_current) - 1;

//     }

//     let date = {
//         "currentYear": currentYear,
//         "previousYear": previousYear,
//         "startMonth": startMonth,
//         "endMonth": endMonth,
//         "startDate": startDate,
//         "endDate": endDate,
//         "cy_current": cy_current,
//         "cy_previous": cy_previous
//     }
//     localStorage.setItem("date", stringToBase64(JSON.stringify(date)))
//     dateDetails = date;
// })

// // sql functions
// async function recordGetPost(data) {
//     let fe = await fetch(baseUrl + "/api/Speed/DynamicGetDataTable", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", 'accept': 'text/plain', "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify(data)
//     })
//     let jsonfe = await fe.json();
//     return jsonfe;
// }

// //CRUD Operation API
// async function recordOperation(record) {
//     let postFe = await fetch(baseUrl + "/api/Speed/DynamicCRUDTables", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", 'accept': 'text/plain', "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify(record)
//     })
//     let postJsonfe = await postFe.json();
//     return postJsonfe;
// }

// async function createNewCompany() {
//     let addedTime = dateTimeGeneration(new Date());
//     let companyName = `Company_${addedTime}`;
//     let insertCompany = await exeQuery(`INSERT INTO SYF_COMPANYMASTER
//             (USERID,USERNAME,EMAIL,COMPANYNAME,ADDEDTIME,ADDEDUSER)
//             VALUES
//             ('${userInfo.lid}','${userInfo.name}','${userInfo.email}','${companyName}','${addedTime}','${userInfo.name}')
//         `);

//     let fetchCompany = await fetchTable(`select * from syf_companymaster where companyName='${companyName}'`)
//     return fetchCompany[0];
// }
// async function resetCompanyCoa(username, companyname, companyid) {
//     let addedTime = dateTimeGeneration(new Date())
//     let udeleteCoaMaster = await exeQuery(`delete from coaMaster where companyID='${companyid}'`);
//     let insertCoaMaster = await exeQuery(`INSERT INTO coaMaster(companyName,
//         coa,
//         alie,
//         bspl,
//         classification,
//         head,
//         subHead,
//         dc,
//         alieSeq,
//         classificatonSeq,
//         headSeq,
//         subHeadSeq,
//         misCoa,
//         country,
//         entityType
//         ) SELECT companyName,
//         coa,
//         alie,
//         bspl,
//         classification,
//         head,
//         subHead,
//         dc,
//         alieSeq,
//         classificatonSeq,
//         headSeq,
//         subHeadSeq,
//         misCoa,
//         country,
//         entityType FROM ggshCoa;
//         UPDATE coaMaster SET companyName='${companyname}',companyID='${companyid}',addedUser='${username}',addedTime='${addedTime}'
//         WHERE companyName='Not Set'`);
// }

// //******************************** Common Workflows End ********************************

// //******************************** Loader Section End ********************************
// // Page Loader
// // function addPageLoader() {
// //     $(`body`).prepend(
// //         `<div class="pageLoader">
// //             <img src='../assets/img/syf_title_logo.jpg'>
// //             <div class="loader"></div>
// //         </div>`
// //     )
// // }
// // function removePageLoader() {
// //     $(`body`).find(".pageLoader").remove()
// // }
// function addPageLoader() {
//     $(`main`).append(
//         `<div id="loadingSpinner" class="page_spinner-container">
//             <div class="vertical-bar bar1"></div>
//             <div class="vertical-bar bar2"></div>
//         </div>`
//     )
// }
// function removePageLoader() {
//     $(`main`).find("#loadingSpinner").remove()
//     $(".showContent").show()
// }
// function addPageWiseLoader() {
//     $(`main`).append(
//         `<div id="loadingSpinner" class="page_spinner-container">
//             <div class="vertical-bar bar1"></div>
//             <div class="vertical-bar bar2"></div>
//         </div>`
//     )
// }
// function removePageWiseLoader() {
//     $(`main`).find("#loadingSpinner").remove()
// }

// // Spinner
// function addSpinner(target) {
//     $(target).html(`<i class="fa-solid fa-spinner fa-spin-pulse"></i>`)
// }
// function removeSpinner(target) {
//     $(target).find(".fa-spinner").remove()
// }
// function commaSeparation(x) {
//     x = x.toString();
//     if (x[0] == "-") {
//         x = x.substring(1, x.length);
//         let lastThree = x.substring(x.length - 3);
//         let otherNumbers = x.substring(0, x.length - 3);
//         if (otherNumbers != '')
//             lastThree = ',' + lastThree;
//         let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
//         return ("-" + res);
//     }
//     else {
//         let lastThree = x.substring(x.length - 3);
//         let otherNumbers = x.substring(0, x.length - 3);
//         if (otherNumbers != '')
//             lastThree = ',' + lastThree;
//         let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
//         return (res);
//     }
// }

// //******************************** Loader Section End ********************************

// //******************************** Encryption Start ********************************
// //Convert string to base64
// function stringToBase64(str) {
//     //unescape characters and encode text to base64
//     return window.btoa(unescape(encodeURIComponent(str)));
// }

// //Convert base64 to string
// function base64ToString(str) {
//     //escape characters and decode base64 to text
//     return decodeURIComponent(escape(window.atob(str)));
// }
// //******************************** Encryption End ********************************

// // project management fetch start

// // Get All Milestones
// async function getAssignmentNature() {
//     let assignNature = {
//         "tableName": "AssignmentNature",
//         "crudOperation": "VIEW",
//         "columnData": null
//     }
//     let assignNatureRes = await recordGetPost(assignNature);
//     let options = assignNatureRes.map((item) => {
//         return { label: item.assignmentNature, value: item.lid };
//     });

//     let res = {
//         obj: assignNatureRes,
//         options: options,
//     }
//     return res;
// }
// async function getLeads() {
//     company = JSON.parse(base64ToString(localStorage.getItem("company")));
//     let getLeadsQuery = stringToBase64(`SELECT * FROM LEADMANAGEMENT where companyid='${company.companyID}'`);
//     try {
//         let getLeadsRes = await queryGet([getLeadsQuery])
//         return getLeadsRes.responseData.table
//     }
//     catch (error) {
//     }
// }
// async function getProposals() {
//     company = JSON.parse(base64ToString(localStorage.getItem("company")));
//     let getProposalQuery = stringToBase64(`SELECT * FROM AllContracts  where companyid='${company.companyID}'`);
//     try {
//         let getProposalRes = await queryGet([getProposalQuery])
//         return getProposalRes.responseData.table
//     }
//     catch (error) {
//     }
// }
// async function getContracts() {
//     company = JSON.parse(base64ToString(localStorage.getItem("company")));
//     let getContractsQuery = stringToBase64(`SELECT * FROM AllContracts where userid='${userInfo.lid}' and companyid='${company.companyID}'`);
//     try {
//         let getContractsRes = await queryGet([getContractsQuery])
//         return getContractsRes.responseData.table
//     }
//     catch (error) {
//     }
// }
// async function getContractsAssignment() {
//     company = JSON.parse(base64ToString(localStorage.getItem("company")));
//     let getContractsQuery = stringToBase64(`SELECT * FROM ContractAssignmentNature where companyid='${company.companyID}'`);
//     try {
//         let getContractsRes = await queryGet([getContractsQuery])
//         return getContractsRes.responseData.table
//     }
//     catch (error) {
//     }
// }

// // project management fetch end

// // invite users notification atchaya
// async function getAcceptedInvites(user) {
//     let getRoles_query = stringToBase64(`SELECT * from INVITEDUSERS where inviteduserid='${user.lid}' and status='pending'`)
//     let getRoles_call = await queryGet([getRoles_query]);
//     let getRoles_res = getRoles_call.responseData.table;
//     let length = getRoles_res.length
//     let notifyList = `<li class="dropdown-header notificationItem">
//                         You have <span class="top_count"></span> notifications
//                     </li>
//                     <li>
//                         <hr class="dropdown-divider">
//                     </li>`
//     getRoles_res.filter((item) => {
//         notifyList += `<li class="notification-item d-flex justify-content-center align-items-center p-3">
//                             <div>
//                                 <div>
//                                     <h5>Invitation from ${item.addeduser}</h5>
//                                     <div class='d-flex' id='${item.lid}'><button class='btn btn-success acceptInvite m-1 p-1'>Accept</button><button class='btn btn-danger rejectInvite m-1 p-1'>Reject</button></div>
//                                 </div>
//                             </div>
//                         </li>

//                         <li>
//                             <hr class="dropdown-divider">
//                         </li>`
//     })
//     $('.syf_notifications').html(notifyList)
//     $(".top_count").text(length)
// }
// async function changeInviteStatus(id, status) {
//     let changeStatus_query = stringToBase64(`UPDATE INVITEDUSERS SET STATUS='${status}' where LID='${id}'`)
//     let changeStatus_call = await queryGet([changeStatus_query]);
//     if (changeStatus_call.responseType == "SUCCESS") {
//         await getInfo()
//         await dismissibleAlert(`Invitation ${status}`, 'success')
//         await getAcceptedInvites(userInfo)
//     }

// }

// // invite users notification atchaya end

// //invite user modal
// async function getClients() {
//     let getUserEntity_query = stringToBase64(`SELECT * FROM SYF_COMPANYMASTER WHERE EMAIL='${userInfo.email}'`)
//     let getUserEntity_call = await queryGet([getUserEntity_query]);
//     let getUserEntity_res = getUserEntity_call.responseData.table;
//     let clientOption = [];
//     getUserEntity_res.map((userEntity) => {
//         clientOption.push({ label: userEntity.companyname, value: userEntity.lid });
//     });

//     let response = {
//         options: clientOption,
//         res: getUserEntity_res
//     }
//     return response;
// }

// async function getRoles() {
//     let getRoles_query = stringToBase64(`SELECT distinct role from roles`)
//     let getRoles_call = await queryGet([getRoles_query]);
//     let getRoles_res = getRoles_call.responseData.table;
//     let rolesOption = [];
//     getRoles_res.map((roles) => {
//         rolesOption.push({ label: roles.role, value: roles.role });
//     });

//     let response = {
//         options: rolesOption,
//         res: getRoles_res
//     }
//     return response;
// }
// async function getInvitedRoles() {
//     let getRoles_query = stringToBase64(`SELECT DISTINCT role FROM roles WHERE userid='${userInfo.lid}'`);
//     let getRoles_call = await queryGet([getRoles_query]);
//     let getRoles_res = getRoles_call.responseData.table;
//     let rolesOption = [];
//     if (getRoles_res.length > 0) {
//         getRoles_res.map((item) => {
//             rolesOption.push({ label: item.role, value: item.role });
//         })
//     }
//     else {
//         let getinvitedRoles_query = stringToBase64(`SELECT userid FROM invitedusers WHERE inviteduserid='${userInfo.lid}'`);
//         let getinvitedRoles_call = await queryGet([getinvitedRoles_query]);
//         let invitedRoles_res = getinvitedRoles_call.responseData.table;
//         if (invitedRoles_res.length > 0) {
//             let Userid = invitedRoles_res[0].userid;

//             let getRolesspecific_query = stringToBase64(`SELECT DISTINCT role FROM roles WHERE userid='${Userid}'`);
//             let getRolesspecific_call = await queryGet([getRolesspecific_query]);
//             let getRolesspecific_res = getRolesspecific_call.responseData.table;
//             if (getRolesspecific_res.length > 0) {
//                 getRolesspecific_res.map((item) => {
//                     rolesOption.push({ label: item.role, value: item.role });
//                 })
//             }
//         }
//     }
//     let response = {
//         options: rolesOption,
//         res: getRoles_res
//     };

//     return response;
// }
// // ACADEMY START
// async function getVideoCourse() {
//     let getcourseVideo_query = stringToBase64(`SELECT * FROM courseVideoMaster where status='inserted'`);
//     let getcourseVideo_call = await queryGet([getcourseVideo_query]);
//     let getcourseVideo_res = getcourseVideo_call.responseData.table;

//     let courseVideoOptions = [];
//     getcourseVideo_res.map((category) => {
//         let course = (category.coursename);
//         courseVideoOptions.push({ label: course, value: course });
//     });
//     let response = {
//         obj: getcourseVideo_res,
//         options: courseVideoOptions
//     }
//     return response;
// }
// async function getVideoCourseRecycle() {
//     let getcourseVideo_query = stringToBase64(`SELECT * FROM courseVideoMaster where status='deleted'`);
//     let getcourseVideo_call = await queryGet([getcourseVideo_query]);
//     let getcourseVideo_res = getcourseVideo_call.responseData.table;

//     let courseVideoOptions = [];
//     getcourseVideo_res.map((category) => {
//         let course = (category.coursename);
//         courseVideoOptions.push({ label: course, value: course });
//     });
//     let response = {
//         obj: getcourseVideo_res,
//         options: courseVideoOptions
//     }
//     return response;
// }

// async function getAcademyEvent() {
//     let getcourseEvent_query = stringToBase64(`SELECT * FROM academyEvent`);
//     let getcourseEvent_call = await queryGet([getcourseEvent_query]);
//     let getcourseEvent_res = getcourseEvent_call.responseData.table;

//     let courseEventOptions = [];
//     getcourseEvent_res.map((eventAcademy) => {
//         let eventCourse = (eventAcademy.eventName);
//         courseEventOptions.push({ label: eventCourse, value: eventCourse });
//     });
//     let response = {
//         obj: getcourseEvent_res,
//         options: courseEventOptions
//     }
//     return response;
// }

// async function getSubscriptionCourse() {
//     let getSubscribecourse_query = stringToBase64(`SELECT * FROM subscriptionTable`);
//     let getSubscribecourse_call = await queryGet([getSubscribecourse_query]);
//     let getSubscribecourse_res = getSubscribecourse_call.responseData.table;

//     let subscribeOptions = [];
//     getSubscribecourse_res.map((category) => {
//         let course = (category.course);
//         subscribeOptions.push({ label: course, value: course });
//     });
//     let response = {
//         obj: getSubscribecourse_res,
//         options: subscribeOptions
//     }
//     return response;

// }
// async function getCourse() {
//     let getCourse_query = stringToBase64(`SELECT * FROM courseMaster where status='inserted'`);
//     let getCourse_call = await queryGet([getCourse_query]);
//     let getCourse_res = getCourse_call.responseData.table;
//     let courseOptions = [];
//     getCourse_res.map((company) => {
//         let courseName = (company.coursename);
//         courseOptions.push({ label: courseName, value: courseName });
//     });
//     let response = {
//         obj: getCourse_res,
//         options: courseOptions
//     }
//     return response;
// }
// async function getCourseRecycle() {
//     let getCourse_query = stringToBase64(`SELECT * FROM courseMaster where status='deleted'`);
//     let getCourse_call = await queryGet([getCourse_query]);
//     let getCourse_res = getCourse_call.responseData.table;
//     let courseOptions = [];
//     getCourse_res.map((company) => {
//         let courseName = (company.coursename);
//         courseOptions.push({ label: courseName, value: courseName });
//     });
//     let response = {
//         obj: getCourse_res,
//         options: courseOptions
//     }
//     return response;
// }

// async function getCategory() {
//     let getCategory_query = stringToBase64(`SELECT * FROM academyCateoryTable where status='inserted'`);
//     let getCategory_call = await queryGet([getCategory_query]);
//     let getCategory_res = getCategory_call.responseData.table;
//     let categoryOptions = [];
//     getCategory_res.map((category) => {
//         let categoryName = (category.category);
//         categoryOptions.push({ label: categoryName, value: categoryName });
//     });
//     let response = {
//         obj: getCategory_res,
//         options: categoryOptions
//     }
//     return response;
// }
// async function getCategoryRecycle() {
//     let getCategory_query = stringToBase64(`SELECT * FROM academyCateoryTable where status='deleted'`);
//     let getCategory_call = await queryGet([getCategory_query]);
//     let getCategory_res = getCategory_call.responseData.table;
//     let categoryOptions = [];
//     getCategory_res.map((category) => {
//         let categoryName = (category.category);
//         categoryOptions.push({ label: categoryName, value: categoryName });
//     });
//     let response = {
//         obj: getCategory_res,
//         options: categoryOptions
//     }
//     return response;
// }

// // ACADEMY

// async function getUserSpecificRoles() {
//     let getRoles_query = stringToBase64(`SELECT role from INVITEDUSERS where inviteduseremail='${userInfo.email}'`)
//     let getRoles_call = await queryGet([getRoles_query]);
//     let getRoles_res = getRoles_call.responseData.table;
//     if (getRoles_res.length == 0) {
//         localStorage.setItem("role", stringToBase64("Analyst Developer"));
//         return "Analyst Developer"

//     } else {
//         localStorage.setItem("role", stringToBase64(getRoles_res[0].role));
//         return getRoles_res[0].role;
//     }
// }

// async function getMaxContId() {
//     company = JSON.parse(base64ToString(localStorage.getItem("company")));
//     let getContractID_query = stringToBase64(`SELECT MAX(urn) FROM AllContracts where userid='${userInfo.lid}' and companyid='${company.companyID}'`);
//     let getContractID_call = await queryGet([getContractID_query]);
//     let getContractID_res = getContractID_call.responseData.table;
//     let contractId;
//     if (getContractID_res[0].column1 === null) {
//         contractId = (`${userInfo.lid}${company.companyID}101`);
//     }
//     else {
//         contractId = BigInt(getContractID_res[0].column1) + 1n;
//     }
//     return contractId;
// }

// async function getMaxAssignmentId(contractID) {
//     let getAssignmentID_query = stringToBase64(`SELECT MAX(assignmentID) FROM ContractAssignmentNature where contractID='${contractID}'`);
//     let getAssignmentID_call = await queryGet([getAssignmentID_query]);
//     let getAssignmentID_res = getAssignmentID_call.responseData.table;
//     let assignmentID;
//     if (getAssignmentID_res[0].column1 === null) {
//         assignmentID = (`${contractID}00`);
//     }
//     else {
//         assignmentID = (getAssignmentID_res[0].column1);
//     }
//     return assignmentID;
// }

// async function getMaxMilestoneId(assignmentID) {
//     let getMilestoneID_query = stringToBase64(`SELECT MAX(milestoneId) FROM milestoneSubform where assignmentID='${assignmentID}'`);
//     let getMilestoneID_call = await queryGet([getMilestoneID_query]);
//     let getMilestoneID_res = getMilestoneID_call.responseData.table;
//     let milestoneID;
//     if (getMilestoneID_res[0].column1 === null) {
//         milestoneID = (`${assignmentID}00`);
//     }
//     else {
//         milestoneID = (getMilestoneID_res[0].column1);
//     }
//     return milestoneID;
// }

// async function getUserModules() {

//     let res = await fetchTable(`select * from SYF_USERMASTER where LID='${userInfo.lid}'`)
//     if (res != undefined & res.length > 0) {
//         let plan = res[0].subscription
//         let getModules = await fetchTable(`select * from SYF_PLANMASTER where NAME='${plan}'`)
//         let getModule = JSON.parse(getModules[0].module)
//         let modulesId = getModule.modules
//         if (modulesId.length > 0) {
//             let formattedIds = modulesId.join(', ');
//             let modulesQuery = await fetchTable(`select * from SYF_MODULEMASTER WHERE LID IN (${formattedIds});`)
//             let moduleList = modulesQuery.map((item) => { return { label: `${item.name} - ${item.subcategory}`, value: item.lid } })
//             return moduleList
//         }
//     }

// }
// async function getAllModules() {
//     let modulesQuery = await fetchTable(`select * from SYF_MODULEMASTER`)
//     let moduleList = modulesQuery.map((item) => { return { label: `${item.name} - ${item.subcategory}`, value: item.lid } })
//     return moduleList
// }

// //balanceSheet financial
// async function balanceSheet(company, dateDetails, roman) {

//     let client = company.companyID;
//     let crntFY = dateDetails.currentYear;
//     let prevFY = dateDetails.previousYear;
//     let crntYearFormat = dateDetails.cy_current;
//     let prevYearFormat = dateDetails.cy_previous;

//     // let split1 = crntFY.split("-")
//     // if (split1.length == 0) {
//     //     prevFY = Number(split1[0]) - 1;
//     // } else {
//     //     prevFY = `${Number(split1[0]) - 1}-${Number(split1[1]) - 1}`;
//     // }
//     let crntYear = crntFY;
//     let preYear = prevFY;

//     $(".bs_Period,.pl_ep").text(`${crntYearFormat}`);
//     $(".pl_sp").text(prevYearFormat);

//     // // EXEC fetchMonthlyTb @companyname=let,fy=let
//     // let data = {
//     //     "companyId": '100001001',
//     //     "fy": '2023-24',
//     //     "pfy": '2022-23'
//     // }
//     // let tbData = await workPaper(data, "feAnnualTb");

//     let queryTB = stringToBase64(`SELECT * FROM dbo.fnfetchAnnualTb('${client}','${preYear}','${crntYear}') ORDER BY alieSeq,classificationSeq,headSeq,subHeadSeq`);
//     let getQuery = await queryGet([queryTB]);
//     let tbData = getQuery.responseData.table;
//     if (tbData.length != 0) {

//         let bs_alieList = [];
//         let pl_alieList = [];
//         tbData.map((tb) => {
//             if (tb.bspl == "BS") {
//                 bs_alieList.push(tb.alie);
//             }
//             else if (tb.bspl == "PL") {
//                 pl_alieList.push(tb.alie);
//             }
//         });
//         let bs_uniqueAlieList = Array.from(new Set(bs_alieList));
//         let pl_uniqueAlieList = Array.from(new Set(pl_alieList));

//         // ********************* Financials Profit & Loss table formation start *********************
//         let headList_check = [];
//         bs_uniqueAlieList.map((alie) => {
//             tbData.map(function (fo) {
//                 if (fo.alie == alie) {
//                     headList_check.push(fo.head);
//                 }
//             });
//         });
//         let uniqueHeadList_check = Array.from(new Set(headList_check));

//         let headCount = uniqueHeadList_check.length + 1;
//         $(".tbNotes_bs").html("");
//         $(".tbNotes_pl").html("");
//         let plRow = "";
//         let pl_current_profit, pl_prev_profit;
//         let income_current_Total, income_prev_Total, expense_current_Total, expense_prev_Total;
//         pl_uniqueAlieList.map((alie, inx) => {
//             let totalRow;
//             if (alie == "Income") {
//                 totalRow = "incomeTotalRow";
//             }
//             else {
//                 totalRow = "expenseTotalRow";
//             }
//             plRow += `<tr><td class="tbsAlie"><b>${roman[inx + 3]}. ${alie}</b></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="text-align:right;" class="fs_yearCount"></td><td style="text-align:right;border-left:1px solid black;" class="fs_yearCount"></td></tr>`;

//             let classList = [];
//             tbData.map(function (fo) {
//                 if (fo.alie == alie) {
//                     classList.push(fo.classification);
//                 }
//             });
//             let uniqueClassList = Array.from(new Set(classList));

//             let crntAlieTotal = 0;
//             let prevAlieTotal = 0;
//             uniqueClassList.map((cls) => {
//                 plRow += `<tr><td class="tbsClassify"><b>${cls}</b></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="text-align:right;" class="fs_yearCount"></td><td style="text-align:right;border-left:1px solid black;" class="fs_yearCount"></td></tr>`;
//                 let headList = [];
//                 tbData.map(function (fo) {
//                     if (fo.alie == alie && fo.classification == cls) {
//                         headList.push(fo.head);
//                     }
//                 });
//                 let uniqueHeadList = Array.from(new Set(headList));

//                 let crntClassTotal = 0;
//                 let prevClassTotal = 0;

//                 uniqueHeadList.map((head) => {
//                     headCount += 1;
//                     let crntClosing = 0;
//                     let prevClosing = 0;
//                     let subHeadList = [];

//                     tbData.map(function (fo) {
//                         if (fo.alie == alie && fo.classification == cls && fo.head == head) {
//                             subHeadList.push(fo.subhead);
//                             if (fo.fy == crntFY) {
//                                 let closing = Number(fo.closingbalance);
//                                 if (closing < 0) { closing *= 1 }
//                                 crntClosing += closing;
//                                 crntAlieTotal += closing;
//                                 crntClassTotal += closing;
//                             }
//                             else if (fo.fy == prevFY) {
//                                 let closing = Number(fo.closingbalance);
//                                 if (closing < 0) { closing *= 1 }
//                                 prevClosing += closing;
//                                 prevAlieTotal += closing;
//                                 prevClassTotal += closing;
//                             }
//                         }
//                     });
//                     // Profit/loss SubHead Creation Start
//                     let uniqueSubHeadList = Array.from(new Set(subHeadList));
//                     let shRow = "";
//                     let crnt_subHeadTotal = 0;
//                     let prev_subHeadTotal = 0;
//                     uniqueSubHeadList.map((subHead) => {
//                         let sh_crntClosing = 0;
//                         let sh_prevClosing = 0;
//                         tbData.map(function (fo) {
//                             if (fo.alie == alie && fo.classification == cls && fo.head == head && fo.subhead == subHead) {
//                                 if (fo.fy == crntFY) {
//                                     let closing = Number(fo.closingbalance);
//                                     if (closing < 0) { closing *= 1 }
//                                     sh_crntClosing += closing;
//                                     crnt_subHeadTotal += closing;
//                                 }
//                                 else if (fo.fy == prevFY) {
//                                     let closing = Number(fo.closingbalance);
//                                     if (closing < 0) { closing *= 1 }
//                                     sh_prevClosing += closing;
//                                     prev_subHeadTotal += closing;
//                                 }
//                             }
//                         });
//                         let subHeadWitoutSpace = subHead.replaceAll(/[^A-Z0-9]+/ig, "");
//                         let pageId_subhead = subHeadWitoutSpace;
//                         let pageId_subhead_crntClosing = subHeadWitoutSpace + headCount + sh_crntClosing;
//                         let pageId_subhead_preClosing = subHeadWitoutSpace + headCount + sh_prevClosing;

//                         let bs_crntSH_value, bs_prevSH_value;
//                         if (alie == "Income") {
//                             if (sh_crntClosing != 0) {
//                                 bs_crntSH_value = (sh_crntClosing * -1);
//                             }
//                             else {
//                                 bs_crntSH_value = (sh_crntClosing);
//                             }
//                             if (sh_prevClosing != 0) {
//                                 bs_prevSH_value = (sh_prevClosing * -1);
//                             }
//                             else {
//                                 bs_prevSH_value = (sh_prevClosing);
//                             }
//                         }
//                         else {
//                             bs_crntSH_value = (sh_crntClosing);
//                             bs_prevSH_value = (sh_prevClosing);
//                         }
//                         shRow += `<tr class="subHead"><td class="pl-5 contextList" id="${pageId_subhead}" style="position:relative;">${subHead}</td><td id="${pageId_subhead_crntClosing}" class="fs_notes fs_yearCount"  style="position:relative;text-align:right;">${INR(bs_crntSH_value)}</td><td id="${pageId_subhead_preClosing}" style="position:relative;text-align:right;" class="contextList  fs_yearCount">${INR(bs_prevSH_value)}</td></tr>`;
//                     });

//                     let pageId_crnt_subHeadTotal = "sht" + crnt_subHeadTotal;
//                     let pageId_prev_subHeadTotal = "sht" + prev_subHeadTotal;

//                     let bs_crntSH_value_T, bs_prevSH_value_T;
//                     if (alie == "Income") {
//                         if (crnt_subHeadTotal != 0) {
//                             bs_crntSH_value_T = (crnt_subHeadTotal * -1);
//                         }
//                         else {
//                             bs_crntSH_value_T = (crnt_subHeadTotal);
//                         }
//                         if (prev_subHeadTotal != 0) {
//                             bs_prevSH_value_T = (prev_subHeadTotal * -1);
//                         }
//                         else {
//                             bs_prevSH_value_T = (prev_subHeadTotal);
//                         }
//                     }
//                     else {
//                         bs_crntSH_value_T = (crnt_subHeadTotal);
//                         bs_prevSH_value_T = (prev_subHeadTotal);
//                     }

//                     shRow += `<tr class="fs_total classifyTotal" style='border-top:1px solid black;'><td style="text-align:left;padding-left:15px;font-weight:bold;">Total</td><td id="${pageId_crnt_subHeadTotal}" style="position:relative;text-align:right;" class="fs_notes fs_yearCount">${INR(bs_crntSH_value_T)}</td><td id="${pageId_prev_subHeadTotal}" style="position:relative;text-align:right;border-left:1px solid black;" class="contextList fs_yearCount">${INR(bs_prevSH_value_T)}</td></tr>`;

//                     let headWitoutSpace = head.replaceAll(/[^A-Z0-9]+/ig, "");
//                     let pageId_head = headWitoutSpace;
//                     let pageId_head_crntClosing = headWitoutSpace + headCount + crntClosing;
//                     let pageId_head_preClosing = headWitoutSpace + headCount + prevClosing;

//                     let bs_crnt_value, bs_prev_value;
//                     if (alie == "Income") {
//                         if (crntClosing != 0) {
//                             bs_crnt_value = (crntClosing * -1);
//                         }
//                         else {
//                             bs_crnt_value = (crntClosing);
//                         }
//                         if (prev_subHeadTotal != 0) {
//                             bs_prev_value = (prevClosing * -1);
//                         }
//                         else {
//                             bs_prev_value = (prevClosing);
//                         }
//                     }
//                     else {
//                         bs_crnt_value = (crntClosing);
//                         bs_prev_value = (prevClosing);
//                     }
//                     plRow += `<tr class="tbsHead subHeadNavigation" onclick="subHeadNavigation('pl${headCount}')"><td id="${pageId_head}" style="position:relative;text-align:left;padding-left:60px;" class="contextList">${head}</td><td class="fs_notes"  style="text-align:center;padding:0px;">${headCount}</td><td id="${pageId_head_crntClosing}" style="position:relative;text-align:right;" class="contextList  fs_yearCount">${INR(bs_crnt_value)}</td><td  id="${pageId_head_preClosing}" style="position:relative;text-align:right;border-left:1px solid black;" class="contextList fs_yearCount">${INR(bs_prev_value)}</td></tr>`;

//                     let subHeadTable = `<div id="pl${headCount}" class="pt-4">
//                     <h6 style="font-weight:bold;">Note No.${headCount}-${head.toUpperCase()}</h6>
//                     <div class="table-responsive">
//                         <table class="table financials_table">
//                             <thead>
//                                 <tr>
//                                     <th style="width:46vw;">Particulars</th>
//                                     <th style="width:11vw;">As at March 31,<span class="summaryCrntFY"></span></th>
//                                     <th style="width:11vw;">As at March 31, <span class="summaryPrevFY"></span></th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${shRow}
//                             </tbody>
//                         </table>
//                     </div>
//                     </div>
//                 `;
//                     $(".tbNotes_pl").append(subHeadTable);
//                 });
//                 let pageId_crntClassTotal = "clst" + crntClassTotal;
//                 let pageId_prevClassTotal = "clst" + prevClassTotal;

//                 let bs_crntClass_value_T, bs_prevClass_value_T;
//                 if (alie == "Income") {
//                     if (crntClassTotal != 0) {
//                         bs_crntClass_value_T = (crntClassTotal * -1);
//                     }
//                     else {
//                         bs_crntClass_value_T = (crntClassTotal);
//                     }
//                     if (prevClassTotal != 0) {
//                         bs_prevClass_value_T = (prevClassTotal * -1);
//                     }
//                     else {
//                         bs_prevClass_value_T = (prevClassTotal);
//                     }
//                 }
//                 else {
//                     bs_crntClass_value_T = (crntClassTotal);
//                     bs_prevClass_value_T = (prevClassTotal);
//                 }

//                 plRow += `<tr class="classifyTotal"><td></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="position:relative;border-top:1px solid black;text-align:right;" id="${pageId_crntClassTotal}" class="contextList  fs_yearCount">${INR(bs_crntClass_value_T)}</td><td style="position:relative;border-top:1px solid black;text-align:right;border-left:1px solid black;" id="${pageId_prevClassTotal}" class="contextList  fs_yearCount">${INR(bs_prevClass_value_T)}</td></tr>`;
//             });
//             let pageId_crntAlieTotal = "alie" + crntAlieTotal;
//             let pageId_prevAlieTotal = "alie" + prevAlieTotal;

//             let bs_crntAlie_value_T, bs_prevAlie_value_T;
//             if (alie == "Income") {
//                 if (crntAlieTotal != 0) {
//                     bs_crntAlie_value_T = (crntAlieTotal * -1);
//                 }
//                 else {
//                     bs_crntAlie_value_T = (crntAlieTotal);
//                 }
//                 if (prevAlieTotal != 0) {
//                     bs_prevAlie_value_T = (prevAlieTotal * -1);
//                 }
//                 else {
//                     bs_prevAlie_value_T = (prevAlieTotal);
//                 }
//             }
//             else {
//                 bs_crntAlie_value_T = (crntAlieTotal);
//                 bs_prevAlie_value_T = (prevAlieTotal);
//             }

//             if (alie == "Income") {
//                 income_current_Total = bs_crntAlie_value_T;
//                 income_prev_Total = bs_prevAlie_value_T;
//             }
//             else {
//                 expense_current_Total = bs_crntAlie_value_T;
//                 expense_prev_Total = bs_prevAlie_value_T;
//             }

//             plRow += `<tr class="fs_total alieTotal ${totalRow}"><td class="text-center" style="font-weight:bold;">Total</td><td style="border:none;"></td><td id="${pageId_crntAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList  fs_yearCount">${INR(bs_crntAlie_value_T)}</td><td id="${pageId_prevAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList fs_yearCount">${INR(bs_prevAlie_value_T)}</td></tr>`;
//         });

//         pl_current_profit = income_current_Total - expense_current_Total;
//         pl_prev_profit = income_prev_Total - expense_prev_Total;

//         plRow += `<tr class="alieTotal"><td class="text-center" style="font-weight:bold;">Profit</td><td style="border-left:1px solid black;"></td><td style="position:relative;text-align:right;font-weight:bold;border-left:1px solid black;" class="contextList  fs_yearCount">${INR(pl_current_profit)}</td><td style="position:relative;text-align:right;font-weight:bold;" class="fs_notes fs_yearCount">${INR(pl_prev_profit)}</td></tr>`;

//         $(".tbPL>tbody").html(plRow);
//         // ****************** Financials Profit & Loss table formation End *********************

//         // ********************* Financials Balance sheet Creation Start *********************

//         let clsHtmlrow = "";
//         let headCount_bs = 1;

//         bs_uniqueAlieList.map((alie, inx) => {
//             clsHtmlrow += `<tr><td class="tbsAlie"><b>${roman[inx + 1]}. ${alie}</b></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="text-align:right;" class="fs_yearCount"></td><td style="text-align:right;border-left:1px solid black;" class="fs_yearCount"></td></tr>`;

//             let classList = [];
//             tbData.map(function (fo) {
//                 if (fo.alie == alie) {
//                     classList.push(fo.classification);
//                 }
//             });
//             let uniqueClassList = Array.from(new Set(classList));

//             let crntAlieTotal = 0;
//             let prevAlieTotal = 0;
//             uniqueClassList.map((cls) => {
//                 clsHtmlrow += `<tr><td class="tbsClassify"><b>${cls}</b></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="text-align:right;" class="fs_yearCount"></td><td style="text-align:right;border-left:1px solid black;" class="fs_yearCount"></td></tr>`;

//                 let headList = [];
//                 tbData.map(function (fo) {
//                     if (fo.alie == alie && fo.classification == cls) {
//                         headList.push(fo.head);
//                     }
//                 });
//                 let uniqueHeadList = Array.from(new Set(headList));

//                 let crntClassTotal = 0;
//                 let prevClassTotal = 0;

//                 uniqueHeadList.map((head) => {
//                     headCount_bs += 1;
//                     let crntClosing = 0;
//                     let prevClosing = 0;
//                     let subHeadList = [];

//                     tbData.map(function (fo) {
//                         if (fo.alie == alie && fo.classification == cls && fo.head == head) {
//                             subHeadList.push(fo.subhead);
//                             if (fo.fy == crntFY) {
//                                 let closing = Number(fo.closingbalance);
//                                 if (closing < 0) { closing *= 1 }
//                                 crntClosing += closing;
//                                 crntAlieTotal += closing;
//                                 crntClassTotal += closing;
//                             }
//                             else if (fo.fy == prevFY) {
//                                 let closing = Number(fo.closingbalance);
//                                 if (closing < 0) { closing *= 1 }
//                                 prevClosing += closing;
//                                 prevAlieTotal += closing;
//                                 prevClassTotal += closing;
//                             }
//                         }
//                     });
//                     // SubHead Creation Start
//                     let uniqueSubHeadList = Array.from(new Set(subHeadList));
//                     let shRow = "";
//                     let crnt_subHeadTotal = 0;
//                     let prev_subHeadTotal = 0;
//                     uniqueSubHeadList.map((subHead) => {
//                         let sh_crntClosing = 0;
//                         let sh_prevClosing = 0;
//                         tbData.map(function (fo) {
//                             if (fo.alie == alie && fo.classification == cls && fo.head == head && fo.subhead == subHead) {
//                                 if (fo.fy == crntFY) {
//                                     let closing = Number(fo.closingbalance);
//                                     if (closing < 0) { closing *= 1 }
//                                     sh_crntClosing += closing;
//                                     crnt_subHeadTotal += closing;
//                                 }
//                                 else if (fo.fy == prevFY) {
//                                     let closing = Number(fo.closingbalance);
//                                     if (closing < 0) { closing *= 1 }
//                                     sh_prevClosing += closing;
//                                     prev_subHeadTotal += closing;

//                                 }
//                             }
//                         });
//                         let subHeadWitoutSpace = subHead.replaceAll(/[^A-Z0-9]+/ig, "");
//                         let pageId_subhead = subHeadWitoutSpace;
//                         let pageId_subhead_crntClosing = subHeadWitoutSpace + headCount_bs + sh_crntClosing;
//                         let pageId_subhead_preClosing = subHeadWitoutSpace + headCount_bs + sh_prevClosing;

//                         let bs_crntSH_value, bs_prevSH_value;
//                         if (alie == "Liabilities") {
//                             if (sh_crntClosing != 0) {
//                                 bs_crntSH_value = (sh_crntClosing * -1);
//                             }
//                             else {
//                                 bs_crntSH_value = (sh_crntClosing);
//                             }
//                             if (sh_prevClosing != 0) {
//                                 bs_prevSH_value = (sh_prevClosing * -1);
//                             }
//                             else {
//                                 bs_prevSH_value = (sh_prevClosing);
//                             }
//                         }
//                         else {
//                             bs_crntSH_value = (sh_crntClosing);
//                             bs_prevSH_value = (sh_prevClosing);
//                         }

//                         if (subHead == "Other reserves") {
//                             shRow += `
//                                 <tr class="subHead openingBalance"><td class="pl-3 contextList" id="openingBalance" style="position:relative;">Opening Balance</td><td id="${pageId_subhead_crntClosing}" style="position:relative;text-align:right;" class="fs_notes fs_yearCount">${INR(bs_crntSH_value)}</td><td id="${pageId_subhead_preClosing}" style="position:relative;text-align:right;" class="contextList fs_yearCount">${INR(bs_prevSH_value)}</td></tr>
//                                 <tr class="subHead profitOrLoss"><td class="pl-3 contextList" id="profitLoss" style="position:relative;">Profit / Loss</td><td id="pageId_${pl_current_profit}" style="position:relative;text-align:right;" class="fs_notes fs_yearCount">${INR(pl_current_profit)}</td><td id="pageId_${pl_prev_profit}" style="position:relative;text-align:right;" class="contextList fs_yearCount">${INR(pl_prev_profit)}</td></tr>
//                                 <tr class="subHead closingBalance" style="border-top:1px solid black;"><td class="pl-3 contextList" id="closingBalance" style="position:relative;"><b>Closing Balance</b></td><td id="pageId_${bs_crntSH_value + pl_current_profit}" style="position:relative;text-align:right;" class="fs_notes fs_yearCount"><b>${INR(bs_crntSH_value + pl_current_profit)}</b></td><td id="pageId_${bs_prevSH_value + pl_prev_profit}" style="position:relative;text-align:right;" class="contextList fs_yearCount"><b>${INR(bs_prevSH_value + pl_prev_profit)}</b></td></tr>
//                             `;
//                         }
//                         else {
//                             shRow += `<tr class="subHead"><td class="pl-3 contextList" id="${pageId_subhead}" style="position:relative;">${subHead}</td><td id="${pageId_subhead_crntClosing}" style="position:relative;text-align:right;" class="fs_notes fs_yearCount">${INR(bs_crntSH_value)}</td><td id="${pageId_subhead_preClosing}" style="position:relative;text-align:right;border-left:1px solid black;" class="contextList fs_yearCount">${INR(bs_prevSH_value)}</td></tr>`;
//                         }
//                     });

//                     let pageId_crnt_subHeadTotal = "sht" + crnt_subHeadTotal;
//                     let pageId_prev_subHeadTotal = "sht" + prev_subHeadTotal;

//                     let bs_crntSH_value_T, bs_prevSH_value_T;
//                     if (alie == "Liabilities") {
//                         if (crnt_subHeadTotal != 0) {
//                             bs_crntSH_value_T = (crnt_subHeadTotal * -1);
//                         }
//                         else {
//                             bs_crntSH_value_T = (crnt_subHeadTotal);
//                         }
//                         if (prev_subHeadTotal != 0) {
//                             bs_prevSH_value_T = (prev_subHeadTotal * -1);
//                         }
//                         else {
//                             bs_prevSH_value_T = (prev_subHeadTotal);
//                         }
//                     }
//                     else {
//                         bs_crntSH_value_T = (crnt_subHeadTotal);
//                         bs_prevSH_value_T = (prev_subHeadTotal);
//                     }

//                     if (head != "Reserves and surplus") {
//                         shRow += `<tr class="fs_total classifyTotal" style='border-top:1px solid black;font-weight:bold;'><td>Total</td><td id="${pageId_crnt_subHeadTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList fs_yearCount">${INR(bs_crntSH_value_T)}</td><td id="${pageId_prev_subHeadTotal}" style="position:relative;text-align:right;font-weight:bold;border-left:1px solid black;" class="contextList fs_yearCount">${INR(bs_prevSH_value_T)}</td></tr>`;
//                     }

//                     let headWitoutSpace = head.replaceAll(/[^A-Z0-9]+/ig, "");
//                     let pageId_head = headWitoutSpace;
//                     let pageId_head_crntClosing = headWitoutSpace + headCount_bs + crntClosing;
//                     let pageId_head_preClosing = headWitoutSpace + headCount_bs + prevClosing;

//                     let bs_crnt_value, bs_prev_value;
//                     if (alie == "Liabilities") {
//                         if (crntClosing != 0) {
//                             bs_crnt_value = (crntClosing * -1);
//                         }
//                         else {
//                             bs_crnt_value = (crntClosing);
//                         }
//                         if (prev_subHeadTotal != 0) {
//                             bs_prev_value = (prevClosing * -1);
//                         }
//                         else {
//                             bs_prev_value = (prevClosing);
//                         }
//                     }
//                     else {
//                         bs_crnt_value = (crntClosing);
//                         bs_prev_value = (prevClosing);
//                     }

//                     if (head == "Reserves and surplus") {
//                         clsHtmlrow += `<tr class="tbsHead subHeadNavigation" onclick="subHeadNavigation('bs${headCount_bs}')"><td id="${pageId_head}" style="position:relative;padding-left:60px;" class="contextList">${head}</td><td style="text-align:center;padding:0px;" class="fs_notes">${headCount_bs}</td><td id="${pageId_head_crntClosing}" style="position:relative;text-align:right;" class="contextList fs_yearCount">${INR(bs_crnt_value + pl_current_profit)}</td><td  id="${pageId_head_preClosing}" style="position:relative;text-align:right;border-left:1px solid black;" class="contextList  fs_yearCount">${INR(bs_prev_value + pl_prev_profit)}</td></tr>`;
//                     }
//                     else {
//                         clsHtmlrow += `<tr class="tbsHead subHeadNavigation" onclick="subHeadNavigation('bs${headCount_bs}')"><td id="${pageId_head}" style="position:relative;padding-left:60px;" class="contextList">${head}</td><td style="text-align:center;padding:0px;" class="fs_notes">${headCount_bs}</td><td id="${pageId_head_crntClosing}" style="position:relative;text-align:right;" class="contextList  fs_yearCount">${INR(bs_crnt_value)}</td><td  id="${pageId_head_preClosing}" style="position:relative;text-align:right;border-left:1px solid black;" class="contextList  fs_yearCount">${INR(bs_prev_value)}</td></tr>`;
//                     }
//                     let subHeadTable = `<div id="bs${headCount_bs}" class="pt-4">
//                     <h6 style="font-weight:bold;">Note No.${headCount_bs}-${head.toUpperCase()}</h6>
//                     <div class="table-responsive">
//                         <table class="table financials_table">
//                             <thead>
//                                 <tr>
//                                     <th style="width:46vw;">Particulars</th>
//                                     <th style="width:11vw;">As at March 31,<span class="summaryCrntFY"></span></th>
//                                     <th style="width:11vw;">As at March 31,<span class="summaryPrevFY"></span></th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${shRow}
//                             </tbody>
//                         </table>
//                     </div>
//                     </div>
//                     `;
//                     $(".tbNotes_bs").append(subHeadTable);
//                 });
//                 let pageId_crntClassTotal = "clst" + crntClassTotal;
//                 let pageId_prevClassTotal = "clst" + prevClassTotal;

//                 let bs_crntClass_value_T, bs_prevClass_value_T;
//                 if (alie == "Liabilities") {
//                     if (crntClassTotal != 0) {
//                         bs_crntClass_value_T = (crntClassTotal * -1);
//                     }
//                     else {
//                         bs_crntClass_value_T = (crntClassTotal);
//                     }
//                     if (prevClassTotal != 0) {
//                         bs_prevClass_value_T = (prevClassTotal * -1);
//                     }
//                     else {
//                         bs_prevClass_value_T = (prevClassTotal);
//                     }
//                 }
//                 else {
//                     bs_crntClass_value_T = (crntClassTotal);
//                     bs_prevClass_value_T = (prevClassTotal);
//                 }

//                 if (cls == "Equity and Shareholders funds") {
//                     clsHtmlrow += `<tr class="classifyTotal"><td></td><td class="fs_notes" style="text-align:center;padding:0px;"></td><td style="position:relative;border-top:1px solid black;text-align:right;" id="${pageId_crntClassTotal}" class="contextList  fs_yearCount">${INR(bs_crntClass_value_T + pl_current_profit)}</td><td style="position:relative;border-top:1px solid black;text-align:right;border-left:1px solid black;" id="${pageId_prevClassTotal}" class="contextList  fs_yearCount">${INR(bs_prevClass_value_T + pl_prev_profit)}</td></tr>`;
//                 }
//                 else {
//                     clsHtmlrow += `<tr class="classifyTotal"><td></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="position:relative;border-top:1px solid black;text-align:right;" id="${pageId_crntClassTotal}" class="contextList  fs_yearCount">${INR(bs_crntClass_value_T)}</td><td style="position:relative;border-top:1px solid black;text-align:right;border-left:1px solid black;" id="${pageId_prevClassTotal}" class="contextList  fs_yearCount">${INR(bs_prevClass_value_T)}</td></tr>`;
//                 }
//             });
//             let pageId_crntAlieTotal = "alie" + crntAlieTotal;
//             let pageId_prevAlieTotal = "alie" + prevAlieTotal;

//             let bs_crntAlie_value_T, bs_prevAlie_value_T;
//             if (alie == "Liabilities") {
//                 if (crntAlieTotal != 0) {
//                     bs_crntAlie_value_T = (crntAlieTotal * -1);
//                 }
//                 else {
//                     bs_crntAlie_value_T = (crntAlieTotal);
//                 }
//                 if (prevAlieTotal != 0) {
//                     bs_prevAlie_value_T = (prevAlieTotal * -1);
//                 }
//                 else {
//                     bs_prevAlie_value_T = (prevAlieTotal);
//                 }
//             }
//             else {
//                 bs_crntAlie_value_T = (crntAlieTotal);
//                 bs_prevAlie_value_T = (prevAlieTotal);
//             }
//             if (alie == "Liabilities") {
//                 clsHtmlrow += `<tr class="fs_total alieTotal"><td class="text-center" style="font-weight:bold;">Total</td><td style="border:none;"></td><td id="${pageId_crntAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList  fs_yearCount">${INR(bs_crntAlie_value_T + pl_current_profit)}</td><td id="${pageId_prevAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList  fs_yearCount">${INR(bs_prevAlie_value_T + pl_prev_profit)}</td></tr>`;
//             }
//             else {
//                 clsHtmlrow += `<tr class="fs_total alieTotal"><td class="text-center" style="font-weight:bold;">Total</td><td style="border:none;"></td><td id="${pageId_crntAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList  fs_yearCount">${INR(bs_crntAlie_value_T)}</td><td id="${pageId_prevAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList  fs_yearCount">${INR(bs_prevAlie_value_T)}</td></tr>`;
//             }
//         });

//         $(".tbBalance>tbody").html(clsHtmlrow);
//         // ********************* Financials Balance sheet Creation End *********************

//         $(".summaryCrntFY").text(crntYearFormat);
//         $(".summaryPrevFY").text(prevYearFormat);

//         // get all Review Comments for the choosen clientName and FY
//         // getReviewComments(client, fy);

//         // Context menu
//         $(".contextList").contextmenu(function (e) {
//             let thisval = e.target;
//             pageId_temp = $(thisval).attr("id");
//             let spanCheck = $(thisval).children();
//             if (spanCheck.length == 0) {
//                 $(thisval).append(`<span class="reviewMsgContainer"></span>`);
//             }
//             let top = thisval.offsetTop + "px";
//             let left = (thisval.offsetLeft + thisval.clientWidth) + "px";

//             $(".contextMenu").attr("style", `top:${top};left:${left};`);

//             $(".contextMenu").toggle();
//         });
//     } else {
//         $(".tbBalance>tbody").html("");
//         $(".tbPL>tbody").html("");

//         $(".tbNotes_bs").html("");
//         $(".tbNotes_pl").html("");
//     }
// }
// async function generateInviteEmailContent(userEmail, password) {
//     let formData = new FormData();
//     formData.append("RecipientList", [userEmail]);
//     formData.append("CCList", ['ranjith@ggsh.in']);
//     formData.append("Subject", "GGSH Invite");
//     let emailBody = `
//         <html>
//             <head></head>
//             <body>
//                 <p>Greetings from GGSH,</p>
//                 <p>We are happy to introduce our tool.</p>
//                 <p>Please take a look at it and let us know your thoughts. Your feedback and comments are crucial in enhancing our services and continuing to meet your needs effectively.</p>
//                 <p>Email : ${userEmail}</p>
//                 <p>Password : ${password}</p>
//                 <p>Click here to <a href='${formUrl}/login/login.html'>login</a></p>
//                 <p>Thanks,<br>SYF Team</p>
//             </body>
//         </html>
//     `;
//     formData.append("Body", emailBody);

//     return formData;
// }
// async function generateNewInviteEmailContent(userEmail) {
//     let formData = new FormData();
//     formData.append("RecipientList", [userEmail]);
//     formData.append("CCList", ['ranjith@ggsh.in']);
//     formData.append("Subject", "GGSH Invite");
//     let emailBody = `
//         <html>
//             <head></head>
//             <body>
//                 <p>Greetings from GGSH,</p>
//                 <p>We are happy to introduce our tool.</p>
//                 <p>Please take a look at it and let us know your thoughts. Your feedback and comments are crucial in enhancing our services and continuing to meet your needs effectively.</p>
//                 <p>Click here to <a href='${formUrl}/login/login.html'>login</a></p>
//                 <p>Thanks,<br>SYF Team</p>
//             </body>
//         </html>
//     `;
//     formData.append("Body", emailBody);

//     return formData;
// }
