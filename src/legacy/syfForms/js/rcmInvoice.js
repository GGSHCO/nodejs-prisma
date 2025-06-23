const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function onloadData({ company }) {
    try {
        let stateCodeDetails = await fetchTable(`select * from gst_state_code_india`)
        let vendorOptions = await fetchOptions(`select * from vendorMasterTemp where companyId='${company.companyID}'`, "vendorName", "vendorName")
        let vendorData = await fetchTable(`select * from vendorMasterTemp where companyId='${company.companyID}'`)
        let invoiceNumberRes = await fetchTable(`select taxInvoiceNo from tdsInvoices where companyId='${company.companyID}'`)
        let data = {
            vendorOptions: vendorOptions,
            vendorData: vendorData,
            invoiceNumber: invoiceNumberRes,
            stateCodeDetails: stateCodeDetails
        }
        return data
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function insertVendor({ name, service, gstin, address, addedTime, stateName, stateCode, addeduser, companyname, companyid }) {
    try {
        let res = await exeQuery(`insert into vendorMasterTemp (vendorName,service,gstin,address,stateName,stateCode,addedTime,addedUser,companyName,companyId)values
                ('${name}','${service}','${gstin}','${address}','${stateName}','${stateCode}','${addedTime}','${addeduser}','${companyname}','${companyid}')`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function rcm_getUvData({ lid }) {
    try {
        let res = await fetchTable(`select * from tdsInvoices where lid='${lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function rcm_deleteDataLid({ lid }) {
    try {
        let res = await exeQuery(`delete  from tdsInvoices where lid='${lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function saveRcm({ data }) {
    try {
        let insertListQuery = []
        data.map((item) => {
            let insert = `INSERT into tdsInvoices(vendorName,date,amount,service,hsncode,placeOfSupply,clientGstin,clientAddress,
            igstRate,igstAmount,sgstRate,sgstAmount,cgstRate,cgstAmount,companyName,companyId,addedUser,addedTime,taxInvoiceNo)
             VALUES('${item.vendorName}','${item.date}','${item.amount}','${item.service}','${item.hsncode}','${item.placeOfSupply}','${item.clientGstin}','${item.clientAddress}',
             '${item.igstRate}','${item.igstAmount}', '${item.sgstRate}','${item.sgstAmount}', '${item.cgstRate}','${item.cgstAmount}',
             '${item.companyname}','${item.companyid}',
             '${item.addeduser}','${item.addedTime}','${item.taxInvoiceNo}')`
            let insertData = Buffer.from(insert).toString('base64')
            insertListQuery.push(insertData)
        })
        let res = await queryGet(insertListQuery)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateRcm({ data }) {
    try {
        let insertListQuery = []
        data.map((item) => {
            if (item.lid != undefined) {
                let insert = `update tdsInvoices set vendorName='${item.vendorName}',date='${item.date}',hsncode='${item.hsncode}',
            amount='${item.amount}',modifiedUser='${item.addeduser}',service='${item.service}',placeOfSupply='${item.placeOfSupply}',
            igstRate='${item.igstRate}',igstAmount='${item.igstAmount}',
              cgstRate='${item.cgstRate}',cgstAmount='${item.cgstAmount}',
                sgstRate='${item.sgstRate}',sgstAmount='${item.sgstAmount}',taxInvoiceNo='${item.taxInvoiceNo}',clientAddress='${item.clientAddress}',clientGstin='${item.clientGstin}',
            modifiedTime='${item.addedTime}' where lid='${item.lid}'`
                let insertData = Buffer.from(insert).toString('base64')
                insertListQuery.push(insertData)

            }
            else {
                let insert = `INSERT into tdsInvoices(vendorName,date,amount,service,hsncode,
            igstRate,igstAmount,sgstRate,sgstAmount,cgstRate,cgstAmount,companyName,companyId,addedUser,addedTime,taxInvoiceNo)
             VALUES('${item.vendorName}','${item.date}','${item.amount}','${item.service}','${item.hsncode}',
             '${item.igstRate}','${item.igstAmount}', '${item.sgstRate}','${item.sgstAmount}', '${item.cgstRate}','${item.cgstAmount}',
             '${item.companyname}','${item.companyid}',
             '${item.addeduser}','${item.addedTime}','${item.taxInvoiceNo}')`
                let insertData = Buffer.from(insert).toString('base64')
                insertListQuery.push(insertData)
            }
        })
        let res = await queryGet(insertListQuery)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


module.exports = { onloadData, insertVendor, saveRcm, updateRcm, rcm_getUvData, rcm_deleteDataLid }