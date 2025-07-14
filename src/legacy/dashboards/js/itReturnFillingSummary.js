const {
  fetchTable,
  queryGet,
  dateTimeGeneration,
  exeQuery,
  workPaper,
  sendMail,
} = require("../../config");

// fetch query for allobservations

// const fetchProjects = async (params) => {
//   // let currentDate = new Date();
//   // let currentDate_temp = new Date(currentDate);
//   // let previousMonth_date = new Date(currentDate_temp.add(-1).month());
//   // let nextMonth_date = new Date(currentDate_temp.add(2).month());
//   // let startDate = dateTimeGeneration(new Date(previousMonth_date.setDate(1)));
//   // let endDate = dateTimeGeneration(new Date(nextMonth_date.getFullYear(), nextMonth_date.getMonth() + 1, 0));
//   // startDate = startDate.split(" ")[0];
//   // endDate = endDate.split(" ")[0];

//   try {
//     // fetch all projects where relevant start date and end date is in current month
//     let allProjects =
//       await fetchTable(`select * from allprojects where companyid='${params.companyid}'
//             AND (managerResponsible='${params.name}' OR personResponsible1='${params.name}' OR personResponsible2='${params.name}' OR personResponsible3='${params.name}' OR partner='${params.name}')
//             ORDER BY status desc, CAST(relevantStartDate as date) asc
//         `);
//     //   AND (CONVERT(DateTime,relevantStartDate,101) < '${endDate}')
//     // AND (CONVERT(DateTime,relevantEndDate,101) BETWEEN '${startDate}' AND '${endDate}' and CONVERT(DateTime,relevantStartDate,101) BETWEEN '${startDate}' AND '${endDate}')
//     return allProjects;
//   } catch (e) {
//     return { error: e };
//   }
// };

// // Fetch allobservations based on projectCode
// async function markProjectCompletion(params) {
//   try {
//     let completionDate = dateTimeGeneration(
//       new Date(params.projectCompletionDate)
//     );
//     let projectQuery = Buffer.from(
//       `update AllProjects set status='Completed',completionStatus='Completed',projectStatus='Completed',completionDate='${completionDate}' where projectCode='${params.projectCode}' and companyid='${params.companyid}'`
//     ).toString("base64");
//     let updateQuery = Buffer.from(
//       `update AllObservations set issueStatus='Completed',completionDate='${completionDate}' where projectCode='${params.projectCode}' and companyid='${params.companyid}'`
//     ).toString("base64");
//     let result = await queryGet([projectQuery, updateQuery]);
//     // let milestones = await fetchTable(`select * from allobservations where projectCode='${params.projectCode}' and companyid='${params.companyid}' order by observationCode asc`);
//     return result;
//   } catch (error) {
//     console.log(error);
//     return { error: error };
//   }
// }

// async function fetchMilestones(params) {
//   try {
//     // let res = await fetchTable(` SELECT  allobservations.*,  assignmentNature.classification, assignmentNature.checkpoints FROM  allobservations LEFT JOIN  assignmentNature  ON  allobservations.assignmentNature = assignmentNature.lid WHERE
//     //     allobservations.projectCode = '${params.projectid}'`)
//     // return res

//     // check if myworks is empty
//     let milestones = await fetchTable(
//       `select * from milestoneSubform where assignmentid='${params.assignmentID}'`
//     );
//     let check = await fetchTable(
//       `select * from myworks where projectcode='${params.projectid}'`
//     );
//     if (check.length == 0) {
//       let res = await fetchTable(`SELECT DISTINCT
//                 allobservations.*,
//                 assignmentNature.classification,
//                 assignmentNature.checkpoints,
//                 milestoneSubform.milestoneId
//             FROM
//                 allobservations
//             LEFT JOIN
//                 assignmentNature
//             ON
//                 allobservations.assignmentNature = assignmentNature.lid
//             LEFT JOIN
//                 milestoneSubform
//             ON
//                 allobservations.assignmentid = milestoneSubform.assignmentid and allobservations.caption = milestoneSubform.milestone
//             WHERE
//                 allobservations.projectCode = '${params.projectid}'`);
//       let data = res;
//       let query = [];
//       let classify = false;
//       let classifyOptions = [];

//       for (let i of data) {
//         let item = i;

