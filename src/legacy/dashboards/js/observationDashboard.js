const {
  fetchTable,
  queryGet,
  dateTimeGeneration,
  exeQuery,
  workPaper,
} = require("../../config");

// fetch query for allobservations


const fetchProjects = async (params) => {
  // let currentDate = new Date();
  // let currentDate_temp = new Date(currentDate);
  // let previousMonth_date = new Date(currentDate_temp.add(-1).month());
  // let nextMonth_date = new Date(currentDate_temp.add(2).month());
  // let startDate = dateTimeGeneration(new Date(previousMonth_date.setDate(1)));
  // let endDate = dateTimeGeneration(new Date(nextMonth_date.getFullYear(), nextMonth_date.getMonth() + 1, 0));
  // startDate = startDate.split(" ")[0];
  // endDate = endDate.split(" ")[0];

  try {
    // fetch all projects where relevant start date and end date is in current month
    let allProjects =
      await fetchTable(`select * from allprojects where companyid='${params.companyid}'
            AND (managerResponsible='${params.name}' OR personResponsible1='${params.name}' OR personResponsible2='${params.name}' OR personResponsible3='${params.name}' OR partner='${params.name}')
            ORDER BY status desc, CAST(relevantStartDate as date) asc
        `);
    //   AND (CONVERT(DateTime,relevantStartDate,101) < '${endDate}')
    // AND (CONVERT(DateTime,relevantEndDate,101) BETWEEN '${startDate}' AND '${endDate}' and CONVERT(DateTime,relevantStartDate,101) BETWEEN '${startDate}' AND '${endDate}')
    return allProjects;
  } catch (e) {
    return { error: e };
  }
};

