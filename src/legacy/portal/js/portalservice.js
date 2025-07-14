const {
  fetchTable,
  queryGet,
  fetchOptions,
  exeQuery,
  dateTimeGeneration,
} = require("../../config");

async function getServices(params) {
  try {
    let res = await fetchTable(
      `select assignmentNature,lid from assignmentnature where isListing=1 and companyId='${params.companyid}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getUnpaidProjects(params) {
  try {
    let res = await fetchTable(`select  from `);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getServiceCriteriaPayment(params) {
  try {
    let res = await fetchTable(
      `select serviceName,price,id from portal_serviceCriteria where link_assignmentId='${params.id}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getZohoClientName(params) {
  try {
    let res =
      await fetchTable(`select distinct pc.zohocontactid as contactid, c.contactname, pc.id as client_id 
      from portal_clients pc
      left join zohocontacts c on c.contactid = pc.zohocontactid
      where pc.id in (select client_id from portal_usersPivot where user_id='${params.userid}')
  `);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

//  TWO NEW FUNCTIONS

async function addServiceOrder(params) {
  try {
    const query = `INSERT INTO portal_serviceOrder (link_clientId, link_serviceId, price, addedtime, addeduser) 
                   VALUES ('${params.clientId}', '${params.serviceId}', '${params.price}', '${params.addedTime}', '${params.addedUser}')`;
    return await exeQuery(query);
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function removeServiceOrder(params) {
  try {
    const query = `DELETE FROM portal_serviceOrder 
                   WHERE link_clientId = '${params.clientId}' AND link_serviceId = '${params.serviceId}'`;
    return await exeQuery(query);
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

// ADD THIS NEW FUNCTION
async function getServiceOrdersForClient(params) {
  try {
    const query = `SELECT link_serviceId FROM portal_serviceOrder WHERE link_clientId = '${params.clientId}'`;
    return await fetchTable(query);
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function savepaymentPortal(params) {
  let paymentDate = params.paymentDate;
  let date = dateTimeGeneration(new Date());
  try {
    const query = `INSERT INTO portal_payment (userid,zohoContactid,contractID,paymentID,orderID,paymentMethod,dateOfPayment,upi,createdAt,
    acquirerData,errorCode,tax,fee,contact,email,vpa,wallet,bank,cardId,description,captured,refundStatus,amountRefunded,international,
    invoice_id,status,currency,amount,addedUser,addedTime) 
                   VALUES ('${params.userid}','${params.contactid}','${params.contractID}','${params.paymentId}','${params.orderId}','${params.paymentMethod}',
                   '${paymentDate}','${params.upi}','${paymentDate}','${params.acquirerData}','${params.errorCode}',
                   '${params.tax}','${params.fee}','${params.contact}','${params.email}','${params.vpa}','${params.wallet}',
                   '${params.bank}','${params.cardId}','${params.description}','${params.captured}','${params.refundStatus}',
                   '${params.amountRefunded}','${params.international}','${params.invoice_id}','${params.status}',
                   '${params.currency}','${params.amount}',
                   '${params.addedUser}','${date}')`;
    return await exeQuery(query);
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

module.exports = {
  getServices,
  getUnpaidProjects,
  getServiceCriteriaPayment,
  getZohoClientName,
  addServiceOrder,
  removeServiceOrder,
  getServiceOrdersForClient,
  savepaymentPortal,
};
