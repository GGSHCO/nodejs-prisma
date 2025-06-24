const {
  fetchTable,
  queryGet,
  fetchOptions,
  exeQuery,
} = require("../../config");

async function getExsistingUserList(params) {
  try {
    console.log(params.companyid);
    let res = await fetchOptions(
      `select name,lid from SYF_USERMASTER `,
      "name",
      "lid"
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function services_userAdd_addNewUser(params) {
  const results = [];
  console.log(params)
  for (const user of params) {
    try {
      const query = `
        INSERT INTO SYF_USERMASTER (email, name, zbStatus, status)
        OUTPUT Inserted.lid
        VALUES ('${user.email}', '${user.name}', 'guest', 'login')
      `;

      let res = await exeQuery(query);
      let serviceId = res.responseData.table[0].lid;
      console.log("Inserted ID:", serviceId);
      user["serviceId"]=serviceId
      results.push({ success: true, user });

    } catch (error) {
      console.log("Error inserting user:", user.email, error);
      results.push({ success: false, user, error: error.message });
    }
  }

  return results;
}

async function services_userAdd_addToPivot(params) {
  const results = [];
  console.log("ram ram ram ram ram ram ram")
  console.log(params)
  for (const user of params.selected_users) {
    try {
      const query = `
        INSERT INTO portal_usersPivot (user_id, client_id)
        VALUES ('${user}', '${params.zlid}')
      `;

      let res = await exeQuery(query);
    

      results.push({ success: true, user_id: user, client_id: params.zlid, res:res });

    } catch (error) {
      console.log("Error inserting pivot user:", user, error);
      results.push({ success: false, user_id: user, error: error.message });
    }
  }

  return results;
}


// async function saveAssignment({ data }) {
//   try {
//     let res =
//       await exeQuery(`insert into AssignmentNature(assignmentNature,type,assignmentFrequency,standardPrice,multiplier,statutoryAssignment,deliverables,scopeInclusions,scopeExclusions,timelines,timelineCount,timelineManualCount,presalesefforts,termsConditions,productOwner,standardPriceinputs,standardHours,addedUser,addedTime,companyName,companyId,isListing) values('${data.assignmentNature}','${data.type}','${data.frequency}',
//             '${data.standardPrice}','${data.multiplier}','${data.statutoryAssign}','${data.deliverables}','${data.scopeInclusions}','${data.scopeExclusions}','${data.timelines}','${data.timelineCount}','${data.timeLineManualCount}','${data.presaleseffort}','${data.termsconditions}','${data.productOwner}','${data.standardPriceInputs}','${data.standardHours}','${data.addeduser}','${data.currentDate}','${data.companyName}','${data.companyId}',${data.isListing}) `);
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }

// async function updateAssignment({ data }) {

//   try {
//     let updateAssign_query = await exeQuery(`update AssignmentNature set
//             assignmentNature='${data.assignmentNature}',type='${data.type}',assignmentFrequency='${data.frequency}',standardPrice='${data.standardPrice}',multiplier='${data.multiplier}',statutoryAssignment='${data.statutoryAssign}',modifiedTime='${data.currentDate}',
//             deliverables='${data.deliverables}',scopeInclusions='${data.scopeInclusions}',scopeExclusions='${data.scopeExclusions}',timelines='${data.timelines}',timelineCount='${data.timelineCount}',timelineManualCount='${data.timeLineManualCount}',presalesefforts='${data.presaleseffort}',termsConditions='${data.termsconditions}',productOwner='${data.productOwner}',isListing=${data.isListing},standardPriceinputs='${data.standardPriceInputs}',standardHours='${data.standardHours}',modifiedUser='${data.modifieduser}' where lid='${data.lid}'`);
//     return updateAssign_query;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }

// async function getInvitedUserNames(params) {
//   try {
//     let res = await fetchTable(
//       `SELECT inviteduseremail FROM INVITEDUSERS where companyname='${params.companyname}'`
//     );
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }

module.exports = { getExsistingUserList, services_userAdd_addNewUser,services_userAdd_addToPivot };
