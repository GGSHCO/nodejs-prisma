const { fetchTable, exeQuery } = require('../../config')

const getBillingAddress = async (params) => {
    try {
        let getBillingAddressQuery = await fetchTable(`select billingAddress from syf_companyMaster where lid=${params.companyID}`)
        return getBillingAddressQuery
    }
    catch (e) {
        return { e: e.message }
    }
}

const getTotalAmount = async (params) => {
    try {
        let getAmountRes = await fetchTable(`select amount from allProjects where projectCode=${params.projectCode}`)
        return getAmountRes
    }
    catch (e) {
        return { e: e.message }
    }

}

const getProjectData = async (params) => {
    try {
        let invoice_query = await fetchTable(`SELECT * FROM AllInvoices WHERE projectCode='${params.projectCode}' AND status='${params.status}' AND amount!=0`);
        return invoice_query
    }
    catch (e) {
        return { e: e.message }
    }
}

const getAllProjectData = async (params) => {
    try {
        let invoice_query1 = await fetchTable(`SELECT * FROM AllInvoices WHERE projectCode='${params.projectCode}' AND amount!=0`);
        return invoice_query1
    }
    catch (e) {
        return { e: e.message }
    }
}

const updatePaidInvoice = async (params) => {
    try {

        let invoiceNumber = params.invoiceNumber.join(',')
        let res = await exeQuery(`UPDATE AllInvoices SET status='Paid' where invoiceNumber in (${invoiceNumber})`)
        return res
    }
    catch (e) {
        return { e: e.message }
    }

}

const updateSentInvoice = async (params) => {
    try {
        let invoiceNumber = params.invoiceNumber.join(',')
        let res = await exeQuery(`UPDATE AllInvoices SET status='Sent',addedTime='${params.addedTime}',edoc='${params.dueDate}' where invoiceNumber in (${invoiceNumber})`)
        return res
    }
    catch (e) {
        return { e: e.message }
    }
}



module.exports = { getBillingAddress, getTotalAmount, getProjectData, getAllProjectData, updatePaidInvoice,updateSentInvoice }