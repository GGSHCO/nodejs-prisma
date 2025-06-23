const {
  fetchTable,
  queryGet,
  fetchOptions,
  exeQuery,
} = require("../../config");

// async function getAssignmentUvData({ lid }) {
//   try {
//     let res = await fetchTable(
//       `SELECT * FROM AssignmentNature where lid='${lid}'`
//     );
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }

// async function updateAssignment({ data }) {
//   try {
//     let updateAssign_query = await exeQuery(`update AssignmentNature set
//             assignmentNature='${data.assignmentNature}',type='${data.type}',assignmentFrequency='${data.frequency}',standardPrice='${data.standardPrice}',multiplier='${data.multiplier}',statutoryAssignment='${data.statutoryAssign}',modifiedTime='${data.currentDate}',
//             modifiedUser='${data.modifieduser}' where lid='${data.lid}'`);
//     return updateAssign_query;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }
async function zohoNames(params) {
  try {
    let res = await fetchOptions(
      `select distinct contactname from zohoContacts where companyname = '${params.companyname}'`,
      "contactname",
      "contactname"
    );

    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

// async function insertIntoGstNotices(params) {
//   try {
//     const query = `
//       INSERT INTO noticeTracker
//  (
//         companyid, addedUser, addedTime, modifiedUser, modifiedTime, gstin, entity, type_of_Notice,
//         scN_Ref_no, doi, section, fy, time_Extension_Filed, due_Date,
//         notice_IGSTtax, notice_CGSTtax, notice_SGSTtax, notice_Cesstax, notice_Total_Tax,
//         notice_IGSTInterest, notice_CGSTInterest, notice_SGSTInterest, notice_CessInterest, notice_Total_Interest,
//         notice_IGSTPenalty, notice_CGSTPenalty, notice_SGSTPenalty, notice_CessPenalty, notice_Total_Penalty,
//         notice_IGSTLatefee, notice_CGSTLatefee, notice_SGSTLatefee, notice_CessLatefee, notice_Total_Late_fee,
//         notice_Total_Notice_Amount, remarks, notice_remarks, order_Ref_No, order_Date,
//         order_IGSTtax, order_CGSTtax, order_SGSTtax, order_Cesstax, order_Total_Tax,
//         order_IGSTInterest, order_CGSTInterest, order_SGSTInterest, order_CessInterest, order_Total_Interest,
//         order_IGSTPenalty, order_CGSTPenalty, order_SGSTPenalty, order_CessPenalty, order_Total_Penalty,
//         order_IGSTLatefee, order_CGSTLatefee, order_SGSTLatefee, order_CessLatefee, order_Total_Late_fee,
//         order_Total_Notice_Amount, order_Total_Demand_amount, order_Total_drop_amount, order_Remarks,
//         category, status, manager_responsible, personresp_1, personresp_2, personresp_3, contractid, projectids
//       ) VALUES (
//         ${params.companyid || null}, '${params.addedUser || ""}', '${
//       params.addedTime || ""
//     }',
//         ${params.modifiedUser ? `'${params.modifiedUser}'` : null}, ${
//       params.modifiedTime ? `'${params.modifiedTime}'` : null
//     },
//         '${params.gstin || ""}', '${params.entity || ""}', '${
//       params.type_of_Notice || ""
//     }',
//         '${params.scn_ref_no || ""}', '${params.doi_Date || ""}', '${
//       params.section || ""
//     }', '${params.fy || ""}',
//         ${params.time_Extension_Filed === true ? 1 : 0}, '${
//       params.due_Date || ""
//     }',
//         ${params.notice_IGSTtax || 0}, ${params.notice_CGSTtax || 0}, ${
//       params.notice_SGSTtax || 0
//     }, ${params.notice_Cesstax || 0}, ${params.notice_Total_Tax || 0},
//         ${params.notice_IGSTInterest || 0}, ${
//       params.notice_CGSTInterest || 0
//     }, ${params.notice_SGSTInterest || 0}, ${
//       params.notice_CessInterest || 0
//     }, ${params.notice_Total_Interest || 0},
//         ${params.notice_IGSTPenalty || 0}, ${params.notice_CGSTPenalty || 0}, ${
//       params.notice_SGSTPenalty || 0
//     }, ${params.notice_CessPenalty || 0}, ${params.notice_Total_Penalty || 0},
//         ${params.notice_IGSTLatefee || 0}, ${params.notice_CGSTLatefee || 0}, ${
//       params.notice_SGSTLatefee || 0
//     }, ${params.notice_CessLatefee || 0}, ${params.notice_Total_Late_fee || 0},
//         ${params.notice_Total_Notice_Amount || 0}, '${
//       params.remarks || ""
//     }', '${params.notice_remarks || ""}', '${params.order_Ref_No || ""}', '${
//       params.order_Date || ""
//     }',
//         ${params.order_IGSTtax || 0}, ${params.order_CGSTtax || 0}, ${
//       params.order_SGSTtax || 0
//     }, ${params.order_Cesstax || 0}, ${params.order_Total_Tax || 0},
//         ${params.order_IGSTInterest || 0}, ${params.order_CGSTInterest || 0}, ${
//       params.order_SGSTInterest || 0
//     }, ${params.order_CessInterest || 0}, ${params.order_Total_Interest || 0},
//         ${params.order_IGSTPenalty || 0}, ${params.order_CGSTPenalty || 0}, ${
//       params.order_SGSTPenalty || 0
//     }, ${params.order_CessPenalty || 0}, ${params.order_Total_Penalty || 0},
//         ${params.order_IGSTLatefee || 0}, ${params.order_CGSTLatefee || 0}, ${
//       params.order_SGSTLatefee || 0
//     }, ${params.order_CessLatefee || 0}, ${params.order_Total_Late_fee || 0},
//         ${params.order_Total_Notice_Amount || 0}, ${
//       params.order_Total_Demand_amount || 0
//     }, ${params.order_Total_drop_amount || 0}, '${params.order_Remarks || ""}',
//         '${params.category || ""}', '${params.status || ""}', '${
//       params.manager_responsible || ""
//     }', '${params.personresp_1 || ""}', '${params.personresp_2 || ""}', '${
//       params.personresp_3 || ""
//     }',
//         '${params.contractid || ""}', '${params.projectids || ""}'
//       )
//     `;

//     const res = await exeQuery(query);
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }
/////commented part 2
// async function insertIntoGstNotices(params) {
//   try {
//     const query = `
//       INSERT INTO noticeTracker (
//         companyid, addedUser, addedTime, modifiedUser, modifiedTime, gstin, entity, type_of_Notice,
//         scN_Ref_no, doi, section, fy, time_Extension_Filed, due_Date,
//         notice_IGSTtax, notice_CGSTtax, notice_SGSTtax, notice_Cesstax, notice_Total_Tax,
//         notice_IGSTInterest, notice_CGSTInterest, notice_SGSTInterest, notice_CessInterest, notice_Total_Interest,
//         notice_IGSTPenalty, notice_CGSTPenalty, notice_SGSTPenalty, notice_CessPenalty, notice_Total_Penalty,
//         notice_IGSTLatefee, notice_CGSTLatefee, notice_SGSTLatefee, notice_CessLatefee, notice_Total_Late_fee,
//         notice_Total_Notice_Amount, remarks, notice_remarks, order_Ref_No, order_Date,
//         order_IGSTtax, order_CGSTtax, order_SGSTtax, order_Cesstax, order_Total_Tax,
//         order_IGSTInterest, order_CGSTInterest, order_SGSTInterest, order_CessInterest, order_Total_Interest,
//         order_IGSTPenalty, order_CGSTPenalty, order_SGSTPenalty, order_CessPenalty, order_Total_Penalty,
//         order_IGSTLatefee, order_CGSTLatefee, order_SGSTLatefee, order_CessLatefee, order_Total_Late_fee,
//         order_Total_Notice_Amount, order_Total_Demand_amount, order_Total_drop_amount, order_Remarks,
//         category, status, manager_responsible, personresp_1, personresp_2, personresp_3, contractid, projectids
//       ) VALUES (
//         ${params.companyid || null}, '${params.addedUser || ""}', '${
//       params.addedTime || ""
//     }',
//         ${params.modifiedUser ? `'${params.modifiedUser}'` : null}, ${
//       params.modifiedTime ? `'${params.modifiedTime}'` : null
//     },
//         '${params.gstin || ""}', '${params.entity || ""}', '${
//       params.type_of_notice || ""
//     }',
//         '${params.scn_ref_no || ""}', '${params.doi_Date || ""}', '${
//       params.section || ""
//     }', '${params.financial_year || ""}',
//         ${params.time_extension_filed === true ? 1 : 0}, '${
//       params.due_Date || ""
//     }',

//         ${params.notice_igst_tax || 0}, ${params.notice_cgst_tax || 0}, ${
//       params.notice_sgst_tax || 0
//     }, ${params.notice_cess_tax || 0}, ${params.notice_grand_total || 0},
//         ${params.notice_igst_interest || 0}, ${
//       params.notice_cgst_interest || 0
//     }, ${params.notice_sgst_interest || 0}, ${
//       params.notice_cess_interest || 0
//     }, 0,
//         ${params.notice_igst_penalty || 0}, ${
//       params.notice_cgst_penalty || 0
//     }, ${params.notice_sgst_penalty || 0}, ${
//       params.notice_cess_penalty || 0
//     }, 0,
//         ${params.notice_igst_late_fees || 0}, ${
//       params.notice_cgst_late_fees || 0
//     }, ${params.notice_sgst_late_fees || 0}, ${
//       params.notice_cess_late_fees || 0
//     }, 0,

//         ${params.notice_grand_total || 0}, '', '', '', '',

//         ${params.order_igst_tax || 0}, ${params.order_cgst_tax || 0}, ${
//       params.order_sgst_tax || 0
//     }, ${params.order_cess_tax || 0}, 0,
//         ${params.order_igst_interest || 0}, ${
//       params.order_cgst_interest || 0
//     }, ${params.order_sgst_interest || 0}, ${
//       params.order_cess_interest || 0
//     }, 0,
//         ${params.order_igst_penalty || 0}, ${params.order_cgst_penalty || 0}, ${
//       params.order_sgst_penalty || 0
//     }, ${params.order_cess_penalty || 0}, 0,
//         ${params.order_igst_late_fees || 0}, ${
//       params.order_cgst_late_fees || 0
//     }, ${params.order_sgst_late_fees || 0}, ${
//       params.order_cess_late_fees || 0
//     }, ${params.order_grand_total || 0},

//         ${params.order_grand_total || 0}, ${
//       params.order_total_demand_amount || 0
//     }, ${params.order_total_drop_amount || 0}, '${params.order_remarks || ""}',

//         '${params.category || ""}', '${params.status || ""}', '${
//       params.manager_responsible || ""
//     }',
//         '${params.person_responsible_1 || ""}', '${
//       params.person_responsible_2 || ""
//     }', '${params.person_responsible_3 || ""}',
//         '${params.contractid || ""}', '${params.projectids || ""}'
//       )
//     `;

//     const res = await exeQuery(query);
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }

