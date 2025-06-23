const { fetchTable, exeQuery, queryGet } = require('../../config')

async function getCompanyEmployees({companyid}){
    try {
        let res = await fetchTable(`SELECT  FROM tbl_tallyprime_LedgerMasters WHERE companyid='${companyid}'`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


module.exports = { getCompanyEmployees }