//         if (item.classification) {
//           // check if there is classification
//           let classifyList = JSON.parse(item.classification);
//           let totalClassify = classifyList.classification;
//           // if total classification is greater than 1 send classification for user to choose
//           if (totalClassify.length > 1 && !params.hasOwnProperty("classify")) {
//             classify = true;
//             classifyOptions = totalClassify;
//             break;
//           } else if (totalClassify.length == 0) {
//             break;
//           } else if (totalClassify.length == 1) {
//             let checkpointData = JSON.parse(item.checkpoints);
//             if (checkpointData) {
//               let checkpoints = JSON.parse(checkpointData.data);
//               let keys = Object.keys(checkpoints);
//               let firstClassification = keys[0];
//               let values = checkpoints[firstClassification];
//               let response = await populateMyworks(values, item);
//               if (response.responseType == "SUCCESS") {
//                 check = await fetchTable(
//                   `select * from myworks where projectcode='${params.projectid}'`
//                 );
//               }
//             }
//           } else if (
//             totalClassify.length > 1 &&
//             params.hasOwnProperty("classify")
//           ) {
//             let checkpointData = JSON.parse(item.checkpoints);
//             let classifyName = params.classify;
//             if (checkpointData) {
//               let checkpoints = JSON.parse(checkpointData.data);
//               let values = checkpoints[classifyName];
//               let response = await populateMyworks(values, item);
//             }
//           }
//         }
//       }
//       // data.map(async (item) => {

//       // })
//       check = await fetchTable(
//         `select * from myworks where projectcode='${params.projectid}'`
//       );

//       if (classify) {
//         return {
//           milestones: milestones,
//           myworks: check,
//           classify: classifyOptions,
//         };
//         // return { classify: classifyOptions }
//       }
//       if (query.length == 0) {
//         return { milestones: milestones, myworks: check };
//       } else {
//         return { milestones: milestones, myworks: check };
//       }
//     } else {
//       return { milestones: milestones, myworks: check };
//     }
//   } catch (e) {
//     return { error: e.message };
//   }
// }

// async function changeStatus(params) {
//   try {
//     let date = ``;
//     let newDate = dateTimeGeneration(new Date());
//     if (params.hasOwnProperty("planDate")) {
//       date = `, planDate='${params.planDate}'`;
//     }
//     let res = await exeQuery(
//       `update allProjects set modifiedTime='${newDate}',modifiedUser='${params.user}',${params.column}='${params.value}'${date} where projectCode='${params.projectCode}'`
//     );
//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// }

// async function reverseProject(params) {
//   try {
//     let newDate = dateTimeGeneration(new Date());
//     let user = params.user;
//     let invoice = `delete from allInvoices where projectCode='${params.projectCode}'`;
//     let invoiceQuery = Buffer.from(invoice).toString("base64");
//     let milestones = `update allObservations set issueStatus='Pending',completionDate=NULL,modifiedUser='${user}',modifiedTime='${newDate}' where projectCode='${params.projectCode}' and type='Milestone'`;
//     let milestoneQuery = Buffer.from(milestones).toString("base64");
//     let projects = `update allProjects set status='Pending',projectStatus='Pipeline',completionStatus=NULL,completionDate=NULL,planDate=NULL,modifiedUser='${user}',modifiedTime='${newDate}' where projectCode='${params.projectCode}'`;
//     let projectQuery = Buffer.from(projects).toString("base64");
//     let query = [invoiceQuery, milestoneQuery, projectQuery];
//     let res = await queryGet(query);
//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// }

// async function updateMilestoneStatus(params) {
//   try {
//     let date = dateTimeGeneration(new Date());
//     let response = await exeQuery(
//       `update allObservations set issueStatus='Completed', completionDate='${date}' where observationCode='${params.observationCode}'`
//     );
//     if (response.responseType == "SUCCESS") {
//       let res = await fetchTable(`
//             SELECT COUNT(*) AS total,SUM(CASE WHEN issueStatus = 'Completed' THEN 1 ELSE 0 END) AS completed FROM allObservations WHERE projectCode = '${params.projectCode}' and type='Milestone'`);
//       if (res[0].total != null && res[0].completed != null) {
//         let lastproject = Number(res[0].total) - Number(res[0].completed);
//         let queries = [];
//         // generate invoice if amount of current milestone is not 0
//         let getObservation = await fetchTable(
//           `select * from allObservations where observationCode='${params.observationCode}'`
//         );
//         if (getObservation.length > 0) {
//           let amount = getObservation[0].amountInvolved;
//           if (amount != 0) {
//             let checkInvoice = await fetchTable(
//               `select * from allInvoices where projectCode='${params.projectCode}'`
//             );
//             let invoiceNumber = BigInt(`${params.projectCode}000`);
//             if (checkInvoice.length > 0) {
//               invoiceNumber =
//                 BigInt(invoiceNumber) + BigInt(checkInvoice.length + 1);
//             } else {
//               invoiceNumber = BigInt(invoiceNumber) + BigInt(1);
//             }
//             let invoiceStatus = `update allprojects set billingStatus='Non-billed' where projectCode='${params.projectCode}'`;
//             let encryptstatus = Buffer.from(invoiceStatus).toString("base64");
//             queries.push(encryptstatus);

