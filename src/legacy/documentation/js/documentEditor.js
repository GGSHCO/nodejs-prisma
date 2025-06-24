const { fetchTable, exeQuery, dateTimeGeneration } = require('../../config')


async function getTransactionCompanyMaster() {
    try {
        let res = await fetchTable(`select * from transactionReportMaster`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getPathtransactionReportMaster(params){

 try {
        let res = await fetchTable(`select templateName from transactionReportMaster where documentPath='${params.documentPath}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getPathTemplateTransaction(params){

 try {
        let res = await fetchTable(`select templateName from templateTransaction where standardPath='${params.standardPath}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getGlobalId() {
    try {
        let res = await fetchTable(`SELECT MAX(documentID) FROM GlobalReportMaster`)
        let resId=res[0].column1
        return resId
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getTransactionId() {
    try {
        let res = await fetchTable(`SELECT MAX(documentID) FROM transactionReportMaster`)
        let resId=res[0].column1
        return resId
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}
async function updateGlobalMaster(params) {
    try {
        let res = await exeQuery(`UPDATE GlobalReportMaster SET templateName='${params.templateName}',template='${params.template}' WHERE lid='${params.lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function insertGlobalMaster(params) {
    try {
        let date = dateTimeGeneration(new Date());
        let res = await exeQuery(`INSERT INTO GlobalReportMaster(template,templateName,documentPath,documentID,addedUser,addedTime)
         VALUES('${params.template}','${params.templateName}','${params.documentPath}','${params.documentID}','${params.adddedUser}','${date}')`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateTransactionMaster(params) {
    try {
        console.log(params.transactionLid)
        let res = await exeQuery(`UPDATE transactionReportMaster SET template='${params.jsonData}',templateName='${params.templateValue}' WHERE lid='${params.lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function insertTransactionMaster(params) {
    try {
        console.log(params.companyNames)
        let date = dateTimeGeneration(new Date());
        let res = await exeQuery(`INSERT INTO transactionReportMaster(template,templateName,companyName,documentPath,documentID,addedUser,addedTime)
         VALUES('${params.template}','${params.templateName}','${params.companyName}','${params.documentPath}','${params.documentID}','${params.adddedUser}','${date}')`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


























module.exports = { getTransactionCompanyMaster,getPathtransactionReportMaster,getPathTemplateTransaction, getGlobalId, getTransactionId, updateGlobalMaster, insertGlobalMaster,updateTransactionMaster,insertTransactionMaster }