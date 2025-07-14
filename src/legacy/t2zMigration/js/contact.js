const {
  fetchTable,
  queryGet,
  fetchOptions,
  exeQuery,
} = require("../../config");

async function t2z_contacts({ fetchType, type, companyid }) {
  try {
    if (fetchType == "t2z") {
      let res = await fetchTable(
        `select * from zohocontacts where contacttype='${type}' and companyid='${companyid}'`
      );
      return res;
    }
    else if(fetchType == 'wd'){
        let res = await fetchTable(
        `select name,entity from contactmaster where type='${type}' and companyid='${companyid}'`
      );
      return res;
    }
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

module.exports = { t2z_contacts };
