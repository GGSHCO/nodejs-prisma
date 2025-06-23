const { fetchTable, exeQuery, queryGet } = require('../../config')

async function getAllTimesheet({ companyid, username }) {
    try {
        let res = await fetchTable(`select * from AllTimesheets where employeename='${username}' and companyid='${companyid}'`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function deleteTimesheetReport({lids,companyid}) {
    try{
        let del1=`DELETE FROM AllTimesheets WHERE lid in (${lids}) and companyid='${companyid}'`
        let del2=`DELETE FROM dayReport WHERE sheetId in (${lids}) and companyid='${companyid}'`
        let delquery=[]
        delquery.push(Buffer.from(del1).toString('base64'))
        delquery.push(Buffer.from(del2).toString('base64'))
        let res=await queryGet(delquery)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


module.exports = { getAllTimesheet,deleteTimesheetReport }