const { fetchTable } = require('../../config')

const onloadTemplate = async (params) => {
    try {
        let proposalDetails = await fetchTable(`SELECT * FROM allcontracts WHERE urn='${params.contractID}'`);
        let getTemplateTransaction_res = await fetchTable(`SELECT * FROM proposal_templateTransactions WHERE contractID='${params.contractID}'`);
        return {
            proposalDetails: proposalDetails,
            getTemplateTransaction_res: getTemplateTransaction_res
        }
    }
    catch (e) {
        return { e: e.message }
    }
}

const fetchContractAssignmentNature = async (params) => {
    try {
        let contractAssign_query = await fetchTable(`SELECT * FROM ContractAssignmentNature WHERE contractID='${params.contractID}' ORDER BY sequence`);
        return contractAssign_query;
    }
    catch (e) {
        return { e: e.message }
    }

}

const fetchMilestoneSubform = async (params) => {
    try {
        let contractAssign_query = await fetchTable(`SELECT * FROM milestoneSubform WHERE contractID='${params.contractID}' ORDER BY assignmentID,sequence`);
        return contractAssign_query;
    }
    catch (e) {
        return { e: e.message }
    }

}

module.exports = { onloadTemplate,fetchContractAssignmentNature,fetchMilestoneSubform}
