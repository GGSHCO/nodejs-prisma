const {
  fetchTable,
  fetchOptions,
  queryGet,
  exeQuery,
} = require("../../config");



async function services_userList_zohoData(params) {
  try {
    let res = await fetchTable(
      `select * from zohoContacts where companyId='${params.companyid}' AND contacttype='customer'`
    );

    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function services_userList_zohocontact(user) {
  try {
    const query = `
        INSERT INTO portal_clients (zohoContactId,createdBy)
        OUTPUT Inserted.id
        VALUES ('${user.zohoContactId}', '${user.createdBy}')
      `;

    let res = await exeQuery(query);
    let serviceId = res.responseData.table[0].id;
    console.log("Inserted ID:", serviceId);
    user["Id"] = serviceId;
    user["res"] = res;
    return user;
  } catch (error) {
    console.log("Error inserting user:", user.email, error);
     return { error: true, message: error.message, details: error };

  }


}

// , { companyId: params.companyid }
async function services_userList_getExistingPortalClients(params) {
  try {
   
    const query = `
      SELECT id, zohoContactId 
      FROM portal_clients 
    `;

    // Assuming your exeQuery can handle named parameters.
    let res = await exeQuery(query);

    // Return the data directly
    if (res.responseType === 'SUCCESS') {
      return res.responseData.table || [];
    }
    return []; // Return empty array on failure

  } catch (error) {
    console.log("Error fetching existing portal clients:", error);
    return []; // Always return an array to prevent frontend errors
  }
}



module.exports = { services_userList_zohoData, services_userList_zohocontact ,services_userList_getExistingPortalClients};