// Fetch allobservations based on projectCode
async function markProjectCompletion(params) {
  try {
    let completionDate = dateTimeGeneration(
      new Date(params.projectCompletionDate)
    );
    let projectQuery = Buffer.from(
      `update AllProjects set status='Completed',completionStatus='Completed',projectStatus='Completed',completionDate='${completionDate}' where projectCode='${params.projectCode}' and companyid='${params.companyid}'`
    ).toString("base64");
    let updateQuery = Buffer.from(
      `update AllObservations set issueStatus='Completed',completionDate='${completionDate}' where projectCode='${params.projectCode}' and companyid='${params.companyid}'`
    ).toString("base64");
    let result = await queryGet([projectQuery, updateQuery]);
    // let milestones = await fetchTable(`select * from allobservations where projectCode='${params.projectCode}' and companyid='${params.companyid}' order by observationCode asc`);
    return result;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}

async function fetchMilestones(params) {
  try {
    // let res = await fetchTable(` SELECT  allobservations.*,  assignmentNature.classification, assignmentNature.checkpoints FROM  allobservations LEFT JOIN  assignmentNature  ON  allobservations.assignmentNature = assignmentNature.lid WHERE
    //     allobservations.projectCode = '${params.projectid}'`)
    // return res

    // check if myworks is empty
    let milestones = await fetchTable(
      `select * from milestoneSubform where assignmentid='${params.assignmentID}'`
    );
    let check = await fetchTable(
      `select * from myworks where projectcode='${params.projectid}'`
    );
    if (check.length == 0) {
      let res = await fetchTable(`SELECT DISTINCT
                allobservations.*,  
                assignmentNature.classification, 
                assignmentNature.checkpoints,
                milestoneSubform.milestoneId
            FROM  
                allobservations 
            LEFT JOIN 
                assignmentNature  
            ON  
                allobservations.assignmentNature = assignmentNature.lid
            LEFT JOIN 
                milestoneSubform
            ON  
                allobservations.assignmentid = milestoneSubform.assignmentid and allobservations.caption = milestoneSubform.milestone
            WHERE 
                allobservations.projectCode = '${params.projectid}'`);
      let data = res;
      let query = [];
      let classify = false;
      let classifyOptions = [];

      for (let i of data) {
        let item = i;

        if (item.classification) {
          // check if there is classification
          let classifyList = JSON.parse(item.classification);
          let totalClassify = classifyList.classification;
          // if total classification is greater than 1 send classification for user to choose
          if (totalClassify.length > 1 && !params.hasOwnProperty("classify")) {
            classify = true;
            classifyOptions = totalClassify;
            break;
          } else if (totalClassify.length == 0) {
            break;
          } else if (totalClassify.length == 1) {
            let checkpointData = JSON.parse(item.checkpoints);
            if (checkpointData) {
              let checkpoints = JSON.parse(checkpointData.data);
              let keys = Object.keys(checkpoints);
              let firstClassification = keys[0];
              let values = checkpoints[firstClassification];
              let response = await populateMyworks(values, item);
              if (response.responseType == "SUCCESS") {
                check = await fetchTable(
                  `select * from myworks where projectcode='${params.projectid}'`
                );
              }
            }
          } else if (
            totalClassify.length > 1 &&
            params.hasOwnProperty("classify")
          ) {
            let checkpointData = JSON.parse(item.checkpoints);
            let classifyName = params.classify;
            if (checkpointData) {
              let checkpoints = JSON.parse(checkpointData.data);
              let values = checkpoints[classifyName];
              let response = await populateMyworks(values, item);
            }
          }
        }
      }
      // data.map(async (item) => {

      // })
      check = await fetchTable(
        `select * from myworks where projectcode='${params.projectid}'`
      );

      if (classify) {
        return {
          milestones: milestones,
          myworks: check,
          classify: classifyOptions,
        };
        // return { classify: classifyOptions }
      }
      if (query.length == 0) {
        return { milestones: milestones, myworks: check };
      } else {
        return { milestones: milestones, myworks: check };
      }
    } else {
      return { milestones: milestones, myworks: check };
    }
  } catch (e) {
    return { error: e.message };
  }
}

async function changeStatus(params) {
  try {
    let date = ``;
    let newDate = dateTimeGeneration(new Date());
    if (params.hasOwnProperty("planDate")) {
      date = `, planDate='${params.planDate}'`;
    }
    let res = await exeQuery(
      `update allProjects set modifiedTime='${newDate}',modifiedUser='${params.user}',${params.column}='${params.value}'${date} where projectCode='${params.projectCode}'`
    );
    return res;
  } catch (e) {
    return { error: e.message };
  }
}

async function reverseProject(params) {
  try {
    let newDate = dateTimeGeneration(new Date());
    let user = params.user;
    let invoice = `delete from allInvoices where projectCode='${params.projectCode}'`;
    let invoiceQuery = Buffer.from(invoice).toString("base64");
    let milestones = `update allObservations set issueStatus='Pending',completionDate=NULL,modifiedUser='${user}',modifiedTime='${newDate}' where projectCode='${params.projectCode}' and type='Milestone'`;
    let milestoneQuery = Buffer.from(milestones).toString("base64");
    let projects = `update allProjects set status='Pending',projectStatus='Pipeline',completionStatus=NULL,completionDate=NULL,planDate=NULL,modifiedUser='${user}',modifiedTime='${newDate}' where projectCode='${params.projectCode}'`;
    let projectQuery = Buffer.from(projects).toString("base64");
    let query = [invoiceQuery, milestoneQuery, projectQuery];
    let res = await queryGet(query);
    return res;
  } catch (e) {
    return { error: e.message };
  }
}

async function updateMilestoneStatus(params) {
  try {
    let date = dateTimeGeneration(new Date());
    let response = await exeQuery(
      `update allObservations set issueStatus='Completed', completionDate='${date}' where observationCode='${params.observationCode}'`
    );
    if (response.responseType == "SUCCESS") {
      let res = await fetchTable(`
            SELECT COUNT(*) AS total,SUM(CASE WHEN issueStatus = 'Completed' THEN 1 ELSE 0 END) AS completed FROM allObservations WHERE projectCode = '${params.projectCode}' and type='Milestone'`);
      if (res[0].total != null && res[0].completed != null) {
        let lastproject = Number(res[0].total) - Number(res[0].completed);
        let queries = [];
        // generate invoice if amount of current milestone is not 0
        let getObservation = await fetchTable(
          `select * from allObservations where observationCode='${params.observationCode}'`
        );
        if (getObservation.length > 0) {
          let amount = getObservation[0].amountInvolved;
          if (amount != 0) {
            let checkInvoice = await fetchTable(
              `select * from allInvoices where projectCode='${params.projectCode}'`
            );
            let invoiceNumber = BigInt(`${params.projectCode}000`);
            if (checkInvoice.length > 0) {
              invoiceNumber =
                BigInt(invoiceNumber) + BigInt(checkInvoice.length + 1);
            } else {
              invoiceNumber = BigInt(invoiceNumber) + BigInt(1);
            }
            let invoiceStatus = `update allprojects set billingStatus='Non-billed' where projectCode='${params.projectCode}'`;
            let encryptstatus = Buffer.from(invoiceStatus).toString("base64");
            queries.push(encryptstatus);

            let invoiceQuery = `insert into allInvoices (projectCode,amount,invoiceNumber,status,assignmentNature,date,edoc,projectName,remarks,contractID,assignmentID,milestones,clientName,companyName,companyId) 
                    values('${
                      params.projectCode
                    }','${amount}','${invoiceNumber}','Pending','${
              getObservation[0].assignmentNature
            }','${getObservation[0].date}','${getObservation[0].edoc}','${
              getObservation[0].projectName
            }','${getObservation[0].projectremarks}','${
              getObservation[0].contractCode
            }','${getObservation[0].assignmentID}','${
              getObservation[0].caption
            }','${getObservation[0].clientName.replace(/'/g, "''")}','${
              getObservation[0].companyName
            }','${getObservation[0].companyId}')`;
            let encryptInvoice = Buffer.from(invoiceQuery).toString("base64");
            queries.push(encryptInvoice);
          }
        }
        if (res[0].total == res[0].completed) {
          let completionDate = dateTimeGeneration(new Date());
          let completeProject = `update allProjects set status='Completed',projectStatus='Completed',completionDate='${completionDate}',completionStatus='Completed' where projectCode='${params.projectCode}'`;
          let encrypt = Buffer.from(completeProject).toString("base64");
          queries.push(encrypt);
        }
        if (queries.length > 0) {
          let response = await queryGet(queries);
          return response;
        } else {
          return response;
        }
      }
      return res;
    }
  } catch (e) {
    return { error: e.message };
  }
}

const populateMyworks = async (values, item) => {
  try {
    let query = [];
    let tasks = values[item.caption];
    if (tasks != undefined) {
      let taskData = Object.keys(tasks);
      taskData.filter((task, taskInx) => {
        let subTasks = tasks[task];
        subTasks.filter((sub) => {
          let q = `insert into myworks(task,subtask,milestoneid,contractid,assignmentid,observationcode,projectcode,companyName,companyId,status) values
            ('${task.replace(/'/g, "''")}','${sub.replace(/'/g, "''")}','${
            item.milestoneId
          }','${item.contractCode}','${item.assignmentID}','${
            item.observationCode
          }','${item.projectCode}','${item.companyName}','${
            item.companyId
          }','Pending')`;
          let encrypt = Buffer.from(q).toString("base64");
          query.push(encrypt);
        });
      });
    }
    let res = await queryGet(query);
    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const addNewTasks = async (item) => {
  try {
    let res =
      await exeQuery(`insert into myworks(task,subtask,milestoneid,contractid,assignmentid,observationcode,projectcode,companyName,companyId,status)  OUTPUT Inserted.lid  values
            ('${item.task.replace(/'/g, "''")}','${item.sub.replace(
        /'/g,
        "''"
      )}','${item.milestoneId}','${item.contractCode}','${
        item.assignmentID
      }','${item.observationCode}','${item.projectCode}','${
        item.companyName
      }','${item.companyId}','Pending')`);
    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const myworksUpdateColumns = async (params) => {
  try {
    let lid = params.lid.join(",");
    let res = await exeQuery(
      `update myworks set ${params.column}='${params.value}' where lid in (${lid})`
    );
    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const deleteMyWorkTasks = async (params) => {
  try {
    let lid = params.lid.join(",");
    let res = await exeQuery(`delete from myworks where lid in (${lid})`);
    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const updatePersonResponsible = async (params) => {
  try {
    let query1 = `update allProjects set ${params.column}='${params.value}' where projectCode='${params.projectCode}'`;
    let query2 = `update allObservations set ${params.column}='${params.value}' where projectCode='${params.projectCode}'`;
    let encrypt1 = Buffer.from(query1).toString("base64");
    let encrypt2 = Buffer.from(query2).toString("base64");
    let query = [encrypt1, encrypt2];
    let res = await queryGet(query);
    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const getTeamProgress = async (params) => {
  try {
    // get all projects up to the current date in the planDate field
    // let currentDate = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'); // Convert current date to DD-MM-YYYY format and reverse to YYYY-MM-DD
    // let res = await fetchTable(`select * from allProjects where planDate IS NOT NULL AND CONVERT(date, planDate, 105) <= '${currentDate}' and companyId='${params.companyid}'`);
    let distinctManagers = await fetchTable(
      `select distinct managerResponsible from allProjects where companyId='${params.companyid}'`
    );
    let progressData = [];

    for (let i = 0; i < distinctManagers.length; i++) {
      let manager = distinctManagers[i];
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const monthLastDate = new Date(year, month, 0)
        .toISOString()
        .split("T")[0];
      let totalCount = await workPaper(
        {
          username: manager.managerResponsible,
          statusname: "Pending",
          monthlastdate: monthLastDate,
          year: year,
          month: month,
        },
        "all_ms_count"
      );
      let total = Number(totalCount.res[0].count);
      let closeCount = await workPaper(
        {
          username: manager.managerResponsible,
          monthlastdate: monthLastDate,
          year: year,
          month: month,
        },
        "close_ms_count"
      );
      let closed = Number(closeCount.res[0].count);
      let value = (closed / total) * 100;
      progressData.push({ name: manager.managerResponsible, progress: value });
    }

    return progressData;
  } catch (e) {
    return { error: e.message };
  }
};

const saveTasks = async (params) => {
  try {
    console.log(params.taskData);
    // Assuming params.taskData is an array of task objects
    let date = dateTimeGeneration(new Date());
    let insertQueries = params.taskData.map((task) => {
      return Buffer.from(
        `
    INSERT INTO pettyTask (task, assignedTo, assigner, edoc, priority, comment, status, companyName, companyId, addedTime,filesAttached)
    VALUES ('${task.task}', '${task.assignedTo}', '${task.assigner}', '${task.edoc}', '${task.priority}', '${task.Comment}', '${task.status}', '${task.companyName}', '${task.companyId}','${date}','${task.files}')
  `
      ).toString("base64");
    });

    // Call queryGet with the array of base64-encoded queries
    let result = await queryGet(insertQueries);

    return result;
  } catch (e) {
    return { error: e.message };
  }
};
const statusUpdate = (params) => {
  try {
    return { hai: "hai" };
  } catch (e) {
    return { error: e.message };
  }
};

const getTableDataPettyTask = async (params) => {
  try {
    console.log(params.email);
    let getObservation = await fetchTable(`SELECT * 
FROM pettyTask
WHERE companyId = '${params.companyId}'
  AND (assigner = '${params.email}' OR assignedTo = '${params.email}');


`);
    return getObservation;
  } catch (e) {
    return { error: e.message };
  }
};

let res;
const updatePettyTaskStatus = async (params) => {
  try {
    if (params.hasOwnProperty("flag")) {
      res = await exeQuery(`UPDATE pettyTask
SET status = '${params.status}',
completedDate ='${params.completedDate}'
WHERE lid = '${params.lid}';
`);
    } else if (params.hasOwnProperty("files")) {
      res = await exeQuery(`UPDATE pettyTask
SET status = '${params.status}',
filesAttached = '${params.files}',
comment = '${params.comment}'
WHERE lid = '${params.lid}';
`);
    } else if (params.hasOwnProperty("comment")) {
      res = await exeQuery(`UPDATE pettyTask
SET status = '${params.status}',
comment = '${params.comment}'
WHERE lid = '${params.lid}';
`);
    } else {
      res = await exeQuery(`UPDATE pettyTask
SET status = '${params.status}'
WHERE lid = '${params.lid}';
`);
    }

    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const updatePettyTaskComment = async (params) => {
  try {
    let res = await exeQuery(`UPDATE pettyTask
SET comment = '${params.comment}'
WHERE lid = '${params.lid}';
`);

    return res;
  } catch (e) {
    return { error: e.message };
  }
};

//  observation-->dashboards/observation.html-->below pettytask--> observation

const getProjectNames = async (params) => {
  try {
    let getProjectData =
      await fetchTable(`SELECT projectCode,projectDescription,clientName,relevantStartDate,relevantEndDate
FROM AllProjects
WHERE companyId = '${params.companyid}'  AND (
    managerResponsible = '${params.name}' OR
    personResponsible1 = '${params.name}' OR
    personResponsible2 = '${params.name}' OR 
    partner = '${params.name}' OR
    personResponsible3 = '${params.name}'
  );
`);

    return getProjectData;
  } catch (e) {
    return { error: e.message };
  }
};

const getMilestonesCount = async (params) => {
  try {
    // params.name = "Durai"
    let getProjectData = await fetchTable(`SELECT observationCode
FROM AllObservations
WHERE projectCode = '${params.projectCode}';

`);

    return getProjectData;
  } catch (e) {
    return { error: e.message };
  }
};

const updateAllObservationObs = async (params) => {
  try {
    let res = await exeQuery(`
    INSERT INTO AllObservations (
        caption,
        companyName,
        companyId,
        projectCode,
        assignedBy,
        personResponsible,
        edoc,
        type,
        observationCode,
        clientName,
        addedTime,steps,addedUser,projectName,issueStatus
    ) VALUES (
        '${params.caption}',
        '${params.companyName}',
        '${params.companyId}',
        '${params.projectCode}',
        '${params.assignedBy}',
        '${params.personResponsible}',
        '${params.edoc}',
        '${params.type}',
        '${params.observationCode}',
        '${params.clientName}',
        '${params.addedTime}',
          '${params.steps}',
        '${params.addedUser}','${params.projectName}','Pending'
        
    )
`);

    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const getProjectDataObservation = async (params) => {
  try {
    let getProjectData = await fetchTable(`
  SELECT observationCode, projectCode, clientName, caption, assignedBy, 
         personResponsible, addedUser, addedTime, type, companyName,projectName,
         companyId, edoc, steps,issueStatus,remarks,filesAttached
  FROM AllObservations 
  WHERE companyId = '${params.companyid}' 
    AND type = 'observation'
    AND (
      personResponsible = '${params.name}' OR  
      assignedBy = '${params.name}'
    )
`);

    return getProjectData;
  } catch (e) {
    return { error: e.message };
  }
};

const updateObservationStatus = async (params) => {
  try {
    let res = await exeQuery(`UPDATE AllObservations
SET issueStatus = '${params.status}'
WHERE  observationCode  = '${params.observationCode}';
`);

    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const updateObservationComment = async (params) => {
  try {
    let res = await exeQuery(`UPDATE AllObservations
SET steps = '${params.steps}'
WHERE  observationCode  = '${params.observationCode}';
`);

    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const updateObservationremarks = async (params) => {
  try {
    let res;
    if (params.files) {
      res = await exeQuery(`UPDATE AllObservations
SET remarks = '${params.remarks}',filesAttached = '${params.files}'
WHERE  observationCode  = '${params.observationCode}';
`);
    } else {
      res = await exeQuery(`UPDATE AllObservations
SET remarks = '${params.remarks}'
WHERE  observationCode  = '${params.observationCode}';
`);
    }

    return res;
  } catch (e) {
    return { error: e.message };
  }
};

const cancelProject = async (params) => {
  try {
    let newDate = dateTimeGeneration(new Date());
    let res =
      await exeQuery(`update allProjects set status='Cancelled',projectStatus='Cancelled',completionStatus='Cancelled',billingStatus='Cancelled',liveOrCancelled='Cancelled',modifiedTime='${newDate}',modifiedUser='${params.user}',planDate=NULL where
         status='Pending' AND projectCode='${params.projectCode}'`);
    return res;
  } catch (e) {
    return { error: e.message };
  }
};

async function pettyTaskStatus() {
  try {
    let res = await fetchTable(`select * from pettyTask`);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}
async function totalUsersCount(params) {
  try {
    let res = await fetchTable(
      `select * from invitedusers where companyname='${params.companyname}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getObservationType(params) {
  try {
    let res = await fetchTable(
      `select * from AllObservations where type='${params.type}'`
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function getPresalesvalidation(params) {
  let status = "Pending Proposal";
  try {
    let res = await fetchTable(
      `SELECT urn,ps_validation FROM AllContracts WHERE companyId='${params.companyid}' AND ps_validation IN ('Open', 'Closed')  AND status='${status}'`
    );

    let results = [];

    for (let item of res) {
      // Step 1: Get assignments for this URN
      let assignments = await fetchTable(`
        SELECT assignmentNature, clientName 
        FROM contractAssignmentNature
        WHERE contractID = '${item.urn}' AND contractStatus='${status}'
      `);

      // Step 2: For each assignment, get milestones (assuming contractID or assignmentNature used)
      for (let assign of assignments) {
        let milestones = await fetchTable(`
          SELECT milestone, standardHours ,milestoneId
          FROM milestoneSubform 
          WHERE contractID = '${item.urn}' AND assignmentNature = '${assign.assignmentNature}' AND status='${status}'
        `);

        results.push({
          contractID: item.urn,
          ps_validation:item.ps_validation,
          clientName: assign.clientName,
          assignmentNature: assign.assignmentNature,
          milestones: milestones, 
        });
      }
    }

    return results;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function saveMilestonePsvalidation(params) {
  let status = "Pending Proposal";
  let res;
  try {
    for (const item of params.milestones) {

      const updateQuery = `
       UPDATE milestoneSubform
  SET milestone = '${item.newMilestone}'
  WHERE contractID = '${item.contractID}'
  AND milestoneId='${item.lid}'
    AND assignmentNature = '${item.assignmentNature}'
    AND milestone = '${item.oldMilestone}'
    AND status = '${status}'
      `;

      console.log("Executing Query:", updateQuery); // Debug
      res = await exeQuery(updateQuery);
      console.log(res)
    }
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

async function allContractsValidationChange(params) {
  let status = "Pending Proposal";
  let ps_validation = "Closed";
  try {
    let res = await exeQuery(
      `update AllContracts set ps_validation='${ps_validation}' where companyId='${params.companyid}' AND status='${status}'  `
    );
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

module.exports = {
  updateObservationremarks,
  cancelProject,
  updateObservationComment,
  updateObservationStatus,
  getProjectDataObservation,
  updateAllObservationObs,
  reverseProject,
  getMilestonesCount,
  getProjectNames,
  updatePettyTaskComment,
  updatePettyTaskStatus,
  getTableDataPettyTask,
  statusUpdate,
  fetchProjects,
  getTeamProgress,
  saveTasks,
  updatePersonResponsible,
  deleteMyWorkTasks,
  addNewTasks,
  myworksUpdateColumns,
  updateMilestoneStatus,
  markProjectCompletion,
  fetchMilestones,
  changeStatus,
  updateMilestoneStatus,
  pettyTaskStatus,
  totalUsersCount,
  getObservationType,
  getPresalesvalidation,
  saveMilestonePsvalidation,
allContractsValidationChange,

};

// get milestone with amount to generate invoice
// let getAmounts = await fetchTable(`select * from allObservations where projectCode='${params.projectCode}' and amountInvolved!=0`)
// // convert this into invoice number
// // invoice number is projectCode + 000
// let invoiceNumber = BigInt(`${params.projectCode}000`);
// if (getAmounts.length > 0) {
//     let invoiceStatus = `update allprojects billingStatus='Non-billed' where projectCode='${params.projectCode}'`
//     let encryptstatus=Buffer.from(invoiceStatus).toString('base64')
//     queries.push(encryptstatus)
//     getAmounts.map((item) => {
//     invoiceNumber = BigInt(invoiceNumber) + BigInt(1)
//     let invoiceQuery = `insert into allInvoices (projectCode,amount,invoiceNumber,status,assignmentNature,date,edoc,projectName,remarks,contractID,assignmentID,milestones,clientName,companyName,companyId)
//     values('${params.projectCode}','${item.amountInvolved}','${invoiceNumber}','Pending','${item.assignmentNature}','${item.date}','${item.edoc}','${item.projectName}','${item.projectremarks}','${item.contractCode}','${item.assignmentID}','${item.caption}','${item.clientName}','${item.companyName}','${item.companyId}')`
//     let encryptInvoice = Buffer.from(invoiceQuery).toString('base64')
//     queries.push(encryptInvoice)
//     })
// }
