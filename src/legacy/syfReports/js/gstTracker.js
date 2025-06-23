const {
  fetchTable,
  queryGet,
  fetchOptions,
  exeQuery,
} = require("../../config");

async function getNoticeTrackerData(params) {
  try {
    let res = await fetchTable(
      `SELECT * FROM noticeTracker where companyid='${params.companyid}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function updateStatusNoticeTracker(params) {
  try {
    console.log(params.lid)
    console.log(params.status)
    let updateStatus_query = await exeQuery(`update  noticeTracker
           SET  status='${params.status}' where lid='${params.lid}'`);
    return updateStatus_query;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}


async function updateContractIdNoticeTracker(params) {
  try {
    console.log(params.lid)
    console.log(params.status)
    let updateStatus_query = await exeQuery(`update  noticeTracker
           SET  contractid='${params.contract_id}' where lid='${params.lid}'`);
    return updateStatus_query;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function updateTimeExtensionFieldNoticeTracker(params) {
  try {
    console.log(params.lid)
    console.log(params.status)
    let updateStatus_query = await exeQuery(`update  noticeTracker
           SET  time_Extension_Filed='${params.time_Extension_Filed}' where lid='${params.lid}'`);
    return updateStatus_query;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}
module.exports = {
  getNoticeTrackerData,
  updateStatusNoticeTracker,updateContractIdNoticeTracker, updateTimeExtensionFieldNoticeTracker
};
