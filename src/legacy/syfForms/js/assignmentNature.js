const {
  fetchTable,
  queryGet,
  fetchOptions,
  dateTimeGeneration,
  exeQuery,
} = require("../../config");

async function getAssignmentUvData({ lid }) {
  try {
    let res = await fetchTable(
      `SELECT * FROM AssignmentNature where lid='${lid}'`
    );
    let docs = await fetchTable(
      `select id,document,type from portal_serviceDocs_CMS where link_id='${lid}' and category='1'`
    );
    return { data: res, docs: docs };
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}



async function saveAssignment({ data }) {
  try {
    let addedTime = dateTimeGeneration(new Date());
    let res =
      await exeQuery(`insert into AssignmentNature(teamlead,partner,personresponsible,assignmentNature,type,assignmentFrequency,standardPrice,multiplier,statutoryAssignment,deliverables,scopeInclusions,scopeExclusions,timelines,timelineCount,timelineManualCount,presalesefforts,termsConditions,productOwner,standardPriceinputs,standardHours,addedUser,addedTime,companyName,companyId,isListing)
        OUTPUT Inserted.lid values('${data.teamlead}','${data.partner}','${data.personresponsible}','${data.assignmentNature}','${data.type}','${data.frequency}',
            '${data.standardPrice}','${data.multiplier}','${data.statutoryAssign}','${data.deliverables}','${data.scopeInclusions}','${data.scopeExclusions}','${data.timelines}','${data.timelineCount}','${data.timeLineManualCount}','${data.presaleseffort}','${data.termsconditions}','${data.productOwner}','${data.standardPriceInputs}','${data.standardHours}','${data.addeduser}','${addedTime}','${data.companyName}','${data.companyId}',${data.isListing}) `);
    let serviceId = res.responseData.table[0].lid;
    let query = [];
     if (data.docs.length > 0) {
    data.docs.map((item) => {
      let q = `insert into portal_serviceDocs_CMS (link_id,category,document,type,addeduser,addedtime)
        values ('${serviceId}','1','${item.documentName}','${item.documentType}','${data.addeduserid}','${addedTime}')`;
      let encryptedQuery = Buffer.from(q).toString("base64");
      query.push(encryptedQuery);
    });
    let result = await queryGet(query);
    return result;
  }
  else{
    return res;
  }
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function updateAssignment({ data }) {
  try {
    let addedTime = dateTimeGeneration(new Date());
    let query = [];
    let updateAssign_query = `update AssignmentNature set teamlead='${data.teamlead}',partner='${data.partner}',personresponsible='${data.personresponsible}',
            assignmentNature='${data.assignmentNature}',type='${data.type}',assignmentFrequency='${data.frequency}',standardPrice='${data.standardPrice}',multiplier='${data.multiplier}',statutoryAssignment='${data.statutoryAssign}',modifiedTime='${data.currentDate}',
            deliverables='${data.deliverables}',scopeInclusions='${data.scopeInclusions}',scopeExclusions='${data.scopeExclusions}',timelines='${data.timelines}',timelineCount='${data.timelineCount}',timelineManualCount='${data.timeLineManualCount}',presalesefforts='${data.presaleseffort}',termsConditions='${data.termsconditions}',productOwner='${data.productOwner}',isListing=${data.isListing},standardPriceinputs='${data.standardPriceInputs}',standardHours='${data.standardHours}',modifiedUser='${data.modifieduser}' where lid='${data.lid}'`;
    let encrypt_update = Buffer.from(updateAssign_query).toString("base64");
    query.push(encrypt_update);
    let serviceId = data.lid;
    if (data.docs.length > 0) {
      data.docs.map((item) => {
        let q;
        if (item.id == undefined) {
          q = `insert into portal_serviceDocs_CMS (link_id,category,document,type,addeduser,addedtime)
        values ('${serviceId}','1','${item.documentName}','${item.documentType}','${data.addeduserid}','${addedTime}')`;
        } else if (item.id) {
          q = `UPDATE portal_serviceDocs_CMS 
            SET document='${item.documentName}', type='${item.documentType}', modifieduser='${data.addeduserid}', modifiedtime='${addedTime}'
            WHERE id='${item.id}'`;
        }
        let encryptedQuery = Buffer.from(q).toString("base64");
        query.push(encryptedQuery);
      });
    }
    let result = await queryGet(query);
    return result;
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

module.exports = {
  getAssignmentUvData,
  saveAssignment,
  updateAssignment,
  getInvitedUserNames,
};
