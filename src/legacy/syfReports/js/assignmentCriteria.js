const {
  fetchTable,
  exeQuery,
  bulkInsert,
  queryGet,
  dateTimeGeneration,
} = require("../../config");

async function getAssignmentCriteria(params) {
  try {
    let result = {};
    // join for getting assignment nature display name
    let res = await fetchTable(`
            SELECT 
                sc.id, 
                sc.serviceName, 
                sc.price, 
                an.assignmentNature
            FROM 
                portal_serviceCriteria sc
            LEFT JOIN 
                assignmentNature an
                ON sc.link_assignmentId = an.lid
            WHERE 
                sc.companyid='${params.companyid}' 
                AND sc.link_assignmentId='${params.assignmentId}'
                
        `);
    if (res.length == 0) {
      res = await fetchTable(`
                SELECT 
                assignmentNature
                FROM 
                assignmentNature
                WHERE 
                companyid='${params.companyid}' 
                AND lid='${params.assignmentId}'
            `);
      result.crit = res;
      result.flag = 0;
    } else {
      result.flag = 1;
      let doc = await fetchTable(`
      SELECT d.document, d.type ,d.link_id,d.id
      FROM portal_serviceDocs_CMS d
      INNER JOIN portal_serviceCriteria sc
        ON d.link_id = sc.id and category='2'
      WHERE sc.link_assignmentId = '${params.assignmentId}'
    `);
      result.doc = doc;
      result.crit = res;
    }
    return result;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function addAssignmentService(params) {
  try {
    // category = 2 - criteria based documents
    let addedTime = dateTimeGeneration(new Date());
    let res =
      await exeQuery(`insert into portal_serviceCriteria (link_assignmentId,companyid,serviceName,price,addeduser,addedtime) 
          OUTPUT Inserted.id values
       ('${params.assignmentId}','${params.companyid}','${params.service}','${params.price}','${params.addeduser}','${addedTime}')`);
    let serviceId = res.responseData.table[0].id;
    let query = [];
    params.docs.map((item) => {
      let q = `insert into portal_serviceDocs_CMS (link_id,category,document,type,addeduser,addedtime)
        values ('${serviceId}','2','${item.documentName}','${item.documentType}','${params.addeduser}','${addedTime}')`;
      let encryptedQuery = Buffer.from(q).toString("base64");
      query.push(encryptedQuery);
    });
    if (query.length > 0) {
      let result = await queryGet(query);
      return result;
    }
    else{
      return res
    }
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function updateAssignmentService(params) {
  try {
    let addedTime = dateTimeGeneration(new Date());
    let query = [];
    let q = `
      UPDATE portal_serviceCriteria
      SET 
        serviceName = '${params.service}',
        price = '${params.price}',
        modifieduser = '${params.addeduser}',
        modifiedtime = '${addedTime}'
      WHERE id='${params.id}'
        AND companyid = '${params.companyid}'
    `;
    let encrypt = Buffer.from(q).toString("base64");
    query.push(encrypt);
    let serviceId = params.id;
    if (params.docs.length > 0) {
      params.docs.map((item) => {
        let q;
        if (item.id == undefined) {
          q = `insert into portal_serviceDocs_CMS (link_id,category,document,type,addeduser,addedtime)
        values ('${serviceId}','2','${item.documentName}','${item.documentType}','${params.addeduser}','${addedTime}')`;
        } else if (item.id) {
          q = `UPDATE portal_serviceDocs_CMS 
            SET document='${item.documentName}', type='${item.documentType}', modifieduser='${params.addeduser}', modifiedtime='${addedTime}'
            WHERE id='${item.id}'`;
        }

        let encryptedQuery = Buffer.from(q).toString("base64");
        query.push(encryptedQuery);
      });
    }
    let result = await queryGet(query);
    console.log(result);
    return result;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function deleteAssignmentCriteria(params) {
  try {
    let q3 = `delete from portal_serviceOrder where link_serviceId='${params.id}'`;
    let encrypt3 = Buffer.from(q3).toString("base64");
    let q1 = `delete from portal_serviceDocs_CMS where link_id='${params.id}'`;
    let encrypt1 = Buffer.from(q1).toString("base64");
    let q2 = `delete from portal_serviceCriteria where id='${params.id}'`;
    let encrypt2 = Buffer.from(q2).toString("base64");
    let query = [encrypt3,encrypt1, encrypt2];
    let res = await queryGet(query);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function deleteCritDoc(params) {
  try {
    let res = await exeQuery(
      `delete from portal_serviceDocs_CMS where id='${params.id}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

module.exports = {
  getAssignmentCriteria,
  addAssignmentService,
  updateAssignmentService,
  deleteAssignmentCriteria,
  deleteCritDoc,
};