//             let invoiceQuery = `insert into allInvoices (projectCode,amount,invoiceNumber,status,assignmentNature,date,edoc,projectName,remarks,contractID,assignmentID,milestones,clientName,companyName,companyId)
//                     values('${
//                       params.projectCode
//                     }','${amount}','${invoiceNumber}','Pending','${
//               getObservation[0].assignmentNature
//             }','${getObservation[0].date}','${getObservation[0].edoc}','${
//               getObservation[0].projectName
//             }','${getObservation[0].projectremarks}','${
//               getObservation[0].contractCode
//             }','${getObservation[0].assignmentID}','${
//               getObservation[0].caption
//             }','${getObservation[0].clientName.replace(/'/g, "''")}','${
//               getObservation[0].companyName
//             }','${getObservation[0].companyId}')`;
//             let encryptInvoice = Buffer.from(invoiceQuery).toString("base64");
//             queries.push(encryptInvoice);
//           }
//         }
//         // added new
//         let allTasksCompleted = false;
//         let allTasksData = false;
//         let projectDetails = "";

//         if (res[0].total == res[0].completed) {
//           let completionDate = dateTimeGeneration(new Date());
//           let completeProject = `update allProjects set status='Completed',projectStatus='Completed',completionDate='${completionDate}',completionStatus='Completed' where projectCode='${params.projectCode}'`;
//           let encrypt = Buffer.from(completeProject).toString("base64");
//           queries.push(encrypt);
//           //ADD ONE KEY to the objs that one passed to fronent HERE if res[0].total == res[0].completed this condition is passed
//           allTasksCompleted = true;
//           projectDetails = await fetchTable(
//             `SELECT  projectCode, managerResponsible, personResponsible1, personResponsible2, personResponsible3, partner
//              FROM allProjects WHERE projectCode = '${params.projectCode}'`
//           );
//           if (projectDetails) {
//             allTasksData = true;
//           }
//           console.log(projectDetails);
//         }

//         if (queries.length > 0) {
//           let response = await queryGet(queries);
//           /////
//           if (allTasksCompleted) {
//             response.allTasks = "completed";
//           }
//           if (allTasksData) {
//             response.allTasksData = projectDetails;
//           }
//           //////
//           return response;
//         } else {
//           return response;
//         }
//       }
//       return res;
//     }
//   } catch (e) {
//     return { error: e.message };
//   }
// }

// const populateMyworks = async (values, item) => {
//   try {
//     let query = [];
//     let tasks = values[item.caption];
//     if (tasks != undefined) {
//       let taskData = Object.keys(tasks);
//       taskData.filter((task, taskInx) => {
//         let subTasks = tasks[task];
//         subTasks.filter((sub) => {
//           let q = `insert into myworks(task,subtask,milestoneid,contractid,assignmentid,observationcode,projectcode,companyName,companyId,status) values
//             ('${task.replace(/'/g, "''")}','${sub.replace(/'/g, "''")}','${
//             item.milestoneId
//           }','${item.contractCode}','${item.assignmentID}','${
//             item.observationCode
//           }','${item.projectCode}','${item.companyName}','${
//             item.companyId
//           }','Pending')`;
//           let encrypt = Buffer.from(q).toString("base64");
//           query.push(encrypt);
//         });
//       });
//     }
//     let res = await queryGet(query);
//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const addNewTasks = async (item) => {
//   try {
//     let res =
//       await exeQuery(`insert into myworks(task,subtask,milestoneid,contractid,assignmentid,observationcode,projectcode,companyName,companyId,status)  OUTPUT Inserted.lid  values
//             ('${item.task.replace(/'/g, "''")}','${item.sub.replace(
//         /'/g,
//         "''"
//       )}','${item.milestoneId}','${item.contractCode}','${
//         item.assignmentID
//       }','${item.observationCode}','${item.projectCode}','${
//         item.companyName
//       }','${item.companyId}','Pending')`);
//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const myworksUpdateColumns = async (params) => {
//   try {
//     let lid = params.lid.join(",");
//     let res = await exeQuery(
//       `update myworks set ${params.column}='${params.value}' where lid in (${lid})`
//     );
//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const deleteMyWorkTasks = async (params) => {
//   try {
//     let lid = params.lid.join(",");
//     let res = await exeQuery(`delete from myworks where lid in (${lid})`);
//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const updatePersonResponsible = async (params) => {
//   try {
//     let query1 = `update allProjects set ${params.column}='${params.value}' where projectCode='${params.projectCode}'`;
//     let query2 = `update allObservations set ${params.column}='${params.value}' where projectCode='${params.projectCode}'`;
//     let encrypt1 = Buffer.from(query1).toString("base64");
//     let encrypt2 = Buffer.from(query2).toString("base64");
//     let query = [encrypt1, encrypt2];
//     let res = await queryGet(query);
//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const getTeamProgress = async (params) => {
//   try {
//     // get all projects up to the current date in the planDate field
//     // let currentDate = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'); // Convert current date to DD-MM-YYYY format and reverse to YYYY-MM-DD
//     // let res = await fetchTable(`select * from allProjects where planDate IS NOT NULL AND CONVERT(date, planDate, 105) <= '${currentDate}' and companyId='${params.companyid}'`);
//     let distinctManagers = await fetchTable(
//       `select distinct managerResponsible from allProjects where companyId='${params.companyid}'`
//     );
//     let progressData = [];

