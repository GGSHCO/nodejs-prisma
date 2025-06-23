const { fetchTable, exeQuery, queryGet } = require('../../config')

async function getProjects({ companyid }) {
    try {
        let getMyProject_res = await fetchTable(`SELECT * FROM AllProjects where companyid='${companyid}'`); // AND status='completed'
        getMyProject_res.push({ clientName: 'Non-Billable', projectDescription: `Public Holiday`, projectCode: `Public Holiday` })
        getMyProject_res.push({ clientName: 'Non-Billable', projectDescription: `Casual/Sick leave`, projectCode: `Casual/Sick leave` })
        getMyProject_res.push({ clientName: 'Non-Billable', projectDescription: `Sunday`, projectCode: `Sunday` })
        getMyProject_res.push({ clientName: 'Non-Billable', projectDescription: `Compensatory Off`, projectCode: `Compensatory Off` })
        getMyProject_res.push({ clientName: 'Non-Billable', projectDescription: `L&D`, projectCode: `L&D` })
        getMyProject_res.push({ clientName: 'Non-Billable', projectDescription: `Meeting`, projectCode: `Meeting` })
        getMyProject_res.push({ clientName: 'Non-Billable', projectDescription: `Discussion`, projectCode: `Discussion` })
        let data = [
            {
                "clientName": "Non-Billable",
                "projectDescription": "A R Followup",
                "projectCode": "A R Followup"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Mail issue resolving, code requests and completion, mails backups, Bank doc signature and coordination,",
                "projectCode": "Mail issue resolving, code requests and completion, mails backups, Bank doc signature and coordination,"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "sreedhar payable worksheet / other support , to Accounts",
                "projectCode": "sreedhar payable worksheet / other support , to Accounts"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Team Discussion with NK & Gopi , Functional Meeting with Partners",
                "projectCode": "Team Discussion with NK & Gopi , Functional Meeting with Partners"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Webinar Icegate 2.0",
                "projectCode": "Webinar Icegate 2.0"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Coordinate to collect chq from client KHI & Saffire, Weekly payment support for expenses during the week",
                "projectCode": "Coordinate to collect chq from client KHI & Saffire, Weekly payment support for expenses during the week"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Client follow-up calls for Data request for GSTR 1 for Dec and clarification on workings support to team for return filing",
                "projectCode": "Client follow-up calls for Data request for GSTR 1 for Dec and clarification on workings support to team for return filing"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Outlook configuration issue",
                "projectCode": "Outlook configuration issue"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Doc printing and signing and scanning for Reboture and Printer and Scanner setup and",
                "projectCode": "Doc printing and signing and scanning for Reboture and Printer and Scanner setup and"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "EMudhra EKYC process for Partner",
                "projectCode": "EMudhra EKYC process for Partner"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "AR Followup / support  to Rajesh for Payment matching from clients  & Book Entry negative balance rectifying  coordination with Rajesh/ Sreedhar outstanding consolidation of all entities",
                "projectCode": "AR Followup / support  to Rajesh for Payment matching from clients  & Book Entry negative balance rectifying  coordination with Rajesh/ Sreedhar outstanding consolidation of all entities"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "ROC incorporation support to nanthini, coordination with Uma Mam for DSC",
                "projectCode": "ROC incorporation support to nanthini, coordination with Uma Mam for DSC"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "GSTR 1 filing support ,Pending returns support",
                "projectCode": "GSTR 1 filing support ,Pending returns support"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Admin work GGSH water dispenser service & KVB Net banking issue coordination with BANK, Emudhra DSC Purchase Coordination,",
                "projectCode": "Admin work GGSH water dispenser service & KVB Net banking issue coordination with BANK, Emudhra DSC Purchase Coordination,"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Status chk for Bhumi regn, Southland Amendment, and other regn status chk",
                "projectCode": "Status chk for Bhumi regn, Southland Amendment, and other regn status chk"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Weekly Plan meeting with Team",
                "projectCode": "Weekly Plan meeting with Team"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Pongal celebration @GGSH",
                "projectCode": "Pongal celebration @GGSH"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Team Discussion",
                "projectCode": "Team Discussion"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "P A & Bhavisham sreedhar outstanding statement updated along with current month bills and Ahaana followup",
                "projectCode": "P A & Bhavisham sreedhar outstanding statement updated along with current month bills and Ahaana followup"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Reboture Professiona Signature issue",
                "projectCode": "Reboture Professiona Signature issue"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Permission for 1 hr",
                "projectCode": "Permission for 1 hr"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "IT Refund related query from client - clarification requested",
                "projectCode": "IT Refund related query from client - clarification requested"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Client coordination for Return data clarification  Genlite 3 entities, Refimac,",
                "projectCode": "Client coordination for Return data clarification  Genlite 3 entities, Refimac,"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Functional Leader Meeting & Team Meeting",
                "projectCode": "Functional Leader Meeting & Team Meeting"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Guild Client coordination, Wellcome, Sreedhar Group new incorporation related,  Genlite client query",
                "projectCode": "Guild Client coordination, Wellcome, Sreedhar Group new incorporation related,  Genlite client query"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "followup, client outstanding request, and KVB bank net banking login issue.",
                "projectCode": "followup, client outstanding request, and KVB bank net banking login issue."
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "TDS Support to team for TDS Clarifications / queries on Q3 Returns",
                "projectCode": "TDS Support to team for TDS Clarifications / queries on Q3 Returns"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Code status for IDTA Projects",
                "projectCode": "Code status for IDTA Projects"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "AR Followup",
                "projectCode": "AR Followup"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "TDS Client coordination for TDS Q3 filing  support to Team",
                "projectCode": "TDS Client coordination for TDS Q3 filing  support to Team"
            },
            {
                "clientName": "Non-Billable",
                "projectDescription": "Status of GST Regn, 80G Reg,  CR mails to team, Coordination with Nanthini for ROC- Form INC22A, MGT7- Anjana & ECSG,",
                "projectCode": "Status of GST Regn, 80G Reg,  CR mails to team, Coordination with Nanthini for ROC- Form INC22A, MGT7- Anjana & ECSG,"
            }
        ]
        getMyProject_res = getMyProject_res.concat(data)
        return getMyProject_res;

    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getDetails({ companyid, lid }) {
    try {
        let getMyWeek_query = await fetchTable(`SELECT * from AllTimeSheets where lid=${lid} and companyid='${companyid}'`); // AND status='completed'
        return getMyWeek_query;

    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getAllObservations({ companyid }) {
    try {
        let getMyProject_query = await fetchTable(`SELECT * FROM AllObservations where type='milestone' and companyid='${companyid}'`); // AND status='completed'
        return getMyProject_query;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getDayRecords({ companyid, sheetId }) {
    try {
        let getDayRecord = await fetchTable(`select * from dayReport where sheetId=${sheetId} and companyid='${companyid}' order by lid`)
        return getDayRecord;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function choosenweek({ week, username, companyid }) {
    try {
        let res = await fetchTable(`select * from AllTimesheets where employeeName='${username}' and week='${week}' and companyid='${companyid}'`)
        return res;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getDepartment({ email }) {
    try {
        let department_query = await fetchTable(`select * from userMaster where emailID='${email}'`)
        return department_query;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function saveData({ data }) {
    try {
        let res = await exeQuery(`INSERT INTO AllTimesheets(employeeName,milestone,clientName, week, department, projectName, projectCode, description, sunday, monday, tuesday, wednesday, thursday, friday, saturday, rowTotal,companyname,companyid)
            OUTPUT Inserted.lid
            VALUES ('${data.employeeName}','${data.milestone}','${data.clientName}','${data.week}',
             '${data.department}',
             '${data.projectName}', '${data.projectCode}', '${data.description}', '${data.sunday}', '${data.monday}', '${data.tuesday}', 
             '${data.wednesday}', '${data.thursday}', '${data.friday}', '${data.saturday}', '${data.rowTotal}',
             '${data.company.companyname}','${data.company.companyID}');
            `)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateData({ data }) {
    try {
        let res = await exeQuery(`update AllTimesheets SET EmployeeName='${data.employeeName}',week='${data.week}',
            projectName='${data.projectName}',ProjectCode='${data.projectCode}',description='${data.description}',
            department='${data.department}',sunday='${data.sunday}',monday='${data.monday}',
            tuesday='${data.tuesday}',wednesday='${data.wednesday}',thursday='${data.thursday}',
            friday='${data.friday}',saturday='${data.saturday}',clientName='${data.clientName}',
            milestone='${data.milestone}',rowTotal='${data.rowTotal}',companyname='${data.company.companyname}',
            companyid='${data.company.companyID}' where lid='${data.sheetId}'`)

        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function saveDayReport({ data }) {
    try {
        let queryList = []
        data.map((item) => {
            if (item.operation == "insert") {
                let insertDayReport = `INSERT INTO dayReport(employeename,milestone,department,
                client,week,projectName,projectCode,description,duration,sheetId,addedTime,addedUser,
                companyname,companyid
                ) VALUES('${item.employeeName}','${item.milestone}','${item.department}','${item.client}',
                 '${item.lineDate}',
                 '${item.projectVal}','${item.projectCodeVal}','${item.descriptionVal}',
                 '${item.duration}',${item.id},'${item.addedTime}',
                 '${item.username}','${item.company.companyname}','${item.company.companyID}')`
                let query = Buffer.from(insertDayReport).toString('base64');
                queryList.push(query)
            }
            else if (item.operation == "edit") {
                let updateDayReport = `UPDATE dayReport set projectName='${item.projectVal}',
             milestone='${item.milestone}',projectCode='${item.projectCodeVal}',
             description='${item.descriptionVal}',duration='${item.duration}',
             modifiedTime='${item.addedTime}',modifiedUser='${item.username}'
                where lid=${item.uid} and companyid='${item.company.companyID}'`
                let query = Buffer.from(updateDayReport).toString('base64');
                queryList.push(query)
            }
        })
        let res = await queryGet(queryList)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}
module.exports = { getProjects, getDetails, getAllObservations, getDayRecords, choosenweek, getDepartment, saveData, updateData, saveDayReport }