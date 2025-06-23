const { fetchTable , exeQuery } = require('../../config')

async function getLeadData({ data }) {
    try {
        let res = await fetchTable(`select * from leadmanagement where companyid='${data.company}' and leadstatus='${data.status}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}
async function getVendorData({ data }) {
    try {
        let res = await fetchTable(`select contactname,entityname,lid from zohoContacts where companyid='${data.companyid}' and contacttype='vendor'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function getCustomerData({ data }) {
    try {
        let res = await fetchTable(`select * from contactMaster where companyid='${data.companyid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function deleteLead({ lid,companyid }) {
    try {
        let res = await exeQuery(`DELETE FROM leadmanagement WHERE lid='${lid}' and companyid='${companyid}'`);
        return res;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function deleteContact({ lid,companyid }) {
    try {
        let res = await exeQuery(`DELETE FROM contactMaster WHERE lid='${lid}' and companyid='${companyid}'`);
        return res;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

module.exports = { getLeadData, getVendorData, getCustomerData, deleteLead, deleteContact }