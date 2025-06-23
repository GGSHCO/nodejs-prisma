const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')


async function onloadDataContracts({ companyid }) {
    try {
        let assignNatureObj = await fetchTable(`select * from AssignmentNature where companyId='${companyid}'`);
        let allClients = await fetchOptions(`select * from zohoContacts where contacttype='customer' and companyid='${companyid}'`, "contactname", "contactname")
        let allAssignments = await fetchOptions(`select * from AssignmentNature where companyId='${companyid}'`, "assignmentNature", "lid")
        let allEmployees = await fetchOptions(`select name from syf_usermaster`, "name", "name")
        return {
            assignNatureObj: assignNatureObj,
            allClients: allClients,
            allAssignments: allAssignments,
            allEmployees: allEmployees
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function fetchContract({ decryptID }) {
    try {
        let feContract = await fetchTable(`select * from allcontracts where urn='${decryptID}'`)
        let getAssignment_res = await fetchTable(`SELECT * FROM ContractAssignmentNature WHERE contractID='${decryptID}' ORDER BY sequence`);
        return {
            feContract: feContract,
            getAssignment_res: getAssignment_res
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function milestoneMaster({ assignmentID }) {
    try {
        let res = await fetchTable(`select * from Milestones where assignmentNatureID='${assignmentID}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function milestoneSubForm({ assignmentID }) {
    try {
        let res = await fetchTable(`select * from milestonesubform where assignmentid='${assignmentID}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function deleteContractAssignment({ assignmentID }) {
    try {
        let delmile = `delete from milestoneSubform where assignmentid='${assignmentID}'`
        let delMilestone = Buffer.from(delmile).toString('base64');
        let delAssign = `delete from contractAssignmentNature where assignmentid='${assignmentID}'`
        let delAssignment = Buffer.from(delAssign).toString('base64');
        let del_call = await queryGet([delMilestone, delAssignment]);
        return del_call
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function deleteContractMilestone({ milestoneid }) {
    try {
        let res = await exeQuery(`delete from milestonesubform where milestoneid='${milestoneid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function saveContract({ contract, assignment, milestone }) {
    try {
        let querylist = []
        contract.map((item) => {
            if (item.querytype == "Update") {
                let query = `UPDATE AllContracts SET
                    clientName='${item.clientName}',attachments='${item.attachments}',remarks='${item.remarks}',contractStartDate='${item.contractStartDate}',contractEndDate='${item.contractEndDate}',entity='${item.entity}',liveChurn='${item.liveChurn}',proposalStatus='${item.proposalStatus}',termsConditions='${item.termsConditions}',modifiedTime='${item.addedTime}',modifiedUser='${item.username}'
                    WHERE urn='${item.contractID}' and companyid='${item.companyid}'`
                let base64Query = Buffer.from(query).toString('base64');

                querylist.push(base64Query)
            }
            else if (item.querytype == "Insert") {
                let query = `INSERT INTO AllContracts(urn,contractID,userid,companyname,companyid,clientName,entity,liveChurn,status,proposalStatus,remarks,termsConditions,addedUser,addedTime,attachments)
                values('${item.contractID}','${item.contractID}','${item.userid}','${item.companyname}','${item.companyid}','${item.clientName}','${item.entity}','${item.liveChurn}','${item.status}','${item.proposalStatus}','${item.remarks}','${item.termsConditions}','${item.username}','${item.addedTime}','${item.attachments}')`
                let base64Query = Buffer.from(query).toString('base64');

                querylist.push(base64Query)
            }
        })
        assignment.map((item) => {
            if (item.querytype == "Update") {
                let query = `UPDATE ContractAssignmentNature SET
                    sequence = '${item.seq}', assignmentNature = '${item.assignmentNature}', dateFormat = '${item.dateFormat}', 
                    feeEstimate = '${item.feeEstimate}',type = '${item.type}', frequency = '${item.frequency}', amount = '${item.amount}',
                     relevantYear = '${item.relevantYear}', contractStartDate = '${item.contractStartDate}',
                    contractEndDate = '${item.contractEndDate}', quarter = '${item.quarter}', managerResponsible = '${item.teamLead}', 
                    personResponsible1 = '${item.personResponsible1}',
                    personResponsible2 = '${item.personResponsible2}', personResponsible3 = '${item.personResponsible3}', entity = '${item.entity}',
                    clientName = '${item.clientName}', liveChurn = '${item.liveChurn}', remarks = '${item.remarks}', projectRemarks = '${item.projectRemarks}', partner = '${item.partner}',
                     relevantStartDate = '${item.relevantStartDate}',
                    relevantEndDate = '${item.relevantEndDate}', edoc = '${item.edoc}', modifiedUser = '${item.username}',
                     modifiedTime = '${item.addedTime}' WHERE assignmentID='${item.assignmentID}' and companyid='${item.companyid}'`
                let base64Query = Buffer.from(query).toString('base64');

                querylist.push(base64Query)
            }
            else if (item.querytype == "Insert") {
                let query = `INSERT INTO ContractAssignmentNature(
                        contractID, sequence, assignmentNature, dateFormat, feeEstimate, assignmentID,
                        type, frequency, amount, relevantYear, contractStartDate,
                        contractEndDate, quarter, managerResponsible, personResponsible1,
                        personResponsible2, personResponsible3, entity,contractStatus,
                        clientName, liveChurn, remarks, partner, relevantStartDate,projectRemarks,
                        relevantEndDate, edoc, companyName, companyID, addedUser, addedTime
                    ) VALUES(
                        '${item.contractID}', '${item.seq}', '${item.assignmentNature}', '${item.dateFormat}', '${item.feeEstimate}','${item.assignmentID}',
                        '${item.type}', '${item.frequency}', '${item.amount}', '${item.relevantYear}', '${item.contractStartDate}',
                        '${item.contractEndDate}', '${item.quarter}', '${item.teamLead}', '${item.personResponsible1}',
                        '${item.personResponsible2}', '${item.personResponsible3}', '${item.entity}','${item.contractStatus}',
                        '${item.clientName}', '${item.liveChurn}', '${item.remarks}', '${item.partner}', '${item.relevantStartDate}','${item.projectRemarks}',
                        '${item.relevantEndDate}', '${item.edoc}', '${item.companyname}', '${item.companyid}',
                        '${item.username}', '${item.addedTime}'
                    )`

                let base64Query = Buffer.from(query).toString('base64');
                querylist.push(base64Query)
            }
        })
        milestone.map((item) => {
            if (item.querytype == "Update") {
                let query = `UPDATE milestoneSubform SET
                        sequence=${item.sequence},milestone='${item.mileStone}',paymentPercent=${item.paymentPercent}, amount=${item.amount},
                        standardHours=${item.standardHours}, advance='${item.advance}', assignmentNature='${item.assignmentNature}', 
                        modifiedUser='${item.username}', modifiedTime='${item.addedTime}'
                        where milestoneID='${item.milestoneID}' and companyid='${item.companyid}'`

                let base64Query = Buffer.from(query).toString('base64');
                querylist.push(base64Query)
            }
            else if (item.querytype == "Insert") {
                let query = `INSERT INTO milestoneSubform
                        (contractID, sequence, milestoneId, assignmentNature, standardHours, advance, milestone, paymentPercent, amount,status, assignmentID, companyName, companyId, addedUser, addedTime)
                        VALUES(
                            '${item.contractID}', ${item.sequence}, '${item.milestoneID}', '${item.assignmentNature}', ${item.standardHours}, '${item.advance}',
                             '${item.mileStone}', 
                            ${item.paymentPercent}, ${item.amount},'${item.status}','${item.assignmentID}', '${item.companyname}', '${item.companyid}',
                             '${item.username}', '${item.addedTime}'
                        )`
                let base64Query = Buffer.from(query).toString('base64');
                querylist.push(base64Query)
            }
        })
        let res = await queryGet(querylist)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


async function getMaxContId(params) {
    try {
        let getContractID_res = await fetchTable(`SELECT MAX(urn) FROM AllContracts where userid='${params.userid}' and companyid='${params.companyid}'`);
        // let getContractID_call = await queryGet([getContractID_query]);
        // let getContractID_res = getContractID_call.responseData.table;
        let contractId;
        if (getContractID_res[0].column1 === null) {
            contractId = (`${params.userid}${params.companyid}101`);
        }
        else {
            contractId = BigInt(getContractID_res[0].column1) + 1n;
        }
        return { contractId: contractId.toString() };
    }
    catch (e) {
        return { e: e.message }
    }

}

async function getMaxAssignmentId(params) {
    try {
        let getAssignmentID_res = await fetchTable(`SELECT MAX(assignmentID) FROM ContractAssignmentNature where contractID='${params.contractId}'`);
        // let getAssignmentID_call = await queryGet([getAssignmentID_query]);
        // let getAssignmentID_res = getAssignmentID_call.responseData.table;
        let assignmentID;
        if (getAssignmentID_res[0].column1 === null) {
            assignmentID = (`${params.contractId}00`);
        }
        else {
            assignmentID = (getAssignmentID_res[0].column1);
        }
        return { assignmentID: assignmentID.toString() };
    }
    catch (e) {
        return { e: e.message }
    }
}

async function getMaxMilestoneId(params) {
    try {
        let getMilestoneID_res = await fetchTable(`SELECT MAX(milestoneId) FROM milestoneSubform where assignmentID='${params.assignmentId}'`);
        // let getMilestoneID_call = await queryGet([getMilestoneID_query]);
        // let getMilestoneID_res = getMilestoneID_call.responseData.table;
        let milestoneID;
        if (getMilestoneID_res[0].column1 === null) {
            milestoneID = (`${params.assignmentId}00`);
        }
        else {
            milestoneID = (getMilestoneID_res[0].column1);
        }
        return { milestoneID: milestoneID.toString() };
    }
    catch (e) {
        return { e: e.message }
    }

}

async function changeAmount(params) {
    try {
        let query = []
        let data = params.data
        for (let item of data) {
            let contractQuery = `update contractAssignmentNature set feeEstimate='${item.amount}', amount='${item.amount}' where assignmentID='${item.assignmentID}'`
            let getAllProjects = await fetchTable(`select * from allProjects where assignmentID='${item.assignmentID}'`)
            query.push(contractQuery)
            if (getAllProjects.length > 0) {
                let projectIds = []
                getAllProjects.map((project) => {
                    if (project.billingStatus != "Billed") {
                        projectIds.push(`'${project.projectCode}'`)
                    }
                })
                let projectQuery = `update allProjects set amount='${item.amount}' where projectCode in (${projectIds})`
                query.push(projectQuery)
                let getAllMilestones = await fetchTable(`select milestone,paymentPercent,amount from milestoneSubform where assignmentID='${item.assignmentID}' and paymentPercent!=0`)
                if (getAllMilestones.length > 0) {
                    getAllMilestones.map((milestone) => {
                        let percent = milestone.paymentPercent / 100
                        let amount = item.amount * percent
                        let updateMilestone = `update milestoneSubform set amount='${amount}' where assignmentID='${item.assignmentID}' and milestone='${milestone.milestone}'`
                        // update allobservations and invoices with projectIds
                        let allObservation = `update allObservations set amountInvolved='${amount}' where projectCode in (${projectIds}) and caption='${milestone.milestone}' and type='Milestone'`
                        let allInvoice = `update allInvoices set amount='${amount}' where projectCode in (${projectIds}) and milestones='${milestone.milestone}' and status='Pending'`
                        query.push(allObservation)
                        query.push(allInvoice)
                        query.push(updateMilestone)
                    })
                }
            }
        }
        if (query.length > 0) {
            let q=query.map((item) => {
                let base64Query = Buffer.from(item).toString('base64');
                item = base64Query
                return item
            })
            let response = await queryGet(q)
            return response
        }


    }
    catch (e) {
        return { e: e.message }
    }
}

module.exports = { onloadDataContracts, changeAmount, fetchContract, milestoneMaster, milestoneSubForm, saveContract, deleteContractAssignment, deleteContractMilestone, getMaxContId, getMaxAssignmentId, getMaxMilestoneId }