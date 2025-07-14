const {
  fetchTable,
  queryGet,
  dateTimeGeneration,
  exeQuery,
  workPaper
} = require("../../config");

const getObservstionDetail = async (params) => {
  try {
    let Project = await fetchTable(`select * from AllObservations where companyid='${params.companyid}' AND projectCode='${params.projectCode}' AND type='observation'`);
    return Project;
  } catch (e) {
    return { error: e };
  }
};

const getMilestoneDetails = async (params) => {
  try {
    let Milestones = await fetchTable(`select * from AllObservations where companyid='${params.companyid}' AND projectCode='${params.projectCode}' AND type='Milestone'`);
    return Milestones;
  } catch (e) {
    return { error: e };
  }
};

const getChecklistDetails = async (params) => {
  try {
    let CheckList = await fetchTable(`select * from myworks where companyid='${params.companyid}' AND projectCode='${params.projectCode}'`);
    return CheckList;
  } catch (e) {
    return { error: e };
  }
};

const getTeamMembersDetails = async (params) => {
  try {
    let TeamMembers = await fetchTable(`select * from AllProjects where companyid='${params.companyid}' AND projectCode='${params.projectCode}'`);
    return TeamMembers;
  } catch (e) {
    return { error: e };
  }
};


const getTimeSheetDetails = async (params) => {
  try {
    let TimeSheet = await fetchTable(`select * from dayReport where companyid='${params.companyid}' AND projectCode='${params.projectCode}'`);
    return TimeSheet;
  } catch (e) {
    return { error: e };
  }
};

const getDocumentDetails = async (params) => {
  try {
    let result = await fetchTable(`select assignmentNature from AllProjects where companyid='${params.companyid}' AND projectCode='${params.projectCode}'`)
    if (!result || result.length === 0) return [];
    
    let link_id=result[0]['assignmentNature'];
    if (!link_id) return [];

    let Document = await fetchTable(`
      SELECT document, id, category, type FROM portal_serviceDocs_CMS 
      WHERE (category = 1 AND link_id = ${link_id}) OR (category = 2 AND link_id IN (SELECT id FROM portal_serviceOrder WHERE link_serviceId = ${link_id}));
      `);
    return Document;
  } catch (e) {
    console.error("Error in getDocumentDetails:", e);
    return { error: "Failed to fetch document details." };
  }
};

const saveKycBlobUrl = async (params) => {
  // console.log("saveKycBlobUrl params:", params);
  let query;
  try {
    if(params.doc_id=='kyc_doc_1'){
      query = `UPDATE SYF_USERMASTER SET docs_aadhar='${params.blobUrl}' where lid='${params.user_lid}'`
    } else if(params.doc_id=='kyc_doc_2'){
      query=`UPDATE SYF_USERMASTER SET docs_pan_aadhar ='${params.blobUrl}' where lid='${params.user_lid}'`
    } else {
        return { error: "Invalid KYC document ID." };
    }
    await fetchTable(query);
    return { success: true };
  } catch (e) {
    console.error("Error in saveKycBlobUrl:", e);
    return { error: "Failed to save KYC document." };
  }
};

const getkycBlobUrl = async (params) => {
  try {
    // const query = `
    //   SELECT
    //     u.lid AS userid,
    //     u.name,
    //     u.email,
    //     u.resetToken, 
    //     CASE
    //       WHEN i.inviteduserid IS NULL THEN 1
    //       ELSE 0
    //     END AS isNew,
      
    //     CASE 
    //       WHEN u.resetToken IS NULL OR u.resetToken = '' THEN 1
    //       ELSE 0
    //     END AS isVerified
    //     -- END OF NEW LOGIC --
    //   FROM portal_usersPivot p
    //   LEFT JOIN SYF_USERMASTER u ON u.lid = p.user_id
    //   LEFT JOIN INVITEDUSERS i ON p.user_id = i.inviteduserid AND i.companyid = '${params.companyid}' and i.role='Client'
    //   WHERE p.client_id = '${params.clientId}'
    // `;
    let userid=await fetchTable(`select user_id from portal_usersPivot where client_id in (select id from portal_clients where zohoContactId in (select zohocontactid from allContracts where contractId in (select contractid from allprojects where projectcode='${params.projectCode}')))`)
    let user = []
    userid.map((item)=>{
      user.push(item.user_id)
    })
    user = user.join(',')
    // console.log("getkycBlobUrl user:", user);
    let kycBlobUrl = await fetchTable(`select lid, docs_pan_aadhar, docs_aadhar from SYF_USERMASTER where lid in (${user})`);
    // console.log("kyc: ",kycBlobUrl)
    let userOfProject = await fetchTable(`select name, lid from SYF_USERMASTER where lid in (${user})`);
    // console.log("userOfProject: ",userOfProject)
    return {"kycBlobUrl":kycBlobUrl, "user": userOfProject};
  } catch (e) {
    return { error: e };
  }
};

