const { fetchTable, exeQuery, queryGet } = require('../../config')

async function getAllInvoices(params){
    try {
        let res = await fetchTable(`select * from allInvoices where companyId='${params.companyId}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateInvoice({formattedDate,invoiceNumber}){
    try {
        let res = await exeQuery(`Update allInvoices set status='Collected',modifiedTime='${formattedDate}' where invoiceNumber=${invoiceNumber}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function pendingToSent({invoiceNumber}){
    try {
        let res = await exeQuery(`Update allInvoices set status='sent' where invoiceNumber=${invoiceNumber}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function changeAmount(params){
    try {
        let res = await fetchTable(`select milestone,amount,percent from milestoneSubform where assignmentID='${params.assignmentID}' and percent!=0`)
        if(res.length>0){
            res.map((item)=>{
                let amount = ''
                let o=`update allObservations`
            })
        }
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports={getAllInvoices,updateInvoice,pendingToSent,changeAmount}