//     for (let i = 0; i < distinctManagers.length; i++) {
//       let manager = distinctManagers[i];
//       const currentDate = new Date();
//       const year = currentDate.getFullYear();
//       const month = currentDate.getMonth() + 1;
//       const monthLastDate = new Date(year, month, 0)
//         .toISOString()
//         .split("T")[0];
//       let totalCount = await workPaper(
//         {
//           username: manager.managerResponsible,
//           statusname: "Pending",
//           monthlastdate: monthLastDate,
//           year: year,
//           month: month,
//         },
//         "all_ms_count"
//       );
//       let total = Number(totalCount.res[0].count);
//       let closeCount = await workPaper(
//         {
//           username: manager.managerResponsible,
//           monthlastdate: monthLastDate,
//           year: year,
//           month: month,
//         },
//         "close_ms_count"
//       );
//       let closed = Number(closeCount.res[0].count);
//       let value = (closed / total) * 100;
//       progressData.push({ name: manager.managerResponsible, progress: value });
//     }

//     return progressData;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const saveTasks = async (params) => {
//   try {
//     console.log(params.taskData);
//     // Assuming params.taskData is an array of task objects
//     let date = dateTimeGeneration(new Date());
//     let insertQueries = params.taskData.map((task) => {
//       return Buffer.from(
//         `
//     INSERT INTO pettyTask (task, assignedTo, assigner, edoc, priority, comment, status, companyName, companyId, addedTime,filesAttached)
//     VALUES ('${task.task}', '${task.assignedTo}', '${task.assigner}', '${task.edoc}', '${task.priority}', '${task.Comment}', '${task.status}', '${task.companyName}', '${task.companyId}','${date}','${task.files}')
//   `
//       ).toString("base64");
//     });

//     // Call queryGet with the array of base64-encoded queries
//     let result = await queryGet(insertQueries);

//     return result;
//   } catch (e) {
//     return { error: e.message };
//   }
// };
// const statusUpdate = (params) => {
//   try {
//     return { hai: "hai" };
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const getTableDataPettyTask = async (params) => {
//   try {
//     console.log(params.email);
//     let getObservation = await fetchTable(`SELECT *
// FROM pettyTask
// WHERE companyId = '${params.companyId}'
//   AND (assigner = '${params.email}' OR assignedTo = '${params.email}');

// `);
//     return getObservation;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// let res;
// const updatePettyTaskStatus = async (params) => {
//   try {
//     if (params.hasOwnProperty("flag")) {
//       res = await exeQuery(`UPDATE pettyTask
// SET status = '${params.status}',
// completedDate ='${params.completedDate}'
// WHERE lid = '${params.lid}';
// `);
//     } else if (params.hasOwnProperty("files")) {
//       res = await exeQuery(`UPDATE pettyTask
// SET status = '${params.status}',
// filesAttached = '${params.files}',
// comment = '${params.comment}'
// WHERE lid = '${params.lid}';
// `);
//     } else if (params.hasOwnProperty("comment")) {
//       res = await exeQuery(`UPDATE pettyTask
// SET status = '${params.status}',
// comment = '${params.comment}'
// WHERE lid = '${params.lid}';
// `);
//     } else {
//       res = await exeQuery(`UPDATE pettyTask
// SET status = '${params.status}'
// WHERE lid = '${params.lid}';
// `);
//     }

//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const updatePettyTaskComment = async (params) => {
//   try {
//     let res = await exeQuery(`UPDATE pettyTask
// SET comment = '${params.comment}'
// WHERE lid = '${params.lid}';
// `);

//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// //  observation-->dashboards/observation.html-->below pettytask--> observation

// const getProjectNames = async (params) => {
//   try {
//     let getProjectData =
//       await fetchTable(`SELECT projectCode,projectDescription,clientName,relevantStartDate,relevantEndDate
// FROM AllProjects
// WHERE companyId = '${params.companyid}'  AND (
//     managerResponsible = '${params.name}' OR
//     personResponsible1 = '${params.name}' OR
//     personResponsible2 = '${params.name}' OR
//     partner = '${params.name}' OR
//     personResponsible3 = '${params.name}'
//   );
// `);

//     return getProjectData;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const getMilestonesCount = async (params) => {
//   try {
//     // params.name = "Durai"
//     let getProjectData = await fetchTable(`SELECT observationCode
// FROM AllObservations
// WHERE projectCode = '${params.projectCode}';

// `);

//     return getProjectData;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const updateAllObservationObs = async (params) => {
//   try {
//     let res = await exeQuery(`
//     INSERT INTO AllObservations (
//         caption,
//         companyName,
//         companyId,
//         projectCode,
//         assignedBy,
//         personResponsible,
//         edoc,
//         type,
//         observationCode,
//         clientName,
//         addedTime,steps,addedUser,projectName,issueStatus
//     ) VALUES (
//         '${params.caption}',
//         '${params.companyName}',
//         '${params.companyId}',
//         '${params.projectCode}',
//         '${params.assignedBy}',
//         '${params.personResponsible}',
//         '${params.edoc}',
//         '${params.type}',
//         '${params.observationCode}',
//         '${params.clientName}',
//         '${params.addedTime}',
//           '${params.steps}',
//         '${params.addedUser}','${params.projectName}','Pending'

//     )
// `);

//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const getProjectDataObservation = async (params) => {
//   try {
//     let getProjectData = await fetchTable(`
//   SELECT observationCode, projectCode, clientName, caption, assignedBy,
//          personResponsible, addedUser, addedTime, type, companyName,projectName,
//          companyId, edoc, steps,issueStatus,remarks,filesAttached
//   FROM AllObservations
//   WHERE companyId = '${params.companyid}'
//     AND type = 'observation'
//     AND (
//       personResponsible = '${params.name}' OR
//       assignedBy = '${params.name}'
//     )
// `);

//     return getProjectData;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const updateObservationStatus = async (params) => {
//   try {
//     let res = await exeQuery(`UPDATE AllObservations
// SET issueStatus = '${params.status}'
// WHERE  observationCode  = '${params.observationCode}';
// `);

//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const updateObservationComment = async (params) => {
//   try {
//     let res = await exeQuery(`UPDATE AllObservations
// SET steps = '${params.steps}'
// WHERE  observationCode  = '${params.observationCode}';
// `);

//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const updateObservationremarks = async (params) => {
//   try {
//     let res;
//     if (params.files) {
//       res = await exeQuery(`UPDATE AllObservations
// SET remarks = '${params.remarks}',filesAttached = '${params.files}'
// WHERE  observationCode  = '${params.observationCode}';
// `);
//     } else {
//       res = await exeQuery(`UPDATE AllObservations
// SET remarks = '${params.remarks}'
// WHERE  observationCode  = '${params.observationCode}';
// `);
//     }

//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// const cancelProject = async (params) => {
//   try {
//     let newDate = dateTimeGeneration(new Date());
//     let res =
//       await exeQuery(`update allProjects set status='Cancelled',projectStatus='Cancelled',completionStatus='Cancelled',billingStatus='Cancelled',liveOrCancelled='Cancelled',modifiedTime='${newDate}',modifiedUser='${params.user}',planDate=NULL where
//          status='Pending' AND projectCode='${params.projectCode}'`);
//     return res;
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// async function pettyTaskStatus() {
//   try {
//     let res = await fetchTable(`select * from pettyTask`);
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }
// async function totalUsersCount(params) {
//   try {
//     let res = await fetchTable(
//       `select * from invitedusers where companyname='${params.companyname}'`
//     );
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }

