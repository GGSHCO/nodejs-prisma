const { fetchTable, exeQuery, dateTimeGeneration } = require("../../config");

async function getGlobalReport() {
  try {
    let res = await fetchTable(`select * from GlobalReportMaster`);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}
async function getLidGlobalReport(params) {
  try {
    let res = await fetchTable(
      `select * from GlobalReportMaster where lid='${params.lid}' `
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getGlobalTemplate() {
  try {
    let res = await fetchTable(`select * from SYF_GLOBALTEMPLATES`);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}
async function getTemplateTransaction() {
  try {
    let res = await fetchTable(`select * from templateTransaction`);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}
async function getTransactionCompany() {
  try {
    let res = await fetchTable(`select * from transactionReportMaster`);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}
async function getSpeedFileDrive(params) {
  try {
    let res = await fetchTable(
      `select * from speedDrive where userName='${params.name}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getSpeedFileDriveCompany(params) {
  try {
    let res = await fetchTable(
      `select * from speedDrive where userid='${params.lid}' AND companyid='${params.companyId}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getSpeedDriveData() {
  try {
    let res = await fetchTable(`select * from speedDrive`);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getSpeedFileCheck(params) {
  try {
    let res = await fetchTable(
      `SELECT * FROM speedDrive WHERE userName ='${params.userName}' AND type='${params.type}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

const insertFileRecord = async (item) => {
  try {
    let date = dateTimeGeneration(new Date());
    let res =
      await exeQuery(`insert into speedDrive(userName,filesSaved,type,companyName,addedUser,addedTime) values
            ('${item.userName}','${item.filesSaved}','${item.type}','${item.companyName}','${item.addedUser}','${date}')`);
    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const insertRoleFileRecord = async (item) => {
  try {
    let date = dateTimeGeneration(new Date());
    let res =
      await exeQuery(`insert into speedDrive(userName,filesSaved,type,role,companyid,userid,addedUser,addedTime) values
            ('${item.userName}','${item.filesSaved}','${item.type}','${item.role}','${item.companyid}','${item.lid}','${item.addedUser}','${date}')`);
   console.log(res)
            return res;
  } catch (e) {
    return { error: e.message };
  }
};

const updateFileRecord = async (item) => {
  const escapeQuotes = (str) => str.replace(/'/g, "''");
  try {
    console.log(item.lid)
    const filesSaved = escapeQuotes(item.filesSaved);
    const userName = escapeQuotes(item.userName);
    const type = escapeQuotes(item.type);

    let query = `
      UPDATE speedDrive 
      SET filesSaved='${filesSaved}',companyid='${item.companyid}',userid='${item.lid}'
      WHERE userName='${userName}' AND type='${type}'
    `;

    let res = await exeQuery(query);
    // let res = await exeQuery(
    //   `update speedDrive set filesSaved='${item.filesSaved}' where userName='${item.userName}' AND type='${item.type}'`
    // );
    return res;
  } catch (e) {
    return { error: e.message };
  }
};

async function getFinancialYear() {
  try {
    let res = await fetchTable(`SELECT * FROM dbo.fnfetchfylist() ORDER BY FY`);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}
async function getGroupClientContact() {
  try {
    let res = await fetchTable(`SELECT groupName,name FROM contactMaster`);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}
async function getAllContracts(params) {
  let companyid=params.companyid;
  try {
    let res = await fetchTable(`SELECT * FROM AllContracts where companyId='${companyid}'`);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getClientMatchingName(params) {
  let companyid=params.companyid;
  try {
    let res1 = await fetchTable(` SELECT
                c.* 
            FROM
                AllContracts c
            INNER JOIN
                ContactMaster m
            ON
                c.clientName = m.name
                  WHERE
        c.companyId = ${companyid} AND m.companyid = ${companyid};
        `);
        
        let res2 = await fetchTable(`
      SELECT
        c.* 
      FROM
        AllContracts c
      LEFT JOIN
        ContactMaster m
      ON
        c.clientName = m.name
       WHERE
        c.companyId = ${companyid} AND m.name IS NULL;
    `);
    return {matched:res1,unmatched:res2};
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getProjectsClientName(params){
  let companyid=params.companyid;
  try{
let res=await fetchTable(`SELECT
    ud.link_projectId,
    ap.clientName,
    ap.personResponsible1, 
    ap.managerResponsible,
    ap.companyId,
    ud.blob,
    CASE
        WHEN cms.category = 1 THEN 'PBC'
        WHEN cms.category = 2 THEN 'Deliverables'
        ELSE 'unknown'
    END AS category_name
FROM
    portal_service_UserDocs AS ud
INNER JOIN
    portal_serviceDocs_CMS AS cms ON ud.link_docId = cms.id
INNER JOIN
    Allprojects AS ap ON ud.link_projectId = ap.projectCode`)
  return res;

  }
  catch (error) {
    return { error: true, message: error.message, details: error };
  }
  
}
 
async function getPersonalDocuments(){
  console.log("test")
  try{
  let res=await fetchTable(`SELECT DISTINCT
    ac.clientName
FROM
    SYF_USERMASTER AS sum
JOIN
    portal_usersPivot AS pup ON sum.lid = pup.user_id
JOIN
    portal_clients AS pc ON pup.client_id = pc.id
JOIN
    AllContracts AS ac ON pc.zohoContactId = ac.zohocontactID
WHERE
    (sum.email LIKE '%docs_pan_aadhar%' OR sum.email LIKE '%docs_aadhar%')`);
    console.log(res)
    return res;
  }
   catch (error) {
    return { error: true, message: error.message, details: error };
  }

}

async function getMonth() {
  try {
    let monthList = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    let monthOption = [];
    let keys = Object.keys(monthList);
    keys.map((key) => {
      monthOption.push({ label: key, value: monthList[key] });
    });
    return monthOption;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

module.exports = {
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
  getGroupClientContact,
  getAllContracts,
  getClientMatchingName,
  getProjectsClientName,
  getPersonalDocuments,
  getMonth,
};
