const { fetchTable, exeQuery, queryGet, dateTimeGeneration, sendMail } = require('../../config')
const { getEmployeeOptions } = require('../../formTemplates/js/forms')
require('datejs');

async function getAllAssignmentNature() {
    try {
        let res = await fetchTable(`select * from assignmentNature`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function deleteAllProjects({ rowId }) {
    try {
        let delMile = `Delete from milestoneSubform where contractID='${rowId}'`
        let deleteMilestone = Buffer.from(delMile).toString('base64');
        let delAssign = `Delete from ContractAssignmentNature where contractID='${rowId}'`
        let deleteContractAssignmentNature = Buffer.from(delAssign).toString('base64');
        let delContract = `Delete from AllContracts where urn='${rowId}'`
        let deleteAllContracts = Buffer.from(delContract).toString('base64');
        let res = await queryGet([deleteMilestone, deleteContractAssignmentNature, deleteAllContracts])
        return res
    } catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function duplicateContract({ contractID, userid, companyid, companyname, username, addedTime }) {
    try {
        let allContracts = await fetchTable(`select * from allcontracts where urn='${contractID}'`);
        let allContractAssignmentNature = await fetchTable(`select * from contractAssignmentNature where contractID='${contractID}'`);
        let allMilestoneSubform = await fetchTable(`select * from milestoneSubform where contractID='${contractID}'`);
        let contractId_max = await fetchTable(`SELECT MAX(urn) FROM AllContracts where userid='${userid}' and companyid='${companyid}'`)
        let contractID_str = (BigInt(contractId_max[0].column1) + 1n).toString();
        let queryList = [];
        let con_query = `INSERT INTO AllContracts(urn,contractID,userid,companyname,companyid,clientName,entity,liveChurn,status,proposalStatus,remarks,termsConditions,addedUser,addedTime)
        values('${contractID_str}','${contractID_str}','${userid}','${companyname}','${companyid}','${allContracts[0].clientName}','${allContracts[0].entity}','${allContracts[0].liveChurn}','${allContracts[0].status}','${allContracts[0].proposalStatus}','${allContracts[0].remarks.replace(/'/g, "''")}','${allContracts[0].termsConditions.replace(/'/g, "''")}','${username}','${addedTime}')`
        let contract_query = Buffer.from(con_query).toString('base64');
        queryList.push(contract_query);
        let assignmentID_new = BigInt(contractID_str + "00");
        for (let contractAssign of allContractAssignmentNature) {
            assignmentID_new += 1n;
            let assignmentID_str = assignmentID_new.toString();
            let contract_Assign = `INSERT INTO ContractAssignmentNature(
            contractID, sequence, assignmentNature, dateFormat, feeEstimate, assignmentID,
            type, frequency, amount, relevantYear, contractStartDate,
            contractEndDate, quarter, managerResponsible, personResponsible1,
            personResponsible2, personResponsible3, entity,
            clientName, liveChurn, remarks, partner, relevantStartDate,
            relevantEndDate, edoc, companyName, companyID, addedUser, addedTime
        ) VALUES(
            '${contractID_str}', '${contractAssign.sequence}', '${contractAssign.assignmentNature}', '${contractAssign.dateFormat}', '${contractAssign.feeEstimate}','${assignmentID_str}',
            '${contractAssign.type}', '${contractAssign.frequency}', '${contractAssign.amount}', '${contractAssign.relevantYear}', '${contractAssign.contractStartDate}',
            '${contractAssign.contractEndDate}', '${contractAssign.quarter}', '${contractAssign.managerResponsible}', '${contractAssign.personResponsible1}',
            '${contractAssign.personResponsible2}', '${contractAssign.personResponsible3}', '${contractAssign.entity}',
            '${contractAssign.clientName.replace(/'/g, "''")}', '${contractAssign.liveChurn}', '${contractAssign.remarks.replace(/'/g, "''")}', '${contractAssign.partner}', '${contractAssign.relevantStartDate}',
            '${contractAssign.relevantEndDate}', '${contractAssign.edoc}', '${companyname}', '${companyid}',
            '${username}', '${addedTime}'
        )`
            let contractAssignmentQuery = Buffer.from(contract_Assign).toString('base64');
            queryList.push(contractAssignmentQuery);
            let milestoneID_new = BigInt(assignmentID_str + "00");
            for (let milestone of allMilestoneSubform) {
                if (contractAssign.assignmentID == milestone.assignmentID) {
                    milestoneID_new += 1n;
                    let milestoneID_str = milestoneID_new.toString();
                    let mile_query = `INSERT INTO milestoneSubform
                (contractID, sequence, milestoneId, assignmentNature, standardHours, advance, milestone, paymentPercent, amount, assignmentID, companyName, companyId, addedUser, addedTime)
                VALUES(
                    '${contractID_str}', ${milestone.sequence}, '${milestoneID_str}', '${milestone.assignmentNature}', ${milestone.standardHours}, '${milestone.advance}', '${milestone.milestone}', ${milestone.paymentPercent}, ${milestone.amount}, '${assignmentID_str}', '${companyname}', '${companyid}', '${username}', '${addedTime}'
                )`
                    let milestoneSubform_query = Buffer.from(mile_query).toString('base64');
                    queryList.push(milestoneSubform_query);
                }

            }
        }

        let res = await queryGet(queryList);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getContractData({ companyid }) {
    try {
        let getLeads_query = await fetchTable(`SELECT * FROM AllContracts WHERE status='Contract' and companyid='${companyid}' order by addedTime desc`);
        return getLeads_query
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function contractCreation({ contractID }) {
    try {
        await exeQuery(`delete from allobservations where contractcode='${contractID}'`);
        await exeQuery(`delete from allInvoices where contractid='${contractID}'`);
        await exeQuery(`delete from allProjects where contractid='${contractID}'`);


        let assignmentNatureDetails = await getContractAssignmentNature(contractID);
        let milestoneDetails = await getContractMilestones(contractID);
        let projectResponse = [contractID];


        for (const element of assignmentNatureDetails) {
            let assignmentRow = element;
            let milestoneRow = milestoneDetails.filter((miles) => {
                return (assignmentRow.assignmentID == miles.assignmentID);
            });
            let res = await projectCreation(assignmentRow, milestoneRow);
            projectResponse.push(res)
        }
        return projectResponse
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateContract({ contractID }) {
    try {
        let res = await exeQuery(`update allContracts set status='ongoingContract' where urn='${contractID}'`)
        return res
    }
    catch (error) {
        return { e: error }
    }
}

async function getContractAssignmentNature(contractID) {
    try {
        let getAssignmentNature_res = await fetchTable(`SELECT * FROM ContractAssignmentNature WHERE contractID='${contractID}'`);
        return getAssignmentNature_res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getContractMilestones(contractID) {
    try {
        let getAssignmentNature_res = await fetchTable(`SELECT * FROM milestoneSubform WHERE contractID='${contractID}'`);
        return (getAssignmentNature_res);
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

let count = 0;
async function projectCreation(assignmentRow, milestoneRow) {
    count += 1;
    let freqObj = {
        "Monthly": 0,
        "Quarterly": 2,
        "Half yearly": 5,
        "Annual": 11,
        "Other": 11
    }

    let rows = assignmentRow;


    let contractStartDate = new Date(rows.contractStartDate);
    let relevantStartDate = new Date(rows.relevantStartDate);

    let startdate, enddate;
    // console.log(contractStartDate.getTime(),relevantStartDate.getTime())
    if (contractStartDate.toLocaleDateString() == relevantStartDate.toLocaleDateString()) {
        startdate = contractStartDate;
        enddate = new Date(rows.contractEndDate);
    } else {
        startdate = relevantStartDate;
        enddate = new Date(rows.relevantEndDate);
    }


    let allAssignmentNature = await getAllAssignmentNature()

    let dynamicEdoc = new Date(rows.edoc);
    let addedUser = rows.addedUser;
    let currentDate_val = new Date();
    let time = new Date().toLocaleTimeString().split(" ");
    // Current Date
    let crnt_date_dd = currentDate_val.getDate();
    let crnt_date_mm = currentDate_val.getMonth() + 1;
    let crnt_date_yy = currentDate_val.getFullYear();
    let currentDate_dateFormat = crnt_date_yy + "-" + crnt_date_mm + "-" + crnt_date_dd;
    currentDate = currentDate_dateFormat + " " + time[0];
    // currentDate = dateTimeGeneration(new Date(currentDate_dateFormat));

    rows.remarks = rows.remarks === null ? '' : rows.remarks;
    rows.projectRemarks = rows.projectRemarks === null ? '' : rows.projectRemarks;

    let projectInsertQueryList = []
    let invoicesInsertQueryList = []
    let observationsInsertQueryList = []
    if (rows.type == "Recurring") {
        let projectCode = BigInt(rows.assignmentID + "000");
        let calculateMonths = (enddate.getMonth() - startdate.getMonth()) + 1 + (12 * (enddate.getFullYear() - startdate.getFullYear()));
        let months = calculateMonth(rows, calculateMonths)
        // let prevMonth = startdate.add(-1).month();
        let current_projectStartDate = new Date(startdate);

        let prevMonth_dynamicEdoc = dynamicEdoc.add(-1).month();

        console.log(months)
        for (let k = 0; k < months; k++) {

            projectCode += 1n;
            let projectCode_str = projectCode.toString();
            // let currentMon = prevMonth.add(1).month();
            // let mon = currentMon.getMonth();
            // let dd = currentMon.getDate();
            // let yy = currentMon.getFullYear();
            // let projectDate = yy + "-" + (mon + 1) + "-" + dd;

            let frequency = freqObj[rows.frequency]
            let current_projectStartDate_temp = new Date(current_projectStartDate);
            let current_projectEndDate = new Date(current_projectStartDate.add(frequency).month());
            let lastDay = new Date(current_projectEndDate.getFullYear(), current_projectEndDate.getMonth() + 1, 0);
            let lastDay_temp = new Date(lastDay);
            current_projectStartDate = new Date(lastDay_temp.add(1).day());

            // Project start date format
            let projectStartMonth = current_projectStartDate_temp.toLocaleString('en-GB', { month: 'short' })
            let projectStartYear = current_projectStartDate_temp.getFullYear().toString().slice(-2);

            // Project start date format
            let edocMonth = lastDay.toLocaleString('en-GB', { month: 'short' })
            let edocYear = lastDay.getFullYear().toString().slice(-2);

            let start_dd = current_projectStartDate_temp.getDate();
            let start_mm = current_projectStartDate_temp.getMonth();
            let start_yyyy = current_projectStartDate_temp.getFullYear();
            let relevantStartDate = start_yyyy + "-" + (start_mm + 1) + "-" + start_dd;



            let end_dd = lastDay.getDate();
            let end_mm = lastDay.getMonth();
            let end_yyyy = lastDay.getFullYear();
            let relevantEndDate = end_yyyy + "-" + (end_mm + 1) + "-" + end_dd;

            let projectDate = relevantStartDate;
            let edoc = relevantEndDate;


            let relevantYear;
            let month = current_projectStartDate_temp.getMonth();
            let year = current_projectStartDate_temp.getFullYear();
            if (rows.dateFormat == "Financial Year") {
                let financialYear;
                if (month == 0 || month == 1 || month == 2) {
                    let previousYear = parseInt(year) - 1;
                    financialYear = previousYear + " - " + year;
                }
                else {
                    let upcomingYear = parseInt(year) + 1;
                    financialYear = year + " - " + upcomingYear;
                }
                relevantYear = financialYear;
            }
            else if (rows.dateFormat == "Calender Year") {
                relevantYear = year;
            }


            let projectDescription;
            let assignmentNatureDisplay;

            allAssignmentNature.map((assign) => {
                if (assign.lid == rows.assignmentNature) {
                    projectDescription = assign.assignmentNature;//+ " " + `(${projectStartMonth}${projectStartYear} - ${edocMonth}${edocYear})`
                    assignmentNatureDisplay = assign.assignmentNature;
                }
            })

            let durationMonthList = getProjectDuration(relevantStartDate, relevantEndDate);
            let durationObj = JSON.stringify({ "data": durationMonthList });
            let quarter = getQuarter(start_mm, rows)


            let proQuery = `INSERT INTO AllProjects(projectCode,assignmentID,contractID,assignmentNature,date,clientName,
                edoc,quarter,projectDescription,amount,managerResponsible,personResponsible1,
                personResponsible2,personResponsible3,contractStatus,status,duration,companyName,projectStatus,completionStatus,liveOrCancelled,
                companyId,addedUser,addedTime,partner,remarks,projectRemarks,relevantStartDate,relevantEndDate,relevantYear,assignmentNatureDisplay
                )
            VALUES ('${projectCode_str}','${rows.assignmentID}','${rows.contractID}','${rows.assignmentNature.replace(/'/g, "''")}','${projectDate}','${rows.clientName.replace(/'/g, "''")}',
            '${edoc}','${quarter}','${projectDescription.replace(/'/g, "''")}','${rows.amount}','${rows.managerResponsible.replace(/'/g, "''")}','${rows.personResponsible1.replace(/'/g, "''")}',
            '${rows.personResponsible2.replace(/'/g, "''")}','${rows.personResponsible3.replace(/'/g, "''")}','${rows.contractStatus}','Pending','${durationObj}','${rows.companyName.replace(/'/g, "''")}','Pipeline','Yet to complete','Live',
            '${rows.companyId}','${addedUser}','${currentDate}','${rows.partner}','${rows.remarks.replace(/'/g, "''")}','${rows.projectRemarks.replace(/'/g, "''")}','${relevantStartDate}','${relevantEndDate}','${relevantYear}','${assignmentNatureDisplay}'
            )
            `

            console.log(proQuery)
            let projectQuery = Buffer.from(proQuery).toString('base64');
            // let projectQuery = proQuery;

            projectInsertQueryList.push(projectQuery)
            // Invoice Creation Start
            let invNum = BigInt(projectCode_str + "000");
            let milestone = milestoneRow;
            let i = 0;
            for (const element of milestone) {
                invNum += 1n;
                i++;
                let invNum_str = invNum.toString();
                let liRows = element;
                let invoiceMile = liRows.milestone;
                let amnt = liRows.amount;
                let milestoneNumber = liRows.milestoneNumber;
                let standardHours = liRows.standardHours;
                if (liRows.advance == "true" && i == 1) {
                    let invQuery = `INSERT INTO AllInvoices(invoiceNumber,projectCode,assignmentID,contractID,clientName,
                            date,edoc,amount,assignmentNature,milestones,status,companyName,
                            companyId,addedUser,addedTime,projectName,remarks
                            )
                        VALUES ('${invNum_str}','${projectCode_str}','${rows.assignmentID}','${rows.contractID}','${rows.clientName.replace(/'/g, "''")}',
                        '${projectDate}','${edoc}','${Number(amnt)}','${rows.assignmentNature.replace(/'/g, "''")}','${invoiceMile.replace(/'/g, "''")}','Pending','${rows.companyName.replace(/'/g, "''")}',
                        '${rows.companyId}','${addedUser}','${currentDate}','${projectDescription.replace(/'/g, "''")}','${rows.remarks.replace(/'/g, "''")}'
                        )
                        `
                    let invoiceQuery = Buffer.from(invQuery).toString('base64');
                    invoicesInsertQueryList.push(invoiceQuery)
                }





                // Invoice Creation End

                // Observation Creation End
                // let miles = $(advance[k]).parent().parent().find(".milestones").text();

                let observQuery = `INSERT INTO AllObservations(observationCode,projectCode,assignmentID,contractCode,
                        assignmentNature,date,caption,comment,amountInvolved,impact,recommendation,
                        clientName,clientResponse,assignedBy,managerResponsible,personResponsible1,
                        personResponsible2,personResponsible3,type,issueStatus,companyName,
                        companyId,addedUser,addedTime,standardHours,projectName,milestoneNumber,edoc,partner,projectremarks
                        )
                    VALUES ('${invNum_str}','${projectCode_str}','${rows.assignmentID}','${rows.contractID}',
                    '${rows.assignmentNature.replace(/'/g, "''")}','${projectDate}','${invoiceMile.replace(/'/g, "''")}','No Value','${amnt}','No Value','No Value',
                   '${rows.clientName.replace(/'/g, "''")}','No Value','System','${rows.managerResponsible.replace(/'/g, "''")}','${rows.personResponsible1.replace(/'/g, "''")}',
                    '${rows.personResponsible2.replace(/'/g, "''")}','${rows.personResponsible3.replace(/'/g, "''")}', 'Milestone','Pending','${rows.companyName.replace(/'/g, "''")}',
                    '${rows.companyId}','${addedUser}','${currentDate}','${standardHours}','${projectDescription}',
                    '${milestoneNumber}','${edoc}','${rows.partner.replace(/'/g, "''")}','${rows.remarks.replace(/'/g, "''")}'
                    )
                    `
                let observationQuery = Buffer.from(observQuery).toString('base64');
                observationsInsertQueryList.push(observationQuery)

                // Observation Creation End
            }


        } // for loop between dates end
    } // if Recurring end
    else if (rows.type == "Non recurring") {


        let projectCodeCreation = BigInt(rows.assignmentID + "000");
        let projectCode = projectCodeCreation + 1n;
        let projectCode_str = projectCode.toString();
        let projectDate = rows.contractStartDate;
        let edoc = rows.edoc;
        let mon = (new Date(projectDate)).getMonth();
        let projectDate_dateFormat = dateTimeGeneration(new Date(projectDate))
        let edoc_dateFormat = dateTimeGeneration(new Date(edoc))
        let nonRecurring_quarter;
        let assignmentNatureDisplay;

        allAssignmentNature.map((assign) => {
            if (assign.lid == rows.assignmentNature) {
                assignmentNatureDisplay = assign.assignmentNature;
            }
        })
        // let current_projectStartDate = new Date(startdate);
        // let current_projectStartDate_temp = new Date(current_projectStartDate);
        // let relevantYear;
        // let month = current_projectStartDate_temp.getMonth();
        // let year = current_projectStartDate_temp.getFullYear();

        // if (rows.dateFormat == "Financial Year") {
        //     let financialYear;
        //     if (month == 0 || month == 1 || month == 2) {
        //         let previousYear = parseInt(year) - 1;
        //         financialYear = previousYear + " - " + year;
        //     }
        //     else {
        //         let upcomingYear = parseInt(year) + 1;
        //         financialYear = year + " - " + upcomingYear;
        //     }
        //     relevantYear = financialYear;
        // }
        // else if (rows.dateFormat == "Calender Year") {
        //     relevantYear = year;
        // }





        let projectDescription;
        allAssignmentNature.map((assign) => {
            if (assign.lid == rows.assignmentNature) {
                projectDescription = assign.assignmentNature
            }
        })

        // + " " + `(${projectDate}-${edoc})`

        // Project Duration list preparation
        let durationMonthList = getProjectDuration(projectDate, edoc);
        let durationObj = JSON.stringify({ "data": durationMonthList });
        nonRecurring_quarter = getQuarter(mon, rows)

        // INSERT INTO AllProjects(projectCode,assignmentID,contractID,assignmentNature,date,clientName,
        //     edoc,quarter,projectDescription,amount,managerResponsible,personResponsible1,
        //     personResponsible2,personResponsible3,contractStatus,status,duration,companyName,projectStatus,completionStatus,liveOrCancelled,
        //     companyId,addedUser,addedTime,partner,remarks,relevantStartDate,relevantEndDate,relevantYear,assignmentNatureDisplay

        let proQuery = `INSERT INTO AllProjects(projectCode,assignmentID,contractID,assignmentNature,date,clientName,
            edoc,quarter,projectDescription,amount,managerResponsible,personResponsible1,
            personResponsible2,personResponsible3,contractStatus,status,duration,companyName,
            companyId,addedUser,addedTime,remarks,projectRemarks,projectStatus,completionStatus,liveOrCancelled,relevantStartDate,relevantEndDate,partner,assignmentNatureDisplay
            )
        VALUES ('${projectCode_str}','${rows.assignmentID}','${rows.contractID}','${rows.assignmentNature}','${projectDate_dateFormat}','${rows.clientName.replace(/'/g, "''")}',
        '${edoc_dateFormat}','${nonRecurring_quarter}','${projectDescription}','${rows.amount}','${rows.managerResponsible}','${rows.personResponsible1}',
        '${rows.personResponsible2}','${rows.personResponsible3}','${rows.contractStatus}','Pending','${durationObj}','${rows.companyName}',
        '${rows.companyId}','${addedUser}','${currentDate}','${rows.remarks.replace(/'/g, "''")}','${rows.projectRemarks.replace(/'/g, "''")}','Pipeline','Yet to complete','Live',
        '${rows.relevantStartDate}','${rows.relevantEndDate}','${rows.partner}','${assignmentNatureDisplay}'
        )`
        let projectQuery = Buffer.from(proQuery).toString('base64');
        // let projectQuery = proQuery;
        projectInsertQueryList.push(projectQuery)



        // Invoice Creation Start
        let invNum = BigInt(projectCode_str + "000");


        let milestone = milestoneRow;
        // create invoice only if first milestone is checked advance
        let i = 0;
        for (const element of milestone) {
            invNum += 1n;
            i++;
            let invNum_str = invNum.toString();
            let liRows = element;
            let invoiceMile = liRows.milestone;
            let amnt = liRows.amount;
            let standardHours = liRows.standardHours;
            let milestoneNumber = liRows.milestoneNumber;
            if (liRows.advance == "true" && i == 1) {
                let invQuery = `INSERT INTO AllInvoices(invoiceNumber,projectCode,assignmentID,contractID,clientName,
                        date,edoc,amount,assignmentNature,milestones,status,companyName,
                        companyId,addedUser,addedTime,projectName,remarks
                        )
                    VALUES ('${invNum_str}','${projectCode_str}','${rows.assignmentID}','${rows.contractID}','${rows.clientName.replace(/'/g, "''")}',
                    '${projectDate}','${edoc_dateFormat}','${Number(amnt)}','${rows.assignmentNature}','${invoiceMile}','Pending','${rows.companyName}',
                    '${rows.companyId}','${addedUser}','${currentDate}','${projectDescription}','${rows.remarks.replace(/'/g, "''")}'
                    )
                    `
                let invoiceQuery = Buffer.from(invQuery).toString('base64');

                invoicesInsertQueryList.push(invoiceQuery)
            }

            // Invoice Creation End

            // Observation Creation End
            // let miles = $(advance[k]).parent().parent().find(".milestones").text();

            let observQuery = `INSERT INTO AllObservations(observationCode,projectCode,assignmentID,contractCode,
                assignmentNature,date,caption,comment,amountInvolved,impact,recommendation,
                clientName,clientResponse,assignedBy,managerResponsible,personResponsible1,
                personResponsible2,personResponsible3,type,issueStatus,companyName,
                companyId,addedUser,addedTime,standardHours,projectName,milestoneNumber,edoc,partner,projectremarks
                )
            VALUES ('${invNum_str}','${projectCode_str}','${rows.assignmentID}','${rows.contractID}',
            '${rows.assignmentNature}','${projectDate}','${invoiceMile}','No Value','${amnt}','No Value','No Value',
           '${rows.clientName.replace(/'/g, "''")}','No Value','System','${rows.managerResponsible}','${rows.personResponsible1}',
            '${rows.personResponsible2}','${rows.personResponsible3}', 'Milestone','Pending','${rows.companyName}',
            '${rows.companyId}','${addedUser}','${currentDate}','${standardHours}','${projectDescription}',
            '${milestoneNumber}','${edoc_dateFormat}','${rows.partner}','${rows.remarks.replace(/'/g, "''")}'
            )
            `
            let observationQuery = Buffer.from(observQuery).toString('base64');
            observationsInsertQueryList.push(observationQuery)


            // Observation Creation End
        }

    }

    let insertProjectCall = await queryGet(projectInsertQueryList)
    if (insertProjectCall.responseType === "SUCCESS") {
        let insertObservation = await queryGet(observationsInsertQueryList)

        if (insertObservation.responseType === "SUCCESS") {

            if (invoicesInsertQueryList.length != 0) {
                let insertInvoice = await queryGet(invoicesInsertQueryList)
            }
            return "success"
        } else {
            await exeQuery(`Delete from AllObservations where contractCode=${rows.contractID}`)
            await exeQuery(`Delete from AllProjects where contractID=${rows.contractID}`)

            return "failed"
        }

        // let totalList=invoicesInsertQueryList.concat(observationsInsertQueryList)
        // let totalCall=await queryGet(totalList)
        // if(totalCall.responseType==="SUCCESS"){
        //     await dismissibleAlert('Project Created','success')
        //     // await updateContract(rows.contractID)
        // }
        // else{
        //     let deleteObservations=stringToBase64(`Delete from AllObservations where contractID=${rows.contractID}`)
        //     let deleteInvoices=stringToBase64(`Delete from AllInvoices where contractID=${rows.contractID}`)
        //     let deleteProject=stringToBase64(`Delete from AllProjects where urn=${rows.contractID}`)
        //     let deleteList=[]
        //     deleteList.push(deleteProject,deleteInvoices,deleteObservations)
        //     await queryGet(deleteList)
        //     $("body").append(`
        //     <div class="alert alert-warning floatAlert text-center">Error in creation</div>
        // `);
        // setTimeout(() => {
        //     $(".floatAlert").fadeOut(400);
        // }, "2000");

        // }
    }
    else {
        await exeQuery(`Delete from AllProjects where contractid=${rows.contractID}`)
        return "failed"
    }
}
function getQuarter(mon, rows) {
    let quarter;
    if (rows.dateFormat == "Calender Year") {
        quarter = getCalendarYearQuarter(mon)
    }
    else if (rows.dateFormat == "Financial Year") {
        quarter = getFinancialYearQuarter(mon)
    }
    return quarter
}
function getCalendarYearQuarter(mon) {
    let quarter;
    if (mon == 0 || mon == 1 || mon == 2) {
        quarter = "Q1";
    }
    if (mon == 3 || mon == 4 || mon == 5) {
        quarter = "Q2";
    }
    if (mon == 6 || mon == 7 || mon == 8) {
        quarter = "Q3";
    }
    if (mon == 9 || mon == 10 || mon == 11) {
        quarter = "Q4";
    }
    return quarter
}
function getFinancialYearQuarter(mon) {
    let quarter;
    if (mon == 0 || mon == 1 || mon == 2) {
        quarter = "Q4";
    }
    if (mon == 3 || mon == 4 || mon == 5) {
        quarter = "Q1";
    }
    if (mon == 6 || mon == 7 || mon == 8) {
        quarter = "Q2";
    }
    if (mon == 9 || mon == 10 || mon == 11) {
        quarter = "Q3";
    }
    return quarter
}
function getProjectDuration(projectDate, edoc) {
    let duration_sd = new Date(projectDate);
    let duration_ed = new Date(edoc);

    let durationMonth = (duration_ed.getMonth() - duration_sd.getMonth()) + 1 + (12 * (duration_ed.getFullYear() - duration_sd.getFullYear()));
    let durationPrevMonth = duration_sd.add(-1).month();
    let durationMonthList = [];
    for (let duration_i = 0; duration_i < durationMonth; duration_i++) {
        let durationDate = durationPrevMonth.add(1).month();
        let durationMon = durationDate.getMonth();
        let durationYear = durationDate.getFullYear();
        let durationData = durationMon + " - " + durationYear;
        durationMonthList.push(durationData);
    }
    return durationMonthList


}
function calculateMonth(rows, calculateMonths) {
    let months;
    if (rows.frequency == "Monthly") {
        months = calculateMonths;
    }
    else if (rows.frequency == "Quarterly") {
        months = parseInt(calculateMonths / 3);
    }
    else if (rows.frequency == "Half yearly") {
        months = parseInt(calculateMonths / 6);
    }
    else if (rows.frequency == "Annual") {
        months = parseInt(calculateMonths / 12);
    }
    else if (rows.frequency == "Other") {
        months = parseInt(calculateMonths / 12);
    }
    return months
}

async function updateBlobUrl({ pdfblobUrl, rowID }) {
    try {
        let insertProposalPdf = await exeQuery(`UPDATE AllContracts SET attachments='${pdfblobUrl}'  WHERE urn=${rowID}`);
        return insertProposalPdf
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const updateOngoing = async (params) => {
    try {
        let data = params.data
        let query = []
        for (let i of data) {
            let contractAssignmentQuery = `update contractAssignmentNature set managerResponsible='${i.teamLead}', personResponsible1='${i.personResponsible1}',personResponsible2='${i.personResponsible2}',
            personResponsible3='${i.personResponsible3}',remarks='${i.remarks}',projectRemarks='${i.projectRemarks}' where assignmentID='${i.assignmentID}'`
            let contractAssignment = Buffer.from(contractAssignmentQuery).toString('base64');
            query.push(contractAssignment)
            let res
            if (i.status == "Pipeline") {
                res = await fetchTable(`select projectCode from allProjects where assignmentID='${i.assignmentID}' and projectStatus='Pipeline'`)
            }
            else if (i.status == "Pending") {
                res = await fetchTable(`select projectCode from allProjects where assignmentID='${i.assignmentID}' and status='Pending'`)
            }
            if (res.length > 0) {
                let projectIds = []
                res.map((item) => { projectIds.push(`'${item.projectCode}'`) })
                let ids = projectIds.join(',')
                let projectQuery = `update allProjects set managerResponsible='${i.teamLead}', personResponsible1='${i.personResponsible1}',personResponsible2='${i.personResponsible2}',
            personResponsible3='${i.personResponsible3}',remarks='${i.remarks}',projectRemarks='${i.projectRemarks}' where projectCode in (${ids})`
                let project = Buffer.from(projectQuery).toString('base64');
                query.push(project)
                let invoiceQuery = `update allInvoices set remarks='${i.remarks}' where projectCode in (${ids})`
                let invoice = Buffer.from(invoiceQuery).toString('base64');
                query.push(invoice)
                let observation = `update allObservations set managerResponsible='${i.teamLead}', personResponsible1='${i.personResponsible1}',personResponsible2='${i.personResponsible2}',
            personResponsible3='${i.personResponsible3}',projectremarks='${i.remarks}',remarks='${i.projectRemarks}' where projectCode in (${ids})`
                let ob = Buffer.from(observation).toString('base64');
                query.push(ob)
            }
        }
        let response = await queryGet(query)
        return response

    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


const timesheetAlert = async (params) => {
    try {
        let res = await fetchTable(`SELECT distinct addedUser from dayReport where
            week BETWEEN '${params.prevDate}' AND '${params.today}'
           AND duration != '0:0' and companyid='${params.companyId}'`);
        let employeeList = []
        res.map((item) => {
            employeeList.push(item.addedUser)
        })
        let allemployees = await getEmployeeOptions({ companyid: params.companyId, type: 'email' })
        let recipientList = []
        allemployees.forEach((element) => {
            if (element.label && !employeeList.includes(element.label) && !recipientList.includes(element.value)) {
                recipientList.push(element)
            }
        })
        let success = 0
        for (let i = 0; i < recipientList.length; i++) {
            let subject = "Timesheet Reminder"
            let body = `<html>
            <head>
            </head>
            <body>
              <p>Hi ${recipientList[i].label},</p>
            
              <p>
               This is a reminder that your timesheet has not been filled for the past 2 consecutive workdays.
                Kindly update it as soon as possible to ensure accurate record-keeping.</p>
                <p> If you've already submitted it, please disregard this message.
              </p>
            
            
              <p>Note: This is a system-generated email. Please do not reply.</p>
    
               
            
              <p>Best regards,<br>
              ${params.companyName}</p>
              </p>
            </body>
            </html>`
            let data = {
                "RecipientList": recipientList[i].value,
                "Subject": subject,
                "Body": body
            }

            let result = await sendMail({ data })
            if (result == "GGSH email communication successful!") {
                success += 1
            }
        }
        if (recipientList.length == success) {
            return "GGSH email communication successful!"
        }
        else {
            return { responseType: "Error" }
        }

    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const cancelContracts = async(params)=>{
    try{
        let newDate=dateTimeGeneration(new Date());
        let allContracts=`update AllContracts set status='Cancelled',modifiedTime='${newDate}',modifiedUser='${params.user}' where contractID=${params.contractId}`
        let encryptedContract=Buffer.from(allContracts).toString('base64');
        let allProjects=`update allProjects set status='Cancelled',projectStatus='Cancelled',completionStatus='Cancelled',billingStatus='Cancelled',liveOrCancelled='Cancelled',modifiedTime='${newDate}',modifiedUser='${params.user}',planDate=NULL where
         status='Pending' AND contractID='${params.contractId}'`
        let encryptedProjects=Buffer.from(allProjects).toString('base64');
        let queries=[encryptedContract,encryptedProjects]
        let res=await queryGet(queries)
        return res    
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}



module.exports = { getAllAssignmentNature,cancelContracts, timesheetAlert, updateContract, deleteAllProjects, duplicateContract, updateOngoing, contractCreation, getContractData, updateBlobUrl }