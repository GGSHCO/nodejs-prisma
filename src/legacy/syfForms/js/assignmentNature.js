const {
  fetchTable,
  queryGet,
  fetchOptions,
  exeQuery,
} = require("../../config");

async function getAssignmentUvData({ lid }) {
  try {
    let res = await fetchTable(
      `SELECT * FROM AssignmentNature where lid='${lid}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function saveAssignment({ data }) {
  try {
    let res =
      await exeQuery(`insert into AssignmentNature(assignmentNature,type,assignmentFrequency,standardPrice,multiplier,statutoryAssignment,deliverables,scopeInclusions,scopeExclusions,timelines,timelineCount,timelineManualCount,presalesefforts,termsConditions,productOwner,standardPriceinputs,standardHours,addedUser,addedTime,companyName,companyId) values('${data.assignmentNature}','${data.type}','${data.frequency}',
            '${data.standardPrice}','${data.multiplier}','${data.statutoryAssign}','${data.deliverables}','${data.scopeInclusions}','${data.scopeExclusions}','${data.timelines}','${data.timelineCount}','${data.timeLineManualCount}','${data.presaleseffort}','${data.termsconditions}','${data.productOwner}','${data.standardPriceInputs}','${data.standardHours}','${data.addeduser}','${data.currentDate}','${data.companyName}','${data.companyId}') `);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function updateAssignment({ data }) {

  try {
    let updateAssign_query = await exeQuery(`update AssignmentNature set 
            assignmentNature='${data.assignmentNature}',type='${data.type}',assignmentFrequency='${data.frequency}',standardPrice='${data.standardPrice}',multiplier='${data.multiplier}',statutoryAssignment='${data.statutoryAssign}',modifiedTime='${data.currentDate}',
            deliverables='${data.deliverables}',scopeInclusions='${data.scopeInclusions}',scopeExclusions='${data.scopeExclusions}',timelines='${data.timelines}',timelineCount='${data.timelineCount}',timelineManualCount='${data.timeLineManualCount}',presalesefforts='${data.presaleseffort}',termsConditions='${data.termsconditions}',productOwner='${data.productOwner}',standardPriceinputs='${data.standardPriceInputs}',standardHours='${data.standardHours}',modifiedUser='${data.modifieduser}' where lid='${data.lid}'`);
    return updateAssign_query;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getInvitedUserNames(params) {
  try {
    let res = await fetchTable(
      `SELECT inviteduseremail FROM INVITEDUSERS where companyname='${params.companyname}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}


module.exports = { getAssignmentUvData, saveAssignment, updateAssignment, getInvitedUserNames};
