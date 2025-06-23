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
            ('${item.userName}','${item.filesSaved}','${item.type}','${item.role}','${item.companyid}',''${item.lid}',${item.addedUser}','${date}')`);
    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const updateFileRecord = async (item) => {
  try {
    let res = await exeQuery(
      `update speedDrive set filesSaved='${item.filesSaved}' where userName='${item.userName}' AND type='${item.type}'`
    );
    return res;
  } catch (e) {
    return { error: e.message };
  }
};

async function getFinancialYear() {
  try {
    let res = await fetchTable(`SELECT * FROM dbo.fnfetchfylist() ORDER BY FY`);
    console.log(res);
    return res;
  } catch (error) {
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
};
