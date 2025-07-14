const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function getRecoTableData({ table, companyid, filter, fields }) {
    try {
        let field = `*`
        if (fields.length > 0) {
            fieldsList = ['lid']
            fields.map((item) => {
                fieldsList.push(item.fieldName)
            })
            field = fieldsList.join(',')
        }
        const conditions = filter.map((item) => {
            if (item.type === "text") {
                if (item.value.includes(',')) {
                    const values = item.value.split(',').map(val => `${item.column}='${val.trim()}'`);
                    return `(${values.join(' or ')})`;
                } else{
                    return `(${item.column}='${item.value}')`;
                }
            } else if (item.type === "date") {
                return `(CAST(${item.column} AS DATE) = '${item.value}')`;
            }
            else if (item.type === "NOT NULL") {
                return `(${item.column} IS NOT NULL AND ${item.column} <> '')`;
            }
        }).filter(Boolean);

        let condition = conditions.length > 0 ? `and ${conditions.join(" and ")}` : "";
        console.log(filter)
        if (table == 'creditcard') {
            // condition += ` and description not like '%RTGS Payment Received%' and description not like '%NEFT PAYMENT RECEIVED%' and description not like '%IGST%' and description not like '%DCC Fee%'`
        }
        console.log(condition)
        let res = await exeQuery(`select ${field} from ${table} where companyId='${companyid}'${condition}`)
        data = res.responseData.table
        return data
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function checkSummary(params){
    try{
        let res = await fetchTable(`select summary from temp_bots_summary where reco_id='${params.id}'`)
        return res
        }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function saveSummary(params){
    try{
        let res;
        if(params.type=='new'){
            res=await exeQuery(`insert into temp_bots_summary (reco_id,summary) values  ('${params.id}','${params.summary}')`)
        }
        else if (params.type=='update'){
            res=await exeQuery(`update temp_bots_summary set summary='${params.summary}' where reco_id='${params.id}'`)
        }
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function deleteTableData({ tableName, lid }) {
    try {
        let res = await exeQuery(`delete from ${tableName} where lid in (${lid})`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function manualMatching(params) {
    try {
        // type cast reco as int to avoid error in case of string
        let res = await fetchTable(`select MAX(CAST(FLOOR(CAST(recoid AS FLOAT)) AS INT)) as recoid from ${params.tableA}`)
        let recoid = res[0].recoid + 1
        let result = await fetchTable(`select MAX(CAST(FLOOR(CAST(recoid AS FLOAT)) AS INT)) as recoid from ${params.tableB}`)
        let data = result[0].recoid + 1
        let tableAids = params.tableAids.join(",")
        let tableBids = params.tableBids.join(",")
        let query = `update ${params.tableA} set recoid='${recoid}',recostatus='Completed',recotag='Manual Match',ISVALIDATED=1 where lid in (${tableAids})`
        let q1 = Buffer.from(query).toString('base64');
        let query2 = `update ${params.tableB} set recoid='${data}',recostatus='Completed',recotag='Manual Match',ISVALIDATED=1 where lid in (${tableBids})`
        let q2 = Buffer.from(query2).toString('base64');
        let response = await queryGet([q1, q2])
        return response
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}



async function completeReco({ tableA, tableB, lid }) {
    try {
        let query1 = `update ${tableA} set recostatus='Completed',ISVALIDATED=1 where recoid='${lid}'`
        let q1 = Buffer.from(query1).toString('base64');
        let query2 = `update ${tableB} set recostatus='Completed',ISVALIDATED=1 where recoid='${lid}'`
        let q2 = Buffer.from(query2).toString('base64');
        let res = await queryGet([q1, q2])
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function completeBulkReco({ tableA, tableB, lids }) {
    try {
        let query1 = `update ${tableA} set recostatus='Completed',ISVALIDATED=1 where recoid in (${lids})`
        let q1 = Buffer.from(query1).toString('base64');
        let query2 = `update ${tableB} set recostatus='Completed',ISVALIDATED=1 where recoid in (${lids})`
        let q2 = Buffer.from(query2).toString('base64');
        let res = await queryGet([q1, q2])
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function rejectReco({ tableA, tableB, lid }) {
    try {
        let query1 = `update ${tableA} set recoid='',recotag='' where recoid='${lid}'`
        let q1 = Buffer.from(query1).toString('base64');
        let query2 = `update ${tableB} set recoid='',recotag='' where recoid='${lid}'`
        let q2 = Buffer.from(query2).toString('base64');
        let res = await queryGet([q1, q2])
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function removeLineItem(params) {
    try {
        let res = await exeQuery(`update ${params.table} set recoid='', recotag='', recostatus='' where lid='${params.lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getRecoTableData,checkSummary, saveSummary,removeLineItem, completeReco, completeBulkReco, rejectReco, deleteTableData, manualMatching }