// async function getObservationType(params) {
//   try {
//     let res = await fetchTable(
//       `select * from AllObservations where type='${params.type}'`
//     );
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }

// async function getPresalesvalidation(params) {
//   let status = "Pending Proposal";
//   try {
//     let res = await fetchTable(
//       `SELECT urn,ps_validation FROM AllContracts WHERE companyId='${params.companyid}' AND ps_validation IN ('Open', 'Closed')  AND status='${status}'`
//     );

//     let results = [];

//     for (let item of res) {
//       // Step 1: Get assignments for this URN
//       let assignments = await fetchTable(`
//         SELECT assignmentNature, clientName
//         FROM contractAssignmentNature
//         WHERE contractID = '${item.urn}' AND contractStatus='${status}'
//       `);

//       // Step 2: For each assignment, get milestones (assuming contractID or assignmentNature used)
//       for (let assign of assignments) {
//         let milestones = await fetchTable(`
//           SELECT milestone, standardHours ,milestoneId
//           FROM milestoneSubform
//           WHERE contractID = '${item.urn}' AND assignmentNature = '${assign.assignmentNature}' AND status='${status}'
//         `);

//         results.push({
//           contractID: item.urn,
//           ps_validation: item.ps_validation,
//           clientName: assign.clientName,
//           assignmentNature: assign.assignmentNature,
//           milestones: milestones,
//         });
//       }
//     }

//     return results;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }

// async function saveMilestonePsvalidation(params) {
//   let status = "Pending Proposal";
//   let res;
//   try {
//     for (const item of params.milestones) {
//       const updateQuery = `
//        UPDATE milestoneSubform
//   SET milestone = '${item.newMilestone}'
//   WHERE contractID = '${item.contractID}'
//   AND milestoneId='${item.lid}'
//     AND assignmentNature = '${item.assignmentNature}'
//     AND milestone = '${item.oldMilestone}'
//     AND status = '${status}'
//       `;

//       console.log("Executing Query:", updateQuery); // Debug
//       res = await exeQuery(updateQuery);
//       console.log(res);
//     }
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }

