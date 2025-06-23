const { fetchTable, exeQuery, queryGet } = require('../../config')

async function getOngoingContractData({ companyid }) {
    try {
        let getLeads_query = await fetchTable(`SELECT * FROM AllContracts WHERE status='ongoingContract' and companyid='${companyid}' order by addedTime desc`);
        return getLeads_query
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports={getOngoingContractData}