const getstoredBlobUrl = async (params) => {
  try {
    let storedBlobUrl = await fetchTable(`select link_docId, blob from portal_service_userDocs where link_userId='${params.user_lid}'`);
    return storedBlobUrl;
  } catch (e) {
    return { error: e };
  }
};


const deleteBlobUrl = async (params) => {
  console.log("deleteBlobUrl params:", params);
  try {
    if (params.doc_type === 'kyc') {
      let query;
      if (params.doc_id === 'kyc_doc_1') {
        query = `UPDATE SYF_USERMASTER SET docs_aadhar = NULL WHERE lid = '${params.user_lid}'`;
      } else if (params.doc_id === 'kyc_doc_2') {
        query = `UPDATE SYF_USERMASTER SET docs_pan_aadhar = NULL WHERE lid = '${params.user_lid}'`;
      }else if (params.doc_type === 'deliverable' || params.doc_type ==="pbc") {
        query = `UPDATE portal_service_UserDocs SET blob = NULL WHERE blob ='${params.blobUrl}' `;
      } else {
        throw new Error("Invalid KYC doc_id for deletion.");
      }
      await fetchTable(query);
      return { Response: "KYC document reference deleted successfully" };
    } 
    
    else {
      if (!params.blobUrl) {
          throw new Error("blobUrl is required to delete a specific file.");
      }
      const blobUrl = params.blobUrl;

      const deleteQuery = `
        DELETE FROM portal_service_userDocs 
        WHERE 
          link_userId = '${params.user_lid}' AND 
          link_docId = '${params.doc_id}' AND 
          link_projectId = '${params.projectCode}' AND
          blob = '${blobUrl}'
      `;
      
      await fetchTable(deleteQuery);
      return { Response: "Project document reference deleted successfully" };
    }
  } catch (e) {
    console.error("Error in deleteBlobUrl:", e);
    return { error: true, message: e.message || "An unexpected error occurred during deletion." };
  }
};


// 
const saveBlobUrl = async (params) => {
  console.log("saveBlobUrl params:", params);
  try {
    const date = dateTimeGeneration(new Date());
    if (!params.blobUrl || !params.fileName) {
      throw new Error("Invalid parameters: blobUrl and fileName are required.");
    }
    const blobUrl = params.blobUrl;
    // const fileName = params.fileName;
    const query = `
      INSERT INTO portal_service_userDocs (link_userId, link_docId, link_projectId, blob, addedtime, addeduser) 
      VALUES ('${params.user_lid}', '${params.doc_id}', '${params.projectCode}', '${blobUrl}', '${date}', '${params.user_lid}')
    `;

    console.log("saveBlobUrl query:", query);
    let res= await fetchTable(query);
    console.log("saveBlobUrl response:", res);
    return { success: true, action: "inserted", "response": res };
  } catch (e) {
    console.error("saveBlobUrl error:", e);
    return { error: true, message: e.message || "Failed to save document URL." };
  }
};

const exportBlobUrl = async (params) => {
  console.log("exportBlobUrl params:", params);
  try {
    let query= `
        SELECT blob, link_docId 
        FROM portal_service_userDocs 
        WHERE link_projectId='${params.projectCode}'
      `;
    // if(params.isClientView){
    //   query =
    // }else{
    //   query = `
    //     SELECT blob, link_docId 

    //     FROM portal_service_userDocs 
    //     WHERE link_projectId='${params.projectCode}'
    //   `;
    // }
    console.log("exportBlobUrl query:", query);
    const result = await fetchTable(query);
    console.log(result,'test',params)
    return result;
  } catch (e) {
    console.error("ExportBlobUrl error:", e);
    return { error: true, message: e.message || "Failed to export blob URLs." };
  }
};


async function sanjay_getAssignedPortalUsers(params) {
  try {
    const query = `
      SELECT u.name, u.email FROM SYF_USERMASTER u
      JOIN portal_usersPivot p ON u.lid = p.user_id
      JOIN portal_clients pc ON p.client_id = pc.id
      JOIN AllContracts ac ON pc.zohoContactId = ac.zohoContactId
      JOIN AllProjects ap ON ac.contractID = ap.contractID
      WHERE ap.projectCode = '${params.projectCode}' AND ap.companyid = '${params.companyid}'
    `;
    const usersResult = await exeQuery(query);
    if (usersResult.responseType === "SUCCESS" && usersResult.responseData.table) {
      return usersResult.responseData.table;
    }
    return [];
  } catch (error) {
    console.error("Error in getAssignedPortalUsers:", error);
    return [];
  }
}

module.exports = { getObservstionDetail, getMilestoneDetails, getChecklistDetails, getTeamMembersDetails, getTimeSheetDetails, getDocumentDetails, saveBlobUrl, exportBlobUrl, saveKycBlobUrl, getkycBlobUrl, getstoredBlobUrl, deleteBlobUrl, sanjay_getAssignedPortalUsers };