// async function allContractsValidationChange(params) {
//   let status = "Pending Proposal";
//   let ps_validation = "Closed";
//   try {
//     let res = await exeQuery(
//       `update AllContracts set ps_validation='${ps_validation}' where companyId='${params.companyid}' AND status='${status}'  `
//     );
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }
// ///sanjay july 7
// // ADD THIS NEW FUNCTION TO YOUR BACKEND CONTROLLER
// const completeObservationWithRemarks = async (params) => {
//   try {
//     // 1. Get the current timestamp for the completion date
//     const completionDate = dateTimeGeneration(new Date());

//     // 2. Escape the remarks string from the frontend to prevent SQL errors
//     const escapedRemarks = params.remarks.replace(/'/g, "''");

//     // 3. Construct a SINGLE, ATOMIC SQL query to update everything at once
//     const sqlQuery = `
//       UPDATE AllObservations
//       SET
//         issueStatus = 'completed',
//         completionDate = '${completionDate}',
//         remarks = '${escapedRemarks}'
//       WHERE
//         observationCode = '${params.observationCode}';
//     `;

//     // 4. Execute the single, reliable query
//     let res = await exeQuery(sqlQuery);

//     // 5. Return the result to the frontend
//     return res;

//   } catch (e) {
//     // Handle any potential database errors
//     return { error: e.message };
//   }
// };
////////////////////////////////////////////////end
// const fetchItReturns = async (params) => {
//   try {
//     // fetch all projects where relevant start date and end date is in current month
//     let allProjects = await fetchTable(` SELECT
//     *
// FROM
//     AllProjects
// WHERE
//     companyId =   '${params.companyid}'
//     AND status = 'Pending'
//     AND (
//         projectDescription = 'IT Return Filing - Individual'
//         OR projectDescription = 'IT Filing - Corporate'
//     ); `);
//     return allProjects;
//   } catch (e) {
//     return { error: e };
//   }
// };

// In your backend controller file

// const fetchItReturns = async (params) => {
//   try {
//     // === STEP 1: Get the initial list of IT Return projects ===
//     const initialProjects = await fetchTable(`
//       SELECT
//         projectCode,
//         clientName
//       FROM
//         AllProjects
//       WHERE
//         companyId = '${params.companyid}'
//         AND status = 'Pending'
//         AND projectDescription IN ('IT Return Filing - Individual', 'IT Filing - Corporate')
//     `);

//     // If no projects are found, return an empty array immediately
//     if (initialProjects.length === 0) {
//       return [];
//     }

//     // === STEP 2: Process each project to find its documents ===

//     // We use Promise.all to run the lookups for all projects concurrently, which is much faster
//     // than a standard for loop with await inside.
//     const finalProjectData = await Promise.all(
//       initialProjects.map(async (project) => {

//         // === STEP 2a: Find document links for the current project ===
//         // Find all rows in `portal_service_userDocs` that match the project's code.
//         const userDocs = await fetchTable(`
//           SELECT
//             link_docId,
//             blob
//           FROM
//             portal_service_userDocs
//           WHERE
//             link_projectId = '${project.projectCode}'
//         `);

//         let documentList = []; // This will hold the final list of { name, url } for this project

//         // If documents were found for this project, proceed to find their names
//         if (userDocs.length > 0) {

//           // === STEP 2b: Find the name for each document found ===
//           documentList = await Promise.all(
//             userDocs.map(async (doc) => {

//               // Find the document's metadata in `portal_serviceDocs_CMS` using the docId.
//               const docCms = await fetchTable(`
//                 SELECT
//                   document
//                 FROM
//                   portal_serviceDocs_CMS
//                 WHERE
//                   id = '${doc.link_docId}'
//               `);

//               // If a name is found, create the final object. Otherwise, provide a default.
//               const docName = docCms.length > 0 ? docCms[0].document : 'Unnamed File';

//               return {
//                 name: docName,
//                 url: doc.blob, // The blob URL from the first query
//               };
//             })
//           );
//         }

//         // === STEP 3: Combine project info with its document list ===
//         return {
//           projectCode: project.projectCode,
//           clientName: project.clientName,
//           documents: documentList, // This will be an array of {name, url} objects
//         };
//       })
//     );

//     // === STEP 4: Return the final, combined data ===
//     return finalProjectData;

//   } catch (e) {
//     // Handle any errors that might occur during the process
//     console.error("Error fetching IT Returns data:", e);
//     return { error: true, message: e.message };
//   }
// };

// In your backend controller file

// In your backend controller file the below one is working perfectly and latest commented
// const fetchItReturns = async (params) => {
//   try {
//     // === STEP 1: Get the initial list of IT Return projects ===
//     console.log("--- Step 1: Fetching initial projects ---");
//     const initialProjects = await fetchTable(`SELECT 
//     *     
//     FROM 
//     AllProjects 
//     WHERE 
//     companyId =   '${params.companyid}'
//     AND status = 'Pending'
//     AND (
//         projectDescription = 'IT Return Filing - Individual' 
//         OR projectDescription = 'IT Filing - Corporate'
//     );     `);

