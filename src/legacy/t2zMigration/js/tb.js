const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function onloadDataTb({ companyid }) {
    try {
        let res = await fetchTable(`select * from tbl_tallyprime_trialbalances where companyid='${companyid}'`)
        let fromdateRes = await fetchTable(`select distinct fromdate  from tbl_tallyprime_trialbalances where companyid='${companyid}'`)
        return {
            tableDate: res,
            fromdateRes: fromdateRes
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function filterTb({companyid,todate,fromdate}) {
    try {
        let res = await exeQuery(`select * from tbl_tallyprime_trialbalances where companyid='${companyid}' and fromdate='${fromdate}' and todate='${todate}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function fetchToDate({companyid,fromdate}) {
    try {
        let todate = await fetchOptions(`select distinct todate  from tbl_tallyprime_trialbalances where companyid='${companyid}' and fromdate='${fromdate}'`, 'todate', 'todate')
        return todate

    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}
module.exports = { onloadDataTb,filterTb,fetchToDate }

