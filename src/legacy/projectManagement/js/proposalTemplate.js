const { fetchTable, dateTimeGeneration, exeQuery } = require("../../config");

const onloadTemplate = async (params) => {
  try {
    let proposalDetails = await fetchTable(
      `SELECT * FROM allcontracts WHERE urn='${params.contractID}'`
    );
    let getTemplateTransaction_res = await fetchTable(
      `SELECT * FROM proposal_templateTransactions WHERE contractID='${params.contractID}'`
    );
    return {
      proposalDetails: proposalDetails,
      getTemplateTransaction_res: getTemplateTransaction_res,
    };
  } catch (e) {
    return { e: e.message };
  }
};

const fetchContractAssignmentNature = async (params) => {
  try {
    let contractAssign_query = await fetchTable(
      `SELECT * FROM ContractAssignmentNature WHERE contractID='${params.contractID}' ORDER BY sequence`
    );
    return contractAssign_query
  } catch (e) {
    return { e: e.message };
  }
};

const fetchMilestoneSubform = async (params) => {
  try {
    let contractAssign_query = await fetchTable(
      `SELECT * FROM milestoneSubform WHERE contractID='${params.contractID}' ORDER BY assignmentID,sequence`
    );
    return contractAssign_query;
  } catch (e) {
    return { e: e.message };
  }
};

async function getDisplayTermsConditions(params) {
  try {
    let termsContract_query = await fetchTable(
      `select termsConditions from AllContracts WHERE contractID='${params.contractID}'`
    );
    return termsContract_query;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getContractStatusQuery(params) {
  try {
    let statusContract_query = await fetchTable(
      `SELECT status FROM AllContracts WHERE contractID='${params.contractID}'`
    );
    return statusContract_query;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function insertTemplateTransaction(params) {
  let date = dateTimeGeneration(new Date());
  try {
    let insertTemplate_query = await exeQuery(
      `INSERT INTO proposal_templateTransactions
        (contractID,template,chatHistory,addedUser,addedTime) VALUES
        ('${params.contractID}','${params.template}','${params.chatHistory}','${params.addedUser}','${date}')
    `
    );
    return insertTemplate_query;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function updateTemplateTransaction(params) {
  let date = dateTimeGeneration(new Date());

  try {
    let updateTemplate_query =
      await exeQuery(`UPDATE proposal_templateTransactions
       SET template = '${params.template}',modifiedUser = '${params.modifiedUser}',modifiedTime = '${date}'
      WHERE contractID='${params.contractID}'`);
    console.log(updateTemplate_query);
    return updateTemplate_query;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getChatfromProposalTemplate(params) {
  try {
    let chatHistory = await fetchTable(
      `SELECT chatHistory FROM proposal_templateTransactions WHERE contractID='${params.contractID}'`
    );
    return chatHistory;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function updateChatProposal(params) {
  try {
    let chatHistoryUpdate = await exeQuery(`UPDATE proposal_templateTransactions
        SET chatHistory = '${params.chatHistory}'
        WHERE contractID='${params.contractID}'
`);
    return chatHistoryUpdate;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function updateStatusProposal(params) {
  try {
    let updateStatus =
      await exeQuery(`UPDATE AllContracts SET status='${params.status}' WHERE contractID='${params.contractID}'
`);
    return updateStatus;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getAssignmentNatureName(params) {
  try {
   const assignmentNatureIds = params.allAssignment
      .map((item) => `'${item.assignmentNature}'`)
      .join(",");

    const assignmentNature_query = await fetchTable(
      `SELECT  assignmentNature ,timelines ,scopeExclusions,scopeInclusions FROM AssignmentNature WHERE lid IN (${assignmentNatureIds})`
    );
    console.log(assignmentNature_query)
    return assignmentNature_query
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getClientDetails(params) {
  try {
    const getClientDetails = await fetchTable(
    `select companyId from allContracts where urn='${params.contractID}'`
  );
    return getClientDetails
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getContactMaster(params) {
  try {
    const getContactMaster =   await fetchTable(
      `select poc1Mail from contactMaster where lid='${params.lid}'`
    );
    return getContactMaster;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function checkEmailClients(params){
   try {
    const checkEmail = await fetchTable(
      `select * from syf_usermaster where email='${params.email}'`
    );
    return checkEmail;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

module.exports = {
  onloadTemplate,
  fetchContractAssignmentNature,
  fetchMilestoneSubform,
  getDisplayTermsConditions,
  getContractStatusQuery,
  insertTemplateTransaction,
  updateTemplateTransaction,
  getChatfromProposalTemplate,
  updateChatProposal,
  updateStatusProposal,
  getAssignmentNatureName,getClientDetails,getContactMaster,checkEmailClients
};
