const { fetchTable, exeQuery } = require("../../config");

async function getLeads({ companyid }) {
  try {
    let getLeadsQuery = await fetchTable(
      `SELECT * FROM LEADMANAGEMENT where companyid='${companyid}'`
    );
    return getLeadsQuery;
  } catch (error) {
    return error;
  }
}

async function getContracts({ companyid }) {
  try {
    let getContractsQuery = await fetchTable(`SELECT 
  contractAssignmentNature.*, 
  allcontracts.status,allcontracts.attachments,
  assignmentNature.assignmentNature
FROM 
  contractAssignmentNature
LEFT JOIN 
  allcontracts 
ON 
  contractAssignmentNature.contractID = allcontracts.contractID
  LEFT JOIN assignmentNature ON contractAssignmentNature.assignmentNature=assignmentNature.lid
WHERE 
  contractAssignmentNature.companyid = '${companyid}';`);
    return getContractsQuery;
  } catch (error) {
    return { error: error.message };
  }
}

async function getProposals({ companyid }) {
  try {
    let getProposalQuery = await fetchTable(
      `SELECT * FROM AllContracts  where companyId='${companyid}'`
    );
    return getProposalQuery;
  } catch (error) {
    return error;
  }
}
async function getPendingLeads(params) {
  try {
    let getPendingLeadsQuery = await fetchTable(
      `SELECT * FROM AllContracts WHERE status='${params.status}' and companyid='${params.companyid}'`
    );
    return getPendingLeadsQuery;
  } catch (error) {
    return error;
  }
}

async function changeStatusPending(params) {
  try {
    console.log(params.ps_validation)
    console.log(params.urn)
    let changeStatus = await exeQuery(
      `UPDATE AllContracts
    SET ps_validation='${params.ps_validation}' where urn='${params.urn}'`
    );
    return changeStatus;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getLeads,
  getContracts,
  getProposals,
  getPendingLeads,
  changeStatusPending,
};
