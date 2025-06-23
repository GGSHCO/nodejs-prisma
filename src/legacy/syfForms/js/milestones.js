const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function getAllAssignmentOptions(params) {
    try {
        let res = await fetchOptions(`select * from assignmentNature where companyId='${params.companyid}'`, "assignmentNature", "lid");
        return res;
    } catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function saveMilestones({ data }) {
    try {
        let insertListQuery = []
        data.map((item) => {
            let insert = `INSERT into Milestones(assignmentNatureID,assignmentNature,milestoneNumber,milestones,companyname,companyid) VALUES('${item.assignmentID}','${item.selectedLabel}','${item.milestoneNumber}','${item.milestone}','${item.companyname}','${item.companyid}')`
            let insertData = Buffer.from(insert).toString('base64')
            insertListQuery.push(insertData)
        })
        let res = await queryGet(insertListQuery)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }


}

async function updateMilestone({ data }) {
    try {
        let insertListQuery = []
        data.map((item) => {
            if (item.lid == undefined) {
                let insert = `INSERT into Milestones(assignmentNature,milestoneNumber,milestones,assignmentNatureID,addedTime,addedUser) VALUES('${item.selectedLabel}','${item.milestoneNumber}','${item.milestone}','${item.assignmentNature}',
            '${item.currentDate}','${item.addeduser}')`
                let insertData = Buffer.from(insert).toString('base64')
                insertListQuery.push(insertData)

            }
            else if (item.lid !== undefined) {
                let update = `update Milestones set milestones='${item.milestone}',milestoneNumber='${item.milestoneNumber}',modifiedUser='${item.addeduser}',modifiedTime='${item.currentDate}' where lid=${item.lid};`
                let insertData = Buffer.from(update).toString('base64')
                insertListQuery.push(insertData)

            }
        })
        let res = await queryGet(insertListQuery)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function milestoneUvData({ lid }) {
    try {
        let res = await fetchTable(`select * from Milestones where assignmentNatureID='${lid}' order by milestoneNumber`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function delSingleMilestone({ lid }) {
    try {
        let res = await exeQuery(`delete from Milestones where lid=${lid}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}
module.exports = { getAllAssignmentOptions, updateMilestone, milestoneUvData, saveMilestones, delSingleMilestone }