async function insertIntoGstNotices(params) {
  try {
    // --- Calculate Notice Totals ---
    const notice_Total_Tax =
      (params.notice_igst_tax || 0) +
      (params.notice_cgst_tax || 0) +
      (params.notice_sgst_tax || 0) +
      (params.notice_cess_tax || 0);

    const notice_Total_Interest =
      (params.notice_igst_interest || 0) +
      (params.notice_cgst_interest || 0) +
      (params.notice_sgst_interest || 0) +
      (params.notice_cess_interest || 0);

    const notice_Total_Penalty =
      (params.notice_igst_penalty || 0) +
      (params.notice_cgst_penalty || 0) +
      (params.notice_sgst_penalty || 0) +
      (params.notice_cess_penalty || 0);

    const notice_Total_Late_fee =
      (params.notice_igst_late_fees || 0) +
      (params.notice_cgst_late_fees || 0) +
      (params.notice_sgst_late_fees || 0) +
      (params.notice_cess_late_fees || 0);

    const notice_Total_Notice_Amount =
      notice_Total_Tax +
      notice_Total_Interest +
      notice_Total_Penalty +
      notice_Total_Late_fee;

    // --- Calculate Order Totals ---
    const order_Total_Tax =
      (params.order_igst_tax || 0) +
      (params.order_cgst_tax || 0) +
      (params.order_sgst_tax || 0) +
      (params.order_cess_tax || 0);

    const order_Total_Interest =
      (params.order_igst_interest || 0) +
      (params.order_cgst_interest || 0) +
      (params.order_sgst_interest || 0) +
      (params.order_cess_interest || 0);

    const order_Total_Penalty =
      (params.order_igst_penalty || 0) +
      (params.order_cgst_penalty || 0) +
      (params.order_sgst_penalty || 0) +
      (params.order_cess_penalty || 0);

    const order_Total_Late_fee =
      (params.order_igst_late_fees || 0) +
      (params.order_cgst_late_fees || 0) +
      (params.order_sgst_late_fees || 0) +
      (params.order_cess_late_fees || 0);

    const order_Total_Notice_Amount =
      order_Total_Tax +
      order_Total_Interest +
      order_Total_Penalty +
      order_Total_Late_fee;

    const query = `
      INSERT INTO noticeTracker (
        companyid, addedUser, addedTime, modifiedUser, modifiedTime, gstin, entity, type_of_Notice,
        scN_Ref_no, doi, section, fy, time_Extension_Filed, due_Date, 
        notice_IGSTtax, notice_CGSTtax, notice_SGSTtax, notice_Cesstax, notice_Total_Tax,
        notice_IGSTInterest, notice_CGSTInterest, notice_SGSTInterest, notice_CessInterest, notice_Total_Interest,
        notice_IGSTPenalty, notice_CGSTPenalty, notice_SGSTPenalty, notice_CessPenalty, notice_Total_Penalty,
        notice_IGSTLatefee, notice_CGSTLatefee, notice_SGSTLatefee, notice_CessLatefee, notice_Total_Late_fee,
        notice_Total_Notice_Amount, remarks, notice_remarks, order_Ref_No, order_Date,
        order_IGSTtax, order_CGSTtax, order_SGSTtax, order_Cesstax, order_Total_Tax,
        order_IGSTInterest, order_CGSTInterest, order_SGSTInterest, order_CessInterest, order_Total_Interest,
        order_IGSTPenalty, order_CGSTPenalty, order_SGSTPenalty, order_CessPenalty, order_Total_Penalty,
        order_IGSTLatefee, order_CGSTLatefee, order_SGSTLatefee, order_CessLatefee, order_Total_Late_fee,
        order_Total_Notice_Amount, order_Total_Demand_amount, order_Total_drop_amount, order_Remarks,
        category, manager_responsible, personresp_1, personresp_2, personresp_3, contractid, projectids,totalDemandAmount,totalDropAmount,status
      ) VALUES (
        ${params.companyid || null}, '${params.addedUser || ""}', '${
      params.addedTime || ""
    }', 
        ${params.modifiedUser ? `'${params.modifiedUser}'` : null}, ${
      params.modifiedTime ? `'${params.modifiedTime}'` : null
    },
        '${params.gstin || ""}', '${params.entity || ""}', '${
      params.type_of_notice || ""
    }',
        '${params.scn_ref_no || ""}', '${params.doi_Date || ""}', '${
      params.section || ""
    }', '${params.financial_year || ""}', 
        ${params.time_extension_filed === true ? 1 : 0}, '${
      params.due_Date || ""
    }',

        ${params.notice_igst_tax || 0}, ${params.notice_cgst_tax || 0}, ${
      params.notice_sgst_tax || 0
    }, ${params.notice_cess_tax || 0}, ${notice_Total_Tax},
        ${params.notice_igst_interest || 0}, ${
      params.notice_cgst_interest || 0
    }, ${params.notice_sgst_interest || 0}, ${
      params.notice_cess_interest || 0
    }, ${notice_Total_Interest},
        ${params.notice_igst_penalty || 0}, ${
      params.notice_cgst_penalty || 0
    }, ${params.notice_sgst_penalty || 0}, ${
      params.notice_cess_penalty || 0
    }, ${notice_Total_Penalty},
        ${params.notice_igst_late_fees || 0}, ${
      params.notice_cgst_late_fees || 0
    }, ${params.notice_sgst_late_fees || 0}, ${
      params.notice_cess_late_fees || 0
    }, ${notice_Total_Late_fee},

        ${notice_Total_Notice_Amount}, '', '', '', '',

        ${params.order_igst_tax || 0}, ${params.order_cgst_tax || 0}, ${
      params.order_sgst_tax || 0
    }, ${params.order_cess_tax || 0}, ${order_Total_Tax},
        ${params.order_igst_interest || 0}, ${
      params.order_cgst_interest || 0
    }, ${params.order_sgst_interest || 0}, ${
      params.order_cess_interest || 0
    }, ${order_Total_Interest},
        ${params.order_igst_penalty || 0}, ${params.order_cgst_penalty || 0}, ${
      params.order_sgst_penalty || 0
    }, ${params.order_cess_penalty || 0}, ${order_Total_Penalty},
        ${params.order_igst_late_fees || 0}, ${
      params.order_cgst_late_fees || 0
    }, ${params.order_sgst_late_fees || 0}, ${
      params.order_cess_late_fees || 0
    }, ${order_Total_Late_fee},

        ${order_Total_Notice_Amount}, ${
      params.order_total_demand_amount || 0
    }, ${params.order_total_drop_amount || 0}, '${params.order_remarks || ""}',

        '${params.category || ""}', '${
      params.manager_responsible || ""
    }', 
        '${params.person_responsible_1 || ""}', '${
      params.person_responsible_2 || ""
    }', '${params.person_responsible_3 || ""}', 
   
        '${params.contractid || ""}', '${params.projectids || ""}','${params.totalDemandAmount || ""}','${params.totalDropAmount || ""}','${"inProcess"}'
      )
    `;

    const res = await exeQuery(query);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function updateGstNotice(params) {
  try {
    console.log(params)
    // --- Calculate Notice Totals ---
    const notice_Total_Tax =
      (params.notice_igst_tax || 0) +
      (params.notice_cgst_tax || 0) +
      (params.notice_sgst_tax || 0) +
      (params.notice_cess_tax || 0);

    const notice_Total_Interest =
      (params.notice_igst_interest || 0) +
      (params.notice_cgst_interest || 0) +
      (params.notice_sgst_interest || 0) +
      (params.notice_cess_interest || 0);

    const notice_Total_Penalty =
      (params.notice_igst_penalty || 0) +
      (params.notice_cgst_penalty || 0) +
      (params.notice_sgst_penalty || 0) +
      (params.notice_cess_penalty || 0);

    const notice_Total_Late_fee =
      (params.notice_igst_late_fees || 0) +
      (params.notice_cgst_late_fees || 0) +
      (params.notice_sgst_late_fees || 0) +
      (params.notice_cess_late_fees || 0);

    const notice_Total_Notice_Amount =
      notice_Total_Tax + notice_Total_Interest + notice_Total_Penalty + notice_Total_Late_fee;

    // --- Calculate Order Totals ---
    const order_Total_Tax =
      (params.order_igst_tax || 0) +
      (params.order_cgst_tax || 0) +
      (params.order_sgst_tax || 0) +
      (params.order_cess_tax || 0);

    const order_Total_Interest =
      (params.order_igst_interest || 0) +
      (params.order_cgst_interest || 0) +
      (params.order_sgst_interest || 0) +
      (params.order_cess_interest || 0);

    const order_Total_Penalty =
      (params.order_igst_penalty || 0) +
      (params.order_cgst_penalty || 0) +
      (params.order_sgst_penalty || 0) +
      (params.order_cess_penalty || 0);

    const order_Total_Late_fee =
      (params.order_igst_late_fees || 0) +
      (params.order_cgst_late_fees || 0) +
      (params.order_sgst_late_fees || 0) +
      (params.order_cess_late_fees || 0);

    const order_Total_Notice_Amount =
      order_Total_Tax + order_Total_Interest + order_Total_Penalty + order_Total_Late_fee;

    const query = `
      UPDATE noticeTracker SET
        companyid = ${params.companyid || null},
        gstin = '${params.gstin || ""}',
        entity = '${params.entity || ""}',
        type_of_Notice = '${params.type_of_notice || ""}',
        scN_Ref_no = '${params.scn_ref_no || ""}',
        doi = '${params.doi_Date || ""}',
        section = '${params.section || ""}',
        fy = '${params.financial_year || ""}',
        time_Extension_Filed = ${params.time_extension_filed === true ? 1 : 0},
        due_Date = '${params.due_Date || ""}',

        notice_IGSTtax = ${params.notice_igst_tax || 0},
        notice_CGSTtax = ${params.notice_cgst_tax || 0},
        notice_SGSTtax = ${params.notice_sgst_tax || 0},
        notice_Cesstax = ${params.notice_cess_tax || 0},
        notice_Total_Tax = ${notice_Total_Tax},

        notice_IGSTInterest = ${params.notice_igst_interest || 0},
        notice_CGSTInterest = ${params.notice_cgst_interest || 0},
        notice_SGSTInterest = ${params.notice_sgst_interest || 0},
        notice_CessInterest = ${params.notice_cess_interest || 0},
        notice_Total_Interest = ${notice_Total_Interest},

        notice_IGSTPenalty = ${params.notice_igst_penalty || 0},
        notice_CGSTPenalty = ${params.notice_cgst_penalty || 0},
        notice_SGSTPenalty = ${params.notice_sgst_penalty || 0},
        notice_CessPenalty = ${params.notice_cess_penalty || 0},
        notice_Total_Penalty = ${notice_Total_Penalty},

        notice_IGSTLatefee = ${params.notice_igst_late_fees || 0},
        notice_CGSTLatefee = ${params.notice_cgst_late_fees || 0},
        notice_SGSTLatefee = ${params.notice_sgst_late_fees || 0},
        notice_CessLatefee = ${params.notice_cess_late_fees || 0},
        notice_Total_Late_fee = ${notice_Total_Late_fee},

        notice_Total_Notice_Amount = ${notice_Total_Notice_Amount},

        order_IGSTtax = ${params.order_igst_tax || 0},
        order_CGSTtax = ${params.order_cgst_tax || 0},
        order_SGSTtax = ${params.order_sgst_tax || 0},
        order_Cesstax = ${params.order_cess_tax || 0},
        order_Total_Tax = ${order_Total_Tax},

        order_IGSTInterest = ${params.order_igst_interest || 0},
        order_CGSTInterest = ${params.order_cgst_interest || 0},
        order_SGSTInterest = ${params.order_sgst_interest || 0},
        order_CessInterest = ${params.order_cess_interest || 0},
        order_Total_Interest = ${order_Total_Interest},

        order_IGSTPenalty = ${params.order_igst_penalty || 0},
        order_CGSTPenalty = ${params.order_cgst_penalty || 0},
        order_SGSTPenalty = ${params.order_sgst_penalty || 0},
        order_CessPenalty = ${params.order_cess_penalty || 0},
        order_Total_Penalty = ${order_Total_Penalty},

        order_IGSTLatefee = ${params.order_igst_late_fees || 0},
        order_CGSTLatefee = ${params.order_cgst_late_fees || 0},
        order_SGSTLatefee = ${params.order_sgst_late_fees || 0},
        order_CessLatefee = ${params.order_cess_late_fees || 0},
        order_Total_Late_fee = ${order_Total_Late_fee},

        order_Total_Notice_Amount = ${order_Total_Notice_Amount},
        order_Total_Demand_amount = ${params.order_total_demand_amount || 0},
        order_Total_drop_amount = ${params.order_total_drop_amount || 0},
        order_Remarks = '${params.order_remarks || ""}',

        category = '${params.category || ""}',
        manager_responsible = '${params.manager_responsible || ""}',
        personresp_1 = '${params.person_responsible_1 || ""}',
        personresp_2 = '${params.person_responsible_2 || ""}',
        personresp_3 = '${params.person_responsible_3 || ""}',

        contractid = '${params.contractid || ""}',
        projectids = '${params.projectids || ""}',
        totalDemandAmount = '${params.totalDemandAmount || ""}',
        totalDropAmount = '${params.totalDropAmount || ""}',
        modifiedUser = '${params.modifiedUser || ""}',
        modifiedTime = '${params.modifiedTime || ""}'

      WHERE lid = ${params.lid}
    `;

    const res = await exeQuery(query);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}


// async function saveAssignment(params) {
//   try {
//     let res =
//       await exeQuery(`insert into AssignmentNature(assignmentNature,type,assignmentFrequency,standardPrice,multiplier,statutoryAssignment,addedUser,addedTime,companyName,companyId) values('${data.assignmentNature}','${data.type}','${data.frequency}',
//             '${data.standardPrice}','${data.multiplier}','${data.statutoryAssign}','${data.addeduser}','${data.currentDate}','${data.companyName}','${data.companyId}') `);
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }

module.exports = {
  zohoNames,
  insertIntoGstNotices,updateGstNotice
};
