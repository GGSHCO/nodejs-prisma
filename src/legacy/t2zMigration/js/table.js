const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function tableData({ tableName, condition }) {
    try {
        let res = await fetchTable(`select * from ${tableName} ${condition}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getMaxAmount({tableName, batchNo}) {
    try {
        let res = await fetchTable(`select sum(amount)as amount from ${tableName} where batchNo=${batchNo}`)
        if (res.length>0) {
            return res[0].amount
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}



module.exports = { tableData,getMaxAmount }