//     // console.log(initialProjects)
//     console.log(
//       `--- Found ${initialProjects.length} initial projects ---`,
//       initialProjects
//     );

//     if (initialProjects.length === 0) {
//       console.log("--- No initial projects found. Returning empty array. ---");
//       return [];
//     }

//     // === STEP 2: Process each project ===
//     const finalProjectData = await Promise.all(
//       initialProjects.map(async (project) => {
//         console.log(`\n--- Processing Project: ${project.projectCode} ---`);

//         // === STEP 2a: Find document links for this project ===
//         const userDocs = await fetchTable(`
//           SELECT 
//             link_docId, 
//             blob 
//           FROM 
//             portal_service_userDocs 
//           WHERE 
//             link_projectId = '${project.projectCode}'
//         `);

//         // console.log(`--- Step 2a: Found ${userDocs.length} userDocs for project ${project.projectCode} ---`, userDocs);

//         let documentList = [];

//         if (userDocs.length > 0) {
//           const docsGroupedById = userDocs.reduce((acc, doc) => {
//             if (!acc[doc.link_docId]) {
//               acc[doc.link_docId] = [];
//             }
//             acc[doc.link_docId].push(doc.blob);
//             return acc;
//           }, {});

//           // console.log(`--- Step 2b: Grouped docs for project ${project.projectCode} ---`, docsGroupedById);

//           documentList = await Promise.all(
//             Object.keys(docsGroupedById).map(async (docId) => {
//               // === STEP 2c: Find the name for each document ID ===
//               const docCms = await fetchTable(`
//                 SELECT document 
//                 FROM portal_serviceDocs_CMS 
//                 WHERE id = '${docId}'
//               `);

//               // console.log(`--- Step 2c: Found name for docId ${docId} ---`, docCms);

//               const docName =
//                 docCms.length > 0 ? docCms[0].document : "Unnamed Document";

//               return {
//                 name: docName,
//                 urls: docsGroupedById[docId],
//               };
//             })
//           );
//         }

//         // === STEP 3: Combine project info with its document list ===
//         const resultForProject = {
//           projectCode: project.projectCode,
//           clientName: project.clientName,
//           documents: documentList,
//         };

//         // console.log(`--- Final data for project ${project.projectCode} ---`, resultForProject);
//         return resultForProject;
//       })
//     );

//     // console.log("\n--- FINAL RESULT being sent to frontend ---", finalProjectData);
//     return finalProjectData;
//   } catch (e) {
//     // console.error("!!! CRITICAL ERROR in fetchItReturns !!!", e);
//     return { error: true, message: e.message };
//   }
// };
//////////the below code also working but efficient 
// const fetchItReturns = async (params) => {
//   try {
//     // === STEP 1: Get the initial list of IT Return projects (No change here) ===
//     const initialProjects = await fetchTable(`
//         SELECT 
//             projectCode,
//             clientName
//         FROM 
//             AllProjects
//         WHERE 
//             companyId = '${params.companyid}'
//             AND status = 'Pending'
//             AND projectDescription IN ('IT Return Filing - Individual', 'IT Filing - Corporate')
//     `);

//     if (initialProjects.length === 0) {
//         return [];
//     }

//     // ===================================================================
//     // ✅ START: OPTIMIZED DATA FETCHING LOGIC
//     // ===================================================================

//     // --- STEP 2: Collect all project codes into a single list for an IN clause ---
//     const projectCodes = initialProjects.map(p => `'${p.projectCode}'`).join(',');
//     // This creates a string like: "'proj_123','proj_456','proj_789'"

//     // --- STEP 3: Fetch ALL user documents for ALL projects in a SINGLE query ---
//     const allUserDocs = await fetchTable(`
//         SELECT 
//             link_projectId,
//             link_docId, 
//             blob 
//         FROM 
//             portal_service_userDocs 
//         WHERE 
//             link_projectId IN (${projectCodes})
//     `);

//     // --- STEP 4: Collect all unique document IDs from the results ---
//     const docIds = [...new Set(allUserDocs.map(doc => doc.link_docId))]
//                     .map(id => `'${id}'`).join(',');
//     // This creates a string like: "'docId_1','docId_2','docId_3'"

//     let docIdToNameMap = {}; // We will use this as a fast lookup map

//     if (docIds) {
//         // --- STEP 5: Fetch ALL document names for ALL needed docs in a SINGLE query ---
//         const allDocNames = await fetchTable(`
//             SELECT 
//                 id,
//                 document 
//             FROM 
//                 portal_serviceDocs_CMS 
//             WHERE 
//                 id IN (${docIds})
//         `);
        
//         // --- STEP 6: Create a fast lookup map from ID to Name ---
//         allDocNames.forEach(doc => {
//             docIdToNameMap[doc.id] = doc.document;
//         });
//     }

//     // --- STEP 7: Combine all the data in memory (this is extremely fast) ---
//     const finalProjectData = initialProjects.map(project => {
//         // Filter the user docs for the current project
//         const projectUserDocs = allUserDocs.filter(doc => doc.link_projectId === project.projectCode);
        
//         // Group the filtered docs by their docId
//         const docsGroupedById = projectUserDocs.reduce((acc, doc) => {
//             if (!acc[doc.link_docId]) {
//                 acc[doc.link_docId] = {
//                     // Use the map to get the name instantly, no new query needed
//                     name: docIdToNameMap[doc.link_docId] || 'Unnamed Document',
//                     urls: []
//                 };
//             }
//             acc[doc.link_docId].urls.push(doc.blob);
//             return acc;
//         }, {});

//         return {
//             projectCode: project.projectCode,
//             clientName: project.clientName,
//             documents: Object.values(docsGroupedById), // Convert the grouped object back to an array
//         };
//     });

//     // ===================================================================
//     // ✅ END: OPTIMIZED DATA FETCHING LOGIC
//     // ===================================================================

//     return finalProjectData;

//   } catch (e) {
//     console.error("!!! CRITICAL ERROR in fetchItReturns !!!", e);
//     return { error: true, message: e.message };
//   }
// };
const fetchItReturns = async (params) => {
  try {
    // === STEP 1: Get initial projects (This part is correct) ===
    const initialProjects = await fetchTable(`
        SELECT 
            projectCode,
            clientName
        FROM 
            AllProjects
        WHERE 
            companyId = '${params.companyid}'
            AND status = 'Pending'
            AND projectDescription IN ('IT Return Filing - Individual', 'IT Filing - Corporate')
    `);

    if (initialProjects.length === 0) {
        return [];
    }

    // === STEP 2: Collect all project codes for bulk queries ===
    const projectCodes = initialProjects.map(p => `'${p.projectCode}'`).join(',');

    // === STEP 3 & 4: Fetch all documents and their names (This part is correct) ===
    const allUserDocs = await fetchTable(`
        SELECT link_projectId, link_docId, blob 
        FROM portal_service_userDocs 
        WHERE link_projectId IN (${projectCodes})
    `);
    
    const docIds = [...new Set(allUserDocs.map(doc => doc.link_docId))].map(id => `'${id}'`).join(',');
    let docIdToNameMap = {};
    if (docIds) {
        const allDocNames = await fetchTable(`
            SELECT id, document 
            FROM portal_serviceDocs_CMS 
            WHERE id IN (${docIds})
        `);
        allDocNames.forEach(doc => {
            docIdToNameMap[doc.id] = doc.document;
        });
    }

    // ===================================================================
    // ✅ START: CORRECTED LOGIC FOR MILESTONE PROGRESS
    // ===================================================================
    
    // --- STEP 5: Fetch ALL milestone statuses using the correct 'issueStatus' column ---
    const allMilestoneStatuses = await fetchTable(`
        SELECT 
            projectCode, 
            issueStatus  -- <-- CORRECTED: Using issueStatus as you specified
        FROM 
            AllObservations 
        WHERE 
            companyId = '${params.companyid}'
            AND projectCode IN (${projectCodes})
            AND type = 'Milestone'
    `);
    
    // --- STEP 6: Create the lookup map for milestone progress (No change in logic here) ---
    const milestoneProgressMap = allMilestoneStatuses.reduce((acc, milestone) => {
        const { projectCode, issueStatus } = milestone;
        if (!acc[projectCode]) {
            acc[projectCode] = { completed: 0, total: 0 };
        }
        
        acc[projectCode].total++;
        
        // This check correctly looks for 'Completed' or 'completed' in the 'issueStatus' field
        if (issueStatus && issueStatus.toLowerCase() === 'completed') {
            acc[projectCode].completed++;
        }
        
        return acc;
    }, {});
    
    // ===================================================================
    // ✅ END: CORRECTED LOGIC
    // ===================================================================

    // === STEP 7: Combine all data in memory (This part is correct) ===
    const finalProjectData = initialProjects.map(project => {
        const projectUserDocs = allUserDocs.filter(doc => doc.link_projectId === project.projectCode);
        const docsGroupedById = projectUserDocs.reduce((acc, doc) => {
            if (!acc[doc.link_docId]) {
                acc[doc.link_docId] = {
                    name: docIdToNameMap[doc.link_docId] || 'Unnamed Document',
                    urls: []
                };
            }
            acc[doc.link_docId].urls.push(doc.blob);
            return acc;
        }, {});

        const progress = milestoneProgressMap[project.projectCode];
        const milestoneStatusString = progress ? `${progress.completed}/${progress.total}` : "0/0";

        return {
            projectCode: project.projectCode,
            clientName: project.clientName,
            documents: Object.values(docsGroupedById),
            milestoneProgress: milestoneStatusString,
        };
    });

    return finalProjectData;

  } catch (e) {
    console.error("!!! CRITICAL ERROR in fetchItReturns !!!", e);
    return { error: true, message: e.message };
  }
};

////
module.exports = { fetchItReturns };
